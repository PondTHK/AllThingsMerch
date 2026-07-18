import React from 'react';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { RoyaltiesClient } from './RoyaltiesClient';

export default async function AdminRoyaltiesPage() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return <div className="p-12 text-center text-neutral-500">Supabase is not configured.</div>;
  }

  // Fetch all active contracts + license holder names
  const { data: contracts } = await supabase
    .from('license_contracts')
    .select('*, license_holders(name)')
    .eq('status', 'active')
    .order('starts_at', { ascending: false });

  // Fetch fulfilled orders with their items and product->brand data
  // So we can compute how much revenue is associated with each licensed brand
  const { data: orders } = await supabase
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

  return (
    <RoyaltiesClient
      initialContracts={contracts || []}
      initialOrders={orders || []}
    />
  );
}
