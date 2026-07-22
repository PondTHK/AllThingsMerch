'use server';

import { getSupabaseServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateReviewStatusAction(reviewId: string, status: 'published' | 'hidden' | 'pending') {
  try {
    const supabase = await getSupabaseServerClient();
    if (!supabase) throw new Error('Supabase not configured');

    const { error } = await supabase
      .from('reviews')
      .update({ status })
      .eq('id', reviewId);

    if (error) throw error;

    revalidatePath('/admin/reviews');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to update review status:', error);
    return { success: false, error: error.message || 'Failed to update review status' };
  }
}
