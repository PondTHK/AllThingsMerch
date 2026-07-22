import { NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { CartItem, ShippingAddress, Coupon } from '@/types';

export async function POST(request: Request) {
  try {
    const supabase = await getSupabaseServerClient();
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not configured' }, { status: 500 });
    }

    const body = await request.json();
    const { items, shippingAddress, paymentMethod, coupon } = body as {
      items: CartItem[];
      shippingAddress: ShippingAddress;
      paymentMethod: string;
      coupon?: Coupon | null;
    };

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }
    if (!shippingAddress || !paymentMethod) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let subtotal = 0;
    const verifiedItems = [];

    // Verify stock and prices from DB
    for (const item of items) {
      const { data: variantData, error: variantError } = await supabase
        .from('product_variants')
        .select('*, products(*)')
        .eq('id', item.variantId)
        .single();

      if (variantError || !variantData) {
        return NextResponse.json({ error: `Selected variant for "${item.productName}" is no longer available.` }, { status: 400 });
      }

      if (variantData.stock_quantity < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for "${item.productName}". Only ${variantData.stock_quantity} left.` }, { status: 400 });
      }

      const officialPrice = Number(variantData.price);
      const lineTotal = officialPrice * item.quantity;
      subtotal += lineTotal;

      let royaltyRateSnapshot = 10.0;
      let licenseContractId = variantData.products.license_contract_id;

      verifiedItems.push({
        productId: variantData.product_id,
        variantId: variantData.id,
        productName: variantData.products.name,
        variantName: variantData.size,
        sku: variantData.sku,
        unitPrice: officialPrice,
        quantity: item.quantity,
        lineTotal,
        royaltyRateSnapshot,
        licenseContractId
      });
    }

    let discountAmount = 0;
    let couponId = null;

    if (coupon && coupon.code) {
      const { data: couponData } = await supabase
        .from('coupons')
        .select('*')
        .ilike('code', coupon.code)
        .eq('is_active', true)
        .single();

      if (couponData) {
        couponId = couponData.id;
        const minOrder = Number(couponData.minimum_order_amount);
        if (!minOrder || subtotal >= minOrder) {
          if (couponData.discount_type === 'percentage') {
            discountAmount = Math.floor(subtotal * (Number(couponData.discount_value) / 100));
          } else {
            discountAmount = Math.min(subtotal, Number(couponData.discount_value));
          }
        }
      }
    }

    const shippingFee = subtotal >= 3000 ? 0 : 100;
    const totalAmount = Math.max(0, subtotal - discountAmount) + shippingFee;

    const orderNumber = `ATM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const userId = '00000000-0000-0000-0000-000000000000'; // Default user UUID

    // Insert Order
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        user_id: userId,
        status: 'paid',
        payment_status: 'paid',
        subtotal,
        discount_amount: discountAmount,
        shipping_amount: shippingFee,
        total_amount: totalAmount,
        coupon_id: couponId,
        shipping_address: shippingAddress
      })
      .select()
      .single();

    if (orderError || !orderData) {
      throw new Error(`Failed to create order: ${orderError?.message}`);
    }

    // Insert Order Items and Tags and update Stock
    const tagsToInsert = [];
    
    for (const item of verifiedItems) {
      const { data: orderItemData, error: oiError } = await supabase
        .from('order_items')
        .insert({
          order_id: orderData.id,
          product_id: item.productId,
          product_variant_id: item.variantId,
          product_name: item.productName,
          variant_name: item.variantName,
          sku: item.sku,
          unit_price: item.unitPrice,
          quantity: item.quantity,
          line_total: item.lineTotal,
          royalty_rate_snapshot: item.royaltyRateSnapshot
        })
        .select()
        .single();

      if (!oiError && orderItemData) {
        for (let i = 0; i < item.quantity; i++) {
          const randomHex = Math.random().toString(16).substring(2, 6).toUpperCase();
          tagsToInsert.push({
            public_code: `TAG-${orderNumber}-${i + 1}-${randomHex}`,
            serial_number: `SN-${item.sku}-${randomHex}`,
            order_item_id: orderItemData.id,
            product_variant_id: item.variantId,
            status: 'issued'
          });
        }
      }

      // Decrement stock
      const { data: vData } = await supabase.from('product_variants').select('stock_quantity').eq('id', item.variantId).single();
      if (vData) {
        await supabase.from('product_variants').update({ stock_quantity: vData.stock_quantity - item.quantity }).eq('id', item.variantId);
      }
    }

    if (tagsToInsert.length > 0) {
      await supabase.from('authenticity_tags').insert(tagsToInsert);
    }

    return NextResponse.json({ order: { orderNumber: orderData.order_number, id: orderData.id } });
  } catch (err: unknown) {
    console.error('Checkout API error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to complete checkout' },
      { status: 500 }
    );
  }
}
