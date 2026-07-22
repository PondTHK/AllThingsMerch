import React from 'react';
import Link from 'next/link';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { getAdminServices } from '@/lib/admin/container';
import { formatTHB } from '@/lib/money';
import { Package, Layers, ClipboardList, FileText, AlertTriangle, ArrowRight } from 'lucide-react';
import { DashboardCharts, OrderChartDataDto, StockChartDataDto } from './DashboardCharts';

export default async function AdminDashboardPage() {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return <div className="p-12 text-center text-neutral-500">Supabase is not configured.</div>;
  }

  const services = getAdminServices(supabase);

  // Fetch all data in parallel
  const [
    totalProductsResult,
    lowStockVariants,
    variantsResult,
    ordersResult,
    activeProductsData,
    topVariants,
  ] = await Promise.all([
    services.products.listProducts({ page: 1, limit: 1 }),
    services.inventory.getLowStockVariants(),
    services.inventory.listVariants({ page: 1, limit: 1 }),
    services.orders.listOrders({ page: 1, limit: 500 }),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    services.inventory.listVariants({ page: 1, limit: 5 }),
  ]);

  const activeProductsCount = activeProductsData?.count ?? 0;
  const totalProductsCount = totalProductsResult.totalCount;
  const totalVariantSkus = variantsResult.totalCount;

  const fulfilledOrders = ordersResult.items.filter((o) =>
    ['processing', 'shipped', 'delivered'].includes(o.status.value)
  );
  const totalRevenue = fulfilledOrders.reduce((sum, o) => sum + o.totalAmount.thb, 0);
  const orderCount = ordersResult.totalCount;

  // Build monthly revenue chart data (last 6 months)
  const monthMap: Record<string, { revenue: number; orders: number }> = {};
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    monthMap[key] = { revenue: 0, orders: 0 };
  }
  for (const order of fulfilledOrders) {
    const d = new Date(order.createdAt);
    const key = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    if (monthMap[key] !== undefined) {
      monthMap[key].revenue += order.totalAmount.thb;
      monthMap[key].orders += 1;
    }
  }
  const revenueChartData: OrderChartDataDto[] = Object.entries(monthMap).map(([month, v]) => ({
    month,
    revenue: v.revenue,
    orders: v.orders,
  }));

  // Build stock pie chart data (top 5 variants by stock)
  const stockChartData: StockChartDataDto[] = topVariants.items.map((v) => ({
    name: v.sku,
    stock: v.stockQuantity,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Operations Overview</h2>
        <p className="text-sm text-slate-500 mt-1">
          Real-time snapshot of merchandise inventory and order fulfillment.
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-sm font-medium">Catalog Products</span>
            <Package className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {activeProductsCount} <span className="text-sm font-medium text-slate-400">/ {totalProductsCount} Total</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-sm font-medium">Variant SKUs</span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {totalVariantSkus} <span className="text-sm font-medium text-slate-400">SKUs Tracked</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 space-y-3">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-sm font-medium">Order Revenue</span>
            <ClipboardList className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{formatTHB(totalRevenue)}</div>
          <div className="text-xs font-medium text-slate-400">{orderCount} Recorded Orders</div>
        </div>

      </div>

      {/* Charts */}
      <DashboardCharts revenueData={revenueChartData} stockData={stockChartData} />

      {/* Low Stock Alert Panel */}
      <div className="rounded-2xl border border-white/80 bg-amber-50/50 backdrop-blur-xl shadow-[0_8px_30px_rgb(217,119,6,0.05)] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="text-sm font-semibold text-amber-900">
              Low Stock Inventory Alerts ({lowStockVariants.length})
            </h3>
          </div>
          <Link
            href="/admin/inventory"
            className="text-sm font-medium text-amber-700 hover:text-amber-800 flex items-center gap-1 transition-colors"
          >
            <span>Manage Stock</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {lowStockVariants.length === 0 ? (
          <p className="text-sm text-amber-700/80">
            All merchandise SKUs are comfortably stocked above low-stock thresholds.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {lowStockVariants.map((v) => (
              <div
                key={v.id}
                className="p-4 rounded-xl bg-white/60 backdrop-blur-md border border-white/80 flex items-center justify-between shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div>
                  <span className="font-semibold text-slate-900 block text-sm">{v.sku}</span>
                  <span className="text-slate-500 text-xs mt-0.5 block">
                    Size: {v.size || 'ONE SIZE'} &bull; {v.productName}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span className="px-2.5 py-1 rounded-md bg-amber-100/80 text-amber-800 text-xs font-bold border border-amber-200/50">
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
        <Link
          href="/admin/products"
          className="p-6 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(59,130,246,0.1)] hover:border-blue-200/50 transition-all duration-300 flex items-center justify-between group"
        >
          <div>
            <h4 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">Product Catalog Management</h4>
            <p className="text-sm text-slate-500 mt-1">
              Add new merchandise, toggle draft/active status, and manage featured images.
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300 ml-4 shrink-0" />
        </Link>

        <Link
          href="/admin/orders"
          className="p-6 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(59,130,246,0.1)] hover:border-blue-200/50 transition-all duration-300 flex items-center justify-between group"
        >
          <div>
            <h4 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">Order Fulfillment &amp; TAGs</h4>
            <p className="text-sm text-slate-500 mt-1">
              Inspect order line items, update shipping status, and verify generated serial TAGs.
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300 ml-4 shrink-0" />
        </Link>
      </div>
    </div>
  );
}
