import React from 'react';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { getAdminServices } from '@/lib/admin/container';
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

  // Initialize Clean Architecture Services
  const services = getAdminServices(supabase);

  // Fetch data in parallel via Use Cases
  const [
    productsResult,
    brandsResult,
    categoriesResult
  ] = await Promise.all([
    services.products.listProducts({ page, limit }),
    services.brands.listActiveBrands(),
    services.categories.listAllCategories()
  ]);

  // Next.js RSC Rule: Cannot pass class instances with methods to Client Components.
  // Map Domain Entities into clean UI DTOs.
  const productsDto = productsResult.items.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    status: p.status.value,
    totalStock: p.totalStock,
    primaryVariantSku: p.primaryVariant?.sku || 'N/A',
    primaryVariantPrice: p.primaryVariant?.price.thb || 0,
    featuredImage: p.images[0]?.storagePath ?? null,
  }));
  const brandsDto = brandsResult.map((b) => ({ id: b.id, name: b.name }));
  const categoriesDto = categoriesResult.map((c) => ({ id: c.id, name: c.name }));

  return (
    <ProductsClient
      initialProducts={productsDto}
      initialBrands={brandsDto}
      initialCategories={categoriesDto}
      currentPage={productsResult.currentPage}
      totalPages={productsResult.totalPages}
      totalCount={productsResult.totalCount}
    />
  );
}
