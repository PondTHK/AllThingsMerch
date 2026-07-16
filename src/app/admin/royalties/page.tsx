'use client';

import React, { useState, useMemo } from 'react';
import { useAdminStore } from '@/lib/admin/useAdminStore';
import { formatTHB } from '@/lib/money';
import { 
  Coins, 
  TrendingUp, 
  FileText, 
  Undo2, 
  Calendar,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

type DateFilterPreset = 'all' | 'month' | 'last-month' | 'quarter' | 'year';

export default function RoyaltyReportsPage() {
  const orders = useAdminStore((state) => state.orders);
  const contracts = useAdminStore((state) => state.contracts);
  const [activePreset, setActivePreset] = useState<DateFilterPreset>('all');

  // Filter orders based on the selected date range preset
  const filteredOrders = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-indexed

    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      const orderYear = orderDate.getFullYear();
      const orderMonth = orderDate.getMonth();

      switch (activePreset) {
        case 'month':
          return orderYear === currentYear && orderMonth === currentMonth;
        case 'last-month': {
          const targetMonth = currentMonth === 0 ? 11 : currentMonth - 1;
          const targetYear = currentMonth === 0 ? currentYear - 1 : currentYear;
          return orderYear === targetYear && orderMonth === targetMonth;
        }
        case 'quarter': {
          const currentQuarter = Math.floor(currentMonth / 3);
          const orderQuarter = Math.floor(orderMonth / 3);
          return orderYear === currentYear && orderQuarter === currentQuarter;
        }
        case 'year':
          return orderYear === currentYear;
        case 'all':
        default:
          return true;
      }
    });
  }, [orders, activePreset]);

  // Aggregate metrics
  const stats = useMemo(() => {
    let grossSales = 0;
    let netSales = 0;
    let totalRoyalty = 0;
    const orderCount = filteredOrders.length;
    let itemsCount = 0;
    let activeReversals = 0;

    filteredOrders.forEach((order) => {
      const isCancelled = order.status === 'cancelled';
      if (isCancelled) {
        activeReversals += 1;
      } else {
        netSales += order.totalAmount;
      }

      order.items.forEach((item) => {
        const itemGross = item.unitPrice * item.quantity;
        const itemRoyalty = (itemGross * (item.royaltyRateSnapshot || 10.0)) / 100;
        
        itemsCount += item.quantity;

        if (isCancelled) {
          // Reversal reduces calculated royalty and gross sales
          totalRoyalty -= itemRoyalty;
          grossSales -= itemGross;
        } else {
          totalRoyalty += itemRoyalty;
          grossSales += itemGross;
        }
      });
    });

    return {
      grossSales,
      netSales,
      totalRoyalty,
      orderCount,
      itemsCount,
      activeReversals,
    };
  }, [filteredOrders]);

  // Group calculations by Contract/License Holder
  const holderSummaries = useMemo(() => {
    const map = new Map<string, {
      id: string;
      holderName: string;
      contractRef: string;
      rate: number;
      unitsSold: number;
      accumulatedRoyalty: number;
    }>();

    // Initialize map with all known active contracts
    contracts.forEach((contract) => {
      map.set(contract.id, {
        id: contract.id,
        holderName: contract.holderName,
        contractRef: contract.contractReference,
        rate: contract.royaltyRate,
        unitsSold: 0,
        accumulatedRoyalty: 0,
      });
    });

    // Populate using order data
    filteredOrders.forEach((order) => {
      const isCancelled = order.status === 'cancelled';

      order.items.forEach((item) => {
        // Fallback mapping if licenseContractId isn't snapshot on older items
        let contractId = item.licenseContractId;
        if (!contractId) {
          // Attempt fuzzy match on product name or SKU
          const matchingContract = contracts.find(c => 
            item.sku.startsWith(c.contractReference.split('-')[0]) ||
            item.productName.toLowerCase().includes(c.holderName.toLowerCase().split(' ')[0].toLowerCase())
          );
          contractId = matchingContract?.id || 'default-contract';
        }

        let summary = map.get(contractId);
        if (!summary) {
          // If contract is not predefined, create a placeholder
          summary = {
            id: contractId,
            holderName: 'Other/Default IP Holder',
            contractRef: 'DEFAULT-10%',
            rate: item.royaltyRateSnapshot || 10.0,
            unitsSold: 0,
            accumulatedRoyalty: 0,
          };
          map.set(contractId, summary);
        }

        const itemGross = item.unitPrice * item.quantity;
        const itemRoyalty = (itemGross * summary.rate) / 100;

        if (isCancelled) {
          summary.unitsSold -= item.quantity;
          summary.accumulatedRoyalty -= itemRoyalty;
        } else {
          summary.unitsSold += item.quantity;
          summary.accumulatedRoyalty += itemRoyalty;
        }
      });
    });

    return Array.from(map.values());
  }, [contracts, filteredOrders]);

  // Flattened items list for the Ledger / Transactions log
  const ledgerEntries = useMemo(() => {
    const list: Array<{
      id: string;
      orderNumber: string;
      date: string;
      productName: string;
      sku: string;
      holderName: string;
      quantity: number;
      unitPrice: number;
      grossPrice: number;
      royaltyRate: number;
      royaltyAmount: number;
      isCancelled: boolean;
    }> = [];

    filteredOrders.forEach((order) => {
      const isCancelled = order.status === 'cancelled';
      order.items.forEach((item) => {
        // Find matching contract details
        const contractId = item.licenseContractId;
        const matchedContract = contracts.find(c => c.id === contractId || c.contractReference === contractId);
        const holderName = matchedContract?.holderName || 'Other/Default IP Holder';
        const rate = item.royaltyRateSnapshot || 10.0;
        const gross = item.unitPrice * item.quantity;
        const royaltyVal = (gross * rate) / 100;

        list.push({
          id: item.id,
          orderNumber: order.orderNumber,
          date: order.createdAt,
          productName: item.productName,
          sku: item.sku,
          holderName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          grossPrice: isCancelled ? -gross : gross,
          royaltyRate: rate,
          royaltyAmount: isCancelled ? -royaltyVal : royaltyVal,
          isCancelled,
        });
      });
    });

    // Sort by order date descending
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [contracts, filteredOrders]);

  return (
    <div className="space-y-10">
      {/* Title & Section Description */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-neutral-200 pb-6">
        <div>
          <h2 className="text-xl font-black uppercase tracking-wider text-black">
            Licensing Royalty &amp; Sales Reports
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            Audit real-time transactional merchandise revenues, active intellectual property contracts, and calculated license holder royalties.
          </p>
        </div>

        {/* Date Filter Tabs */}
        <div className="flex flex-wrap items-center bg-neutral-100 p-1.5 rounded-xl border border-neutral-200 self-start">
          {[
            { id: 'all', label: 'All Time' },
            { id: 'month', label: 'This Month' },
            { id: 'last-month', label: 'Last Month' },
            { id: 'quarter', label: 'This Quarter' },
            { id: 'year', label: 'This Year' },
          ].map((preset) => (
            <button
              key={preset.id}
              onClick={() => setActivePreset(preset.id as DateFilterPreset)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                activePreset === preset.id
                  ? 'bg-black text-white'
                  : 'text-neutral-500 hover:text-black'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-neutral-100 border border-neutral-200 flex flex-col justify-between h-36">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-bold uppercase tracking-wider">Gross Sales (Subtotal)</span>
            <TrendingUp className="w-4 h-4 text-black" />
          </div>
          <div>
            <div className="text-2xl font-black text-black">
              {formatTHB(stats.grossSales)}
            </div>
            <div className="text-[10px] text-neutral-500 font-medium mt-1">
              Before discount &amp; shipping fee
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-neutral-100 border border-neutral-200 flex flex-col justify-between h-36">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-bold uppercase tracking-wider">Net Store Revenue</span>
            <Calendar className="w-4 h-4 text-black" />
          </div>
          <div>
            <div className="text-2xl font-black text-black">
              {formatTHB(stats.netSales)}
            </div>
            <div className="text-[10px] text-neutral-500 font-medium mt-1">
              Actual customer payout amount
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-neutral-100 border border-neutral-200 flex flex-col justify-between h-36">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-bold uppercase tracking-wider">Royalty Owed</span>
            <Coins className="w-4 h-4 text-black" />
          </div>
          <div>
            <div className="text-2xl font-black text-black">
              {formatTHB(stats.totalRoyalty)}
            </div>
            <div className="text-[10px] text-neutral-500 font-medium mt-1">
              Licensing liability accumulator
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-neutral-100 border border-neutral-200 flex flex-col justify-between h-36">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-bold uppercase tracking-wider">Orders Processed</span>
            <FileText className="w-4 h-4 text-black" />
          </div>
          <div>
            <div className="text-2xl font-black text-black">{stats.orderCount}</div>
            <div className="text-[10px] text-neutral-500 font-medium mt-1">
              {stats.itemsCount} units sold {stats.activeReversals > 0 && `• ${stats.activeReversals} Reversals`}
            </div>
          </div>
        </div>
      </div>

      {/* Main Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Summary by License Holder */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-wider text-black flex items-center gap-1.5">
              <Coins className="w-4 h-4" />
              <span>License Holder Ledger</span>
            </h3>
            <span className="text-[10px] font-bold text-neutral-500 uppercase">Active Contracts</span>
          </div>

          <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-neutral-100 border-b border-neutral-200 text-neutral-500 font-bold uppercase tracking-wider">
                    <th className="py-3.5 px-4 font-bold">Holder / Contract</th>
                    <th className="py-3.5 px-4 font-bold text-center">Rate</th>
                    <th className="py-3.5 px-4 font-bold text-center">Units</th>
                    <th className="py-3.5 px-4 font-bold text-right">Royalty Owed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {holderSummaries.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-neutral-500 font-medium">
                        No license agreements configured.
                      </td>
                    </tr>
                  ) : (
                    holderSummaries.map((summary) => (
                      <tr key={summary.id} className="hover:bg-neutral-50 font-medium text-black">
                        <td className="py-3.5 px-4">
                          <div className="font-bold">{summary.holderName}</div>
                          <div className="text-[10px] text-neutral-500 font-mono mt-0.5">{summary.contractRef}</div>
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono font-bold">
                          {summary.rate.toFixed(2)}%
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono">
                          {summary.unitsSold}
                        </td>
                        <td className={`py-3.5 px-4 text-right font-mono font-bold ${
                          summary.accumulatedRoyalty < 0 ? 'text-red-600' : ''
                        }`}>
                          {formatTHB(summary.accumulatedRoyalty)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Explanation Alert */}
          <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
            <div className="text-[11px] text-neutral-600 leading-normal">
              <span className="font-bold text-black block mb-0.5">Royalty Base Calculation Rule</span>
              License holder royalties are computed using the <strong>Gross Price</strong> (unit catalog price × quantity) snapshot at checkout, as specified in the SADS audit guidelines. Discounts applied at order checkout do not decrease partner royalties.
            </div>
          </div>
        </div>

        {/* Right Column: Transaction Log / Ledger */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-wider text-black flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              <span>Royalty Transaction Ledger</span>
            </h3>
            <span className="text-[10px] font-bold text-neutral-500 uppercase">{ledgerEntries.length} items</span>
          </div>

          <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-neutral-100 border-b border-neutral-200 text-neutral-500 font-bold uppercase tracking-wider">
                    <th className="py-3.5 px-4 font-bold">Order / Date</th>
                    <th className="py-3.5 px-4 font-bold">Item / Brand</th>
                    <th className="py-3.5 px-4 font-bold text-right">Gross Price</th>
                    <th className="py-3.5 px-4 font-bold text-right">Royalty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {ledgerEntries.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-neutral-500 font-medium">
                        No transactions recorded in the selected period.
                      </td>
                    </tr>
                  ) : (
                    ledgerEntries.map((entry) => (
                      <tr key={entry.id} className={`hover:bg-neutral-50 font-medium text-black ${
                        entry.isCancelled ? 'bg-red-50/30' : ''
                      }`}>
                        <td className="py-3.5 px-4">
                          <div className="font-bold font-mono">{entry.orderNumber}</div>
                          <div className="text-[10px] text-neutral-500 mt-0.5">
                            {new Date(entry.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold truncate max-w-[180px]">{entry.productName}</div>
                          <div className="text-[10px] text-neutral-500 mt-0.5 flex items-center gap-1.5">
                            <span>{entry.holderName}</span>
                            {entry.isCancelled && (
                              <span className="inline-flex items-center gap-0.5 px-1 py-0.25 rounded bg-red-100 text-red-700 text-[9px] font-black uppercase tracking-wide">
                                <Undo2 className="w-2.5 h-2.5" /> Reversal
                              </span>
                            )}
                          </div>
                        </td>
                        <td className={`py-3.5 px-4 text-right font-mono font-bold ${
                          entry.isCancelled ? 'text-red-600' : ''
                        }`}>
                          {entry.quantity} &times; {formatTHB(entry.unitPrice)}
                        </td>
                        <td className={`py-3.5 px-4 text-right font-mono font-bold ${
                          entry.isCancelled ? 'text-red-600 font-black' : ''
                        }`}>
                          <div className="text-[10px] text-neutral-500 font-medium">
                            ({entry.royaltyRate.toFixed(1)}%)
                          </div>
                          <div>
                            {entry.isCancelled ? '-' : ''}{formatTHB(Math.abs(entry.royaltyAmount))}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
