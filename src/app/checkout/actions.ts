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

  // 1. Fetch current variants to verify prices & metadata
  const variantIds = items.map((i) => i.variantId);
  const { data: variants, error: variantsError } = await supabase
    .from('product_variants')
    .select('id, product_id, price, stock_quantity, sku, size, color')
    .in('id', variantIds);

  if (variantsError || !variants) {
    throw new Error(`Failed to verify product prices and metadata: ${variantsError?.message}`);
  }

  // 2. Calculate subtotal using verified DB prices
  let subtotal = 0;
  for (const item of items) {
    const dbVariant = variants.find((v) => v.id === item.variantId);
    if (!dbVariant) {
      throw new Error(`Product variant "${item.productName}" is no longer available.`);
    }
    subtotal += Number(dbVariant.price) * (item.quantity || 1);
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

    if (couponError || !coupon) {
      throw new Error('Invalid coupon code.');
    }

    if (!coupon.is_active) throw new Error('This coupon is no longer active.');
    if (new Date(coupon.expires_at) < new Date()) throw new Error('This coupon has expired.');
    if (coupon.starts_at && new Date(coupon.starts_at) > new Date()) throw new Error('This coupon is not active yet.');
    if (coupon.minimum_order_amount && subtotal < Number(coupon.minimum_order_amount)) {
      throw new Error(`This coupon requires a minimum order of ${coupon.minimum_order_amount}`);
    }
    if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
      throw new Error('This coupon usage limit has been reached.');
    }

    // Calculate discount
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
      status: 'paid', // Setting to paid directly for now (demo purpose)
      payment_status: 'paid',
      subtotal,
      discount_amount: discountAmount,
      shipping_amount: shippingAmount,
      total_amount: totalAmount,
      coupon_id: couponId,
      shipping_address: shippingAddress,
      payment_method: paymentMethod || 'credit-card',
    })
    .select()
    .single();

  if (orderError) throw new Error(`Failed to create order (${orderError.code}): ${orderError.message}`);

  // 7. Insert Order Items
  const orderItemsData = items.map((item) => {
    const dbVariant = variants.find((v) => v.id === item.variantId);
    if (!dbVariant) {
      throw new Error(`Variant ${item.variantId} not found in database.`);
    }

    const productId = item.productId || dbVariant.product_id;
    const sku = item.sku || dbVariant.sku || 'SKU-UNKNOWN';
    const productName = item.productName || 'Merchandise Item';
    const unitPrice = Number(dbVariant.price) || Number(item.unitPrice) || 0;
    const quantity = Number(item.quantity) || 1;
    const lineTotal = unitPrice * quantity;

    if (!productId) {
      throw new Error(`Missing product_id for item "${productName}"`);
    }

    return {
      order_id: order.id,
      product_id: productId,
      product_variant_id: dbVariant.id,
      product_name: productName,
      variant_name: dbVariant.size || dbVariant.color || item.size || item.color || null,
      sku: sku,
      unit_price: unitPrice,
      quantity: quantity,
      line_total: lineTotal,
      royalty_rate_snapshot: 0,
    };
  });

  const { data: insertedItems, error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItemsData)
    .select();

  if (itemsError || !insertedItems) {
    throw new Error(
      `Failed to add order items (${itemsError?.code}): ${itemsError?.message} | details: ${itemsError?.details} | hint: ${itemsError?.hint}`
    );
  }

  // 8. Generate 1-to-1 Authenticity TAGs and deduct stock for each fulfilled item
  const tagsData = [];
  const stockMovementsData = [];

  for (const item of insertedItems) {
    const dbVariant = variants.find((v) => v.id === item.product_variant_id);
    if (dbVariant) {
      const newStock = Math.max(0, dbVariant.stock_quantity - item.quantity);
      await supabase
        .from('product_variants')
        .update({ stock_quantity: newStock })
        .eq('id', item.product_variant_id);

      stockMovementsData.push({
        product_variant_id: item.product_variant_id,
        movement_type: 'sale',
        quantity: -item.quantity,
        reference_type: 'order',
        reference_id: order.id,
        note: `Order ${orderNumber} purchased`,
      });
    }

    for (let q = 0; q < item.quantity; q++) {
      const randomHex = Math.random().toString(16).substring(2, 6).toUpperCase();
      tagsData.push({
        public_code: `TAG-${orderNumber}-${tagsData.length + 1}-${randomHex}`,
        serial_number: `SN-${item.sku}-${randomHex}`,
        order_item_id: item.id,
        product_variant_id: item.product_variant_id,
        status: 'issued',
      });
    }
  }

  if (tagsData.length > 0) {
    const { error: tagsError } = await supabase.from('authenticity_tags').insert(tagsData);
    if (tagsError) console.error('Failed to insert authenticity tags:', tagsError);
  }

  if (stockMovementsData.length > 0) {
    const { error: smError } = await supabase.from('stock_movements').insert(stockMovementsData);
    if (smError) console.error('Failed to record stock movements:', smError);
  }

  // 9. Update coupon usage count if used
  if (couponId) {
    const { data: c } = await supabase.from('coupons').select('usage_count').eq('id', couponId).single();
    if (c) {
      const { error: updateErr } = await supabase
        .from('coupons')
        .update({ usage_count: c.usage_count + 1 })
        .eq('id', couponId);
    }
  }

  revalidatePath('/account/orders');
  revalidatePath('/admin/coupons');
  
  return { success: true, orderNumber };
}
