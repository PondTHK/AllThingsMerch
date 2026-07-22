/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { getSupabaseServerClient } from '@/lib/supabase/server';
import { getAdminServices } from '@/lib/admin/container';
import { CreateCategoryInput } from '@/lib/admin/ports/outbound/IAdminCategoryRepository';
import { revalidatePath } from 'next/cache';

async function initAdminServices() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error('Supabase client not initialized');
  return getAdminServices(supabase);
}

export async function createCategoryAction(input: CreateCategoryInput) {
  try {
    const services = await initAdminServices();
    await services.categories.createCategory(input);
    revalidatePath('/admin/categories');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create category' };
  }
}

export async function deleteCategoryAction(id: string) {
  try {
    const services = await initAdminServices();
    await services.categories.deleteCategory(id);
    revalidatePath('/admin/categories');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete category' };
  }
}
