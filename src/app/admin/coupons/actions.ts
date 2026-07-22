/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { getSupabaseServerClient } from '@/lib/supabase/server';
import { getAdminServices } from '@/lib/admin/container';
import { CreateCouponInput } from '@/lib/admin/ports/outbound/IAdminCouponRepository';
import { revalidatePath } from 'next/cache';

async function initAdminServices() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error('Supabase client not initialized');
  return getAdminServices(supabase);
}

export async function createCouponAction(input: CreateCouponInput) {
  try {
    const services = await initAdminServices();
    await services.coupons.createCoupon(input);
    revalidatePath('/admin/coupons');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.cause?.message || error.cause?.details || error.message || 'Failed to create coupon' };
  }
}

export async function toggleCouponActiveAction(id: string) {
  try {
    const services = await initAdminServices();
    await services.coupons.toggleCouponActive(id);
    revalidatePath('/admin/coupons');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.cause?.message || error.cause?.details || error.message || 'Failed to toggle coupon status' };
  }
}

export async function deleteCouponAction(id: string) {
  try {
    const services = await initAdminServices();
    await services.coupons.deleteCoupon(id);
    revalidatePath('/admin/coupons');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.cause?.message || error.cause?.details || error.message || 'Failed to delete coupon' };
  }
}
