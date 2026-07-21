'use server';

import { getSupabaseServerClient } from '@/lib/supabase/server';
import { Order, OrderItem, ShippingAddress } from '@/types';

// Convert DB row to Order type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapDbOrder(row: any): Order {
  return {
    id: row.id,
    orderNumber: row.order_number,
    status: row.status,
    subtotal: Number(row.subtotal),
    shippingFee: Number(row.shipping_amount),
    totalAmount: Number(row.total_amount),
    shippingAddress: row.shipping_address as ShippingAddress,
    paymentMethod: row.payment_method,
    isDemoOrder: false,
    createdAt: row.created_at,
    items: (row.order_items || []).map((item: any) => {
      const tag = item.authenticity_tags?.[0];
      return {
        id: item.id,
        productId: item.product_id,
        variantId: item.product_variant_id,
        productName: item.product_name,
        sku: item.sku,
        size: item.size,
        unitPrice: Number(item.unit_price),
        quantity: item.quantity,
        totalPrice: Number(item.line_total),
        authenticityTagCode: tag?.public_code,
        serialNumber: tag?.serial_number,
      } as OrderItem;
    }),
  };
}

export async function getUserOrdersAction(): Promise<Order[]> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return [];

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*, authenticity_tags(*))')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error || !data) {
    console.error('Failed to fetch user orders', error);
    return [];
  }

  return data.map(mapDbOrder);
}

export async function getUserOrderByNumberAction(orderNumber: string): Promise<Order | null> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*, authenticity_tags(*))')
    .eq('user_id', user.id)
    .eq('order_number', orderNumber)
    .single();

  if (error || !data) return null;

  return mapDbOrder(data);
}
