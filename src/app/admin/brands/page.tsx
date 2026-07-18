import React from 'react';
import { getSupabaseServerClient } from '@/lib/supabase/server';
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

  // Await searchParams in Next.js 15
  const resolvedParams = await searchParams;
  const page = parseInt((resolvedParams.page as string) || '1', 10);
  const limit = 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data: brands, count } = await supabase
    .from('brands')
    .select('*', { count: 'exact' })
    .order('name', { ascending: true })
    .range(from, to);

  const totalPages = count ? Math.ceil(count / limit) : 1;

  return (
    <BrandsClient 
      initialBrands={brands || []}
      currentPage={page}
      totalPages={totalPages}
      totalCount={count || 0}
    />
  );
}
