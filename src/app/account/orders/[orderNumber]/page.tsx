'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { getUserOrderByNumberAction } from '@/app/account/orders/actions';
import { Order, OrderItem } from '@/types';
import { formatTHB } from '@/lib/money';
import { ArrowLeft, ShieldCheck, ExternalLink, Star, AlertCircle } from 'lucide-react';
import { useReviewStore } from '@/lib/reviews/useReviewStore';
import { OrderItem } from '@/types';

export default function AccountOrderDetailPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = use(params);
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserOrderByNumberAction(orderNumber).then(data => {
      setOrder(data);
      setLoading(false);
    });
  }, [orderNumber]);

  const [activeReviewItem, setActiveReviewItem] = useState<OrderItem | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const reviews = useReviewStore((s) => s.reviews);
  const addReview = useReviewStore((s) => s.addReview);

  const hasReviewed = (orderItemId: string) => {
    return reviews.some((r) => r.orderItemId === orderItemId);
  };

  const handleSubmitReview = () => {
    if (!activeReviewItem || !order) return;
    if (!comment.trim()) {
      setError('Please write a review comment.');
      return;
    }
    
    if (hasReviewed(activeReviewItem.id)) {
      setError('You have already reviewed this item.');
      return;
    }

    addReview({
      productId: activeReviewItem.productId,
      userId: order.shippingAddress.email || 'collector-demo-id',
      orderItemId: activeReviewItem.id,
      rating,
      comment: comment.trim(),
      status: 'published',
      userName: order.shippingAddress.fullName || 'Verified Buyer',
      productName: activeReviewItem.productName,
    });

    setActiveReviewItem(null);
  };

  if (loading) {
    return <div className="p-16 text-center text-neutral-500">Loading Order Details...</div>;
  }

  if (!order) {
    return (
      <div className="rounded-2xl bg-neutral-100 border border-neutral-200 p-12 text-center space-y-4">
        <h3 className="text-lg font-black text-black">Order Not Found</h3>
        <p className="text-xs text-neutral-600">
          Order number <span className="font-mono font-bold">{orderNumber}</span> could not be located in your order history.
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

              {/* Reviews Button Section */}
              {order.status === 'fulfilled' && (
                <div className="mt-2 pt-2 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Product Review</span>
                  {hasReviewed(item.id) ? (
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider font-semibold">Reviewed</span>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const matchingReview = reviews.find(r => r.orderItemId === item.id);
                          const ratingVal = matchingReview?.rating || 0;
                          return (
                            <Star 
                              key={star} 
                              className={`w-3 h-3 ${
                                star <= ratingVal ? 'text-black fill-black' : 'text-neutral-300'
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
                      className="px-3 py-1.5 rounded-lg border border-neutral-300 bg-white text-black font-bold text-[10px] uppercase tracking-wider hover:bg-neutral-100 transition-colors"
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

      {/* Review Modal Overlay */}
      {activeReviewItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-200 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl">
            <div className="border-b border-neutral-200 pb-3 flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-wider text-black">
                Review Merchandise
              </h3>
              <button 
                type="button" 
                onClick={() => setActiveReviewItem(null)}
                className="text-neutral-400 hover:text-black font-bold text-xs uppercase"
              >
                Close
              </button>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500">Item Name</span>
              <div className="text-sm font-bold text-black">{activeReviewItem.productName}</div>
              <div className="text-xs text-neutral-500">SKU: {activeReviewItem.sku}</div>
            </div>

            {/* Stars selection */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">Select Rating *</span>
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
                          ? 'text-black fill-black' 
                          : 'text-neutral-300'
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Comment area */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block mb-1">
                Your Review *
              </label>
              <textarea
                required
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="บอกความรู้สึกเกี่ยวกับสินค้าชิ้นนี้ ลิขสิทธิ์แท้ เนื้อผ้า คุณภาพการผลิต..."
                className="w-full px-4 py-3 rounded-xl bg-neutral-100 border border-neutral-300 text-sm font-medium text-black focus:outline-none focus:border-black focus:bg-white resize-none"
              />
            </div>

            {error && (
              <div className="text-xs font-bold text-red-650 flex items-center gap-1.5 bg-red-50 p-3 rounded-xl border border-red-200">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-650" />
                <span>{error}</span>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveReviewItem(null)}
                className="px-4 py-2.5 rounded-xl border border-neutral-300 bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-neutral-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitReview}
                className="px-6 py-2.5 rounded-xl bg-black text-white font-bold text-xs uppercase tracking-wider hover:bg-neutral-800"
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
