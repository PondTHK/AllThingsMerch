import React from 'react';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { getAdminServices } from '@/lib/admin/container';
import { OrdersClient } from './OrdersClient';

export default async function AdminOrdersPage({
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

  // Fetch orders
  const ordersResult = await services.orders.listOrders({ page, limit });

  // Map Domain Entities into UI DTOs
  const ordersDto = ordersResult.items.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    status: o.status.value,
    createdAt: o.createdAt,
    totalAmount: o.totalAmount.thb,
    shippingAddress: {
      fullName: o.shippingAddress.fullName,
      city: o.shippingAddress.city,
    },
    items: o.items.map((item) => ({
      id: item.id,
      productName: item.productName,
      sku: item.sku,
      quantity: item.quantity,
      lineTotal: item.unitPrice.thb * item.quantity,
      tagCode: item.tagCode,
    })),
  }));

  return (
    <OrdersClient
      initialOrders={ordersDto}
      currentPage={ordersResult.currentPage}
      totalPages={ordersResult.totalPages}
      totalCount={ordersResult.totalCount}
    />
  );
}
