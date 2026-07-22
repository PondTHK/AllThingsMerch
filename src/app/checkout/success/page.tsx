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
      <div className="max-w-3xl mx-auto px-4 py-24 text-center font-bold text-muted transition-colors">
        Loading official order confirmation from database...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-6 transition-colors">
        <h1 className="text-3xl font-black text-foreground transition-colors">Order Confirmation</h1>
        <p className="text-sm text-muted transition-colors">
          We received your checkout request, but could not immediately load order details for <span className="font-mono font-bold text-foreground">{orderNumber}</span>. Please check your order history.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/account/orders"
            className="inline-block px-8 py-3.5 bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider rounded-xl hover:opacity-90 shadow-sm transition-opacity"
          >
            View Order History
          </Link>
          <Link
            href="/products"
            className="inline-block px-8 py-3.5 border border-border bg-surface text-foreground font-bold text-xs uppercase tracking-wider rounded-xl hover:border-foreground transition-all"
          >
            Continue Exploring Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 transition-colors">
      <div className="rounded-3xl bg-surface border border-border p-8 sm:p-12 space-y-8 transition-colors shadow-sm">
        {/* Header Status */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6 transition-colors">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider shadow-sm">
              <Check className="w-3.5 h-3.5" />
              <span>OFFICIAL ORDER FULFILLED</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-foreground transition-colors">
              Thank You For Your Order
            </h1>
            <p className="text-xs text-muted font-mono transition-colors">
              Order Number: <span className="font-bold text-foreground">{order.orderNumber}</span>
            </p>
          </div>

          <div className="text-left sm:text-right">
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted transition-colors">
              Total Paid
            </div>
            <div className="text-2xl font-black text-foreground transition-colors">
              {formatTHB(order.totalAmount)}
            </div>
          </div>
        </div>

        {/* Authenticity TAG Notice */}
        <div className="p-5 rounded-2xl bg-background border border-border space-y-3 transition-colors shadow-sm">
          <div className="flex items-center gap-2 font-bold text-foreground text-sm uppercase tracking-wider transition-colors">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <span>1-to-1 Verified Authenticity TAG Assigned</span>
          </div>
          <p className="text-xs text-muted leading-relaxed transition-colors">
            Every item in your order has been permanently registered with a unique verification code. You can verify royalty tracking and item authenticity instantly below.
          </p>
        </div>

        {/* Order Items Table */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted transition-colors">
            Fulfilled Merchandise &amp; TAG Registration
          </h3>

          <div className="divide-y divide-border border border-border rounded-2xl bg-background overflow-hidden transition-colors">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors"
              >
                <div className="space-y-1">
                  <div className="font-bold text-foreground text-sm flex items-center gap-2 transition-colors">
                    <span>{item.productName}</span>
                    {item.isPreorder && (
                      <span className="px-1.5 py-0.5 rounded-md bg-primary text-primary-foreground text-[9px] font-black uppercase tracking-wider">
                        Pre-Order
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted transition-colors">
                    Size: {item.size || 'ONE SIZE'} &bull; Qty: {item.quantity} &bull; SKU: <span className="font-mono text-foreground">{item.sku}</span>
                  </div>
                  {item.authenticityTagCode && (
                    <div className="pt-1 flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-surface border border-border text-foreground font-mono text-[10px] font-bold transition-colors">
                        {item.authenticityTagCode}
                      </span>
                      <Link
                        href={`/verify/${item.authenticityTagCode}`}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-foreground underline hover:text-muted transition-colors"
                      >
                        <span>Verify TAG</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  )}
                </div>

                <div className="font-black text-foreground text-sm transition-colors">
                  {formatTHB(item.totalPrice)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-border text-xs transition-colors">
          <div>
            <span className="font-bold uppercase tracking-wider text-muted block mb-1 transition-colors">
              Shipping Address
            </span>
            <div className="font-bold text-foreground transition-colors">{order.shippingAddress.fullName}</div>
            <div className="text-muted transition-colors">
              {order.shippingAddress.street}, {order.shippingAddress.city} {order.shippingAddress.postalCode}
            </div>
            <div className="text-muted mt-1 transition-colors">Phone: {order.shippingAddress.phone}</div>
          </div>

          <div>
            <span className="font-bold uppercase tracking-wider text-muted block mb-1 transition-colors">
              Payment &amp; Delivery Status
            </span>
            <div className="text-muted transition-colors">Payment Method: <span className="font-bold text-foreground uppercase">{order.paymentMethod}</span></div>
            <div className="text-muted transition-colors">Fulfillment Status: <span className="font-bold text-foreground uppercase">{order.status}</span></div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border transition-colors">
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-border bg-surface text-foreground font-bold text-xs uppercase tracking-wider text-center hover:border-foreground transition-all"
          >
            Return to Home
          </Link>
          <Link
            href="/products"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-sm"
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
    <Suspense fallback={<div className="p-16 text-center text-muted transition-colors font-bold">Loading order details...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
