import React from 'react';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { ProductsClient } from './ProductsClient';

export default async function AdminProductsPage() {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return <div className="p-12 text-center text-neutral-500">Supabase is not configured.</div>;
  }

  const { data: products } = await supabase
    .from('products')
    .select('*, product_variants(*)')
    .order('created_at', { ascending: false });

  return <ProductsClient initialProducts={products || []} />;
}
