/* eslint-disable @typescript-eslint/no-explicit-any */
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
  } catch (error: any) {
    console.error('Failed to update order status:', error);
    return { success: false, error: error.message || 'Failed to update order status' };
  }
}
