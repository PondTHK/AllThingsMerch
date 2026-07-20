'use client';

import React, { useState } from 'react';
import { Plus, Minus, AlertTriangle, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { adjustStockAction, setStockAbsoluteAction } from './actions';

export interface InventoryVariantDto {
  id: string;
  sku: string;
  size: string | null;
  stockQuantity: number;
  lowStockThreshold: number;
}

export interface InventoryProductDto {
  id: string;
  name: string;
  slug: string;
  variants: InventoryVariantDto[];
}

interface InventoryClientProps {
  initialProducts: InventoryProductDto[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

export function InventoryClient({
  initialProducts,
  currentPage,
  totalPages,
  totalCount,
}: InventoryClientProps) {
  const router = useRouter();
  const [products, setProducts] = useState<InventoryProductDto[]>(initialProducts);
  // Per-variant manual input state: variantId -> { inputValue, saving, saved }
  const [manualInputs, setManualInputs] = useState<Record<string, { value: string; saving: boolean; saved: boolean }>>({});
  const [isUpdating, setIsUpdating] = useState(false);

  const adjustStock = async (variantId: string, deltaAmount: number) => {
    setIsUpdating(true);
    
    const previousProducts = [...products];

    // Optimistic update
    setProducts((prev) =>
      prev.map((prod) => ({
        ...prod,
        variants: prod.variants.map((v) => {
          if (v.id !== variantId) return v;
          const newQty = Math.max(0, v.stockQuantity + deltaAmount);
          return { ...v, stockQuantity: newQty };
        }),
      }))
    );

    const result = await adjustStockAction(variantId, deltaAmount);
    
    if (!result.success) {
      alert(result.error || 'Failed to adjust stock.');
      setProducts(previousProducts);
    }

    setIsUpdating(false);
  };

  const setStockAbsolute = async (variantId: string, newQty: number) => {
    if (newQty < 0) return;

    setManualInputs((prev) => ({ ...prev, [variantId]: { ...prev[variantId], saving: true, saved: false } }));
    const previousProducts = [...products];

    // Optimistic update
    setProducts((prev) =>
      prev.map((prod) => ({
        ...prod,
        variants: prod.variants.map((v) =>
          v.id === variantId ? { ...v, stockQuantity: newQty } : v
        ),
      }))
    );

    const result = await setStockAbsoluteAction(variantId, newQty);
    
    if (!result.success) {
      alert(result.error || 'Failed to set stock.');
      setProducts(previousProducts);
      setManualInputs((prev) => ({ ...prev, [variantId]: { ...prev[variantId], saving: false, saved: false } }));
    } else {
      setManualInputs((prev) => ({ ...prev, [variantId]: { value: String(newQty), saving: false, saved: true } }));
      setTimeout(() => {
        setManualInputs((prev) => ({ ...prev, [variantId]: { ...prev[variantId], saved: false } }));
      }, 2000);
    }
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
                  const stockQuantity = variant.stockQuantity || 0;
                  const isLow = stockQuantity <= variant.lowStockThreshold;

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

                      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="text-center">
                          <span className="text-[10px] uppercase tracking-wider text-neutral-500 block">
                            In Stock
                          </span>
                          <span className="font-black text-black text-base">
                            {stockQuantity}
                          </span>
                        </div>

                        {/* Quick ±buttons */}
                        <div className="flex items-center gap-1.5">
                          <button
                           type="button"
                           disabled={isUpdating}
                           onClick={() => adjustStock(variant.id, -5)}
                           className="px-2.5 py-1.5 rounded-lg border border-neutral-300 bg-white text-xs font-bold hover:bg-neutral-100 disabled:opacity-50"
                           title="Subtract 5"
                         >
                           -5
                         </button>
                         <button
                           type="button"
                           disabled={isUpdating}
                           onClick={() => adjustStock(variant.id, -1)}
                           className="p-1.5 rounded-lg border border-neutral-300 bg-white text-xs font-bold hover:bg-neutral-100 disabled:opacity-50"
                           title="Subtract 1"
                         >
                           <Minus className="w-3.5 h-3.5" />
                         </button>
                         <button
                           type="button"
                           disabled={isUpdating}
                           onClick={() => adjustStock(variant.id, 1)}
                           className="p-1.5 rounded-lg border border-black bg-black text-white text-xs font-bold hover:bg-neutral-800 disabled:opacity-50"
                           title="Add 1"
                         >
                           <Plus className="w-3.5 h-3.5" />
                         </button>
                         <button
                           type="button"
                           disabled={isUpdating}
                           onClick={() => adjustStock(variant.id, 10)}
                           className="px-2.5 py-1.5 rounded-lg border border-black bg-black text-white text-xs font-bold hover:bg-neutral-800 disabled:opacity-50"
                           title="Add 10"
                         >
                           +10
                         </button>
                        </div>

                        {/* Manual set input */}
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min="0"
                            value={manualInputs[variant.id]?.value ?? ''}
                            onChange={(e) =>
                              setManualInputs((prev) => ({
                                ...prev,
                                [variant.id]: { value: e.target.value, saving: false, saved: false },
                              }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                const val = parseInt(manualInputs[variant.id]?.value ?? '', 10);
                                if (!isNaN(val)) setStockAbsolute(variant.id, val);
                              }
                            }}
                            placeholder="Set qty"
                            className="w-20 px-2.5 py-1.5 rounded-lg border border-neutral-300 bg-white text-xs font-mono text-black focus:outline-none focus:border-black"
                          />
                          <button
                            type="button"
                            disabled={manualInputs[variant.id]?.saving}
                            onClick={() => {
                              const val = parseInt(manualInputs[variant.id]?.value ?? '', 10);
                              if (!isNaN(val)) setStockAbsolute(variant.id, val);
                            }}
                            className="p-1.5 rounded-lg border border-neutral-300 bg-white text-xs font-bold hover:bg-neutral-100 disabled:opacity-50"
                            title="Set stock to this value"
                          >
                            {manualInputs[variant.id]?.saved ? (
                              <Check className="w-3.5 h-3.5 text-black" />
                            ) : (
                              <Check className="w-3.5 h-3.5 text-neutral-400" />
                            )}
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
      
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-neutral-200 pt-4">
          <p className="text-xs text-neutral-500">
            Showing page {currentPage} of {totalPages} ({totalCount} total products)
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push(`/admin/inventory?page=${currentPage - 1}`)}
              disabled={currentPage <= 1 || isUpdating}
              className="px-3 py-1.5 rounded-xl border border-neutral-300 bg-white text-xs font-bold disabled:opacity-50 hover:bg-neutral-50"
            >
              Previous
            </button>
            <button
              onClick={() => router.push(`/admin/inventory?page=${currentPage + 1}`)}
              disabled={currentPage >= totalPages || isUpdating}
              className="px-3 py-1.5 rounded-xl border border-neutral-300 bg-white text-xs font-bold disabled:opacity-50 hover:bg-neutral-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
