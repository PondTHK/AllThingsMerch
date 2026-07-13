'use client';

import React, { useState } from 'react';
import { useAdminStore } from '@/lib/admin/useAdminStore';
import { Order } from '@/types';
import { formatTHB } from '@/lib/money';
import { ClipboardList, ShieldCheck } from 'lucide-react';

export default function AdminOrdersPage() {
  const orders = useAdminStore((state) => state.orders);
  const updateStatus = useAdminStore((state) => state.updateOrderStatus);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredOrders =
    filterStatus === 'all'
      ? orders
      : orders.filter((o) => o.status === filterStatus);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
        <div>
          <h2 className="text-xl font-black uppercase tracking-wider text-black">
            Customer Orders &amp; Fulfillment
          </h2>
          <p className="text-xs text-neutral-600 mt-1">
            Update order fulfillment status and inspect cryptographic Authenticity TAG registries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Filter:
          </span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-neutral-100 border border-neutral-300 text-xs font-bold text-black"
          >
            <option value="all">All Orders ({orders.length})</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="fulfilled">Fulfilled</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="rounded-2xl bg-neutral-100 border border-neutral-200 p-12 text-center space-y-3">
          <ClipboardList className="w-10 h-10 mx-auto text-neutral-400" />
          <h3 className="text-base font-bold text-black">No Orders Match Filter</h3>
          <p className="text-xs text-neutral-600">
            Complete a checkout transaction in Demo mode to inspect live fulfillment orders here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.orderNumber}
              className="rounded-2xl bg-white border border-neutral-200 p-6 space-y-4"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-black text-base">
                      {order.orderNumber}
                    </span>
                    <span className="text-xs text-neutral-500">
                      &bull; Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-600 mt-0.5">
                    Recipient: <span className="font-bold text-black">{order.shippingAddress.fullName}</span> ({order.shippingAddress.city})
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right mr-2">
                    <span className="text-[10px] uppercase tracking-wider text-neutral-500 block">
                      Total Amount
                    </span>
                    <span className="font-black text-black text-base">
                      {formatTHB(order.totalAmount)}
                    </span>
                  </div>

                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateStatus(order.orderNumber, e.target.value as Order['status'])
                    }
                    className="px-3.5 py-2 rounded-xl bg-black text-white text-xs font-bold uppercase tracking-wider"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="fulfilled">Fulfilled</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Order Items & TAGs */}
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-neutral-100 border border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <span className="font-bold text-black">{item.productName}</span>
                      <span className="text-neutral-500 ml-2">
                        SKU: {item.sku} &bull; Qty: {item.quantity} &bull; {formatTHB(item.totalPrice)}
                      </span>
                    </div>

                    {item.authenticityTagCode && (
                      <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-black">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>TAG: {item.authenticityTagCode}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
