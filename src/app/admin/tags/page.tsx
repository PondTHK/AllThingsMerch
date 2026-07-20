import React from 'react';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { getAdminServices } from '@/lib/admin/container';
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

  const resolvedParams = await searchParams;
  const page = parseInt((resolvedParams.page as string) || '1', 10);
  const limit = 20;

  const services = getAdminServices(supabase);
  const result = await services.tags.listTags({ page, limit });

  const tagsDto = result.items.map((t) => ({
    id: t.id,
    publicCode: t.publicCode,
    serialNumber: t.serialNumber,
    productName: t.productName,
    sku: t.sku,
    status: t.status,
    issuedAt: t.issuedAt,
    orderNumber: t.orderNumber,
  }));

  return (
    <TagsClient
      initialTags={tagsDto}
      currentPage={result.currentPage}
      totalPages={result.totalPages}
      totalCount={result.totalCount}
    />
  );
}
