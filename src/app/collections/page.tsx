'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getRepository } from '@/lib/repositories';
import { Brand } from '@/types';
import { LayoutGrid } from 'lucide-react';

export default function CollectionsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getRepository().getBrands().then((bData) => {
      if (mounted) {
        setBrands(bData);
        setLoading(false);
      }
    }).catch((err) => {
      console.error('Failed to fetch brands:', err);
      if (mounted) setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header & Breadcrumb */}
      <div className="border-b border-neutral-200 pb-8 mb-10">
        <div className="flex items-center gap-2 text-xs text-neutral-500 uppercase tracking-wider mb-4">
          <Link href="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-black font-semibold">Collections</span>
        </div>
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-black text-black tracking-tight">
            Exclusive Collections
          </h1>
          <p className="text-base text-neutral-600 mt-4 leading-relaxed">
            ค้นพบคอลเลกชันสินค้าสุดพิเศษจากทีมแข่งระดับโลก ศิลปินที่คุณชื่นชอบ และแบรนด์ชั้นนำ เลือกซื้อสินค้าแท้ร้อยเปอร์เซ็นต์ได้แล้ววันนี้
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-neutral-500 flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-neutral-200 border-t-black rounded-full animate-spin" />
          <span className="text-sm font-medium uppercase tracking-wider">Loading...</span>
        </div>
      ) : brands.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/products?brand=${brand.slug}`}
              className="group relative h-48 overflow-hidden rounded-2xl bg-neutral-100 border border-neutral-200 hover:border-black transition-all duration-300 block"
            >
              {brand.logoUrl ? (
                <>
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${brand.logoUrl})` }}
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                    <h3 className="text-2xl font-black text-white drop-shadow-md">
                      {brand.name}
                    </h3>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-neutral-100 group-hover:bg-neutral-200 transition-colors duration-300 text-center gap-3">
                  <h3 className="text-2xl font-black text-black">
                    {brand.name}
                  </h3>
                  <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest group-hover:text-black transition-colors">
                    View Collection &rarr;
                  </span>
                </div>
              )}
            </Link>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-20 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-white border border-neutral-200 mx-auto flex items-center justify-center text-neutral-400 shadow-sm">
            <LayoutGrid className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-black">No collections found</h3>
          <p className="text-sm text-neutral-500 max-w-sm mx-auto">
            We currently don&apos;t have any collections or brands available. Check back later!
          </p>
        </div>
      )}
    </div>
  );
}
