import React from 'react';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { OrdersClient } from './OrdersClient';

export default async function AdminOrdersPage() {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return <div className="p-12 text-center text-neutral-500">Supabase is not configured.</div>;
  }

  const { data: orders } = await supabase
    .from('orders')
    .select('*, order_items(*, authenticity_tags(*))')
    .order('created_at', { ascending: false });

  return <OrdersClient initialOrders={orders || []} />;
}
