'use client';

import React, { useMemo } from 'react';
import { BarChart2, TrendingUp, DollarSign, FileText } from 'lucide-react';

function formatTHB(amount: number) {
  return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(amount);
}

interface RoyaltiesClientProps {
  initialContracts: any[];
  initialOrders: any[];
}

export function RoyaltiesClient({ initialContracts, initialOrders }: RoyaltiesClientProps) {

  // Aggregate revenue per brand from fulfilled orders
  const brandRevenue = useMemo(() => {
    const map: Record<string, { brandName: string; totalRevenue: number; orderCount: number }> = {};

    for (const order of initialOrders) {
      for (const item of order.order_items || []) {
        const brand = item.product_variants?.products?.brands;
        const brandId = item.product_variants?.products?.brand_id;
        if (!brandId || !brand) continue;

        const lineTotal = (item.unit_price || 0) * (item.quantity || 1);
        if (!map[brandId]) {
          map[brandId] = { brandName: brand.name, totalRevenue: 0, orderCount: 0 };
        }
        map[brandId].totalRevenue += lineTotal;
        map[brandId].orderCount += 1;
      }
    }
    return map;
  }, [initialOrders]);

  // Match contracts to brand revenue
  const royaltyRows = useMemo(() => {
    return initialContracts.map((contract) => {
      // Find matching brand revenue by license holder name if no direct brand_id link
      // We match on license_holder name against brand name as a fallback
      const brandRevData = Object.values(brandRevenue).find(
        (b) => b.brandName?.toLowerCase().includes(contract.license_holders?.name?.toLowerCase().split(' ')[0])
      );
      const revenue = brandRevData?.totalRevenue || 0;
      const royaltyOwed = revenue * (contract.royalty_rate / 100);

      return {
        id: contract.id,
        holderName: contract.license_holders?.name || 'Unknown',
        ref: contract.contract_reference,
        royaltyRate: contract.royalty_rate,
        revenue,
        royaltyOwed,
        status: contract.status,
        expiresAt: contract.expires_at,
      };
    });
  }, [initialContracts, brandRevenue]);

  const totalRevenue = royaltyRows.reduce((sum, r) => sum + r.revenue, 0);
  const totalRoyaltyOwed = royaltyRows.reduce((sum, r) => sum + r.royaltyOwed, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-neutral-200 pb-4">
        <h2 className="text-xl font-black uppercase tracking-wider text-black flex items-center gap-2">
          <BarChart2 className="w-6 h-6" />
          IP Royalty Report
        </h2>
        <p className="text-xs text-neutral-600 mt-1">
          Revenue-based royalty calculations for all active license contracts.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-neutral-100 border border-neutral-200 space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Total Attributed Revenue
          </p>
          <p className="text-2xl font-black text-black">{formatTHB(totalRevenue)}</p>
        </div>
        <div className="p-5 rounded-2xl bg-black text-white space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1">
            <DollarSign className="w-3 h-3" /> Total Royalties Owed
          </p>
          <p className="text-2xl font-black">{formatTHB(totalRoyaltyOwed)}</p>
        </div>
        <div className="p-5 rounded-2xl bg-neutral-100 border border-neutral-200 space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1">
            <FileText className="w-3 h-3" /> Active Contracts
          </p>
          <p className="text-2xl font-black text-black">{initialContracts.length}</p>
        </div>
      </div>

      {/* Per-Contract Breakdown */}
      {royaltyRows.length === 0 ? (
        <div className="rounded-2xl bg-neutral-100 border border-neutral-200 p-12 text-center">
          <BarChart2 className="w-10 h-10 mx-auto text-neutral-400" />
          <h3 className="text-base font-bold text-black mt-3">No Active Contracts</h3>
          <p className="text-xs text-neutral-500 mt-1">Add license contracts to see royalty calculations.</p>
        </div>
      ) : (
        <div className="border border-neutral-200 rounded-2xl bg-white overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-neutral-50 border-b border-neutral-200 text-[10px] font-bold uppercase tracking-wider text-neutral-500">
            <div className="col-span-4">IP Holder / Ref</div>
            <div className="col-span-2 text-right">Rate</div>
            <div className="col-span-3 text-right">Revenue</div>
            <div className="col-span-3 text-right">Royalty Owed</div>
          </div>
          <div className="divide-y divide-neutral-200">
            {royaltyRows.map((row) => (
              <div key={row.id} className="grid grid-cols-12 gap-4 px-5 py-4 hover:bg-neutral-50 transition-colors items-center">
                <div className="col-span-4">
                  <p className="font-bold text-black text-sm">{row.holderName}</p>
                  <p className="text-xs text-neutral-500 font-mono mt-0.5">{row.ref}</p>
                  <p className="text-[10px] text-neutral-400 mt-0.5">Expires: {row.expiresAt || 'N/A'}</p>
                </div>
                <div className="col-span-2 text-right">
                  <span className="font-black text-black text-lg">{Number(row.royaltyRate).toFixed(1)}%</span>
                </div>
                <div className="col-span-3 text-right">
                  <span className="font-bold text-black">{formatTHB(row.revenue)}</span>
                  {row.revenue === 0 && (
                    <p className="text-[10px] text-neutral-400 mt-0.5">No matched orders</p>
                  )}
                </div>
                <div className="col-span-3 text-right">
                  <span className={`font-black text-lg ${row.royaltyOwed > 0 ? 'text-black' : 'text-neutral-400'}`}>
                    {formatTHB(row.royaltyOwed)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Summary row */}
          <div className="grid grid-cols-12 gap-4 px-5 py-4 bg-neutral-50 border-t-2 border-black items-center">
            <div className="col-span-4 text-xs font-bold uppercase tracking-wider text-black">TOTAL</div>
            <div className="col-span-2" />
            <div className="col-span-3 text-right font-black text-black">{formatTHB(totalRevenue)}</div>
            <div className="col-span-3 text-right font-black text-black text-lg">{formatTHB(totalRoyaltyOwed)}</div>
          </div>
        </div>
      )}

      <p className="text-xs text-neutral-400">
        * Revenue is calculated from fulfilled orders (status: shipped or delivered) attributed to each licensed brand. Orders with no brand data are excluded.
      </p>
    </div>
  );
}
