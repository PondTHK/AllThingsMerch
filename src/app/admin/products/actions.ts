'use server';

import { getSupabaseServerClient } from '@/lib/supabase/server';
import { getAdminServices } from '@/lib/admin/container';
import { CreateProductInput } from '@/lib/admin/ports/outbound/IAdminProductRepository';
import { revalidatePath } from 'next/cache';

async function initAdminServices() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error('Supabase client not initialized');
  return getAdminServices(supabase);
}

export async function createProductAction(input: CreateProductInput) {
  try {
    const services = await initAdminServices();
    // Use Case execution
    await services.products.createProduct(input);
    
    revalidatePath('/admin/products');
    return { success: true };
  } catch (error: unknown) {
    console.error('Failed to create product:', error);
    const err = error as { message?: string } | null;
    return { success: false, error: err?.message || 'Failed to create product' };
  }
}

export async function toggleProductStatusAction(id: string) {
  try {
    const services = await initAdminServices();
    // Use Case execution
    await services.products.toggleProductStatus(id);
    
    revalidatePath('/admin/products');
    return { success: true };
  } catch (error: unknown) {
    console.error('Failed to toggle product status:', error);
    const err = error as { message?: string } | null;
    return { success: false, error: err?.message || 'Failed to toggle product status' };
  }
}
