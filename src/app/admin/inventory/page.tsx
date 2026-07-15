'use client';

import React, { useState } from 'react';
import { useAdminStore } from '@/lib/admin/useAdminStore';
import { Plus, Minus, AlertTriangle } from 'lucide-react';

export default function AdminInventoryPage() {
  const products = useAdminStore((state) => state.products);
  const adjustStock = useAdminStore((state) => state.adjustVariantStock);
  const stockMovements = useAdminStore((state) => state.stockMovements) || [];

  const [draftChanges, setDraftChanges] = useState<Record<string, number>>({});

  const getVariantCurrentStock = (variantId: string) => {
    for (const p of products) {
      const v = p.variants.find((v) => v.id === variantId);
      if (v) return v.stockQuantity;
    }
    return 0;
  };

  const handleAdjustDraft = (variantId: string, amount: number) => {
    const currentStock = getVariantCurrentStock(variantId);
    setDraftChanges((prev) => {
      const currentDelta = prev[variantId] || 0;
      const newDelta = currentDelta + amount;

      if (currentStock + newDelta < 0) {
        return { ...prev, [variantId]: -currentStock };
      }
      return { ...prev, [variantId]: newDelta };
    });
  };

  const handleConfirmSave = () => {
    Object.entries(draftChanges).forEach(([variantId, delta]) => {
      if (delta !== 0) {
        adjustStock(
          variantId,
          delta,
          'adjustment',
          'admin',
          undefined,
          `Admin manual stock adjustment of ${delta > 0 ? '+' : ''}${delta}`
        );
      }
    });
    setDraftChanges({});
  };

  const getVariantSkuDetails = (variantId: string) => {
    for (const p of products) {
      const v = p.variants.find((v) => v.id === variantId);
      if (v) {
        return {
          productName: p.name,
          size: v.size || 'ONE SIZE',
          sku: v.sku,
        };
      }
    }
    return null;
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-black uppercase tracking-wider text-black">
          Inventory &amp; SKU Stock Controller
        </h2>
        <p className="text-xs text-neutral-600 mt-1">
          Adjust stock quantities across all merchandise sizes and monitor replenishment thresholds.
        </p>
      </div>

      <div className="border border-neutral-200 rounded-2xl bg-white overflow-hidden">
        <div className="divide-y divide-neutral-200">
          {products.map((prod) => (
            <div key={prod.id} className="p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                <span className="font-black text-black text-sm">{prod.name}</span>
                <span className="text-xs font-mono text-neutral-500">Slug: {prod.slug}</span>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {prod.variants.map((variant) => {
                  const isLow = variant.stockQuantity <= variant.lowStockThreshold;

                  return (
                    <div
                      key={variant.id}
                      className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                        isLow ? 'border-black bg-neutral-100' : 'border-neutral-200 bg-white'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-black text-xs">
                            {variant.sku}
                          </span>
                          {isLow && (
                            <span className="px-2 py-0.5 rounded bg-black text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              <span>Low Stock Alert</span>
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-neutral-500 mt-0.5">
                          Size: {variant.size || 'ONE SIZE'} &bull; Threshold: {variant.lowStockThreshold} Units
                        </div>
                      </div>

                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="text-center flex flex-col items-center">
                          <span className="text-[10px] uppercase tracking-wider text-neutral-500 block">
                            In Stock
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className={`font-black text-base ${draftChanges[variant.id] !== undefined ? 'text-neutral-400 line-through' : 'text-black'}`}>
                              {variant.stockQuantity}
                            </span>
                            {draftChanges[variant.id] !== undefined && (
                              <>
                                <span className="text-xs text-neutral-400">&rarr;</span>
                                <span className="font-black text-base text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded font-mono">
                                  {variant.stockQuantity + draftChanges[variant.id]}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleAdjustDraft(variant.id, -5)}
                            className="px-2.5 py-1.5 rounded-lg border border-neutral-300 bg-white text-xs font-bold hover:bg-neutral-100"
                            title="Subtract 5"
                          >
                            -5
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAdjustDraft(variant.id, -1)}
                            className="p-1.5 rounded-lg border border-neutral-300 bg-white text-xs font-bold hover:bg-neutral-100"
                            title="Subtract 1"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAdjustDraft(variant.id, 1)}
                            className="p-1.5 rounded-lg border border-black bg-black text-white text-xs font-bold hover:bg-neutral-800"
                            title="Add 1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAdjustDraft(variant.id, 10)}
                            className="px-2.5 py-1.5 rounded-lg border border-black bg-black text-white text-xs font-bold hover:bg-neutral-800"
                            title="Add 10"
                          >
                            +10
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {Object.keys(draftChanges).length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-black text-white px-6 py-4 rounded-2xl border border-neutral-850 shadow-2xl flex items-center justify-between gap-8">
          <div className="text-xs">
            <span className="font-black uppercase tracking-wider block">Unsaved Stock Adjustments</span>
            <span className="text-neutral-400 mt-0.5 block">You have adjusted stock for {Object.keys(draftChanges).length} SKU(s).</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDraftChanges({})}
              className="px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white font-bold text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors"
            >
              Discard
            </button>
            <button
              type="button"
              onClick={handleConfirmSave}
              className="px-4 py-2 rounded-xl bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-neutral-100 transition-colors"
            >
              Confirm &amp; Save
            </button>
          </div>
        </div>
      )}

      {/* Stock Audit Ledger */}
      <div className="space-y-4 pt-6 border-t border-neutral-200">
        <div>
          <h3 className="text-sm font-black uppercase tracking-wider text-black">
            Stock Audit Ledger
          </h3>
          <p className="text-[11px] text-neutral-500 mt-0.5">
            Live chronological log of all stock reservations, sales, adjustments, and returns.
          </p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-100 border-b border-neutral-200 text-neutral-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Product Variant</th>
                  <th className="py-3 px-4 text-center">Type</th>
                  <th className="py-3 px-4 text-center">Change</th>
                  <th className="py-3 px-4">Reference &amp; Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 font-medium text-black">
                {stockMovements.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-neutral-500">
                      No stock movement logs recorded yet.
                    </td>
                  </tr>
                ) : (
                  stockMovements.map((move) => {
                    const details = getVariantSkuDetails(move.productVariantId);
                    const isPositive = move.quantity > 0;
                    const formattedQty = `${isPositive ? '+' : ''}${move.quantity}`;

                    // Color coding for movement types
                    let badgeStyle = 'bg-neutral-100 text-neutral-600';
                    if (move.movementType === 'reserve') badgeStyle = 'bg-amber-100 text-amber-800';
                    else if (move.movementType === 'sale') badgeStyle = 'bg-black text-white';
                    else if (move.movementType === 'release') badgeStyle = 'bg-blue-100 text-blue-800';
                    else if (move.movementType === 'return') badgeStyle = 'bg-emerald-100 text-emerald-800';
                    else if (move.movementType === 'adjustment') badgeStyle = 'bg-red-100 text-red-800';

                    return (
                      <tr key={move.id} className="hover:bg-neutral-50">
                        <td className="py-3 px-4 text-neutral-500 font-mono text-[10px]">
                          {new Date(move.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </td>
                        <td className="py-3 px-4">
                          {details ? (
                            <div>
                              <div className="font-bold">{details.productName}</div>
                              <div className="text-[10px] text-neutral-500 mt-0.5">
                                Size: {details.size} &bull; SKU: <span className="font-mono">{details.sku}</span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-neutral-400 italic">Unknown Variant ({move.productVariantId})</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${badgeStyle}`}>
                            {move.movementType}
                          </span>
                        </td>
                        <td className={`py-3 px-4 text-center font-bold ${isPositive ? 'text-emerald-600' : move.quantity < 0 ? 'text-red-600' : 'text-neutral-500'}`}>
                          {formattedQty}
                        </td>
                        <td className="py-3 px-4 font-normal text-neutral-600 max-w-xs truncate" title={move.note}>
                          {move.note || '-'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
