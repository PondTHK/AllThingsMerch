import React from 'react';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { getAdminServices } from '@/lib/admin/container';
import { InventoryClient } from './InventoryClient';

export default async function AdminInventoryPage({
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

  // We use the products service here because the UI groups variants by product
  const productsResult = await services.products.listProducts({ page, limit });

  // Map Domain Entities into UI DTOs for the inventory client
  const inventoryDto = productsResult.items.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    variants: p.variants.map((v) => ({
      id: v.id,
      sku: v.sku,
      size: v.size,
      stockQuantity: v.stockQuantity,
      lowStockThreshold: v.lowStockThreshold,
    })),
  }));

  return (
    <InventoryClient
      initialProducts={inventoryDto}
      currentPage={productsResult.currentPage}
      totalPages={productsResult.totalPages}
      totalCount={productsResult.totalCount}
    />
  );
}
