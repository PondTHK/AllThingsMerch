import React from 'react';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { getAdminServices } from '@/lib/admin/container';
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

  const services = getAdminServices(supabase);
  const result = await services.coupons.listCoupons({ page, limit });

  const couponsDto = result.items.map((c) => ({
    id: c.id,
    code: c.code,
    discountType: c.discountType,
    discountValue: c.discountValue,
    minOrderAmount: c.minOrderAmount,
    maxUsageCount: c.maxUsageCount,
    usageCount: c.usageCount,
    maxUsesPerUser: c.maxUsesPerUser,
    isActive: c.isActive,
    expiresAt: c.expiresAt,
  }));

  return (
    <CouponsClient
      initialCoupons={couponsDto}
      currentPage={result.currentPage}
      totalPages={result.totalPages}
      totalCount={result.totalCount}
    />
  );
}
