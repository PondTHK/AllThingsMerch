'use client';

import React, { useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { formatTHB } from '@/lib/money';
import { Plus, Check, Eye, EyeOff, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Product = any; // We can use the actual types from our schema or 'any' for simplicity here

interface ProductsClientProps {
  initialProducts: Product[];
  initialBrands: any[];
  initialCategories: any[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

export function ProductsClient({
  initialProducts,
  initialBrands,
  initialCategories,
  currentPage,
  totalPages,
  totalCount,
}: ProductsClientProps) {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [brandId, setBrandId] = useState(initialBrands[0]?.id || '');
  const [categoryId, setCategoryId] = useState(initialCategories[0]?.id || '');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState('2990');
  const [stockQuantity, setStockQuantity] = useState('20');
  const [createdMsg, setCreatedMsg] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleNameChange = (val: string) => {
    setName(val);
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setSlug(generatedSlug);
    setSku(`SKU-${generatedSlug.toUpperCase().slice(0, 10)}-01`);
  };

  const toggleStatus = async (productId: string, currentStatus: string) => {
    if (!supabase) return;
    const nextStatus = currentStatus === 'active' ? 'draft' : 'active';
    const previousProducts = [...products];
    
    // Optimistic update
    setProducts((prev) => 
      prev.map((p) => p.id === productId ? { ...p, status: nextStatus } : p)
    );

    try {
      const { error } = await supabase
        .from('products')
        .update({ status: nextStatus })
        .eq('id', productId);
        
      if (error) throw error;
      router.refresh();
    } catch (error) {
      console.error('Failed to toggle product status:', error);
      alert('Failed to update product status. Please try again.');
      setProducts(previousProducts);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim() || !sku.trim() || !supabase) return;

    setIsLoading(true);

    try {
      // 1. Insert product
      const { data: newProduct, error: productError } = await supabase
        .from('products')
        .insert({
          brand_id: brandId,
          category_id: categoryId,
          name: name.trim(),
          slug: slug.trim(),
          description: description.trim() || 'Official licensed merchandise release.',
          status: 'active',
          is_preorder: false,
        })
        .select()
        .single();

      if (productError) throw productError;

      // 2. Insert variant
      const parsedPrice = parseFloat(price) || 2990;
      const parsedStock = parseInt(stockQuantity, 10) || 20;

      const { data: newVariant, error: variantError } = await supabase
        .from('product_variants')
        .insert({
          product_id: newProduct.id,
          sku: sku.trim(),
          size: 'ONE SIZE',
          price: parsedPrice,
          stock_quantity: parsedStock,
          low_stock_threshold: 3,
          is_active: true,
        })
        .select()
        .single();

      if (variantError) {
        // Rollback pseudo-transaction
        await supabase.from('products').delete().eq('id', newProduct.id);
        throw variantError;
      }

      // Update local state
      setProducts([{ ...newProduct, product_variants: [newVariant] }, ...products]);

      setName('');
      setSlug('');
      setDescription('');
      setSku('');
      setShowForm(false);
      setCreatedMsg(true);
      setTimeout(() => setCreatedMsg(false), 3000);
      router.refresh();
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Failed to create product.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-neutral-200 pb-4 gap-4">
        <div>
          <h2 className="text-xl font-black uppercase tracking-wider text-black">
            Catalog Product Management
          </h2>
          <p className="text-xs text-neutral-600 mt-1">
            Create new merchandising releases and toggle storefront availability.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2.5 rounded-xl bg-black text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-neutral-800 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Product Release</span>
        </button>
      </div>

      {createdMsg && (
        <div className="p-4 rounded-xl bg-neutral-100 border border-black flex items-center gap-2 text-xs font-bold text-black">
          <Check className="w-4 h-4" />
          <span>New product release added successfully to catalog.</span>
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="p-6 rounded-2xl bg-neutral-100 border border-neutral-300 space-y-4 max-w-2xl"
        >
          <h3 className="text-xs font-bold uppercase tracking-wider text-black">
            New Merch Specification
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
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Red Bull Racing 2026 Special Edition Cap"
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
                Variant SKU Code *
              </label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs font-mono text-black focus:outline-none focus:border-black"
              />
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
                {initialBrands.length === 0 && <option value="">No Brands Available</option>}
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
                {initialCategories.length === 0 && <option value="">No Categories Available</option>}
                {initialCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Price (THB) *
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs font-medium text-black focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Initial Stock Quantity *
              </label>
              <input
                type="number"
                required
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs font-medium text-black focus:outline-none focus:border-black"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-white border border-neutral-300 text-xs text-black focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50"
            >
              {isLoading ? 'Publishing...' : 'Publish Product'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2.5 rounded-xl border border-neutral-300 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-neutral-200"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Products Table */}
      {products.length === 0 ? (
        <div className="rounded-2xl bg-neutral-100 border border-neutral-200 p-12 text-center space-y-3">
          <Package className="w-10 h-10 mx-auto text-neutral-400" />
          <h3 className="text-base font-bold text-black">No Products in Catalog</h3>
          <p className="text-xs text-neutral-600 max-w-xs mx-auto">
            Add your first merchandise release using the &quot;New Product Release&quot; button above.
          </p>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors mt-2"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Product Release</span>
          </button>
        </div>
      ) : (
      <div className="border border-neutral-200 rounded-2xl bg-white overflow-hidden">
        <div className="divide-y divide-neutral-200">
          {products.map((prod) => {
            const primaryVariant = prod.product_variants?.[0];
            const isActive = prod.status === 'active';

            return (
              <div
                key={prod.id}
                className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-neutral-50 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-black text-sm">{prod.name}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        isActive ? 'bg-black text-white' : 'bg-neutral-300 text-neutral-700'
                      }`}
                    >
                      {prod.status}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-500 mt-1">
                    Slug: <span className="font-mono">{prod.slug}</span> &bull; SKU:{' '}
                    <span className="font-mono">{primaryVariant?.sku || 'N/A'}</span> &bull; Stock:{' '}
                    <span className="font-bold text-black">
                      {prod.product_variants?.reduce((s: number, v: any) => s + (v.stock_quantity || 0), 0) || 0} Units
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-right">
                    <div className="font-black text-black text-sm">
                      {primaryVariant ? formatTHB(primaryVariant.price) : 'N/A'}
                    </div>
                  </div>

                  <Link
                    href={`/admin/products/${prod.id}`}
                    className="px-3.5 py-2 rounded-xl border border-neutral-300 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-neutral-100 flex items-center gap-1.5"
                  >
                    <span>Edit</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => toggleStatus(prod.id, prod.status)}
                    className="px-3.5 py-2 rounded-xl border border-neutral-300 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-neutral-100 flex items-center gap-1.5"
                  >
                    {isActive ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-neutral-500" />
                        <span>Set Draft</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5 text-black" />
                        <span>Publish</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      )}
      
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-neutral-200 pt-4">
          <p className="text-xs text-neutral-500">
            Showing page {currentPage} of {totalPages} ({totalCount} total products)
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push(`/admin/products?page=${currentPage - 1}`)}
              disabled={currentPage <= 1 || isLoading}
              className="px-3 py-1.5 rounded-xl border border-neutral-300 bg-white text-xs font-bold disabled:opacity-50 hover:bg-neutral-50"
            >
              Previous
            </button>
            <button
              onClick={() => router.push(`/admin/products?page=${currentPage + 1}`)}
              disabled={currentPage >= totalPages || isLoading}
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
