'use client';

import React, { useState } from 'react';
import { useAdminStore } from '@/lib/admin/useAdminStore';
import { formatTHB } from '@/lib/money';
import { Plus, Check, Eye, EyeOff } from 'lucide-react';

export default function AdminProductsPage() {
  const products = useAdminStore((state) => state.products);
  const addProduct = useAdminStore((state) => state.addProduct);
  const toggleStatus = useAdminStore((state) => state.toggleProductStatus);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [brandId, setBrandId] = useState('b1111111-1111-4111-8111-111111111111');
  const [categoryId, setCategoryId] = useState('c1111111-1111-4111-8111-111111111111');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState('2990');
  const [stockQuantity, setStockQuantity] = useState('20');
  const [isPreorder, setIsPreorder] = useState(false);
  const [preorderReleaseAt, setPreorderReleaseAt] = useState('');
  const [createdMsg, setCreatedMsg] = useState(false);

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

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim() || !sku.trim()) return;

    addProduct({
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim() || 'Official licensed merchandise release.',
      brandId,
      categoryId,
      sku: sku.trim(),
      price: parseFloat(price) || 2990,
      stockQuantity: parseInt(stockQuantity, 10) || 20,
      featuredImage: '/products/polo-navy.jpg',
      isPreorder,
      preorderReleaseAt: isPreorder ? (preorderReleaseAt || undefined) : undefined,
    });

    setName('');
    setSlug('');
    setDescription('');
    setSku('');
    setIsPreorder(false);
    setPreorderReleaseAt('');
    setShowForm(false);
    setCreatedMsg(true);
    setTimeout(() => setCreatedMsg(false), 3000);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
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
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs font-medium"
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
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs font-mono"
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
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Licensed Brand
              </label>
              <select
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs font-medium"
              >
                <option value="b1111111-1111-4111-8111-111111111111">Oracle Red Bull Racing</option>
                <option value="b2222222-2222-4222-8222-222222222222">Scuderia Ferrari F1</option>
                <option value="b3333333-3333-4333-8333-333333333333">Cactus Jack Merch</option>
                <option value="b4444444-4444-4444-8444-444444444444">KAWS Collectibles</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs font-medium"
              >
                <option value="c1111111-1111-4111-8111-111111111111">Formula 1 Apparel</option>
                <option value="c2222222-2222-4222-8222-222222222222">Artist &amp; Concert Merch</option>
                <option value="c3333333-3333-4333-8333-333333333333">Art Toys &amp; Collectibles</option>
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
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs font-medium"
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
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs font-medium"
              />
            </div>

            <div className="sm:col-span-2 flex flex-col sm:flex-row gap-4 items-start sm:items-center p-4 bg-neutral-50 rounded-xl border border-neutral-200">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPreorder}
                  onChange={(e) => setIsPreorder(e.target.checked)}
                  className="w-4 h-4 rounded border-neutral-300 text-black focus:ring-black"
                />
                <span className="text-xs font-bold uppercase tracking-wider text-black">
                  Pre-Order Product
                </span>
              </label>
              
              {isPreorder && (
                <div className="flex-1 w-full sm:w-auto">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                    Release Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={preorderReleaseAt}
                    onChange={(e) => setPreorderReleaseAt(e.target.value)}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white border border-neutral-300 text-xs font-medium"
                  />
                </div>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-white border border-neutral-300 text-xs"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800"
            >
              Publish Product
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
      <div className="border border-neutral-200 rounded-2xl bg-white overflow-hidden">
        <div className="divide-y divide-neutral-200">
          {products.map((prod) => {
            const primaryVariant = prod.variants[0];
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
                      {prod.variants.reduce((s, v) => s + v.stockQuantity, 0)} Units
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-right">
                    <div className="font-black text-black text-sm">
                      {primaryVariant ? formatTHB(primaryVariant.price) : 'N/A'}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleStatus(prod.id)}
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
    </div>
  );
}
