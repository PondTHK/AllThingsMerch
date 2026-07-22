'use client';

import React, { useState } from 'react';
import { Star, AlertCircle } from 'lucide-react';
import { OrderItem } from '@/types';
import { submitProductReviewAction } from '@/lib/reviews/actions';
import { useReviewStore } from '@/lib/reviews/useReviewStore';

interface OrderReviewActionProps {
  item: OrderItem;
  orderStatus: string;
  customerName: string;
}

export function OrderReviewAction({ item, orderStatus, customerName }: OrderReviewActionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Local state to immediately reflect new reviews without waiting for store sync
  const [justReviewed, setJustReviewed] = useState(false);

  const reviews = useReviewStore((s) => s.reviews);
  
  const canReview = orderStatus === 'fulfilled' || orderStatus === 'shipped' || orderStatus === 'delivered';
  const hasReviewed = justReviewed || reviews.some(r => r.orderItemId === item.id);
  const matchingReview = reviews.find(r => r.orderItemId === item.id);
  const displayRating = matchingReview?.rating || rating;

  if (!canReview) return null;

  const handleSubmitReview = async () => {
    if (!comment.trim()) {
      setError('Please write a review comment.');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);

    try {
      await submitProductReviewAction({
        productId: item.productId,
        orderItemId: item.id,
        rating,
        comment: comment.trim(),
        userName: customerName || 'Verified Buyer',
        productName: item.productName,
      });
      setJustReviewed(true);
      setIsModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to submit review.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between transition-colors w-full">
        <span className="text-[10px] text-muted font-bold uppercase tracking-wider transition-colors hidden sm:inline-block">Product Review</span>
        {hasReviewed ? (
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Reviewed</span>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`w-3 h-3 ${
                    star <= displayRating ? 'text-foreground fill-foreground' : 'text-neutral-300 dark:text-neutral-700'
                  }`} 
                />
              ))}
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setRating(5);
              setComment('');
              setError(null);
              setIsModalOpen(true);
            }}
            className="ml-auto px-3 py-1.5 rounded-lg border border-border bg-background text-foreground font-bold text-[10px] uppercase tracking-wider hover:bg-surface transition-colors"
          >
            Write a Review
          </button>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl transition-colors">
            <div className="border-b border-border pb-3 flex items-center justify-between transition-colors">
              <h3 className="text-sm font-black uppercase tracking-wider text-foreground transition-colors">
                Review Merchandise
              </h3>
              <button 
                type="button" 
                onClick={() => !isSubmitting && setIsModalOpen(false)}
                disabled={isSubmitting}
                className="text-muted hover:text-foreground font-bold text-xs uppercase transition-colors"
              >
                Close
              </button>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted transition-colors">Item Name</span>
              <div className="text-sm font-bold text-foreground transition-colors">{item.productName}</div>
              <div className="text-xs text-muted transition-colors">SKU: {item.sku}</div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted block transition-colors">Select Rating *</span>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    disabled={isSubmitting}
                    className="p-1 text-neutral-300 hover:scale-110 transition-transform disabled:opacity-50 disabled:hover:scale-100"
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

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1 transition-colors">
                Your Review *
              </label>
              <textarea
                required
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={isSubmitting}
                placeholder="บอกความรู้สึกเกี่ยวกับสินค้าชิ้นนี้..."
                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-sm font-medium text-foreground placeholder:text-muted focus:outline-none focus:border-foreground transition-colors resize-none disabled:opacity-50"
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
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl border border-border bg-background text-foreground font-bold text-xs uppercase tracking-wider hover:bg-surface transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitReview}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
