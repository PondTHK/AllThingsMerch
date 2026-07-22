'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/lib/cart/useCartStore';
import { useHydrated } from '@/lib/cart/useHydrated';
import { placeOrderAction } from './actions';
import { formatTHB } from '@/lib/money';
import { getRepository } from '@/lib/repositories';
import { CheckoutReservationBanner } from '@/components/CheckoutReservationBanner';
import { ShieldAlert, ShieldCheck, Lock, ArrowLeft, Ticket, X } from 'lucide-react';

type PaymentMethodId = 'credit-card' | 'promptpay' | 'cod';

export default function CheckoutPage() {
  const router = useRouter();
  const isHydrated = useHydrated();
  const items = useCartStore((s) => s.items);
  const hasPreorder = items.some((item) => item.isPreorder);
  const clearCartWithoutRelease = useCartStore((s) => s.clearCartWithoutRelease);
  const releaseExpiredReservation = useCartStore((s) => s.releaseExpiredReservation);
  const appliedCoupon = useCartStore((s) => s.appliedCoupon);
  const applyCoupon = useCartStore((s) => s.applyCoupon);
  const removeCoupon = useCartStore((s) => s.removeCoupon);
  const [now] = useState(() => Date.now());

  // Release expired per-item reservations on mount
  useEffect(() => {
    if (isHydrated) releaseExpiredReservation();
  }, [isHydrated, releaseExpiredReservation]);

  // Unified checkout timer — driven by the soonest-expiring item
  const soonestExpiry = items.reduce<string | null>((min, item) => {
    if (!item.reservedUntil) return min;
    if (!min) return item.reservedUntil;
    return item.reservedUntil < min ? item.reservedUntil : min;
  }, null);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>('credit-card');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Coupon state
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  if (!isHydrated) {
    return <div className="p-16 text-center text-muted font-bold transition-colors">Loading checkout...</div>;
  }

  // Live calculation based on current items & applied coupon
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const shippingFee = subtotal === 0 || subtotal >= 3000 ? 0 : 100;

  let discountAmount = 0;
  if (appliedCoupon && (!appliedCoupon.minOrderValue || subtotal >= appliedCoupon.minOrderValue)) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = Math.floor(subtotal * (appliedCoupon.discountValue / 100));
    } else {
      discountAmount = Math.min(subtotal, appliedCoupon.discountValue);
    }
  }
  const totalAmount = Math.max(0, subtotal - discountAmount) + shippingFee;

  // Check if any item's reservation has expired
  const expiredItem = items.find((item) => item.reservedUntil && new Date(item.reservedUntil).getTime() < now);
  const isValid = items.length > 0 && !expiredItem;
  const errorMessage = expiredItem
    ? `Your reservation for "${expiredItem.productName}" has expired. Please return to catalog and add it again.`
    : items.length === 0
      ? 'Your shopping bag is empty.'
      : undefined;

  if (items.length === 0 || !isValid) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-6 transition-colors">
        <h1 className="text-3xl font-black text-foreground transition-colors">Cannot Proceed to Checkout</h1>
        <p className="text-sm text-muted transition-colors">
          {errorMessage || 'Your shopping bag is empty.'}
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

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!fullName.trim() || !email.trim() || !phone.trim() || !street.trim() || !city.trim() || !postalCode.trim()) {
        throw new Error('Please fill out all required shipping address fields.');
      }

      const res = await placeOrderAction(
        items,
        {
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          street: street.trim(),
          city: city.trim(),
          postalCode: postalCode.trim(),
        },
        paymentMethod,
        appliedCoupon?.code
      );

      clearCartWithoutRelease();
      router.push(`/checkout/success?orderNumber=${encodeURIComponent(res.orderNumber)}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to complete checkout.';
      setError(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 transition-colors">
      {/* Sticky reservation countdown — shows neutral/amber/red based on time left */}
      <CheckoutReservationBanner soonestExpiry={soonestExpiry} />

      {/* Top Banner Notice */}
      <div className="mb-8 p-4 rounded-2xl bg-surface border border-border flex items-center justify-between gap-4 transition-colors shadow-sm">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-primary shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-foreground uppercase tracking-wider block transition-colors">
              OFFICIAL LICENSED CHECKOUT
            </span>
            <span className="text-muted transition-colors">
              Verified order processing with real-time stock deduction and 1-to-1 serial TAG generation.
            </span>
          </div>
        </div>
        <Link
          href="/cart"
          className="text-xs font-bold uppercase tracking-wider text-foreground hover:underline shrink-0 flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Bag</span>
        </Link>
      </div>

      {hasPreorder && (
        <div className="mb-8 p-4 rounded-2xl bg-surface border border-border flex items-start gap-3 transition-colors shadow-sm">
          <ShieldAlert className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-foreground uppercase tracking-wider block transition-colors">
              Pre-Order Combined Shipment Notice (ข้อควรทราบสำหรับการรวมส่งสินค้าพรีออเดอร์)
            </span>
            <span className="text-muted leading-relaxed mt-1 block transition-colors">
              เนื่องจากคำสั่งซื้อของคุณมีสินค้าพรีออเดอร์รวมอยู่ด้วย สินค้าทั้งหมดในออเดอร์นี้จะถูกจัดส่งพร้อมกันเมื่อสินค้าพรีออเดอร์พร้อมจัดส่ง (อ้างอิงตามวันวางจำหน่ายของสินค้าพรีออเดอร์)
            </span>
          </div>
        </div>
      )}

      <h1 className="text-3xl sm:text-4xl font-black text-foreground mb-10 transition-colors">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Form Column */}
        <form onSubmit={handleConfirmOrder} className="lg:col-span-7 space-y-8">
          {/* Shipping Address */}
          <div className="space-y-4">
            <h2 className="text-lg font-black uppercase tracking-wider text-foreground border-b border-border pb-3 transition-colors">
              1. Shipping Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1 transition-colors">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border text-sm font-medium text-foreground focus:outline-none focus:border-foreground focus:bg-background transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1 transition-colors">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border text-sm font-medium text-foreground focus:outline-none focus:border-foreground focus:bg-background transition-colors"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1 transition-colors">
                  Phone Number *
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border text-sm font-medium text-foreground focus:outline-none focus:border-foreground focus:bg-background transition-colors"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1 transition-colors">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border text-sm font-medium text-foreground focus:outline-none focus:border-foreground focus:bg-background transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1 transition-colors">
                  City / Province *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border text-sm font-medium text-foreground focus:outline-none focus:border-foreground focus:bg-background transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1 transition-colors">
                  Postal Code *
                </label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border text-sm font-medium text-foreground focus:outline-none focus:border-foreground focus:bg-background transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-4">
            <h2 className="text-lg font-black uppercase tracking-wider text-foreground border-b border-border pb-3 transition-colors">
              2. Payment Method
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'credit-card', label: 'Credit / Debit Card' },
                { id: 'promptpay', label: 'PromptPay QR' },
                { id: 'cod', label: 'Cash on Delivery' },
              ].map((pm) => (
                <button
                  key={pm.id}
                  type="button"
                  onClick={() => setPaymentMethod(pm.id as PaymentMethodId)}
                  className={`p-4 rounded-xl border text-left text-xs font-bold uppercase tracking-wider transition-all ${paymentMethod === pm.id
                      ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                      : 'border-border bg-surface text-foreground hover:border-foreground'
                    }`}
                >
                  {pm.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-600 dark:text-rose-400 text-xs font-bold">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-sm"
          >
            <Lock className="w-4 h-4" />
            <span>Place Order ({formatTHB(totalAmount)})</span>
          </button>
        </form>

        {/* Server-verified Order Summary Sidebar */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl bg-surface border border-border p-6 sm:p-8 space-y-6 transition-colors shadow-sm">
            <div className="flex items-center justify-between border-b border-border pb-4 transition-colors">
              <h2 className="text-base font-black uppercase tracking-wider text-foreground transition-colors">
                Verified Order Summary
              </h2>
              <span className="text-xs font-bold uppercase tracking-wider text-muted transition-colors">
                {items.reduce((s, i) => s + i.quantity, 0)} Items
              </span>
            </div>

            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.id} className="flex items-start justify-between gap-4 text-xs transition-colors">
                  <div>
                    <div className="font-bold text-foreground flex items-center gap-2 transition-colors">
                      <span>{item.productName}</span>
                      {item.isPreorder && (
                        <span className="px-1.5 py-0.5 rounded-md bg-primary text-primary-foreground text-[9px] font-black uppercase tracking-wider">
                          Pre-Order
                        </span>
                      )}
                    </div>
                    <div className="text-muted transition-colors">
                      Size: {item.size || 'ONE SIZE'} &bull; Qty: {item.quantity}
                    </div>
                  </div>
                  <div className="font-bold text-foreground shrink-0 transition-colors">
                    {formatTHB(item.unitPrice * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-border space-y-2 text-sm transition-colors">
              <div className="flex items-center justify-between text-muted transition-colors">
                <span>Verified Subtotal</span>
                <span className="font-bold text-foreground transition-colors">
                  {formatTHB(subtotal)}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                  <span className="flex items-center gap-1">
                    <Ticket className="w-3.5 h-3.5" />
                    Discount ({appliedCoupon?.code})
                  </span>
                  <span className="font-bold">
                    -{formatTHB(discountAmount)}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between text-muted transition-colors">
                <span>Shipping Fee</span>
                <span className="font-bold text-foreground transition-colors">
                  {shippingFee === 0
                    ? 'FREE'
                    : formatTHB(shippingFee)}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex items-baseline justify-between transition-colors">
              <span className="text-base font-black uppercase tracking-wider text-foreground transition-colors">
                Total Due
              </span>
              <span className="text-2xl font-black text-foreground transition-colors">
                {formatTHB(totalAmount)}
              </span>
            </div>

            {/* Coupon Code Panel */}
            <div className="pt-6 border-t border-border space-y-3 transition-colors">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground transition-colors">
                Promo / Coupon Code
              </h3>
              {appliedCoupon ? (
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <span className="font-bold text-emerald-800 dark:text-emerald-300 font-mono block">
                        {appliedCoupon.code}
                      </span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
                        {appliedCoupon.discountType === 'percentage'
                          ? `${appliedCoupon.discountValue}% Off`
                          : `${formatTHB(appliedCoupon.discountValue)} Off`}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCoupon()}
                    className="p-1 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                      className="flex-1 px-3 py-2 rounded-xl bg-background border border-border text-xs font-medium uppercase font-mono text-foreground focus:outline-none focus:border-foreground transition-colors"
                    />
                    <button
                      type="button"
                      disabled={isApplyingCoupon || !couponCodeInput}
                      onClick={async () => {
                        setIsApplyingCoupon(true);
                        setCouponError(null);
                        try {
                          const coupon = await getRepository().getCouponByCode(couponCodeInput);
                          if (!coupon) {
                            throw new Error('Invalid coupon code');
                          }
                          if (!coupon.isActive) {
                            throw new Error('This coupon is no longer active');
                          }
                          if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
                            throw new Error('This coupon has expired');
                          }
                          if (coupon.maxGlobalUses !== undefined && coupon.currentGlobalUses >= coupon.maxGlobalUses) {
                            throw new Error('This coupon is fully claimed');
                          }
                          if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
                            throw new Error(`Minimum order of ${formatTHB(coupon.minOrderValue)} required`);
                          }
                          applyCoupon(coupon);
                          setCouponCodeInput('');
                        } catch (err: unknown) {
                          setCouponError(err instanceof Error ? err.message : 'Failed to apply coupon');
                        } finally {
                          setIsApplyingCoupon(false);
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-[10px] font-bold text-rose-600 dark:text-rose-400">{couponError}</p>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 rounded-xl bg-background border border-border text-xs text-muted space-y-1 transition-colors">
              <div className="flex items-center gap-1.5 font-bold text-foreground transition-colors">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>1-to-1 Serial Registration</span>
              </div>
              <p>
                Upon order completion, encrypted Authenticity TAG verification codes will be assigned to every fulfilled line item.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
