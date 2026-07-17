import React from 'react';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { ContractsClient } from './ContractsClient';

export default async function AdminContractsPage() {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    return <div className="p-12 text-center text-neutral-500">Supabase is not configured.</div>;
  }

  const { data: contracts } = await supabase
    .from('license_contracts')
    .select('*, license_holders(name)')
    .order('created_at', { ascending: false });

  return <ContractsClient initialContracts={contracts || []} />;
}
