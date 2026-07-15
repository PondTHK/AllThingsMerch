'use client';

import React, { useMemo } from 'react';
import { useReviewStore } from '@/lib/reviews/useReviewStore';
import { 
  Star, 
  MessageSquare, 
  Eye, 
  EyeOff, 
  ShieldAlert, 
  CheckCircle 
} from 'lucide-react';

export default function AdminReviewsPage() {
  const reviews = useReviewStore((state) => state.reviews);
  const updateStatus = useReviewStore((state) => state.updateReviewStatus);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = reviews.length;
    const published = reviews.filter((r) => r.status === 'published');
    const hidden = reviews.filter((r) => r.status === 'hidden');
    const pending = reviews.filter((r) => r.status === 'pending');

    const avgRating = published.length > 0
      ? published.reduce((acc, curr) => acc + curr.rating, 0) / published.length
      : 0;

    return {
      total,
      published: published.length,
      hidden: hidden.length,
      pending: pending.length,
      avgRating,
    };
  }, [reviews]);

  // Sort reviews: pending first, then published/hidden, then by date descending
  const sortedReviews = useMemo(() => {
    return [...reviews].sort((a, b) => {
      // Pending first
      if (a.status === 'pending' && b.status !== 'pending') return -1;
      if (a.status !== 'pending' && b.status === 'pending') return 1;
      
      // Date descending
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [reviews]);

  return (
    <div className="space-y-10">
      {/* Title & Section Description */}
      <div className="border-b border-neutral-200 pb-6">
        <h2 className="text-xl font-black uppercase tracking-wider text-black">
          Customer Reviews &amp; Moderation
        </h2>
        <p className="text-xs text-neutral-500 mt-1">
          Monitor product quality ratings, feedback comments, and regulate review visibility on storefront product catalog pages.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-neutral-100 border border-neutral-200 flex flex-col justify-between h-36">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Reviews</span>
            <MessageSquare className="w-4 h-4 text-black" />
          </div>
          <div>
            <div className="text-2xl font-black text-black">{stats.total}</div>
            <div className="text-[10px] text-neutral-500 font-medium mt-1">
              Registered collector submissions
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-neutral-100 border border-neutral-200 flex flex-col justify-between h-36">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-bold uppercase tracking-wider">Average Rating</span>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`w-3.5 h-3.5 ${
                    star <= Math.round(stats.avgRating) 
                      ? 'text-black fill-black' 
                      : 'text-neutral-300'
                  }`} 
                />
              ))}
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-black">
              {stats.avgRating > 0 ? stats.avgRating.toFixed(2) : '0.00'}
            </div>
            <div className="text-[10px] text-neutral-500 font-medium mt-1">
              Based on {stats.published} published reviews
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-neutral-100 border border-neutral-200 flex flex-col justify-between h-36">
          <div className="flex items-center justify-between text-neutral-500">
            <span className="text-xs font-bold uppercase tracking-wider">Hidden Reviews</span>
            <EyeOff className="w-4 h-4 text-black" />
          </div>
          <div>
            <div className="text-2xl font-black text-black">{stats.hidden}</div>
            <div className="text-[10px] text-neutral-500 font-medium mt-1">
              Flagged/moderated from storefront
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-wider text-black">
          Reviews Ledger
        </h3>

        <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-100 border-b border-neutral-200 text-neutral-500 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-4 font-bold">Date &amp; Customer</th>
                  <th className="py-3.5 px-4 font-bold">Merchandise Product</th>
                  <th className="py-3.5 px-4 font-bold text-center">Stars</th>
                  <th className="py-3.5 px-4 font-bold">Collector Comment</th>
                  <th className="py-3.5 px-4 font-bold text-center">Status</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {sortedReviews.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-neutral-500 font-medium">
                      No customer reviews recorded in the system.
                    </td>
                  </tr>
                ) : (
                  sortedReviews.map((review) => (
                    <tr 
                      key={review.id} 
                      className={`hover:bg-neutral-50 font-medium text-black ${
                        review.status === 'hidden' ? 'bg-neutral-50/50 opacity-75' : ''
                      }`}
                    >
                      {/* Date & Customer */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold">{review.userName || 'Verified Collector'}</div>
                        <div className="text-[10px] text-neutral-500 mt-0.5">
                          {new Date(review.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                      </td>

                      {/* Product Name */}
                      <td className="py-3.5 px-4 font-bold truncate max-w-[150px]">
                        {review.productName || 'Merchandise Drop'}
                      </td>

                      {/* Rating Stars */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`w-3.5 h-3.5 ${
                                star <= review.rating 
                                  ? 'text-black fill-black' 
                                  : 'text-neutral-300'
                              }`} 
                            />
                          ))}
                        </div>
                      </td>

                      {/* Comment */}
                      <td className="py-3.5 px-4 font-normal text-neutral-700 max-w-xs break-words">
                        "{review.comment}"
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                          review.status === 'published'
                            ? 'bg-black text-white'
                            : review.status === 'hidden'
                            ? 'bg-neutral-200 text-neutral-500'
                            : 'bg-neutral-100 text-black border border-neutral-300'
                        }`}>
                          {review.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {review.status === 'published' ? (
                            <button
                              type="button"
                              onClick={() => updateStatus(review.id, 'hidden')}
                              className="px-2.5 py-1.5 rounded-lg border border-neutral-300 bg-white text-black hover:bg-neutral-100 font-bold text-[9px] uppercase tracking-wider inline-flex items-center gap-1 transition-colors"
                              title="Hide from Storefront"
                            >
                              <EyeOff className="w-3 h-3" />
                              <span>Hide</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => updateStatus(review.id, 'published')}
                              className="px-2.5 py-1.5 rounded-lg bg-black text-white hover:bg-neutral-800 font-bold text-[9px] uppercase tracking-wider inline-flex items-center gap-1 transition-colors"
                              title="Approve / Publish"
                            >
                              <Eye className="w-3 h-3" />
                              <span>Publish</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
