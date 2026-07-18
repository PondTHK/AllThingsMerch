import React from 'react';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { getAdminServices } from '@/lib/admin/container';
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

  const resolvedParams = await searchParams;
  const page = parseInt((resolvedParams.page as string) || '1', 10);
  const limit = 20;

  const services = getAdminServices(supabase);
  const result = await services.categories.listCategories({ page, limit });

  const categoriesDto = result.items.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    parentId: c.parentId,
  }));

  return (
    <CategoriesClient
      initialCategories={categoriesDto}
      currentPage={result.currentPage}
      totalPages={result.totalPages}
      totalCount={result.totalCount}
    />
  );
}
