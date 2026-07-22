/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { Check, Plus, Trash2, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function ProductEditClient({ 
  initialProduct,
  initialBrands,
  initialCategories
}: { 
  initialProduct: any;
  initialBrands: any[];
  initialCategories: any[];
}) {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  
  // Product State
  const [name, setName] = useState(initialProduct.name || '');
  const [slug, setSlug] = useState(initialProduct.slug || '');
  const [description, setDescription] = useState(initialProduct.description || '');
  const [brandId, setBrandId] = useState(initialProduct.brand_id || '');
  const [categoryId, setCategoryId] = useState(initialProduct.category_id || '');
  const [status, setStatus] = useState(initialProduct.status || 'draft');
  
  // Variants State
  const [variants, setVariants] = useState<any[]>(initialProduct.product_variants || []);
  
  const [isLoading, setIsLoading] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim() || !supabase) return;

    setIsLoading(true);

    try {
      const { error: productError } = await supabase
        .from('products')
        .update({
          brand_id: brandId || null,
          category_id: categoryId || null,
          name: name.trim(),
          slug: slug.trim(),
          description: description.trim(),
          status: status,
        })
        .eq('id', initialProduct.id);

      if (productError) throw productError;

      // Upsert variants
      for (const variant of variants) {
        if (variant.id.startsWith('new-')) {
          // Insert new
          const { id, ...newVariantData } = variant;
          const { error: insertError } = await supabase
            .from('product_variants')
            .insert({
              ...newVariantData,
              product_id: initialProduct.id
            });
          if (insertError) throw insertError;
        } else {
          // Update existing
          const { error: updateError } = await supabase
            .from('product_variants')
            .update({
              sku: variant.sku,
              size: variant.size,
              price: variant.price,
              stock_quantity: variant.stock_quantity,
              is_active: variant.is_active
            })
            .eq('id', variant.id);
          if (updateError) throw updateError;
        }
      }

      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 3000);
      router.refresh();
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product details. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddVariant = () => {
    const newSku = slug ? `SKU-${slug.toUpperCase().slice(0, 10)}-V${variants.length + 1}` : '';
    setVariants([
      ...variants,
      {
        id: `new-${Date.now()}`,
        product_id: initialProduct.id,
        sku: newSku,
        size: 'NEW SIZE',
        price: variants[0]?.price || 2990,
        stock_quantity: 0,
        low_stock_threshold: 3,
        is_active: true
      }
    ]);
  };

  const handleUpdateVariant = (index: number, field: string, value: any) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  const handleDeleteVariant = async (index: number, variantId: string) => {
    if (!supabase) return;
    
    // If it's a newly added row that hasn't been saved yet
    if (variantId.startsWith('new-')) {
      setVariants(variants.filter((_, i) => i !== index));
      return;
    }

    // Delete from database
    if (confirm('Are you sure you want to delete this variant? This action cannot be undone.')) {
      try {
        const { error } = await supabase.from('product_variants').delete().eq('id', variantId);
        if (error) throw error;
        setVariants(variants.filter((_, i) => i !== index));
        router.refresh();
      } catch (err) {
        console.error('Error deleting variant:', err);
        alert('Failed to delete variant. It might have associated order items or stock movements.');
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <div>
          <h2 className="text-xl font-black uppercase tracking-wider text-black flex items-center gap-2">
            <Package className="w-5 h-5" />
            Edit Product
          </h2>
          <p className="text-xs text-neutral-600 mt-1">
            Update product details, categorize items, and manage variant pricing.
          </p>
        </div>
        
        {savedMsg && (
          <div className="px-4 py-2 rounded-xl bg-neutral-100 border border-black flex items-center gap-2 text-xs font-bold text-black">
            <Check className="w-3.5 h-3.5" />
            <span>Product Saved</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSaveProduct} className="space-y-8">
        
        {/* Core Details Panel */}
        <div className="p-6 rounded-2xl bg-neutral-100 border border-neutral-300 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-black border-b border-neutral-200 pb-2">
            Core Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!initialProduct.name) {
                    // Auto-slug only if new or explicitly requested
                  }
                }}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs font-medium text-black focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                URL Slug *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs font-mono text-black focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs font-bold uppercase tracking-wider text-black focus:outline-none focus:border-black"
              >
                <option value="draft">Draft</option>
                <option value="active">Active (Published)</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Licensed Brand
              </label>
              <select
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs font-medium text-black focus:outline-none focus:border-black"
              >
                <option value="">-- No Brand --</option>
                {initialBrands.map((brand) => (
                  <option key={brand.id} value={brand.id}>{brand.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs font-medium text-black focus:outline-none focus:border-black"
              >
                <option value="">-- No Category --</option>
                {initialCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Description
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white border border-neutral-300 text-xs text-black focus:outline-none focus:border-black"
              />
            </div>
          </div>
        </div>

        {/* Variants Panel */}
        <div className="p-6 rounded-2xl bg-neutral-100 border border-neutral-300 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-black">
              Product Variants (SKUs)
            </h3>
            <button
              type="button"
              onClick={handleAddVariant}
              className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-black bg-white border border-neutral-300 px-2 py-1 rounded-lg hover:bg-neutral-50"
            >
              <Plus className="w-3 h-3" /> Add Variant
            </button>
          </div>

          <div className="space-y-3">
            {variants.map((v, index) => (
              <div key={v.id} className="p-4 bg-white border border-neutral-200 rounded-xl grid grid-cols-12 gap-3 items-center">
                <div className="col-span-12 sm:col-span-3">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">SKU</label>
                  <input
                    type="text"
                    required
                    value={v.sku}
                    onChange={(e) => handleUpdateVariant(index, 'sku', e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border border-neutral-300 text-xs font-mono text-black"
                  />
                </div>
                <div className="col-span-12 sm:col-span-3">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Size/Label</label>
                  <input
                    type="text"
                    required
                    value={v.size || ''}
                    onChange={(e) => handleUpdateVariant(index, 'size', e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border border-neutral-300 text-xs text-black"
                  />
                </div>
                <div className="col-span-6 sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Price (THB)</label>
                  <input
                    type="number"
                    required
                    value={v.price}
                    onChange={(e) => handleUpdateVariant(index, 'price', parseFloat(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-lg border border-neutral-300 text-xs text-black"
                  />
                </div>
                <div className="col-span-6 sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">Stock</label>
                  <input
                    type="number"
                    required
                    value={v.stock_quantity}
                    onChange={(e) => handleUpdateVariant(index, 'stock_quantity', parseInt(e.target.value, 10))}
                    className="w-full px-2 py-1.5 rounded-lg border border-neutral-300 text-xs text-black"
                  />
                </div>
                <div className="col-span-12 sm:col-span-2 flex items-end justify-end pb-0.5">
                  <button
                    type="button"
                    onClick={() => handleDeleteVariant(index, v.id)}
                    className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Variant"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            
            {variants.length === 0 && (
              <div className="text-center py-6 text-xs text-neutral-500 border border-dashed border-neutral-300 rounded-xl">
                No variants found. A product must have at least one variant to be purchasable.
              </div>
            )}
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center gap-3 border-t border-neutral-200 pt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 rounded-xl bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50"
          >
            {isLoading ? 'Saving Changes...' : 'Save Product Changes'}
          </button>
        </div>

      </form>
    </div>
  );
}
