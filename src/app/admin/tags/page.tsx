import React from 'react';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { TagsClient } from './TagsClient';

export default async function AdminTagsPage({
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

  const { data: tags, count } = await supabase
    .from('authenticity_tags')
    .select('*, order_items(product_name, sku)', { count: 'exact' })
    .order('issued_at', { ascending: false })
    .range(from, to);

  const totalPages = count ? Math.ceil(count / limit) : 1;

  return (
    <TagsClient
      initialTags={tags || []}
      currentPage={page}
      totalPages={totalPages}
      totalCount={count || 0}
    />
  );
}
