'use client';

import React from 'react';
import Link from 'next/link';
import { getOrderHistory } from '@/lib/orders/mock-checkout';
import { useHydrated } from '@/lib/cart/useHydrated';
import { formatTHB } from '@/lib/money';
import { Package, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AccountOrdersPage() {
  const isHydrated = useHydrated();
  const orders = isHydrated ? getOrderHistory() : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <div>
          <h2 className="text-xl font-black uppercase tracking-wider text-black">
            Order History &amp; Authenticity TAGs
          </h2>
          <p className="text-xs text-neutral-600 mt-1">
            Review your past purchases and inspect assigned cryptographic serial verification codes.
          </p>
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
          {orders.length} Orders
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl bg-neutral-100 border border-neutral-200 p-12 text-center space-y-4">
          <Package className="w-10 h-10 mx-auto text-neutral-400" />
          <h3 className="text-base font-bold text-black">No Orders Recorded Yet</h3>
          <p className="text-xs text-neutral-600 max-w-sm mx-auto">
            You haven&apos;t completed any merchandise orders. Browse our catalog and checkout in Demo mode to generate live Authenticity TAGs.
          </p>
          <div>
            <Link
              href="/products"
              className="inline-block px-6 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider"
            >
              Browse Catalog
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.orderNumber}
              className="rounded-2xl bg-neutral-100 border border-neutral-200 p-6 space-y-4"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-300 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-black text-base">
                      {order.orderNumber}
                    </span>
                    {order.isDemoOrder && (
                      <span className="px-2 py-0.5 rounded bg-black text-white text-[10px] font-bold uppercase tracking-wider">
                        DEMO ORDER
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-neutral-500">
                    Placed on {new Date(order.createdAt).toLocaleDateString()} &bull; {order.items.reduce((s, i) => s + i.quantity, 0)} Items
                  </span>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-xs text-neutral-500 uppercase tracking-wider">Total</div>
                  <div className="font-black text-black text-lg">
                    {formatTHB(order.totalAmount)}
                  </div>
                </div>
              </div>

              {/* Items preview */}
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 rounded-xl bg-white border border-neutral-200 text-xs"
                  >
                    <div>
                      <span className="font-bold text-black">{item.productName}</span>
                      <span className="text-neutral-500 ml-2">
                        (Size: {item.size || 'ONE SIZE'} &bull; Qty: {item.quantity})
                      </span>
                    </div>

                    {item.authenticityTagCode && (
                      <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-black">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{item.authenticityTagCode}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end pt-2">
                <Link
                  href={`/account/orders/${order.orderNumber}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-black uppercase tracking-wider hover:underline"
                >
                  <span>View Full Order Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
