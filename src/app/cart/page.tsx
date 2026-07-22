'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/lib/cart/useCartStore';
import { useHydrated } from '@/lib/cart/useHydrated';
import { formatTHB } from '@/lib/money';
import { CartItemTimer } from '@/components/CartItemTimer';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const isHydrated = useHydrated();
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const releaseExpiredReservation = useCartStore((s) => s.releaseExpiredReservation);
  const subtotal = useCartStore((state) => state.getSubtotal());
  const shippingFee = useCartStore((state) => state.getShippingFee());
  const totalAmount = useCartStore((state) => state.getTotalAmount());

  // Release any per-item reservations that expired while the user was away
  useEffect(() => {
    if (isHydrated) releaseExpiredReservation();
  }, [isHydrated, releaseExpiredReservation]);

  // The item whose reservation expires soonest gets highlighted
  const soonestExpiry = items.reduce<string | null>((min, item) => {
    if (!item.reservedUntil) return min;
    if (!min) return item.reservedUntil;
    return item.reservedUntil < min ? item.reservedUntil : min;
  }, null);

  if (!isHydrated) {
    return <div className="p-16 text-center text-muted font-bold transition-colors">Loading Shopping Cart...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6 transition-colors">
        <div className="w-16 h-16 rounded-full bg-surface border border-border mx-auto flex items-center justify-center text-muted transition-colors">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-foreground transition-colors">Your Cart is Empty</h1>
        <p className="text-sm text-muted max-w-sm mx-auto transition-colors">
          You have no licensed merchandise or collectibles in your shopping bag. Explore our official catalog to find your favorite team gear.
        </p>
        <div>
          <Link
            href="/products"
            className="inline-block px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity shadow-sm"
          >
            Browse Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 transition-colors">
      <div className="border-b border-border pb-6 mb-10 transition-colors">
        <h1 className="text-3xl sm:text-5xl font-black text-foreground transition-colors">Shopping Bag</h1>
        <p className="text-xs uppercase tracking-wider text-muted mt-1 transition-colors">
          {items.reduce((s, i) => s + i.quantity, 0)} Items &bull; 1-to-1 Verified Authenticity Included
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-6">
          <div className="divide-y divide-border border-b border-border transition-colors">
            {items.map((item) => (
              <div
                key={item.variantId}
                className="py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-surface border border-border overflow-hidden shrink-0 transition-colors">
                    <Image
                      src={item.imageUrl}
                      alt={item.productName}
                      fill
                      sizes="100px"
                      className="object-cover"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted transition-colors">
                        {item.brandName || 'Official Merch'}
                      </span>
                      {item.isPreorder && (
                        <span className="px-1.5 py-0.5 rounded-md bg-primary text-primary-foreground text-[9px] font-black uppercase tracking-wider shadow-sm">
                          Pre-Order
                        </span>
                      )}
                    </div>
                    <Link
                      href={`/products/${item.productSlug}`}
                      className="font-bold text-foreground text-sm sm:text-base hover:underline block transition-colors"
                    >
                      {item.productName}
                    </Link>
                    <div className="text-xs text-muted font-medium transition-colors">
                      Size: <span className="font-bold text-foreground uppercase">{item.size || 'ONE SIZE'}</span> &bull; SKU: <span className="font-mono text-foreground">{item.sku}</span>
                    </div>
                    <CartItemTimer
                      reservedUntil={item.reservedUntil}
                      isSoonest={item.reservedUntil === soonestExpiry}
                    />
                    <div className="text-xs font-bold text-foreground sm:hidden pt-1 transition-colors">
                      {formatTHB(item.unitPrice)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6">
                  {/* Quantity Controller */}
                  <div className="flex items-center border border-border rounded-xl overflow-hidden bg-surface transition-colors">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                      className="px-3 py-1.5 font-bold text-sm text-foreground hover:bg-background transition-colors"
                    >
                      &minus;
                    </button>
                    <span className="px-3 font-bold text-xs text-foreground transition-colors">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                      className="px-3 py-1.5 font-bold text-sm text-foreground hover:bg-background transition-colors"
                    >
                      &#43;
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right hidden sm:block w-28">
                    <div className="font-black text-foreground text-sm transition-colors">
                      {formatTHB(item.unitPrice * item.quantity)}
                    </div>
                    <div className="text-[10px] text-muted transition-colors">
                      {formatTHB(item.unitPrice)} each
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeItem(item.variantId)}
                    aria-label="Remove item"
                    className="p-2 text-muted hover:text-foreground transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={clearCart}
              className="text-xs font-bold uppercase tracking-wider text-muted hover:text-foreground underline transition-colors"
            >
              Clear Entire Bag
            </button>
            <Link
              href="/products"
              className="text-xs font-bold uppercase tracking-wider text-foreground hover:underline transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4">
          <div className="rounded-2xl bg-surface border border-border p-6 sm:p-8 space-y-6 transition-colors shadow-sm">
            <h2 className="text-lg font-black uppercase tracking-wider text-foreground transition-colors">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between text-muted transition-colors">
                <span>Subtotal</span>
                <span className="font-bold text-foreground transition-colors">{formatTHB(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-muted transition-colors">
                <span>Estimated Shipping</span>
                <span className="font-bold text-foreground transition-colors">
                  {shippingFee === 0 ? 'FREE' : formatTHB(shippingFee)}
                </span>
              </div>
              {shippingFee === 0 && (
                <div className="text-[11px] font-bold text-foreground uppercase tracking-wider pt-1 transition-colors">
                  Qualified for Free Standard Delivery
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-border flex items-baseline justify-between transition-colors">
              <span className="text-base font-black uppercase tracking-wider text-foreground transition-colors">
                Total Amount
              </span>
              <span className="text-xl sm:text-2xl font-black text-foreground transition-colors">
                {formatTHB(totalAmount)}
              </span>
            </div>

            <Link
              href="/checkout"
              className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-sm"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="text-center text-[11px] text-muted transition-colors">
              100% Official Licensed &bull; Guaranteed Authenticity TAG Tracking
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
