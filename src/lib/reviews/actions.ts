'use server';

import { getSupabaseServerClient } from '@/lib/supabase/server';
import { Review } from '@/types';
import { revalidatePath } from 'next/cache';

export async function getProductReviewsAction(productId: string): Promise<Review[]> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('reviews')
    .select('*, order_items(product_name)')
    .eq('product_id', productId)
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error || !data) {
    console.error('Failed to fetch reviews for product:', error);
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((row: any) => ({
    id: row.id,
    productId: row.product_id,
    userId: row.user_id,
    orderItemId: row.order_item_id,
    rating: Number(row.rating),
    comment: row.comment || '',
    status: (row.status || 'published') as 'pending' | 'published' | 'hidden',
    createdAt: row.created_at,
    userName: 'Verified Collector',
    productName: row.order_items?.product_name || undefined,
  }));
}

export async function submitProductReviewAction(data: {
  productId: string;
  orderItemId: string;
  rating: number;
  comment: string;
  userName?: string;
  productName?: string;
}): Promise<Review> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error('Supabase client not configured.');

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be logged in to submit a review.');
  }

  // Check if review already exists for this order item
  const { data: existing } = await supabase
    .from('reviews')
    .select('id')
    .eq('order_item_id', data.orderItemId)
    .single();

  if (existing) {
    throw new Error('You have already reviewed this item.');
  }

  const { data: newRow, error } = await supabase
    .from('reviews')
    .insert({
      product_id: data.productId,
      user_id: user.id,
      order_item_id: data.orderItemId,
      rating: data.rating,
      comment: data.comment.trim(),
      status: 'published',
    })
    .select('*, order_items(product_name)')
    .single();

  if (error || !newRow) {
    throw new Error(`Failed to submit review: ${error?.message}`);
  }

  revalidatePath(`/products/${data.productId}`);
  revalidatePath('/account/orders');

  return {
    id: newRow.id,
    productId: newRow.product_id,
    userId: newRow.user_id,
    orderItemId: newRow.order_item_id,
    rating: Number(newRow.rating),
    comment: newRow.comment,
    status: newRow.status as 'pending' | 'published' | 'hidden',
    createdAt: newRow.created_at,
    userName: data.userName || 'Verified Collector',
    productName: data.productName || newRow.order_items?.product_name || undefined,
  };
}

export async function getUserReviewsAction(): Promise<Review[]> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return [];

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('reviews')
    .select('*, order_items(product_name)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error || !data) {
    console.error('Failed to fetch user reviews:', error);
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((row: any) => ({
    id: row.id,
    productId: row.product_id,
    userId: row.user_id,
    orderItemId: row.order_item_id,
    rating: Number(row.rating),
    comment: row.comment || '',
    status: (row.status || 'published') as 'pending' | 'published' | 'hidden',
    createdAt: row.created_at,
    userName: 'Verified Collector',
    productName: row.order_items?.product_name || undefined,
  }));
}
