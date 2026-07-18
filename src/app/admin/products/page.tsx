import React from 'react';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { ProductsClient } from './ProductsClient';

export default async function AdminProductsPage({
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

  // Fetch products, brands, and categories in parallel
  const [
    { data: products, count },
    { data: brands },
    { data: categories }
  ] = await Promise.all([
    supabase
      .from('products')
      .select('*, product_variants(*)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to),
    supabase.from('brands').select('id, name').eq('is_active', true).order('name'),
    supabase.from('categories').select('id, name').order('name')
  ]);

  const totalPages = count ? Math.ceil(count / limit) : 1;

  return (
    <ProductsClient
      initialProducts={products || []}
      initialBrands={brands || []}
      initialCategories={categories || []}
      currentPage={page}
      totalPages={totalPages}
      totalCount={count || 0}
    />
  );
}
