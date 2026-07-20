import React from 'react';
import Link from 'next/link';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { getAdminServices } from '@/lib/admin/container';
import { formatTHB } from '@/lib/money';
import { Package, Layers, ClipboardList, FileText, AlertTriangle, ArrowRight } from 'lucide-react';

export default async function AdminDashboardPage() {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return <div className="p-12 text-center text-neutral-500">Supabase is not configured.</div>;
  }

  const services = getAdminServices(supabase);

  // Fetch data in parallel via Use Cases — all independent
  const [
    totalProductsResult,
    lowStockVariants,
    variantsResult,
    ordersResult,
    activeContracts,
    activeProductsData,
  ] = await Promise.all([
    services.products.listProducts({ page: 1, limit: 1 }),
    services.inventory.getLowStockVariants(),
    services.inventory.listVariants({ page: 1, limit: 1 }),
    services.orders.listOrders({ page: 1, limit: 500 }),
    services.contracts.getActiveContracts(),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('status', 'active'),
  ]);

  const activeProductsCount = activeProductsData?.count ?? 0;
  const totalProductsCount = totalProductsResult.totalCount;
  const totalVariantSkus = variantsResult.totalCount;
  const activeContractsCount = activeContracts.length;

  // Compute revenue from all fetched orders
  const totalRevenue = ordersResult.items
    .filter((o) => ['processing', 'shipped', 'delivered'].includes(o.status.value))
    .reduce((sum, o) => sum + o.totalAmount.thb, 0);
  const orderCount = ordersResult.totalCount;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-black uppercase tracking-wider text-black">
          Operations Overview
        </h2>
        <p className="text-xs text-neutral-600 mt-1">
          Real-time snapshot of merchandise inventory, order fulfillment, and IP licensing contracts.
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-neutral-100 border border-neutral-200 space-y-2">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-bold uppercase tracking-wider">Catalog Products</span>
            <Package className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-black">
            {activeProductsCount} <span className="text-xs font-normal text-neutral-500">/ {totalProductsCount} Total</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-100 border border-neutral-200 space-y-2">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-bold uppercase tracking-wider">Variant SKUs</span>
            <Layers className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-black">
            {totalVariantSkus} <span className="text-xs font-normal text-neutral-500">SKUs Tracked</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-100 border border-neutral-200 space-y-2">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-bold uppercase tracking-wider">Order Revenue</span>
            <ClipboardList className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-black">{formatTHB(totalRevenue)}</div>
          <div className="text-[11px] text-neutral-500">{orderCount} Recorded Orders</div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-100 border border-neutral-200 space-y-2">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-bold uppercase tracking-wider">IP Contracts</span>
            <FileText className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-black">{activeContractsCount} Active</div>
          <div className="text-[11px] text-neutral-500">License Agreements</div>
        </div>
      </div>

      {/* Low Stock Alert Panel */}
      <div className="rounded-2xl border border-black bg-neutral-100 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-black" />
            <h3 className="text-sm font-black uppercase tracking-wider text-black">
              Low Stock Inventory Alerts ({lowStockVariants.length})
            </h3>
          </div>
          <Link href="/admin/inventory"
            className="text-xs font-bold uppercase tracking-wider text-black underline flex items-center gap-1">
            <span>Manage Stock</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {lowStockVariants.length === 0 ? (
          <p className="text-xs text-neutral-600">
            All merchandise SKUs are comfortably stocked above low-stock thresholds.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {lowStockVariants.map((v) => (
              <div key={v.id} className="p-3.5 rounded-xl bg-white border border-neutral-300 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-black block">{v.sku}</span>
                  <span className="text-neutral-500">Size: {v.size || 'ONE SIZE'} &bull; {v.productName}</span>
                </div>
                <div className="text-right">
                  <span className="px-2 py-1 rounded bg-black text-white text-[10px] font-bold uppercase tracking-wider">
                    {v.stockQuantity} Left
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/admin/products"
          className="p-6 rounded-2xl bg-neutral-100 border border-neutral-200 hover:border-black transition-all flex items-center justify-between group">
          <div>
            <h4 className="text-sm font-black uppercase tracking-wider text-black">Product Catalog Management</h4>
            <p className="text-xs text-neutral-600 mt-1">Add new merchandise, toggle draft/active status, and manage featured images.</p>
          </div>
          <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-black transition-colors" />
        </Link>

        <Link href="/admin/orders"
          className="p-6 rounded-2xl bg-neutral-100 border border-neutral-200 hover:border-black transition-all flex items-center justify-between group">
          <div>
            <h4 className="text-sm font-black uppercase tracking-wider text-black">Order Fulfillment &amp; TAGs</h4>
            <p className="text-xs text-neutral-600 mt-1">Inspect order line items, update shipping status, and verify generated serial TAGs.</p>
          </div>
          <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-black transition-colors" />
        </Link>
      </div>
    </div>
  );
}
