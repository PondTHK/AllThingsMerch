import React from 'react';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { ProductEditClient } from './ProductEditClient';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function AdminProductEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return <div className="p-12 text-center text-neutral-500">Supabase is not configured.</div>;
  }

  const resolvedParams = await params;
  const productId = resolvedParams.id;

  const [
    { data: product },
    { data: brands },
    { data: categories }
  ] = await Promise.all([
    supabase
      .from('products')
      .select('*, product_variants(*)')
      .eq('id', productId)
      .single(),
    supabase.from('brands').select('id, name').eq('is_active', true).order('name'),
    supabase.from('categories').select('id, name').order('name')
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-black transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Catalog
      </Link>
      
      <ProductEditClient 
        initialProduct={product}
        initialBrands={brands || []}
        initialCategories={categories || []}
      />
    </div>
  );
}
