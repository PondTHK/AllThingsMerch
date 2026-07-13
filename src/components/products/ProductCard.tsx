import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { formatTHB } from '@/lib/money';
import { ArrowRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const isPreorder = product.isPreorder;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative flex flex-col rounded-2xl bg-white border border-neutral-200 overflow-hidden transition-all duration-300 hover:border-black hover:shadow-lg"
    >
      {/* Studio Image Container matching prototype */}
      <div className="relative aspect-square w-full bg-neutral-100 overflow-hidden">
        <Image
          src={product.featuredImage}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Top-left Minimalist Badge matching prototype */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded bg-black text-white text-[10px] font-bold uppercase tracking-wider">
            {isPreorder ? 'PRE-ORDER' : 'NEW'}
          </span>
        </div>
      </div>

      {/* Details & Minimalist Bottom Actions */}
      <div className="flex flex-col flex-1 p-4">
        <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
          {product.brand?.name || 'Official Merch'}
        </div>

        <h3 className="font-bold text-black text-sm sm:text-base line-clamp-2 group-hover:underline">
          {product.name}
        </h3>

        <div className="mt-auto pt-4 flex items-center justify-between">
          <span className="text-base font-extrabold text-black">
            {formatTHB(product.minPrice)}
          </span>

          <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center group-hover:scale-110 transition-transform">
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
