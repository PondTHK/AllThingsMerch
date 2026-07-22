/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
'use server';

import { getSupabaseServerClient } from '@/lib/supabase/server';
import { CartItem, ShippingAddress } from '@/types';
import { revalidatePath } from 'next/cache';

export async function placeOrderAction(
  items: CartItem[],
  shippingAddress: ShippingAddress,
  paymentMethod: string,
  couponCode?: string
) {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error('Supabase is not configured.');

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be logged in to place an order.');
  }

  // 1. Fetch current variants to verify prices & stock
  const variantIds = items.map((i) => i.variantId);
  const { data: variants, error: variantsError } = await supabase
    .from('product_variants')
    .select('id, price, stock_quantity, sku, product_id, is_active')
    .in('id', variantIds);

  if (variantsError || !variants) {
    throw new Error('Failed to verify product details.');
  }

  // Check if we need royalties: fetch products for license_contract_id
  const productIds = Array.from(new Set(variants.map(v => v.product_id)));
  const { data: products } = await supabase
    .from('products')
    .select('id, name, license_contract_id')
    .in('id', productIds);

  let licenseContracts: any[] = [];
  if (products) {
    const contractIds = products.map(p => p.license_contract_id).filter(Boolean);
    if (contractIds.length > 0) {
      const { data: contracts } = await supabase
        .from('license_contracts')
        .select('id, royalty_rate')
        .in('id', contractIds);
      if (contracts) licenseContracts = contracts;
    }
  }

  // 2. Calculate subtotal & Verify Stock
  let subtotal = 0;
  for (const item of items) {
    const dbVariant = variants.find((v) => v.id === item.variantId);
    if (!dbVariant || !dbVariant.is_active) {
      throw new Error(`Product variant ${item.productName} is no longer available.`);
    }
    if (!item.isPreorder && dbVariant.stock_quantity < item.quantity) {
      throw new Error(`Insufficient stock for ${item.productName}. Only ${dbVariant.stock_quantity} available.`);
    }
    subtotal += Number(dbVariant.price) * item.quantity;
  }

  // 3. Process Coupon if provided
  let discountAmount = 0;
  let couponId = null;
  if (couponCode) {
    const { data: coupon, error: couponError } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', couponCode.toUpperCase())
      .single();

    if (couponError || !coupon) throw new Error('Invalid coupon code.');
    if (!coupon.is_active) throw new Error('This coupon is no longer active.');
    if (new Date(coupon.expires_at) < new Date()) throw new Error('This coupon has expired.');
    if (coupon.starts_at && new Date(coupon.starts_at) > new Date()) throw new Error('This coupon is not active yet.');
    if (coupon.minimum_order_amount && subtotal < Number(coupon.minimum_order_amount)) {
      throw new Error(`This coupon requires a minimum order of ${coupon.minimum_order_amount}`);
    }
    if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
      throw new Error('This coupon usage limit has been reached.');
    }

    if (coupon.discount_type === 'percentage') {
      discountAmount = Math.round(subtotal * (Number(coupon.discount_value) / 100));
    } else {
      discountAmount = Math.min(Number(coupon.discount_value), subtotal);
    }
    couponId = coupon.id;
  }

  // 4. Calculate Shipping and Total
  const shippingAmount = subtotal >= 3000 ? 0 : 100;
  const totalAmount = Math.max(0, subtotal - discountAmount) + shippingAmount;

  // 5. Generate unique order number
  const timestamp = Date.now().toString().slice(-6);
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  const orderNumber = `ATM-${timestamp}-${randomStr}`;

  // 6. Insert Order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      user_id: user.id,
      status: 'paid', // Assuming paid for demo
      payment_status: 'paid',
      subtotal,
      discount_amount: discountAmount,
      shipping_amount: shippingAmount,
      total_amount: totalAmount,
      coupon_id: couponId,
      shipping_address: shippingAddress,
      payment_method: paymentMethod,
    })
    .select('id, order_number')
    .single();

  if (orderError || !order) throw new Error(`Failed to create order: ${orderError.message}`);

  // 7. Insert Order Items, Deduct Stock, Create Tags & Royalties
  for (const item of items) {
    const dbVariant = variants.find((v) => v.id === item.variantId)!;
    const dbProduct = products?.find(p => p.id === dbVariant.product_id);
    let royaltyRate = 0;
    
    if (dbProduct?.license_contract_id) {
      const contract = licenseContracts.find(c => c.id === dbProduct.license_contract_id);
      if (contract) royaltyRate = Number(contract.royalty_rate);
    }

    const lineTotal = Number(dbVariant.price) * item.quantity;

    // A. Insert Order Item
    const { data: orderItem, error: itemsError } = await supabase
      .from('order_items')
      .insert({
        order_id: order.id,
        product_id: item.productId,
        product_variant_id: item.variantId,
        product_name: item.productName,
        sku: item.sku,
        unit_price: Number(dbVariant.price),
        quantity: item.quantity,
        line_total: lineTotal,
        royalty_rate_snapshot: royaltyRate,
      })
      .select('id')
      .single();

    if (itemsError || !orderItem) throw new Error(`Failed to add order items: ${itemsError?.message}`);

    // B. Generate Authenticity TAGs (1 for EACH unit quantity)
    const tagsToInsert = [];
    for (let i = 0; i < item.quantity; i++) {
      const hex1 = Math.random().toString(16).substring(2, 6).toUpperCase();
      const hex2 = Math.random().toString(16).substring(2, 8).toUpperCase();
      tagsToInsert.push({
        public_code: `TAG-${order.order_number}-${i + 1}-${hex1}`,
        serial_number: `SN-${item.sku}-${hex2}`,
        order_item_id: orderItem.id,
        product_variant_id: item.variantId,
        status: 'issued'
      });
    }

    if (tagsToInsert.length > 0) {
      const { error: tagError } = await supabase.from('authenticity_tags').insert(tagsToInsert);
      if (tagError) console.error('Failed to generate TAGs', tagError);
    }

    // C. Deduct Stock & Record Movement (skip decrement if it's preorder and doesn't track strict stock, though here we just decrement)
    await supabase.from('product_variants')
      .update({ stock_quantity: Math.max(0, dbVariant.stock_quantity - item.quantity) })
      .eq('id', dbVariant.id);
      
    await supabase.from('stock_movements').insert({
      product_variant_id: dbVariant.id,
      movement_type: 'sale',
      quantity: -item.quantity,
      reference_type: 'order',
      reference_id: order.id,
      note: `Order ${order.order_number} purchased`
    });

    // D. Record Royalty Transaction if applicable
    if (dbProduct?.license_contract_id && royaltyRate > 0) {
      const royaltyAmount = lineTotal * (royaltyRate / 100);
      await supabase.from('royalty_transactions').insert({
        order_item_id: orderItem.id,
        license_contract_id: dbProduct.license_contract_id,
        gross_amount: lineTotal,
        royalty_rate: royaltyRate,
        royalty_amount: royaltyAmount,
        status: 'pending'
      });
    }
  }

  // 8. Update coupon usage count if used
  if (couponId) {
    try {
      await supabase.rpc('increment_coupon_usage', { p_coupon_id: couponId });
    } catch {
      // Fallback
      const { data: c } = await supabase.from('coupons').select('usage_count').eq('id', couponId).single();
      if (c) {
        await supabase.from('coupons').update({ usage_count: c.usage_count + 1 }).eq('id', couponId);
      }
    }
  }

  revalidatePath('/account/orders');
  
  return { success: true, orderNumber };
}
