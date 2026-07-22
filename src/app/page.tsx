'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getRepository } from '@/lib/repositories';
import { Product } from '@/types';
import { ProductCard } from '@/components/products/ProductCard';
import { formatTHB } from '@/lib/money';
import { ArrowRight, ShieldCheck } from 'lucide-react';

type TabId = 'ALL' | 'F1' | 'ARTIST' | 'SPORTS' | 'COLLECTIBLES';

export default function HomePage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>('ALL');
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  useEffect(() => {
    let mounted = true;
    getRepository()
      .getProducts()
      .then((products) => {
        if (mounted) {
          setAllProducts(products);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch products on home page:', err);
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Rotate hero product every 5 seconds
  useEffect(() => {
    if (allProducts.length === 0) return;
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % Math.min(allProducts.length, 5)); // Rotate through top 5 products
    }, 5000);
    return () => clearInterval(interval);
  }, [allProducts.length]);

  const trendingProducts = allProducts.slice(0, 3);

  const filteredBestSellers = allProducts.filter((product) => {
    if (activeTab === 'F1') return product.categoryId === 'cat-f1' || product.category?.slug === 'formula-1';
    if (activeTab === 'ARTIST') return product.categoryId === 'cat-music' || product.category?.slug === 'music-merch';
    if (activeTab === 'SPORTS') return product.categoryId === 'cat-football' || product.category?.slug === 'sports';
    if (activeTab === 'COLLECTIBLES') return product.categoryId === 'cat-collectibles' || product.category?.slug === 'collectibles';
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* 1. HERO SECTION MATCHING PROTOTYPE */}
      <section className="relative overflow-hidden border-b border-border py-12 lg:py-20 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative">
            {/* Left Column Text */}
            <div className="lg:col-span-6 space-y-6 z-10">
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-foreground leading-none transition-colors">
                Fuel Your <br />
                Racing <br />
                Passion
              </h1>
              <p className="text-sm sm:text-base text-muted max-w-md leading-relaxed transition-colors">
                Gear Up With Official Merchandise From Your Favorite Teams. Speed, Style, And Performance Standard.
              </p>
              <div>
                <Link
                  href="/products?category=formula-1"
                  className="inline-block px-8 py-3.5 bg-primary text-primary-foreground font-bold text-sm tracking-wide uppercase transition-all hover:opacity-90 shadow-md"
                >
                  Shop Now
                </Link>
              </div>
            </div>

            {/* Center Vertical Watermark Text */}
            <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0">
              <span className="text-[110px] font-black text-neutral-100 dark:text-neutral-900/40 tracking-tighter rotate-[-90deg] inline-block transition-all duration-500 whitespace-nowrap">
                {(allProducts[currentHeroIndex]?.brand?.name || 'FEATURED COLLECTION').toUpperCase()}
              </span>
            </div>

            {/* Right Column Featured Product Showcase */}
            <div className="lg:col-span-6 relative z-10 transition-all duration-500">
              <div className="max-w-md mx-auto bg-surface rounded-3xl p-8 sm:p-12 text-center border border-border relative transition-colors shadow-sm animate-in fade-in zoom-in duration-500" key={currentHeroIndex}>
                <div className="relative aspect-square w-full mb-6">
                  <Image
                    src={allProducts[currentHeroIndex]?.featuredImage || '/favicon.ico'}
                    alt={allProducts[currentHeroIndex]?.name || 'Featured Product'}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-contain transition-transform duration-700 hover:scale-105"
                  />
                </div>
                <h3 className="font-bold text-foreground text-lg transition-colors line-clamp-1">
                  {allProducts[currentHeroIndex]?.name || 'Loading Featured Product...'}
                </h3>
                <p className="text-muted font-semibold text-sm mt-1 transition-colors">
                  {allProducts[currentHeroIndex] ? formatTHB(allProducts[currentHeroIndex].minPrice) : '...'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BLACK BRAND LOGO STRIP MATCHING PROTOTYPE */}
      <section className="bg-neutral-950 text-white py-8 border-b border-border transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-6 text-xs sm:text-sm font-bold tracking-widest uppercase opacity-90 text-neutral-200">
            <span className="hover:opacity-100 transition-opacity">ORACLE RED BULL RACING</span>
            <span className="hover:opacity-100 transition-opacity">GMM GRAMMY</span>
            <span className="hover:opacity-100 transition-opacity">UNIVERSAL MUSIC THAILAND</span>
            <span className="hover:opacity-100 transition-opacity">AUTHENTICITY TAG 1:1</span>
            <span className="hover:opacity-100 transition-opacity">SCUDERIA FERRARI</span>
          </div>
        </div>
      </section>

      {/* 3. TRENDING MERCH / MOST POPULAR PRODUCTS MATCHING PROTOTYPE */}
      <section className="py-16 sm:py-24 border-b border-border transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-muted transition-colors">
                -- Our Trending Merch --
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-foreground mt-1 transition-colors">
                Most Popular Products
              </h2>
            </div>
            <Link
              href="/products"
              className="px-6 py-2.5 bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              Explore All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {trendingProducts.map((product) => (
              <div
                key={product.id}
                className="rounded-2xl bg-surface border border-border p-6 flex flex-col justify-between transition-colors shadow-sm"
              >
                <div className="relative aspect-square w-full mb-4 overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-900">
                  <Image
                    src={product.featuredImage}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>

                <h3 className="font-bold text-foreground text-base line-clamp-1 transition-colors">{product.name}</h3>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground transition-colors">
                    {formatTHB(product.minPrice)}
                  </span>
                  <Link
                    href={`/products/${product.slug}`}
                    className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-all"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FULL-WIDTH DARK F1 HERO BANNER MATCHING PROTOTYPE */}
      <section className="py-12 bg-background transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-neutral-950 dark:bg-neutral-900 text-white p-8 sm:p-14 overflow-hidden relative border border-border transition-colors shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6">
                <div className="aspect-[16/9] relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900">
                  <Image
                    src={allProducts[1]?.featuredImage || '/favicon.ico'}
                    alt="Formula 1 Racing Showcase"
                    fill
                    sizes="(max-width: 768px) 100vw, 600px"
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="lg:col-span-6 space-y-4">
                <h2 className="text-3xl sm:text-5xl font-black leading-tight text-white">
                  Feel the Speed <br />
                  <span className="text-red-500">Live The Legacy</span>
                </h2>
                <p className="text-sm sm:text-base text-neutral-300">
                  Official F1 Team Merch for true fans. 100% Authentic with verified serial tracking.
                </p>
                <div className="pt-2">
                  <Link
                    href="/products?category=formula-1"
                    className="inline-block px-8 py-3.5 bg-white text-black font-bold text-sm uppercase tracking-wide hover:bg-neutral-200 transition-colors shadow-sm"
                  >
                    Shop F1 Collection
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BEST SELLING SECTION WITH TABS MATCHING PROTOTYPE */}
      <section className="py-16 sm:py-24 border-b border-border transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-foreground transition-colors">
              -- Best Selling --
            </h2>

            {/* Filter Tabs matching prototype */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              {[
                { id: 'ALL', label: 'All Merch' },
                { id: 'F1', label: 'F1 Teams' },
                { id: 'ARTIST', label: 'Artists' },
                { id: 'SPORTS', label: 'Sports' },
                { id: 'COLLECTIBLES', label: 'Collectibles' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as TabId)}
                  className={`px-6 py-2 text-xs font-bold uppercase tracking-wider border rounded-xl transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                      : 'bg-surface text-foreground border-border hover:border-foreground'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredBestSellers.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. AUTHENTICITY TAG NOTICE (CLEAN MONOCHROME) */}
      <section className="py-16 bg-surface border-b border-border transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider shadow-sm transition-colors">
              <ShieldCheck className="w-4 h-4" />
              <span>Authenticity Verification</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-foreground transition-colors">
              1-to-1 Verified Serial TAG Included
            </h3>
            <p className="text-sm text-muted leading-relaxed transition-colors">
              Every item sold by AllThingsMerch carries a unique cryptographic code and serial number to confirm authenticity and track licensing royalty transparency.
            </p>
            <div className="pt-2">
              <Link
                href="/verify"
                className="inline-block px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity shadow-sm"
              >
                Verify Item Provenance
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
