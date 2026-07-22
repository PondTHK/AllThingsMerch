'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCartStore } from '@/lib/cart/useCartStore';

import { useHydrated } from '@/lib/cart/useHydrated';
import { placeOrderAction } from '@/app/checkout/actions';
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

  const [fullName, setFullName] = useState('Thanakhon Demo Collector');
  const [email, setEmail] = useState('collector@allthingsmerch.demo');
  const [phone, setPhone] = useState('089-123-4567');
  const [street, setStreet] = useState('999 Sukhumvit Road, Khlong Toei');
  const [city, setCity] = useState('Bangkok');
  const [postalCode, setPostalCode] = useState('10110');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>('credit-card');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Coupon state
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  if (!isHydrated) {
    return <div className="p-16 text-center text-neutral-500">Loading checkout...</div>;
  }

  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const getDiscountAmount = useCartStore((s) => s.getDiscountAmount);
  const getShippingFee = useCartStore((s) => s.getShippingFee);
  const getTotalAmount = useCartStore((s) => s.getTotalAmount);

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-6">
        <h1 className="text-3xl font-black text-black">Cannot Proceed to Checkout</h1>
        <p className="text-sm text-neutral-600">
          Your shopping bag is empty.
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

  const subtotal = getSubtotal();
  const discountAmount = getDiscountAmount();
  const shippingFee = getShippingFee();
  const totalAmount = getTotalAmount();

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (!fullName.trim() || !email.trim() || !phone.trim() || !street.trim() || !city.trim() || !postalCode.trim()) {
        throw new Error('Please fill out all required shipping address fields.');
      }

      const shippingAddress = {
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        street: street.trim(),
        city: city.trim(),
        postalCode: postalCode.trim(),
      };

      const result = await placeOrderAction(items, shippingAddress, paymentMethod, appliedCoupon?.code);

      if (result.success && result.orderNumber) {
        clearCartWithoutRelease();
        router.push(`/checkout/success?orderNumber=${encodeURIComponent(result.orderNumber)}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to complete checkout.';
      setError(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Sticky reservation countdown — shows neutral/amber/red based on time left */}
      <CheckoutReservationBanner soonestExpiry={soonestExpiry} />

      {/* Top Banner Notice */}
      <div className="mb-8 p-4 rounded-2xl bg-neutral-100 border border-neutral-300 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-black shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-black uppercase tracking-wider block">
              SECURE CHECKOUT
            </span>
            <span className="text-neutral-600">
              Orders will be processed through the live database. Authenticity TAGs and Royalties are handled automatically.
            </span>
          </div>
        </div>
        <Link
          href="/cart"
          className="text-xs font-bold uppercase tracking-wider text-black hover:underline shrink-0 flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Bag</span>
        </Link>
      </div>

      {hasPreorder && (
        <div className="mb-8 p-4 rounded-2xl bg-neutral-100 border border-neutral-300 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-black shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-black uppercase tracking-wider block">
              Pre-Order Combined Shipment Notice (ข้อควรทราบสำหรับการรวมส่งสินค้าพรีออเดอร์)
            </span>
            <span className="text-neutral-600 leading-relaxed mt-1 block">
              เนื่องจากคำสั่งซื้อของคุณมีสินค้าพรีออเดอร์รวมอยู่ด้วย สินค้าทั้งหมดในออเดอร์นี้จะถูกจัดส่งพร้อมกันเมื่อสินค้าพรีออเดอร์พร้อมจัดส่ง (อ้างอิงตามวันวางจำหน่ายของสินค้าพรีออเดอร์)
            </span>
          </div>
        </div>
      )}

      <h1 className="text-3xl sm:text-4xl font-black text-black mb-10">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Form Column */}
        <form onSubmit={handleConfirmOrder} className="lg:col-span-7 space-y-8">
          {/* Shipping Address */}
          <div className="space-y-4">
            <h2 className="text-lg font-black uppercase tracking-wider text-black border-b border-neutral-200 pb-3">
              1. Shipping Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-100 border border-neutral-300 text-sm font-medium text-black focus:outline-none focus:border-black focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-100 border border-neutral-300 text-sm font-medium text-black focus:outline-none focus:border-black focus:bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                  Phone Number *
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-100 border border-neutral-300 text-sm font-medium text-black focus:outline-none focus:border-black focus:bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-100 border border-neutral-300 text-sm font-medium text-black focus:outline-none focus:border-black focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                  City / Province *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-100 border border-neutral-300 text-sm font-medium text-black focus:outline-none focus:border-black focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                  Postal Code *
                </label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-100 border border-neutral-300 text-sm font-medium text-black focus:outline-none focus:border-black focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-4">
            <h2 className="text-lg font-black uppercase tracking-wider text-black border-b border-neutral-200 pb-3">
              2. Simulated Payment Method
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'credit-card', label: 'Credit / Debit Card (Mock)' },
                { id: 'promptpay', label: 'PromptPay QR (Mock)' },
                { id: 'cod', label: 'Cash on Delivery (Mock)' },
              ].map((pm) => (
                <button
                  key={pm.id}
                  type="button"
                  onClick={() => setPaymentMethod(pm.id as PaymentMethodId)}
                  className={`p-4 rounded-xl border text-left text-xs font-bold uppercase tracking-wider transition-all ${
                    paymentMethod === pm.id
                      ? 'border-black bg-black text-white'
                      : 'border-neutral-300 bg-white text-black hover:border-black'
                  }`}
                >
                  {pm.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-neutral-200 border border-black text-black text-xs font-bold">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-xl bg-black text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors"
          >
            <Lock className="w-4 h-4" />
            <span>{isSubmitting ? 'Processing...' : `Confirm Order (${formatTHB(totalAmount)})`}</span>
          </button>
        </form>

        {/* Server-verified Order Summary Sidebar */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl bg-neutral-100 border border-neutral-200 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
              <h2 className="text-base font-black uppercase tracking-wider text-black">
                Verified Order Summary
              </h2>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                {items.reduce((s, i) => s + i.quantity, 0)} Items
              </span>
            </div>

            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.id} className="flex items-start justify-between gap-4 text-xs">
                  <div>
                    <div className="font-bold text-black flex items-center gap-2">
                      <span>{item.productName}</span>
                      {item.isPreorder && (
                        <span className="px-1.5 py-0.5 rounded-md bg-neutral-200 text-black text-[9px] font-black uppercase tracking-wider">
                          Pre-Order
                        </span>
                      )}
                    </div>
                    <div className="text-neutral-500">
                      Size: {item.size || 'ONE SIZE'} &bull; Qty: {item.quantity}
                    </div>
                  </div>
                  <div className="font-bold text-black shrink-0">
                    {formatTHB(item.unitPrice * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-neutral-200 space-y-2 text-sm">
              <div className="flex items-center justify-between text-neutral-600">
                <span>Verified Subtotal</span>
                <span className="font-bold text-black">
                  {formatTHB(subtotal)}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-green-600">
                  <span className="flex items-center gap-1">
                    <Ticket className="w-3.5 h-3.5" />
                    Discount ({appliedCoupon?.code})
                  </span>
                  <span className="font-bold">
                    -{formatTHB(discountAmount)}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between text-neutral-600">
                <span>Shipping Fee</span>
                <span className="font-bold text-black">
                  {shippingFee === 0
                    ? 'FREE'
                    : formatTHB(shippingFee)}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-300 flex items-baseline justify-between">
              <span className="text-base font-black uppercase tracking-wider text-black">
                Total Due
              </span>
              <span className="text-2xl font-black text-black">
                {formatTHB(totalAmount)}
              </span>
            </div>


            {/* Coupon Code Panel */}
            <div className="pt-6 border-t border-neutral-200 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-black">
                Promo / Coupon Code
              </h3>
              {appliedCoupon ? (
                <div className="p-3.5 rounded-xl bg-green-50 border border-green-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-green-700" />
                    <div>
                      <span className="font-bold text-green-800 font-mono block">
                        {appliedCoupon.code}
                      </span>
                      <span className="text-[10px] text-green-600">
                        {appliedCoupon.discountType === 'percentage'
                          ? `${appliedCoupon.discountValue}% Off`
                          : `${formatTHB(appliedCoupon.discountValue)} Off`}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCoupon()}
                    className="p-1 rounded bg-green-100 hover:bg-green-200 text-green-700 transition-colors"
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
                      className="flex-1 px-3 py-2 rounded-xl bg-white border border-neutral-300 text-xs font-medium uppercase font-mono text-black focus:outline-none focus:border-black"
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
                      className="px-4 py-2 rounded-xl bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-[10px] font-bold text-red-600">{couponError}</p>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 rounded-xl bg-white border border-neutral-200 text-xs text-neutral-600 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-black">
                <ShieldCheck className="w-4 h-4" />
                <span>1-to-1 Serial Registration</span>
              </div>
              <p>
                Upon completion, encrypted Authenticity TAG verification codes will be assigned to every fulfilled line item.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
