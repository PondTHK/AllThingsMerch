import React from 'react';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { InventoryClient } from './InventoryClient';

export default async function AdminInventoryPage() {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return <div className="p-12 text-center text-neutral-500">Supabase is not configured.</div>;
  }

  const { data: products } = await supabase
    .from('products')
    .select('*, product_variants(*)')
    .order('name', { ascending: true });

  return <InventoryClient initialProducts={products || []} />;
}
