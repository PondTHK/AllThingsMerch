'use server';

import { getSupabaseServerClient } from '@/lib/supabase/server';
import { getAdminServices } from '@/lib/admin/container';
import { revalidatePath } from 'next/cache';

async function initAdminServices() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) throw new Error('Supabase client not initialized');
  return getAdminServices(supabase);
}

export async function createContractAction(input: {
  holderName: string;
  contractReference: string;
  royaltyRate: number;
  startsAt: string;
  expiresAt: string;
}) {
  try {
    const services = await initAdminServices();
    const supabase = await getSupabaseServerClient();
    if (!supabase) throw new Error('Supabase client not initialized');

    // Create the license holder first (raw Supabase — outside domain scope for now)
    const { data: newHolder, error: holderError } = await supabase
      .from('license_holders')
      .insert({ name: input.holderName.trim(), status: 'active' })
      .select()
      .single();

    if (holderError) throw new Error(holderError.message);

    // Create the contract via Use Case
    await services.contracts.createContract({
      licenseHolderId: newHolder.id,
      holderName: input.holderName.trim(),
      contractReference: input.contractReference.trim().toUpperCase(),
      royaltyRate: input.royaltyRate,
      startsAt: input.startsAt,
      expiresAt: input.expiresAt,
    });

    revalidatePath('/admin/contracts');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create contract' };
  }
}
