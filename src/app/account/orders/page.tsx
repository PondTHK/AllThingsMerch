import React from 'react';
import Link from 'next/link';
import { getUserOrdersAction } from './actions';
import { formatTHB } from '@/lib/money';
import { Package, ArrowRight, ShieldCheck } from 'lucide-react';
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge';
import { OrderReviewAction } from '@/components/orders/OrderReviewAction';

export default async function AccountOrdersPage() {
  const orders = await getUserOrdersAction();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4 transition-colors">
        <div>
          <h2 className="text-xl font-black uppercase tracking-wider text-foreground transition-colors">
            Order History &amp; Authenticity TAGs
          </h2>
          <p className="text-xs text-muted mt-1 transition-colors">
            Review your past purchases and inspect assigned cryptographic serial verification codes.
          </p>
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-muted transition-colors">
          {orders.length} Orders
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl bg-surface border border-border p-12 text-center space-y-4 transition-colors shadow-sm">
          <Package className="w-10 h-10 mx-auto text-muted" />
          <h3 className="text-base font-bold text-foreground transition-colors">No Orders Recorded Yet</h3>
          <p className="text-xs text-muted max-w-sm mx-auto transition-colors">
            You haven&apos;t completed any merchandise orders. Browse our catalog and place an order to receive your 1-to-1 verified Authenticity TAGs.
          </p>
          <div>
            <Link
              href="/products"
              className="inline-block px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity shadow-sm"
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
              className="rounded-2xl bg-surface border border-border p-6 space-y-4 transition-colors shadow-sm hover:border-foreground/40"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4 transition-colors">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono font-bold text-foreground text-base transition-colors">
                      {order.orderNumber}
                    </span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <span className="text-xs text-muted mt-1 block transition-colors">
                    Placed on {new Date(order.createdAt).toLocaleDateString()} &bull; {order.items.reduce((s, i) => s + i.quantity, 0)} Items
                  </span>
                </div>

                <div className="text-left sm:text-right">
                  <div className="text-xs text-muted uppercase tracking-wider transition-colors">Total</div>
                  <div className="font-black text-foreground text-lg transition-colors">
                    {formatTHB(order.totalAmount)}
                  </div>
                </div>
              </div>

              {/* Items preview */}
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3.5 rounded-xl bg-background border border-border text-xs transition-colors"
                  >
                    <div>
                      <span className="font-bold text-foreground transition-colors">{item.productName}</span>
                      <span className="text-muted ml-2 transition-colors">
                        (Size: {item.size || 'ONE SIZE'} &bull; Qty: {item.quantity})
                      </span>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      {item.authenticityTagCode && (
                        <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-foreground bg-surface px-2.5 py-1 rounded-lg border border-border transition-colors">
                          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                          <span>{item.authenticityTagCode}</span>
                        </div>
                      )}
                      
                      <div className="w-full sm:w-auto">
                        <OrderReviewAction 
                          item={item} 
                          orderStatus={order.status} 
                          customerName={order.shippingAddress.fullName || 'Verified Buyer'} 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end pt-2">
                <Link
                  href={`/account/orders/${order.orderNumber}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-foreground uppercase tracking-wider hover:underline transition-colors"
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
