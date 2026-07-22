import React from 'react';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { getAdminServices } from '@/lib/admin/container';
import { RoyaltiesClient, RoyaltyRowDto } from './RoyaltiesClient';

export default async function AdminRoyaltiesPage() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return <div className="p-12 text-center text-neutral-500">Supabase is not configured.</div>;
  }

  const services = getAdminServices(supabase);

  // Fetch active contracts
  const contracts = await services.contracts.getActiveContracts();

  const brandRevenue: Record<string, { brandName: string; totalRevenue: number; orderCount: number }> = {};

  // ---------------------------------------------------------------------------
  // FAST PATH: Try to query the Database View first (O(1) payload size)
  // ---------------------------------------------------------------------------
  const { data: viewData, error: viewError } = await supabase
    .from('brand_revenue_summary')
    .select('*');

  if (!viewError && viewData) {
    // View exists! Use the pre-calculated data from SQL
    for (const row of viewData) {
      brandRevenue[row.brand_id] = {
        brandName: row.brand_name || 'Unknown Brand',
        totalRevenue: Number(row.total_revenue),
        orderCount: Number(row.order_count)
      };
    }
  } else {
    // ---------------------------------------------------------------------------
    // FALLBACK PATH: If the View hasn't been created in Supabase yet,
    // fallback to querying all orders and calculating in JS.
    // ---------------------------------------------------------------------------
    const { data: rawOrders } = await supabase
      .from('orders')
      .select(`
        id,
        total_amount,
        status,
        created_at,
        order_items (
          id,
          quantity,
          unit_price,
          product_variants (
            id,
            products (
              id,
              name,
              brand_id,
              brands (
                id,
                name
              )
            )
          )
        )
      `)
      .in('status', ['delivered', 'shipped'])
      .order('created_at', { ascending: false });

    for (const order of rawOrders || []) {
      for (const item of order.order_items || []) {
        const variant = item.product_variants as { products?: { brand_id?: string; brands?: { id?: string; name?: string } } } | null;
        const brand = variant?.products?.brands;
        const brandId = variant?.products?.brand_id;
        if (!brandId || !brand) continue;

        const lineTotal = (item.unit_price || 0) * (item.quantity || 1);
        if (!brandRevenue[brandId]) {
          brandRevenue[brandId] = { brandName: brand.name || 'Unknown Brand', totalRevenue: 0, orderCount: 0 };
        }
        brandRevenue[brandId].totalRevenue += lineTotal;
        brandRevenue[brandId].orderCount += 1;
      }
    }
  }

  // Match contracts to brand revenue (whether from View or JS calculation)
  const royaltyRows: RoyaltyRowDto[] = contracts.map((contract) => {
    const brandRevData = Object.values(brandRevenue).find(
      (b) => b.brandName?.toLowerCase().includes(contract.holderName.toLowerCase().split(' ')[0])
    );
    const revenue = brandRevData?.totalRevenue || 0;
    const royaltyOwed = revenue * (contract.royaltyRate / 100);

    return {
      id: contract.id,
      holderName: contract.holderName,
      ref: contract.contractReference,
      royaltyRate: contract.royaltyRate,
      revenue,
      royaltyOwed,
      status: contract.status,
      expiresAt: contract.expiresAt,
    };
  });

  return <RoyaltiesClient royaltyRows={royaltyRows} />;
}
