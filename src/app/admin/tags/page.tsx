import React from 'react';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { TagsClient } from './TagsClient';

export default async function AdminTagsPage() {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return <div className="p-12 text-center text-neutral-500">Supabase is not configured.</div>;
  }

  const { data: tags } = await supabase
    .from('authenticity_tags')
    .select('*, order_items(product_name, sku)')
    .order('issued_at', { ascending: false });

  return <TagsClient initialTags={tags || []} />;
}
