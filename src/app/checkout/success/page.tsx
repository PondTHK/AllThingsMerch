'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getUserOrderByNumberAction } from '@/app/account/orders/actions';
import { Order } from '@/types';
import { formatTHB } from '@/lib/money';
import { ShieldCheck, Check, ArrowRight, ExternalLink } from 'lucide-react';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams?.get('orderNumber') || '';
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    if (!orderNumber) {
      setLoading(false);
      return;
    }
    getUserOrderByNumberAction(orderNumber)
      .then((data) => {
        if (mounted) {
          setOrder(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load order from database:', err);
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [orderNumber]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center font-bold text-neutral-500">
        Loading official order confirmation from database...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-6">
        <h1 className="text-3xl font-black text-black">Order Confirmation</h1>
        <p className="text-sm text-neutral-600">
          We received your checkout request, but could not immediately load order details for <span className="font-mono font-bold">{orderNumber}</span>. Please check your order history.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/account/orders"
            className="inline-block px-8 py-3.5 bg-black text-white font-bold text-xs uppercase tracking-wider"
          >
            View Order History
          </Link>
          <Link
            href="/products"
            className="inline-block px-8 py-3.5 border border-black bg-white text-black font-bold text-xs uppercase tracking-wider"
          >
            Continue Exploring Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="rounded-3xl bg-neutral-100 border border-neutral-200 p-8 sm:p-12 space-y-8">
        {/* Header Status */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-300 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-wider">
              <Check className="w-3.5 h-3.5" />
              <span>OFFICIAL ORDER FULFILLED</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-black">
              Thank You For Your Order
            </h1>
            <p className="text-xs text-neutral-600 font-mono">
              Order Number: <span className="font-bold text-black">{order.orderNumber}</span>
            </p>
          </div>

          <div className="text-left sm:text-right">
            <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
              Total Paid (Simulated)
            </div>
            <div className="text-2xl font-black text-black">
              {formatTHB(order.totalAmount)}
            </div>
          </div>
        </div>

        {/* Authenticity TAG Notice */}
        <div className="p-5 rounded-2xl bg-white border border-neutral-300 space-y-3">
          <div className="flex items-center gap-2 font-bold text-black text-sm uppercase tracking-wider">
            <ShieldCheck className="w-5 h-5" />
            <span>1-to-1 Verified Authenticity TAG Assigned</span>
          </div>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Every item in your order has been permanently registered with a unique verification code. You can verify royalty tracking and item authenticity instantly below.
          </p>
        </div>

        {/* Order Items Table */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500">
            Fulfilled Merchandise &amp; TAG Registration
          </h3>

          <div className="divide-y divide-neutral-200 border border-neutral-200 rounded-2xl bg-white overflow-hidden">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="font-bold text-black text-sm flex items-center gap-2">
                    <span>{item.productName}</span>
                    {item.isPreorder && (
                      <span className="px-1.5 py-0.5 rounded-md bg-neutral-200 text-black text-[9px] font-black uppercase tracking-wider">
                        Pre-Order
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-neutral-500">
                    Size: {item.size || 'ONE SIZE'} &bull; Qty: {item.quantity} &bull; SKU: {item.sku}
                  </div>
                  {item.authenticityTagCode && (
                    <div className="pt-1 flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-neutral-100 text-black font-mono text-[10px] font-bold">
                        {item.authenticityTagCode}
                      </span>
                      <Link
                        href={`/verify/${item.authenticityTagCode}`}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-black underline hover:text-neutral-600"
                      >
                        <span>Verify TAG</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </div>

                <div className="font-black text-black text-sm">
                  {formatTHB(item.totalPrice)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-neutral-300 text-xs">
          <div>
            <span className="font-bold uppercase tracking-wider text-neutral-500 block mb-1">
              Shipping Address
            </span>
            <div className="font-bold text-black">{order.shippingAddress.fullName}</div>
            <div className="text-neutral-600">
              {order.shippingAddress.street}, {order.shippingAddress.city} {order.shippingAddress.postalCode}
            </div>
            <div className="text-neutral-500 mt-1">Phone: {order.shippingAddress.phone}</div>
          </div>

          <div>
            <span className="font-bold uppercase tracking-wider text-neutral-500 block mb-1">
              Payment &amp; Delivery Status
            </span>
            <div className="text-neutral-600">Simulated Method: <span className="font-bold text-black uppercase">{order.paymentMethod}</span></div>
            <div className="text-neutral-600">Fulfillment Status: <span className="font-bold text-black">Complete (Demo)</span></div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-neutral-300">
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-black bg-white text-black font-bold text-xs uppercase tracking-wider text-center hover:bg-neutral-100 transition-colors"
          >
            Return to Home
          </Link>
          <Link
            href="/products"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-black text-white font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="p-16 text-center text-neutral-500">Loading order details...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
