'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getProductBySlug, getAllProducts } from '@/lib/repositories/mock-data';
import { formatTHB } from '@/lib/money';
import { ShieldCheck, Check, ArrowLeft, ShoppingBag } from 'lucide-react';
import { ProductCard } from '@/components/products/ProductCard';
import { useCartStore } from '@/lib/cart/useCartStore';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = typeof params?.slug === 'string' ? params.slug : '';
  const product = getProductBySlug(slug);

  const [selectedVariant, setSelectedVariant] = useState(product?.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <h1 className="text-3xl font-black text-black">Product Not Found</h1>
        <p className="text-sm text-neutral-600">
          We could not locate this merchandise drop in our catalog.
        </p>
        <Link
          href="/products"
          className="inline-block px-6 py-3 rounded-xl bg-black text-white font-bold text-xs uppercase tracking-wider"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedVariant || selectedVariant.stockQuantity <= 0 || !product) return;
    addItem(selectedVariant, product, quantity);
    setAddedMessage(true);
    setTimeout(() => {
      setAddedMessage(false);
    }, 3000);
  };

  const relatedProducts = getAllProducts()
    .filter((p) => p.id !== product.id && (p.categoryId === product.categoryId || p.brandId === product.brandId))
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb & Back button */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-200">
        <div className="flex items-center gap-2 text-xs text-neutral-500 uppercase tracking-wider">
          <Link href="/" className="hover:text-black">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-black">
            Catalog
          </Link>
          <span>/</span>
          <span className="text-black font-semibold truncate max-w-[200px]">{product.name}</span>
        </div>

        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-black"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </Link>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
        {/* Left Column: Studio Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-square w-full rounded-3xl bg-neutral-100 border border-neutral-200 overflow-hidden">
            <Image
              src={product.featuredImage}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 600px"
              className="object-cover"
              priority
            />
            {product.isPreorder && (
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1.5 rounded bg-black text-white text-xs font-bold uppercase tracking-wider">
                  Pre-Order Drop
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Product Details & Variant Selection */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-1">
              {product.brand?.name || 'Official Licensed Merch'}
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-black leading-tight">
              {product.name}
            </h1>
            {product.tagline && (
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mt-1">
                {product.tagline}
              </p>
            )}
          </div>

          <div className="flex items-baseline gap-3 pt-2 border-t border-neutral-200">
            <span className="text-2xl sm:text-3xl font-black text-black">
              {formatTHB(selectedVariant?.price || product.minPrice)}
            </span>
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              VAT Included &bull; Free Shipping over 3,000 THB
            </span>
          </div>

          {/* Authenticity TAG Badge */}
          <div className="p-4 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-black shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-black uppercase tracking-wider">
                1-to-1 Verified Authenticity TAG
              </h4>
              <p className="text-xs text-neutral-600 mt-0.5">
                Each unit includes an encrypted serial code for instant online authentication and direct licensing royalty tracking.
              </p>
            </div>
          </div>

          {/* Variant Selection */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-black">
                Select Size / Edition:
              </span>
              {selectedVariant && (
                <span className="text-xs font-semibold text-neutral-600">
                  SKU: <span className="font-mono">{selectedVariant.sku}</span>
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3">
              {product.variants.map((variant) => {
                const isSelected = selectedVariant?.id === variant.id;
                const isOut = variant.stockQuantity <= 0;

                return (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setSelectedVariant(variant)}
                    disabled={isOut}
                    className={`py-3 px-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-black bg-black text-white'
                        : isOut
                        ? 'border-neutral-200 bg-neutral-100 text-neutral-400 cursor-not-allowed'
                        : 'border-neutral-300 bg-white text-black hover:border-black'
                    }`}
                  >
                    <div className="text-xs font-bold uppercase">{variant.size}</div>
                    <div className="text-[10px] opacity-80 mt-0.5">
                      {isOut ? 'Sold Out' : `${variant.stockQuantity} available`}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stock Status Indicator */}
          {selectedVariant && (
            <div className="text-xs font-medium">
              {selectedVariant.stockQuantity <= 0 ? (
                <span className="text-neutral-500 font-bold">Out of Stock</span>
              ) : selectedVariant.stockQuantity <= selectedVariant.lowStockThreshold ? (
                <span className="text-black font-bold">
                  Low Stock &mdash; Only {selectedVariant.stockQuantity} left
                </span>
              ) : (
                <span className="text-black font-bold">In Stock &mdash; Ready to Ship</span>
              )}
            </div>
          )}

          {/* Add to Cart Actions */}
          <div className="space-y-3 pt-4 border-t border-neutral-200">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-neutral-300 rounded-xl overflow-hidden bg-neutral-50">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3.5 font-bold text-sm hover:bg-neutral-200 transition-colors"
                >
                  &minus;
                </button>
                <span className="px-4 font-bold text-sm">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3.5 font-bold text-sm hover:bg-neutral-200 transition-colors"
                >
                  &#43;
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!selectedVariant || selectedVariant.stockQuantity <= 0}
                className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  !selectedVariant || selectedVariant.stockQuantity <= 0
                    ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                    : 'bg-black text-white hover:bg-neutral-800'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>
                  {!selectedVariant || selectedVariant.stockQuantity <= 0
                    ? 'Sold Out'
                    : 'Add to Cart'}
                </span>
              </button>
            </div>

            {addedMessage && (
              <div className="p-3 rounded-xl bg-black text-white text-xs font-bold flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                <span>Added to Shopping Cart ({quantity} item{quantity > 1 ? 's' : ''})</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="pt-6 border-t border-neutral-200 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-black">
              Description & Details
            </h4>
            <p className="text-sm text-neutral-600 leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="pt-16 border-t border-neutral-200">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-black">
              You May Also Like
            </h3>
            <Link
              href="/products"
              className="text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-black"
            >
              View Full Catalog
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
