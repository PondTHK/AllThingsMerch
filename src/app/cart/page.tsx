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
    return <div className="p-16 text-center text-neutral-500">Loading Shopping Cart...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-neutral-100 mx-auto flex items-center justify-center text-neutral-600">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-black">Your Cart is Empty</h1>
        <p className="text-sm text-neutral-600 max-w-sm mx-auto">
          You have no licensed merchandise or collectibles in your shopping bag. Explore our official catalog to find your favorite team gear.
        </p>
        <div>
          <Link
            href="/products"
            className="inline-block px-8 py-3.5 bg-black text-white font-bold text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors"
          >
            Browse Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="border-b border-neutral-200 pb-6 mb-10">
        <h1 className="text-3xl sm:text-5xl font-black text-black">Shopping Bag</h1>
        <p className="text-xs uppercase tracking-wider text-neutral-500 mt-1">
          {items.reduce((s, i) => s + i.quantity, 0)} Items &bull; 1-to-1 Verified Authenticity Included
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-6">
          <div className="divide-y divide-neutral-200 border-b border-neutral-200">
            {items.map((item) => (
              <div
                key={item.variantId}
                className="py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-neutral-100 border border-neutral-200 overflow-hidden shrink-0">
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
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                        {item.brandName || 'Official Merch'}
                      </span>
                      {item.isPreorder && (
                        <span className="px-1.5 py-0.5 rounded-md bg-neutral-200 text-black text-[9px] font-black uppercase tracking-wider">
                          Pre-Order
                        </span>
                      )}
                    </div>
                    <Link
                      href={`/products/${item.productSlug}`}
                      className="font-bold text-black text-sm sm:text-base hover:underline block"
                    >
                      {item.productName}
                    </Link>
                    <div className="text-xs text-neutral-600 font-medium">
                      Size: <span className="font-bold text-black uppercase">{item.size || 'ONE SIZE'}</span> &bull; SKU: <span className="font-mono">{item.sku}</span>
                    </div>
                    <CartItemTimer
                      reservedUntil={item.reservedUntil}
                      isSoonest={item.reservedUntil === soonestExpiry}
                    />
                    <div className="text-xs font-bold text-black sm:hidden pt-1">
                      {formatTHB(item.unitPrice)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6">
                  {/* Quantity Controller */}
                  <div className="flex items-center border border-neutral-300 rounded-xl overflow-hidden bg-neutral-50">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                      className="px-3 py-1.5 font-bold text-sm hover:bg-neutral-200 transition-colors"
                    >
                      &minus;
                    </button>
                    <span className="px-3 font-bold text-xs">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                      className="px-3 py-1.5 font-bold text-sm hover:bg-neutral-200 transition-colors"
                    >
                      &#43;
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right hidden sm:block w-28">
                    <div className="font-black text-black text-sm">
                      {formatTHB(item.unitPrice * item.quantity)}
                    </div>
                    <div className="text-[10px] text-neutral-500">
                      {formatTHB(item.unitPrice)} each
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeItem(item.variantId)}
                    aria-label="Remove item"
                    className="p-2 text-neutral-400 hover:text-black transition-colors"
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
              className="text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-black underline"
            >
              Clear Entire Bag
            </button>
            <Link
              href="/products"
              className="text-xs font-bold uppercase tracking-wider text-black hover:underline"
            >
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4">
          <div className="rounded-2xl bg-neutral-100 border border-neutral-200 p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-black uppercase tracking-wider text-black">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between text-neutral-600">
                <span>Subtotal</span>
                <span className="font-bold text-black">{formatTHB(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-neutral-600">
                <span>Estimated Shipping</span>
                <span className="font-bold text-black">
                  {shippingFee === 0 ? 'FREE' : formatTHB(shippingFee)}
                </span>
              </div>
              {shippingFee === 0 && (
                <div className="text-[11px] font-bold text-black uppercase tracking-wider pt-1">
                  Qualified for Free Standard Delivery
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-neutral-300 flex items-baseline justify-between">
              <span className="text-base font-black uppercase tracking-wider text-black">
                Total Amount
              </span>
              <span className="text-xl sm:text-2xl font-black text-black">
                {formatTHB(totalAmount)}
              </span>
            </div>

            <Link
              href="/checkout"
              className="w-full py-4 rounded-xl bg-black text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="text-center text-[11px] text-neutral-500">
              100% Official Licensed &bull; Guaranteed Authenticity TAG Tracking
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
