'use server';

import { getSupabaseServerClient } from '@/lib/supabase/server';
import { getAdminServices } from '@/lib/admin/container';
import { revalidatePath } from 'next/cache';

async function initAdminServices() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error('Supabase client not initialized');
  return getAdminServices(supabase);
}

export async function adjustStockAction(variantId: string, deltaAmount: number) {
  try {
    const services = await initAdminServices();
    
    // The Use Case will automatically record the stock_movement
    await services.inventory.adjustStock(variantId, deltaAmount);
    
    revalidatePath('/admin/inventory');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to adjust stock:', error);
    return { success: false, error: error.message || 'Failed to adjust stock' };
  }
}

export async function setStockAbsoluteAction(variantId: string, newQty: number) {
  try {
    const services = await initAdminServices();
    
    // The Use Case will automatically record the stock_movement
    await services.inventory.setStock(variantId, newQty);
    
    revalidatePath('/admin/inventory');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to set absolute stock:', error);
    return { success: false, error: error.message || 'Failed to set stock' };
  }
}
