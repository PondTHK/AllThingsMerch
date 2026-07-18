'use server';

import { getSupabaseServerClient } from '@/lib/supabase/server';
import { getAdminServices } from '@/lib/admin/container';
import { TagStatusValue } from '@/lib/admin/domain/entities/AdminTag';
import { revalidatePath } from 'next/cache';

async function initAdminServices() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error('Supabase client not initialized');
  return getAdminServices(supabase);
}

export async function updateTagStatusAction(tagId: string, newStatus: string) {
  try {
    const services = await initAdminServices();
    if (newStatus === 'revoked') {
      await services.tags.revokeTag(tagId);
    } else if (newStatus === 'flagged') {
      await services.tags.flagTag(tagId);
    } else {
      // Use the repo directly for other statuses
      const supabase = await getSupabaseServerClient();
      if (supabase) {
        await supabase.from('authenticity_tags').update({ status: newStatus }).eq('id', tagId);
      }
    }
    revalidatePath('/admin/tags');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update TAG status' };
  }
}
