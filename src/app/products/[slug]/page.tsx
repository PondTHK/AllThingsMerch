'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getRepository } from '@/lib/repositories';
import { getProductReviewsAction } from '@/lib/reviews/actions';
import { Product, ProductVariant, Review } from '@/types';
import { formatTHB } from '@/lib/money';
import { ShieldCheck, Check, ArrowLeft, ShoppingBag, Star } from 'lucide-react';
import { ProductCard } from '@/components/products/ProductCard';
import { useCartStore } from '@/lib/cart/useCartStore';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = typeof params?.slug === 'string' ? params.slug : '';

  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    let mounted = true;
    if (!slug) {
      setLoading(false);
      return;
    }
    const repo = getRepository();
    Promise.all([
      repo.getProductBySlug(slug),
      repo.getProducts(),
    ]).then(([prod, all]) => {
      if (mounted) {
        setProduct(prod);
        setAllProducts(all);
        if (prod && prod.variants.length > 0) {
          setSelectedVariant(prod.variants[0]);
        }
        if (prod) {
          getProductReviewsAction(prod.id)
            .then((revs) => {
              if (mounted) setReviews(revs);
            })
            .catch((err) => console.error('Failed to load reviews:', err));
        }
        setLoading(false);
      }
    }).catch((err) => {
      console.error('Failed to load product details:', err);
      if (mounted) setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, [slug]);

  if (loading) {
    return <div className="p-20 text-center text-muted font-bold transition-colors">Loading product details...</div>;
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6 transition-colors">
        <h1 className="text-3xl font-black text-foreground transition-colors">Product Not Found</h1>
        <p className="text-sm text-muted transition-colors">
          We could not locate this merchandise drop in our catalog.
        </p>
        <Link
          href="/products"
          className="inline-block px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity shadow-sm"
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

  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && (p.categoryId === product.categoryId || p.brandId === product.brandId))
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors">
      {/* Breadcrumb & Back button */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-border transition-colors">
        <div className="flex items-center gap-2 text-xs text-muted uppercase tracking-wider transition-colors">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-foreground transition-colors">
            Catalog
          </Link>
          <span>/</span>
          <span className="text-foreground font-semibold truncate max-w-[200px] transition-colors">{product.name}</span>
        </div>

        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </Link>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
        {/* Left Column: Studio Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-square w-full rounded-3xl bg-surface border border-border overflow-hidden transition-colors shadow-sm">
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
                <span className="px-3 py-1.5 rounded bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider shadow-sm">
                  Pre-Order Drop
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Product Details & Variant Selection */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-muted mb-1 transition-colors">
              {product.brand?.name || 'Official Licensed Merch'}
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-foreground leading-tight transition-colors">
              {product.name}
            </h1>
            {product.tagline && (
              <p className="text-xs font-semibold uppercase tracking-wider text-muted mt-1 transition-colors">
                {product.tagline}
              </p>
            )}
          </div>

          <div className="flex items-baseline gap-3 pt-2 border-t border-border transition-colors">
            <span className="text-2xl sm:text-3xl font-black text-foreground transition-colors">
              {formatTHB(selectedVariant?.price || product.minPrice)}
            </span>
            <span className="text-xs font-semibold text-muted uppercase tracking-wider transition-colors">
              VAT Included &bull; Free Shipping over 3,000 THB
            </span>
          </div>

          {/* Authenticity TAG Badge */}
          <div className="p-4 rounded-2xl bg-surface border border-border flex items-start gap-3 transition-colors shadow-sm">
            <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider transition-colors">
                1-to-1 Verified Authenticity TAG
              </h4>
              <p className="text-xs text-muted mt-0.5 transition-colors">
                Each unit includes an encrypted serial code for instant online authentication and direct licensing royalty tracking.
              </p>
            </div>
          </div>

          {/* Variant Selection */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-foreground transition-colors">
                Select Size / Edition:
              </span>
              {selectedVariant && (
                <span className="text-xs font-semibold text-muted transition-colors">
                  SKU: <span className="font-mono text-foreground">{selectedVariant.sku}</span>
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
                        ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                        : isOut
                        ? 'border-border bg-background text-muted cursor-not-allowed opacity-60'
                        : 'border-border bg-surface text-foreground hover:border-foreground'
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
            <div className="text-xs font-medium transition-colors">
              {selectedVariant.stockQuantity <= 0 ? (
                <span className="text-rose-600 dark:text-rose-400 font-bold">Out of Stock</span>
              ) : selectedVariant.stockQuantity <= selectedVariant.lowStockThreshold ? (
                <span className="text-amber-600 dark:text-amber-400 font-bold">
                  Low Stock &mdash; Only {selectedVariant.stockQuantity} left
                </span>
              ) : (
                <span className="text-foreground font-bold transition-colors">In Stock &mdash; Ready to Ship</span>
              )}
            </div>
          )}

          {/* Add to Cart Actions */}
          <div className="space-y-3 pt-4 border-t border-border transition-colors">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-border rounded-xl overflow-hidden bg-surface transition-colors">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3.5 font-bold text-sm text-foreground hover:bg-background transition-colors"
                >
                  &minus;
                </button>
                <span className="px-4 font-bold text-sm text-foreground transition-colors">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3.5 font-bold text-sm text-foreground hover:bg-background transition-colors"
                >
                  &#43;
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!selectedVariant || selectedVariant.stockQuantity <= 0}
                className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm ${
                  !selectedVariant || selectedVariant.stockQuantity <= 0
                    ? 'bg-surface border border-border text-muted cursor-not-allowed'
                    : 'bg-primary text-primary-foreground hover:opacity-90'
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
              <div className="p-3 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center gap-2 shadow-md animate-in fade-in duration-300">
                <Check className="w-4 h-4" />
                <span>Added to Shopping Cart ({quantity} item{quantity > 1 ? 's' : ''})</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="pt-6 border-t border-border space-y-2 transition-colors">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground transition-colors">
              Description &amp; Details
            </h4>
            <p className="text-sm text-muted leading-relaxed transition-colors">
              {product.description}
            </p>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="pt-16 mt-16 border-t border-border transition-colors">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-foreground transition-colors">
              Verified Collector Reviews
            </h3>
            <p className="text-xs text-muted mt-1 transition-colors">
              Feedback from authenticated 1-to-1 merchandise owners
            </p>
          </div>
          <span className="px-3 py-1 rounded bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider shadow-sm">
            {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
          </span>
        </div>

        {reviews.length === 0 ? (
          <div className="p-8 rounded-2xl bg-surface border border-border text-center text-xs text-muted font-medium transition-colors">
            No reviews published yet for this merchandise drop. Owners can verify their item and submit feedback inside their Account Orders dashboard.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-6 rounded-2xl bg-surface border border-border space-y-3 transition-colors shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${star <= rev.rating ? 'text-foreground fill-foreground' : 'text-neutral-300 dark:text-neutral-700'}`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-muted uppercase tracking-wider">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-foreground font-medium leading-relaxed transition-colors">
                  &ldquo;{rev.comment}&rdquo;
                </p>
                <div className="text-[11px] font-bold text-muted flex items-center gap-1.5 pt-1 transition-colors">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                  <span>{rev.userName || 'Verified Collector'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="pt-16 border-t border-border transition-colors">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-foreground transition-colors">
              You May Also Like
            </h3>
            <Link
              href="/products"
              className="text-xs font-bold uppercase tracking-wider text-muted hover:text-foreground transition-colors"
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
