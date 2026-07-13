'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { getOrderHistory } from '@/lib/orders/mock-checkout';
import { useHydrated } from '@/lib/cart/useHydrated';
import { formatTHB } from '@/lib/money';
import { ArrowLeft, ShieldCheck, ExternalLink } from 'lucide-react';

export default function AccountOrderDetailPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = use(params);
  const isHydrated = useHydrated();
  const history = isHydrated ? getOrderHistory() : [];
  const order = history.find((o) => o.orderNumber === orderNumber);

  if (!isHydrated) {
    return <div className="p-16 text-center text-neutral-500">Loading Order Details...</div>;
  }

  if (!order) {
    return (
      <div className="rounded-2xl bg-neutral-100 border border-neutral-200 p-12 text-center space-y-4">
        <h3 className="text-lg font-black text-black">Order Not Found</h3>
        <p className="text-xs text-neutral-600">
          Order number <span className="font-mono font-bold">{orderNumber}</span> could not be located in your local order history.
        </p>
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-black underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Order History</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <div>
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-black mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Orders</span>
          </Link>
          <h2 className="text-2xl font-black uppercase tracking-wider text-black">
            Order {order.orderNumber}
          </h2>
          <p className="text-xs text-neutral-600">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="text-right">
          <span className="px-3 py-1 rounded bg-black text-white text-xs font-bold uppercase tracking-wider">
            {order.status}
          </span>
        </div>
      </div>

      {/* Items & Verification Table */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500">
          Fulfilled Line Items &amp; TAG Registry
        </h3>

        <div className="divide-y divide-neutral-200 border border-neutral-200 rounded-2xl bg-white overflow-hidden">
          {order.items.map((item) => (
            <div key={item.id} className="p-5 space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-black text-sm">{item.productName}</div>
                  <div className="text-xs text-neutral-500">
                    Size: {item.size || 'ONE SIZE'} &bull; SKU: <span className="font-mono">{item.sku}</span> &bull; Qty: {item.quantity}
                  </div>
                </div>

                <div className="font-black text-black text-sm">
                  {formatTHB(item.totalPrice)}
                </div>
              </div>

              {item.authenticityTagCode && (
                <div className="p-3 rounded-xl bg-neutral-100 border border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-black shrink-0" />
                    <div>
                      <span className="font-bold text-black block">
                        Assigned Authenticity TAG: <span className="font-mono">{item.authenticityTagCode}</span>
                      </span>
                      <span className="text-neutral-500 text-[11px]">
                        Serial Registry: {item.serialNumber}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/verify/${item.authenticityTagCode}`}
                    className="px-3 py-1.5 rounded-lg bg-black text-white font-bold text-[10px] uppercase tracking-wider inline-flex items-center gap-1 hover:bg-neutral-800"
                  >
                    <span>Verify Code</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Financial & Shipping Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 rounded-2xl bg-neutral-100 border border-neutral-200 p-6 text-xs">
        <div className="space-y-1">
          <span className="font-bold uppercase tracking-wider text-neutral-500 block mb-2">
            Shipping Address
          </span>
          <div className="font-bold text-black">{order.shippingAddress.fullName}</div>
          <div className="text-neutral-600">
            {order.shippingAddress.street}, {order.shippingAddress.city} {order.shippingAddress.postalCode}
          </div>
          <div className="text-neutral-500 pt-1">Phone: {order.shippingAddress.phone}</div>
        </div>

        <div className="space-y-2">
          <span className="font-bold uppercase tracking-wider text-neutral-500 block mb-2">
            Order Breakdown
          </span>
          <div className="flex justify-between text-neutral-600">
            <span>Subtotal</span>
            <span className="font-bold text-black">{formatTHB(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-neutral-600">
            <span>Shipping</span>
            <span className="font-bold text-black">
              {order.shippingFee === 0 ? 'FREE' : formatTHB(order.shippingFee)}
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t border-neutral-300 text-sm font-black text-black">
            <span>Total Amount</span>
            <span>{formatTHB(order.totalAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
