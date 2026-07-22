'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { getUserOrderByNumberAction } from '@/app/account/orders/actions';
import { submitProductReviewAction } from '@/lib/reviews/actions';
import { Order, OrderItem } from '@/types';
import { formatTHB } from '@/lib/money';
import { ArrowLeft, ShieldCheck, ExternalLink, Star, AlertCircle } from 'lucide-react';
import { useReviewStore } from '@/lib/reviews/useReviewStore';
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge';
import { OrderStatusTimeline } from '@/components/orders/OrderStatusTimeline';

export default function AccountOrderDetailPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewedItemIds, setReviewedItemIds] = useState<string[]>([]);

  const [activeReviewItem, setActiveReviewItem] = useState<OrderItem | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const reviews = useReviewStore((s) => s.reviews);

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

  const hasReviewed = (orderItemId: string) => {
    return reviewedItemIds.includes(orderItemId) || reviews.some((r) => r.orderItemId === orderItemId);
  };

  const handleSubmitReview = async () => {
    if (!activeReviewItem || !order) return;
    if (!comment.trim()) {
      setError('Please write a review comment.');
      return;
    }
    
    if (hasReviewed(activeReviewItem.id)) {
      setError('You have already reviewed this item.');
      return;
    }

    try {
      await submitProductReviewAction({
        productId: activeReviewItem.productId,
        orderItemId: activeReviewItem.id,
        rating,
        comment: comment.trim(),
        userName: order.shippingAddress.fullName || 'Verified Buyer',
        productName: activeReviewItem.productName,
      });
      setReviewedItemIds((prev) => [...prev, activeReviewItem.id]);
      setActiveReviewItem(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to submit review.';
      setError(msg);
    }
  };

  if (loading) {
    return <div className="p-16 text-center text-muted font-bold transition-colors">Loading official order details from database...</div>;
  }

  if (!order) {
    return (
      <div className="rounded-2xl bg-surface border border-border p-12 text-center space-y-4 transition-colors shadow-sm">
        <h3 className="text-lg font-black text-foreground transition-colors">Order Not Found</h3>
        <p className="text-xs text-muted transition-colors">
          Order number <span className="font-mono font-bold text-foreground">{orderNumber}</span> could not be located in your local order history.
        </p>
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-foreground underline transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Order History</span>
        </Link>
      </div>
    );
  }

  const canReview = order.status === 'fulfilled' || order.status === 'shipped' || order.status === 'delivered';

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4 transition-colors">
        <div>
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-muted hover:text-foreground mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Orders</span>
          </Link>
          <h2 className="text-2xl font-black uppercase tracking-wider text-foreground transition-colors">
            Order {order.orderNumber}
          </h2>
          <p className="text-xs text-muted transition-colors">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="text-left sm:text-right">
          <OrderStatusBadge status={order.status} size="md" />
        </div>
      </div>

      {/* Fulfillment Timeline Tracker */}
      <OrderStatusTimeline status={order.status} createdAt={order.createdAt} />

      {/* Items & Verification Table */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted transition-colors">
          Fulfilled Line Items &amp; TAG Registry
        </h3>

        <div className="divide-y divide-border border border-border rounded-2xl bg-surface overflow-hidden transition-colors shadow-sm">
          {order.items.map((item) => (
            <div key={item.id} className="p-5 space-y-3 transition-colors">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-foreground text-sm transition-colors">{item.productName}</div>
                  <div className="text-xs text-muted transition-colors">
                    Size: {item.size || 'ONE SIZE'} &bull; SKU: <span className="font-mono text-foreground">{item.sku}</span> &bull; Qty: {item.quantity}
                  </div>
                </div>

                <div className="font-black text-foreground text-sm transition-colors">
                  {formatTHB(item.totalPrice)}
                </div>
              </div>

              {item.authenticityTagCode && (
                <div className="p-3.5 rounded-xl bg-background border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs transition-colors">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                    <div>
                      <span className="font-bold text-foreground block transition-colors">
                        Assigned Authenticity TAG: <span className="font-mono">{item.authenticityTagCode}</span>
                      </span>
                      <span className="text-muted text-[11px] transition-colors">
                        Serial Registry: {item.serialNumber}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/verify/${item.authenticityTagCode}`}
                    className="px-3.5 py-1.5 rounded-lg bg-primary text-primary-foreground font-bold text-[10px] uppercase tracking-wider inline-flex items-center gap-1 hover:opacity-90 transition-opacity"
                  >
                    <span>Verify Code</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              )}

              {/* Reviews Button Section */}
              {canReview && (
                <div className="mt-3 pt-3 border-t border-border flex items-center justify-between transition-colors">
                  <span className="text-[10px] text-muted font-bold uppercase tracking-wider transition-colors">Product Review</span>
                  {hasReviewed(item.id) ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Reviewed</span>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const matchingReview = reviews.find(r => r.orderItemId === item.id);
                          const ratingVal = matchingReview?.rating || 0;
                          return (
                            <Star 
                              key={star} 
                              className={`w-3 h-3 ${
                                star <= ratingVal ? 'text-foreground fill-foreground' : 'text-neutral-300 dark:text-neutral-700'
                              }`} 
                            />
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveReviewItem(item);
                        setRating(5);
                        setComment('');
                        setError(null);
                      }}
                      className="px-3.5 py-1.5 rounded-lg border border-border bg-background text-foreground font-bold text-[10px] uppercase tracking-wider hover:bg-surface transition-colors"
                    >
                      Write a Review
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Financial & Shipping Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 rounded-2xl bg-surface border border-border p-6 sm:p-8 text-xs transition-colors shadow-sm">
        <div className="space-y-1.5">
          <span className="font-bold uppercase tracking-wider text-muted block mb-2 transition-colors">
            Shipping Address
          </span>
          <div className="font-bold text-foreground text-sm transition-colors">{order.shippingAddress.fullName}</div>
          <div className="text-muted transition-colors leading-relaxed">
            {order.shippingAddress.street}, {order.shippingAddress.city} {order.shippingAddress.postalCode}
          </div>
          <div className="text-muted pt-1 transition-colors">Phone: {order.shippingAddress.phone}</div>
        </div>

        <div className="space-y-2.5">
          <span className="font-bold uppercase tracking-wider text-muted block mb-2 transition-colors">
            Order Breakdown
          </span>
          <div className="flex justify-between text-muted transition-colors">
            <span>Subtotal</span>
            <span className="font-bold text-foreground transition-colors">{formatTHB(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-muted transition-colors">
            <span>Shipping</span>
            <span className="font-bold text-foreground transition-colors">
              {order.shippingFee === 0 ? 'FREE' : formatTHB(order.shippingFee)}
            </span>
          </div>
          <div className="flex justify-between pt-3 border-t border-border text-sm font-black text-foreground transition-colors">
            <span>Total Amount</span>
            <span>{formatTHB(order.totalAmount)}</span>
          </div>
        </div>
      </div>

      {/* Review Modal Overlay */}
      {activeReviewItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl transition-colors">
            <div className="border-b border-border pb-3 flex items-center justify-between transition-colors">
              <h3 className="text-sm font-black uppercase tracking-wider text-foreground transition-colors">
                Review Merchandise
              </h3>
              <button 
                type="button" 
                onClick={() => setActiveReviewItem(null)}
                className="text-muted hover:text-foreground font-bold text-xs uppercase transition-colors"
              >
                Close
              </button>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted transition-colors">Item Name</span>
              <div className="text-sm font-bold text-foreground transition-colors">{activeReviewItem.productName}</div>
              <div className="text-xs text-muted transition-colors">SKU: {activeReviewItem.sku}</div>
            </div>

            {/* Stars selection */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted block transition-colors">Select Rating *</span>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-neutral-300 hover:scale-110 transition-transform"
                  >
                    <Star 
                      className={`w-8 h-8 ${
                        star <= rating 
                          ? 'text-foreground fill-foreground' 
                          : 'text-neutral-300 dark:text-neutral-700'
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment area */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1 transition-colors">
                Your Review *
              </label>
              <textarea
                required
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="บอกความรู้สึกเกี่ยวกับสินค้าชิ้นนี้ ลิขสิทธิ์แท้ เนื้อผ้า คุณภาพการผลิต..."
                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-sm font-medium text-foreground placeholder:text-muted focus:outline-none focus:border-foreground transition-colors resize-none"
              />
            </div>

            {error && (
              <div className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5 bg-rose-50 dark:bg-rose-950/40 p-3 rounded-xl border border-rose-200 dark:border-rose-800/60">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveReviewItem(null)}
                className="px-4 py-2.5 rounded-xl border border-border bg-background text-foreground font-bold text-xs uppercase tracking-wider hover:bg-surface transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitReview}
                className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
