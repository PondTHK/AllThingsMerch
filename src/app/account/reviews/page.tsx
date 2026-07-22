import React from 'react';
import Link from 'next/link';
import { getUserReviewsAction } from '@/lib/reviews/actions';
import { Star, MessageSquare } from 'lucide-react';

export default async function AccountReviewsPage() {
  const reviews = await getUserReviewsAction();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4 transition-colors">
        <div>
          <h2 className="text-xl font-black uppercase tracking-wider text-foreground transition-colors">
            My Reviews
          </h2>
          <p className="text-xs text-muted mt-1 transition-colors">
            A history of all product reviews you have submitted.
          </p>
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-muted transition-colors">
          {reviews.length} Reviews
        </span>
      </div>

      {reviews.length === 0 ? (
        <div className="rounded-2xl bg-surface border border-border p-12 text-center space-y-4 transition-colors shadow-sm">
          <MessageSquare className="w-10 h-10 mx-auto text-muted" />
          <h3 className="text-base font-bold text-foreground transition-colors">No Reviews Yet</h3>
          <p className="text-xs text-muted max-w-sm mx-auto transition-colors">
            You haven&apos;t reviewed any products. Go to your Order History to review the items you&apos;ve purchased.
          </p>
          <div>
            <Link
              href="/account/orders"
              className="inline-block px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity shadow-sm"
            >
              View Order History
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-2xl bg-surface border border-border p-6 space-y-4 transition-colors shadow-sm"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4 transition-colors">
                <div>
                  <div className="font-bold text-foreground text-base transition-colors">
                    <Link href={`/products/${review.productId}`} className="hover:underline">
                      {review.productName || 'Unknown Product'}
                    </Link>
                  </div>
                  <span className="text-xs text-muted mt-1 block transition-colors">
                    Reviewed on {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="text-left sm:text-right flex items-center gap-1.5 bg-background border border-border px-3 py-1.5 rounded-xl">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted mr-1">Rating</span>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`w-4 h-4 ${
                          star <= review.rating ? 'text-foreground fill-foreground' : 'text-neutral-300 dark:text-neutral-700'
                        }`} 
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="text-sm text-foreground bg-background border border-border rounded-xl p-4 transition-colors">
                {review.comment}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
