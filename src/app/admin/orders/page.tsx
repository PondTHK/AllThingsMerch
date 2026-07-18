import React from 'react';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { OrdersClient } from './OrdersClient';

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return <div className="p-12 text-center text-neutral-500">Supabase is not configured.</div>;
  }

  // Await searchParams in Next.js 15
  const resolvedParams = await searchParams;
  const page = parseInt((resolvedParams.page as string) || '1', 10);
  const limit = 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data: orders, count } = await supabase
    .from('orders')
    .select('*, order_items(*, authenticity_tags(*))', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  const totalPages = count ? Math.ceil(count / limit) : 1;

  return (
    <OrdersClient
      initialOrders={orders || []}
      currentPage={page}
      totalPages={totalPages}
      totalCount={count || 0}
    />
  );
}
