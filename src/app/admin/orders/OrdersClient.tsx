'use client';

import React, { useState } from 'react';
import { formatTHB } from '@/lib/money';
import { ClipboardList, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { updateOrderStatusAction } from './actions';

export interface OrderItemDto {
  id: string;
  productName: string;
  sku: string;
  quantity: number;
  lineTotal: number;
  tagCode: string | null;
}

export interface OrderDto {
  id: string;
  orderNumber: string;
  status: string;
  createdAt: string;
  totalAmount: number;
  shippingAddress: {
    fullName: string;
    city: string;
  };
  items: OrderItemDto[];
}

interface OrdersClientProps {
  initialOrders: OrderDto[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

export function OrdersClient({
  initialOrders,
  currentPage,
  totalPages,
  totalCount,
}: OrdersClientProps) {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderDto[]>(initialOrders);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isUpdating, setIsUpdating] = useState(false);

  const filteredOrders =
    filterStatus === 'all'
      ? orders
      : orders.filter((o) => o.status === filterStatus);

  const updateStatus = async (orderId: string, newStatus: string) => {
    setIsUpdating(true);

    // Save previous state for rollback
    const previousOrders = [...orders];

    // Optimistic update
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );

    const result = await updateOrderStatusAction(orderId, newStatus);
    
    if (!result.success) {
      alert(result.error || 'Failed to update order status.');
      setOrders(previousOrders);
    } else {
      // Sync fresh server data (revalidatePath + router.refresh = consistent state)
      router.refresh();
    }
    
    setIsUpdating(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Customer Orders &amp; Fulfillment
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Update order fulfillment status and inspect cryptographic Authenticity TAG registries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-500">
            Filter:
          </span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white/70 backdrop-blur-md border border-white/80 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all shadow-sm"
          >
            <option value="all">All Orders ({orders.length})</option>
            <option value="pending_payment">Pending Payment</option>
            <option value="paid">Paid</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/80 p-12 text-center space-y-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <ClipboardList className="w-10 h-10 mx-auto text-slate-300" />
          <h3 className="text-base font-medium text-slate-900">No Orders Match Filter</h3>
          <p className="text-sm text-slate-500">
            Wait for customers to complete a checkout transaction to inspect live fulfillment orders here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            return (
              <div
                key={order.id}
                className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/80 p-6 space-y-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:bg-white/80 transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/50 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 text-base">
                        {order.orderNumber}
                      </span>
                      <span className="text-sm text-slate-500">
                        &bull; Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-sm text-slate-600 mt-1">
                      Recipient: <span className="font-medium text-slate-900">{order.shippingAddress.fullName || 'Unknown'}</span> ({order.shippingAddress.city || 'Unknown'})
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-xs font-medium text-slate-500 block">
                        Total Amount
                      </span>
                      <span className="font-bold text-slate-900 text-base">
                        {formatTHB(order.totalAmount)}
                      </span>
                    </div>

                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      disabled={isUpdating}
                      className="px-3 py-2 rounded-xl bg-white/50 backdrop-blur-md border border-slate-200/60 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 disabled:opacity-50 hover:bg-white transition-all shadow-sm"
                    >
                      <option value="pending_payment">Pending Payment</option>
                      <option value="paid">Paid</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Order Items & TAGs */}
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl bg-white/40 backdrop-blur-sm border border-white/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-sm"
                    >
                      <div>
                        <span className="font-medium text-slate-900">{item.productName}</span>
                        <span className="text-slate-500 ml-2">
                          SKU: {item.sku} &bull; Qty: {item.quantity} &bull; {formatTHB(item.lineTotal)}
                        </span>
                      </div>

                      {item.tagCode && (
                        <div className="flex items-center gap-1.5 font-mono text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                          <ShieldCheck className="w-4 h-4" />
                          <span>TAG: {item.tagCode}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-200 pt-4">
          <p className="text-sm text-slate-500">
            Showing page {currentPage} of {totalPages} ({totalCount} total orders)
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push(`/admin/orders?page=${currentPage - 1}`)}
              disabled={currentPage <= 1 || isUpdating}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-sm font-medium disabled:opacity-50 hover:bg-slate-50"
            >
              Previous
            </button>
            <button
              onClick={() => router.push(`/admin/orders?page=${currentPage + 1}`)}
              disabled={currentPage >= totalPages || isUpdating}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-sm font-medium disabled:opacity-50 hover:bg-slate-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
