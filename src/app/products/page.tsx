'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getAllProducts, MOCK_BRANDS, MOCK_CATEGORIES } from '@/lib/repositories/mock-data';
import { ProductCard } from '@/components/products/ProductCard';
import { Search, SlidersHorizontal, X } from 'lucide-react';

function ProductsCatalogContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams?.get('search') || '';
  const initialCategory = searchParams?.get('category') || 'ALL';
  const initialBrand = searchParams?.get('brand') || 'ALL';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState(initialBrand);
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');

  const allProducts = getAllProducts();

  const filteredProducts = useMemo(() => {
    return allProducts
      .filter((product) => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = product.name.toLowerCase().includes(q);
          const matchesDesc = product.description.toLowerCase().includes(q);
          const matchesBrand = product.brand?.name.toLowerCase().includes(q);
          if (!matchesName && !matchesDesc && !matchesBrand) return false;
        }

        // Category filter
        if (selectedCategory !== 'ALL' && product.category?.slug !== selectedCategory) {
          return false;
        }

        // Brand filter
        if (selectedBrand !== 'ALL' && product.brand?.slug !== selectedBrand) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.minPrice - b.minPrice;
        if (sortBy === 'price-desc') return b.minPrice - a.minPrice;
        // newest
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [allProducts, searchQuery, selectedCategory, selectedBrand, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setSelectedBrand('ALL');
    setSortBy('newest');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header & Breadcrumb */}
      <div className="border-b border-neutral-200 pb-8 mb-8">
        <div className="flex items-center gap-2 text-xs text-neutral-500 uppercase tracking-wider mb-2">
          <Link href="/" className="hover:text-black">
            Home
          </Link>
          <span>/</span>
          <span className="text-black font-semibold">Catalog</span>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-5xl font-black text-black">All Merchandise</h1>
            <p className="text-sm text-neutral-600 mt-1">
              Official Licensed Apparel & Collectibles &bull; {filteredProducts.length} items found
            </p>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs uppercase font-bold text-neutral-500 shrink-0">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'price-asc' | 'price-desc')}
              className="px-3 py-2 rounded-lg bg-neutral-100 border border-neutral-300 text-xs font-semibold text-black focus:outline-none focus:border-black"
            >
              <option value="newest">Newest Drops</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
        {/* Search Input */}
        <div className="lg:col-span-2 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search merchandise by keyword, team, or artist..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-neutral-100 border border-neutral-300 text-sm text-black placeholder:text-neutral-500 focus:outline-none focus:border-black focus:bg-white"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Dropdown */}
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-100 border border-neutral-300 text-xs font-semibold text-black focus:outline-none focus:border-black"
          >
            <option value="ALL">All Categories</option>
            {MOCK_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Brand Dropdown */}
        <div className="flex items-center gap-2">
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-100 border border-neutral-300 text-xs font-semibold text-black focus:outline-none focus:border-black"
          >
            <option value="ALL">All Brands</option>
            {MOCK_BRANDS.map((brand) => (
              <option key={brand.id} value={brand.slug}>
                {brand.name}
              </option>
            ))}
          </select>
          {(searchQuery || selectedCategory !== 'ALL' || selectedBrand !== 'ALL') && (
            <button
              type="button"
              onClick={resetFilters}
              title="Clear Filters"
              className="p-2.5 rounded-xl bg-neutral-200 hover:bg-black hover:text-white text-black transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <button
          type="button"
          onClick={() => setSelectedCategory('ALL')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-colors ${
            selectedCategory === 'ALL'
              ? 'bg-black text-white border-black'
              : 'bg-white text-black border-neutral-300 hover:border-black'
          }`}
        >
          All
        </button>
        {MOCK_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.slug)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-colors ${
              selectedCategory === cat.slug
                ? 'bg-black text-white border-black'
                : 'bg-white text-black border-neutral-300 hover:border-black'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-3xl border border-dashed border-neutral-300 bg-neutral-50 p-16 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-neutral-200 mx-auto flex items-center justify-center text-neutral-600">
            <SlidersHorizontal className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-black">No merchandise matches your filters</h3>
          <p className="text-sm text-neutral-500 max-w-sm mx-auto">
            Try resetting your search query or selecting a different category or brand filter.
          </p>
          <div>
            <button
              type="button"
              onClick={resetFilters}
              className="px-6 py-2.5 rounded-xl bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-neutral-500">Loading catalog...</div>}>
      <ProductsCatalogContent />
    </Suspense>
  );
}
