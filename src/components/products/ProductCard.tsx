import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { formatTHB } from '@/lib/money';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, ArrowRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const isPreorder = product.isPreorder;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative flex flex-col rounded-2xl bg-neutral-900/80 border border-white/10 overflow-hidden transition-all duration-300 hover:border-emerald-500/40 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/10"
    >
      {/* Image Showcase Container */}
      <div className="relative aspect-square w-full bg-neutral-950 overflow-hidden">
        <Image
          src={product.featuredImage}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {isPreorder ? (
            <Badge variant="amber">Pre-Order Drop</Badge>
          ) : (
            <Badge variant="emerald" className="bg-emerald-500 text-black border-none font-bold">
              In Stock
            </Badge>
          )}
        </div>

        {/* Tag Verification Indicator */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-medium text-neutral-300">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Authenticity TAG Included</span>
          </span>
        </div>
      </div>

      {/* Content Details */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        {/* Brand Header */}
        <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-1">
          {product.brand?.name || 'AllThingsMerch Exclusive'}
        </div>

        {/* Product Name */}
        <h3 className="font-semibold text-white text-sm sm:text-base line-clamp-2 group-hover:text-emerald-300 transition-colors">
          {product.name}
        </h3>

        {/* Tagline */}
        {product.tagline && (
          <p className="text-xs text-neutral-400 mt-1 line-clamp-1">{product.tagline}</p>
        )}

        {/* Footer: Price & CTA */}
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/10">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium">
              Price
            </span>
            <span className="text-base sm:text-lg font-extrabold text-white">
              {formatTHB(product.minPrice)}
            </span>
          </div>

          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/5 group-hover:bg-emerald-500 text-neutral-300 group-hover:text-black font-semibold text-xs transition-colors">
            <span>View Drop</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
