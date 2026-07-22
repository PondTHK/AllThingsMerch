'use server';

import { getSupabaseServerClient } from '@/lib/supabase/server';
import { getAdminServices } from '@/lib/admin/container';
import { CreateBrandInput } from '@/lib/admin/ports/outbound/IAdminBrandRepository';
import { revalidatePath } from 'next/cache';

async function initAdminServices() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error('Supabase client not initialized');
  return getAdminServices(supabase);
}

export async function createBrandAction(input: CreateBrandInput) {
  try {
    const services = await initAdminServices();
    await services.brands.createBrand(input);
    revalidatePath('/admin/brands');
    return { success: true };
  } catch (error: unknown) {
    const err = error as { message?: string } | null;
    return { success: false, error: err?.message || 'Failed to create brand' };
  }
}

export async function toggleBrandActiveAction(id: string) {
  try {
    const services = await initAdminServices();
    await services.brands.toggleBrandActive(id);
    revalidatePath('/admin/brands');
    return { success: true };
  } catch (error: unknown) {
    const err = error as { message?: string } | null;
    return { success: false, error: err?.message || 'Failed to toggle brand status' };
  }
}
