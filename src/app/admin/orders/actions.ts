'use server';

import { getSupabaseServerClient } from '@/lib/supabase/server';
import { getAdminServices } from '@/lib/admin/container';
import { OrderStatusValue } from '@/lib/admin/domain/value-objects/OrderStatus';
import { revalidatePath } from 'next/cache';

async function initAdminServices() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error('Supabase client not initialized');
  return getAdminServices(supabase);
}

export async function updateOrderStatusAction(orderId: string, newStatus: string) {
  try {
    const services = await initAdminServices();
    
    // The Use Case internally handles automatic TAG generation when transitioning to shipped/delivered
    await services.orders.updateOrderStatus(orderId, newStatus as OrderStatusValue);
    
    revalidatePath('/admin/orders');
    return { success: true };
  } catch (error: unknown) {
    console.error('Failed to update order status:', error);
    const err = error as { message?: string } | null;
    return { success: false, error: err?.message || 'Failed to update order status' };
  }
}
