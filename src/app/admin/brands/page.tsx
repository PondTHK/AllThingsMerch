import React from 'react';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { getAdminServices } from '@/lib/admin/container';
import { BrandsClient } from './BrandsClient';

export default async function AdminBrandsPage({
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
  const result = await services.brands.listBrands({ page, limit });

  const brandsDto = result.items.map((b) => ({
    id: b.id,
    name: b.name,
    slug: b.slug,
    isActive: b.isActive,
  }));

  return (
    <BrandsClient
      initialBrands={brandsDto}
      currentPage={result.currentPage}
      totalPages={result.totalPages}
      totalCount={result.totalCount}
    />
  );
}
