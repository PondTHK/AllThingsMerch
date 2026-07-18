import React from 'react';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { CouponsClient } from './CouponsClient';

export default async function AdminCouponsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return <div className="p-12 text-center text-neutral-500">Supabase is not configured.</div>;
  }

  const resolvedParams = await searchParams;
  const page = parseInt((resolvedParams.page as string) || '1', 10);
  const limit = 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // Assuming a 'coupons' table exists
  const { data: coupons, count, error } = await supabase
    .from('coupons')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  const totalPages = count ? Math.ceil(count / limit) : 1;

  return (
    <CouponsClient 
      initialCoupons={coupons || []}
      currentPage={page}
      totalPages={totalPages}
      totalCount={count || 0}
      dbError={error?.message}
    />
  );
}
