'use client';

import React from 'react';
import { useAdminStore } from '@/lib/admin/useAdminStore';
import { Plus, Minus, AlertTriangle } from 'lucide-react';

export default function AdminInventoryPage() {
  const products = useAdminStore((state) => state.products);
  const adjustStock = useAdminStore((state) => state.adjustVariantStock);

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
                        <div className="text-center">
                          <span className="text-[10px] uppercase tracking-wider text-neutral-500 block">
                            In Stock
                          </span>
                          <span className="font-black text-black text-base">
                            {variant.stockQuantity}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => adjustStock(variant.id, -5)}
                            className="px-2.5 py-1.5 rounded-lg border border-neutral-300 bg-white text-xs font-bold hover:bg-neutral-100"
                            title="Subtract 5"
                          >
                            -5
                          </button>
                          <button
                            type="button"
                            onClick={() => adjustStock(variant.id, -1)}
                            className="p-1.5 rounded-lg border border-neutral-300 bg-white text-xs font-bold hover:bg-neutral-100"
                            title="Subtract 1"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => adjustStock(variant.id, 1)}
                            className="p-1.5 rounded-lg border border-black bg-black text-white text-xs font-bold hover:bg-neutral-800"
                            title="Add 1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => adjustStock(variant.id, 10)}
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
    </div>
  );
}
