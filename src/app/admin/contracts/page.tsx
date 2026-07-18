import React from 'react';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { getAdminServices } from '@/lib/admin/container';
import { ContractsClient } from './ContractsClient';

export default async function AdminContractsPage() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return <div className="p-12 text-center text-neutral-500">Supabase is not configured.</div>;
  }

  const services = getAdminServices(supabase);
  const contractsList = await services.contracts.getActiveContracts();

  const contractsDto = contractsList.map((c) => ({
    id: c.id,
    holderName: c.holderName,
    contractReference: c.contractReference,
    royaltyRate: c.royaltyRate,
    startsAt: c.startsAt,
    expiresAt: c.expiresAt,
    status: c.status,
  }));

  return <ContractsClient initialContracts={contractsDto} />;
}
