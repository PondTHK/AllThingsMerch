'use client';

import React, { useState } from 'react';
import { formatTHB } from '@/lib/money';
import { Plus, Check, Eye, EyeOff, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createProductAction, toggleProductStatusAction } from './actions';

export interface ProductDto {
  id: string;
  name: string;
  slug: string;
  status: string;
  totalStock: number;
  primaryVariantSku: string;
  primaryVariantPrice: number;
  featuredImage: string | null;
}

export interface BrandDto {
  id: string;
  name: string;
}

export interface CategoryDto {
  id: string;
  name: string;
}

interface ProductsClientProps {
  initialProducts: ProductDto[];
  initialBrands: BrandDto[];
  initialCategories: CategoryDto[];
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
  const [products, setProducts] = useState<ProductDto[]>(initialProducts);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [brandId, setBrandId] = useState(initialBrands[0]?.id || '');
  const [categoryId, setCategoryId] = useState(initialCategories[0]?.id || '');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState('2990');
  const [stockQuantity, setStockQuantity] = useState('20');
  const [featuredImage, setFeaturedImage] = useState('');
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
    const nextStatus = currentStatus === 'active' ? 'draft' : 'active';
    const previousProducts = [...products];

    // Optimistic update
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, status: nextStatus } : p))
    );

    const result = await toggleProductStatusAction(productId);
    
    if (!result.success) {
      alert(result.error || 'Failed to update product status. Please try again.');
      setProducts(previousProducts);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim() || !sku.trim()) return;

    setIsLoading(true);

    try {
      const parsedPrice = parseFloat(price) || 2990;
      const parsedStock = parseInt(stockQuantity, 10) || 20;

      const result = await createProductAction({
        brandId,
        categoryId,
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim() || 'Official licensed merchandise release.',
        isPreorder: false,
        sku: sku.trim(),
        price: parsedPrice,
        stockQuantity: parsedStock,
        lowStockThreshold: 3,
        featuredImage: featuredImage.trim(),
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      setName('');
      setSlug('');
      setDescription('');
      setSku('');
      setFeaturedImage('');
      setShowForm(false);
      setCreatedMsg(true);
      setTimeout(() => setCreatedMsg(false), 3000);
      
      // Instead of manual optimistic insert, we just refresh since actions revalidate path
      // But for better UX we could insert a dummy object until refresh completes.
      // Next.js router.refresh() is seamless anyway.
      router.refresh();
      
    } catch (error: unknown) {
      console.error('Error creating product:', error);
      const err = error as { message?: string } | null;
      alert(err?.message || 'Failed to create product.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 pb-4 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Catalog Product Management
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Create new merchandising releases and toggle storefront availability.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2.5 rounded-xl bg-blue-600/90 backdrop-blur-md text-white text-sm font-medium flex items-center gap-2 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-600/20 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 border border-blue-500/50"
        >
          <Plus className="w-4 h-4" />
          <span>New Product Release</span>
        </button>
      </div>

      {createdMsg && (
        <div className="p-4 rounded-xl bg-green-50/80 backdrop-blur-md border border-green-200/60 flex items-center gap-2 text-sm font-medium text-green-800 shadow-sm">
          <Check className="w-4 h-4" />
          <span>New product release added successfully to catalog.</span>
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="p-6 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-4 max-w-2xl transition-all duration-300"
        >
          <h3 className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
            New Merch Specification
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Featured Image URL *
              </label>
              <input
                type="url"
                required
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                placeholder="https://img.sasom.co.th/..."
                className="w-full px-4 py-2.5 rounded-xl bg-white/50 backdrop-blur-sm border border-slate-200/60 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 focus:bg-white transition-all duration-300"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Red Bull Racing 2026 Special Edition Cap"
                className="w-full px-4 py-2.5 rounded-xl bg-white/50 backdrop-blur-sm border border-slate-200/60 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 focus:bg-white transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                URL Slug *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Variant SKU Code *
              </label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-300 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Licensed Brand
              </label>
              <select
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              >
                {initialBrands.length === 0 && <option value="">No Brands Available</option>}
                {initialBrands.map((brand) => (
                  <option key={brand.id} value={brand.id}>{brand.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              >
                {initialCategories.length === 0 && <option value="">No Categories Available</option>}
                {initialCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Price (THB) *
              </label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Initial Stock Quantity *
              </label>
              <input
                type="number"
                required
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-white border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl bg-blue-600/90 backdrop-blur-md text-white text-sm font-medium hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-600/20 hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 transition-all duration-300 border border-blue-500/50"
            >
              {isLoading ? 'Publishing...' : 'Publish Product'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2.5 rounded-xl border border-white/80 bg-white/50 backdrop-blur-md text-slate-700 text-sm font-medium hover:bg-white hover:shadow-sm hover:-translate-y-0.5 active:scale-95 transition-all duration-300 shadow-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Products Table */}
      {products.length === 0 ? (
        <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/80 p-12 text-center space-y-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <Package className="w-10 h-10 mx-auto text-slate-300" />
          <h3 className="text-base font-medium text-slate-900">No Products in Catalog</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Add your first merchandise release using the &quot;New Product Release&quot; button above.
          </p>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600/90 backdrop-blur-md text-white text-sm font-medium hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-600/20 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 border border-blue-500/50 mt-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Product Release</span>
          </button>
        </div>
      ) : (
      <div className="border border-white/80 rounded-2xl bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="divide-y divide-slate-200/50">
          {products.map((prod) => {
            const isActive = prod.status === 'active';

            return (
              <div
                key={prod.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-white/60 transition-colors duration-300"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-slate-900">{prod.name}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isActive ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {prod.status}
                    </span>
                  </div>
                  <div className="text-sm text-slate-500 mt-1">
                    Slug: <span className="font-mono text-slate-600">{prod.slug}</span> &bull; SKU:{' '}
                    <span className="font-mono text-slate-600">{prod.primaryVariantSku}</span> &bull; Stock:{' '}
                    <span className="font-medium text-slate-700">{prod.totalStock} Units</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-right">
                    <div className="font-semibold text-slate-900">
                      {formatTHB(prod.primaryVariantPrice)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/products/${prod.id}`}
                      className="px-3 py-1.5 rounded-xl border border-slate-200/60 bg-white/50 backdrop-blur-sm text-slate-700 text-sm font-medium hover:bg-white hover:shadow-sm hover:-translate-y-0.5 active:scale-95 flex items-center gap-1.5 transition-all duration-300"
                    >
                      <span>Edit</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => toggleStatus(prod.id, prod.status)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200/60 bg-white/50 backdrop-blur-sm text-slate-700 text-sm font-medium hover:bg-white hover:shadow-sm hover:-translate-y-0.5 active:scale-95 flex items-center gap-1.5 transition-all duration-300"
                    >
                      {isActive ? (
                        <>
                          <EyeOff className="w-4 h-4 text-slate-400" />
                          <span>Draft</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 text-slate-700" />
                          <span>Publish</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      )}
      
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-200 pt-4">
          <p className="text-sm text-slate-500">
            Showing page {currentPage} of {totalPages} ({totalCount} total products)
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push(`/admin/products?page=${currentPage - 1}`)}
              disabled={currentPage <= 1 || isLoading}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-sm font-medium disabled:opacity-50 hover:bg-slate-50"
            >
              Previous
            </button>
            <button
              onClick={() => router.push(`/admin/products?page=${currentPage + 1}`)}
              disabled={currentPage >= totalPages || isLoading}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-sm font-medium disabled:opacity-50 hover:bg-slate-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
