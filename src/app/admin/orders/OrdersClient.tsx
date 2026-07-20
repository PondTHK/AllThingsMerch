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
    }
    
    // Automatic TAGs might have been generated on the server for shipped/delivered,
    // so we rely on Server Action's revalidatePath and router.refresh to sync state.
    // The optimistic update will be replaced by the fresh server data.
    
    setIsUpdating(false);
  };

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
            className="px-3 py-2 rounded-xl bg-neutral-100 border border-neutral-300 text-xs font-bold text-black focus:outline-none focus:border-black"
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
        <div className="rounded-2xl bg-neutral-100 border border-neutral-200 p-12 text-center space-y-3">
          <ClipboardList className="w-10 h-10 mx-auto text-neutral-400" />
          <h3 className="text-base font-bold text-black">No Orders Match Filter</h3>
          <p className="text-xs text-neutral-600">
            Wait for customers to complete a checkout transaction to inspect live fulfillment orders here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            return (
              <div
                key={order.id}
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
                      Recipient: <span className="font-bold text-black">{order.shippingAddress.fullName || 'Unknown'}</span> ({order.shippingAddress.city || 'Unknown'})
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
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      disabled={isUpdating}
                      className="px-3.5 py-2 rounded-xl bg-black text-white text-xs font-bold uppercase tracking-wider focus:outline-none disabled:opacity-50"
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
                      className="p-3 rounded-xl bg-neutral-100 border border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs"
                    >
                      <div>
                        <span className="font-bold text-black">{item.productName}</span>
                        <span className="text-neutral-500 ml-2">
                          SKU: {item.sku} &bull; Qty: {item.quantity} &bull; {formatTHB(item.lineTotal)}
                        </span>
                      </div>

                      {item.tagCode && (
                        <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-black">
                          <ShieldCheck className="w-3.5 h-3.5" />
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
        <div className="flex items-center justify-between border-t border-neutral-200 pt-4">
          <p className="text-xs text-neutral-500">
            Showing page {currentPage} of {totalPages} ({totalCount} total orders)
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push(`/admin/orders?page=${currentPage - 1}`)}
              disabled={currentPage <= 1 || isUpdating}
              className="px-3 py-1.5 rounded-xl border border-neutral-300 bg-white text-xs font-bold disabled:opacity-50 hover:bg-neutral-50"
            >
              Previous
            </button>
            <button
              onClick={() => router.push(`/admin/orders?page=${currentPage + 1}`)}
              disabled={currentPage >= totalPages || isUpdating}
              className="px-3 py-1.5 rounded-xl border border-neutral-300 bg-white text-xs font-bold disabled:opacity-50 hover:bg-neutral-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
