'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getRepository } from '@/lib/repositories';
import { Product, Brand, Category } from '@/types';
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

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const repo = getRepository();
    Promise.all([
      repo.getProducts(),
      repo.getBrands(),
      repo.getCategories(),
    ]).then(([pData, bData, cData]) => {
      if (mounted) {
        setAllProducts(pData);
        setBrands(bData);
        setCategories(cData);
        setLoading(false);
      }
    }).catch((err) => {
      console.error('Failed to fetch products catalog:', err);
      if (mounted) setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, []);

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
        if (selectedCategory !== 'ALL' && product.category?.slug !== selectedCategory && product.categoryId !== selectedCategory) {
          return false;
        }

        // Brand filter
        if (selectedBrand !== 'ALL' && product.brand?.slug !== selectedBrand && product.brandId !== selectedBrand) {
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors">
      {/* Header & Breadcrumb */}
      <div className="border-b border-border pb-8 mb-8 transition-colors">
        <div className="flex items-center gap-2 text-xs text-muted uppercase tracking-wider mb-2 transition-colors">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground font-semibold transition-colors">Catalog</span>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-5xl font-black text-foreground transition-colors">All Merchandise</h1>
            <p className="text-sm text-muted mt-1 transition-colors">
              Official Licensed Apparel &amp; Collectibles &bull; {filteredProducts.length} items found
            </p>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs uppercase font-bold text-muted shrink-0 transition-colors">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'price-asc' | 'price-desc')}
              className="px-3 py-2 rounded-xl bg-surface border border-border text-xs font-semibold text-foreground focus:outline-none focus:border-foreground transition-colors"
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
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search merchandise by keyword, team, or artist..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-surface border border-border text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-foreground focus:bg-background transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
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
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-xs font-semibold text-foreground focus:outline-none focus:border-foreground transition-colors"
          >
            <option value="ALL">All Categories</option>
            {categories.map((cat) => (
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
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-border text-xs font-semibold text-foreground focus:outline-none focus:border-foreground transition-colors"
          >
            <option value="ALL">All Brands</option>
            {brands.map((brand) => (
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
              className="p-2.5 rounded-xl bg-surface hover:bg-primary hover:text-primary-foreground border border-border text-foreground transition-all shrink-0"
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
          className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${
            selectedCategory === 'ALL'
              ? 'bg-primary text-primary-foreground border-primary shadow-sm'
              : 'bg-surface text-foreground border-border hover:border-foreground'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.slug)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${
              selectedCategory === cat.slug
                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                : 'bg-surface text-foreground border-border hover:border-foreground'
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
        <div className="rounded-3xl border border-dashed border-border bg-surface p-16 text-center space-y-4 transition-colors">
          <div className="w-12 h-12 rounded-full bg-background border border-border mx-auto flex items-center justify-center text-muted">
            <SlidersHorizontal className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-foreground transition-colors">No merchandise matches your filters</h3>
          <p className="text-sm text-muted max-w-sm mx-auto transition-colors">
            Try resetting your search query or selecting a different category or brand filter.
          </p>
          <div>
            <button
              type="button"
              onClick={resetFilters}
              className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity shadow-sm"
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
    <Suspense fallback={<div className="p-12 text-center text-muted transition-colors">Loading catalog...</div>}>
      <ProductsCatalogContent />
    </Suspense>
  );
}
