import React from 'react';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { CategoriesClient } from './CategoriesClient';

export default async function AdminCategoriesPage({
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

  const { data: categories, count } = await supabase
    .from('categories')
    .select('*', { count: 'exact' })
    .order('name', { ascending: true })
    .range(from, to);

  const totalPages = count ? Math.ceil(count / limit) : 1;

  return (
    <CategoriesClient 
      initialCategories={categories || []}
      currentPage={page}
      totalPages={totalPages}
      totalCount={count || 0}
    />
  );
}
