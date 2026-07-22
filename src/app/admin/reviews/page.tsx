import React from 'react';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { ReviewsClient, ReviewDto } from './ReviewsClient';

export default async function AdminReviewsPage() {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return <div className="p-12 text-center text-neutral-500">Supabase is not configured.</div>;
  }

  // Fetch reviews with product name and user metadata via join
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      id,
      rating,
      comment,
      status,
      created_at,
      products ( name ),
      user_id
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch reviews:', error);
  }

  // Fetch user metadata (display names) for each unique user_id
  const userIds = [...new Set((data ?? []).map((r) => r.user_id))];
  const userNameMap: Record<string, string> = {};

  if (userIds.length > 0) {
    // Try to get display names from auth.users via admin API (uses service role)
    // Fallback: show "Customer" if not available
    try {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, username')
        .in('id', userIds);

      if (profiles) {
        for (const p of profiles) {
          userNameMap[p.id] = p.full_name || p.username || 'Customer';
        }
      }
    } catch {
      // profiles table may not exist — that's okay
    }
  }

  const reviewsDto: ReviewDto[] = (data ?? []).map((r) => ({
    id: r.id,
    rating: r.rating,
    comment: r.comment,
    status: r.status as ReviewDto['status'],
    createdAt: r.created_at,
    productName: (r.products as any)?.name ?? 'Product',
    userName: userNameMap[r.user_id] ?? null,
  }));

  return <ReviewsClient initialReviews={reviewsDto} />;
}
