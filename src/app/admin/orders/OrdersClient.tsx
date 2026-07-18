'use client';

import React, { useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { formatTHB } from '@/lib/money';
import { ClipboardList, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Order = any; // Assuming 'any' or proper type matching Supabase response

interface OrdersClientProps {
  initialOrders: Order[];
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
  const supabase = getSupabaseBrowserClient();
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isUpdating, setIsUpdating] = useState(false);

  const filteredOrders =
    filterStatus === 'all'
      ? orders
      : orders.filter((o) => o.status === filterStatus);

  const updateStatus = async (orderId: string, newStatus: string) => {
    if (!supabase) return;
    setIsUpdating(true);

    // Save previous state for rollback
    const previousOrders = [...orders];

    // Optimistic update
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );

    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;
      
      router.refresh();
    } catch (error) {
      console.error('Failed to update order status:', error);
      alert('Failed to update order status. Please check your connection and permissions.');
      // Revert to previous state
      setOrders(previousOrders);
    } finally {
      setIsUpdating(false);
    }
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
            // Note: In Supabase, the JSONB field is usually accessed as an object directly
            const shipping = order.shipping_address || {};
            
            return (
              <div
                key={order.id}
                className="rounded-2xl bg-white border border-neutral-200 p-6 space-y-4"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-black text-base">
                        {order.order_number}
                      </span>
                      <span className="text-xs text-neutral-500">
                        &bull; Placed on {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-xs text-neutral-600 mt-0.5">
                      Recipient: <span className="font-bold text-black">{shipping.fullName || shipping.name || 'Unknown'}</span> ({shipping.city || 'Unknown'})
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right mr-2">
                      <span className="text-[10px] uppercase tracking-wider text-neutral-500 block">
                        Total Amount
                      </span>
                      <span className="font-black text-black text-base">
                        {formatTHB(order.total_amount)}
                      </span>
                    </div>

                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="px-3.5 py-2 rounded-xl bg-black text-white text-xs font-bold uppercase tracking-wider focus:outline-none"
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
                  {order.order_items?.map((item: any) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-neutral-100 border border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs"
                    >
                      <div>
                        <span className="font-bold text-black">{item.product_name}</span>
                        <span className="text-neutral-500 ml-2">
                          SKU: {item.sku} &bull; Qty: {item.quantity} &bull; {formatTHB(item.line_total)}
                        </span>
                      </div>

                      {/* In a real scenario, we might join authenticity_tags, but we assume it's part of the item or fetched separately if needed */}
                      {item.authenticity_tags?.[0]?.public_code && (
                        <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-black">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>TAG: {item.authenticity_tags[0].public_code}</span>
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
