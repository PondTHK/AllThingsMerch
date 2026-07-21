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

  // 1. Fetch current variants to verify prices
  const variantIds = items.map((i) => i.variantId);
  const { data: variants, error: variantsError } = await supabase
    .from('product_variants')
    .select('id, price, stock_quantity')
    .in('id', variantIds);

  if (variantsError || !variants) {
    throw new Error('Failed to verify product prices.');
  }

  // 2. Calculate subtotal using verified DB prices
  let subtotal = 0;
  for (const item of items) {
    const dbVariant = variants.find((v) => v.id === item.variantId);
    if (!dbVariant) {
      throw new Error(`Product variant ${item.productName} is no longer available.`);
    }
    // Note: We could check stock_quantity here and throw if insufficient
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
      payment_method: paymentMethod,
    })
    .select()
    .single();

  if (orderError) throw new Error(`Failed to create order: ${orderError.message}`);

  // 7. Insert Order Items
  const orderItemsData = items.map((item) => {
    const dbVariant = variants.find((v) => v.id === item.variantId)!;
    return {
      order_id: order.id,
      product_id: item.productId,
      product_variant_id: item.variantId,
      product_name: item.productName,
      sku: item.sku,
      unit_price: Number(dbVariant.price),
      quantity: item.quantity,
      line_total: Number(dbVariant.price) * item.quantity,
      royalty_rate_snapshot: 0, // Should fetch from contract, but 0 is fine for demo
    };
  });

  const { error: itemsError } = await supabase.from('order_items').insert(orderItemsData);

  if (itemsError) throw new Error(`Failed to add order items: ${itemsError.message}`);

  // 8. Update coupon usage count if used
  if (couponId) {
    // Note: Concurrency might be an issue here in real-world without RPC, but fine for now
    try {
      await supabase.rpc('increment_coupon_usage', { p_coupon_id: couponId });
    } catch {
      // Fallback if RPC doesn't exist
      const { data: c } = await supabase.from('coupons').select('usage_count').eq('id', couponId).single();
      if (c) {
        await supabase.from('coupons').update({ usage_count: c.usage_count + 1 }).eq('id', couponId);
      }
    }
  }

  revalidatePath('/account/orders');
  
  return { success: true, orderNumber };
}
