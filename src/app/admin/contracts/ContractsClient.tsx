'use client';

import React, { useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { Plus, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Contract = any; 

export function ContractsClient({ initialContracts }: { initialContracts: Contract[] }) {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const [contracts, setContracts] = useState<Contract[]>(initialContracts);

  const [showForm, setShowForm] = useState(false);
  const [holderName, setHolderName] = useState('');
  const [contractReference, setContractReference] = useState('');
  const [royaltyRate, setRoyaltyRate] = useState('12.5');
  const [startsAt, setStartsAt] = useState('2026-01-01');
  const [expiresAt, setExpiresAt] = useState('2027-12-31');
  const [createdMsg, setCreatedMsg] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!holderName.trim() || !contractReference.trim() || !supabase) return;

    setIsLoading(true);

    try {
      // 1. Insert License Holder first (simplified since we only ask for name)
      const { data: newHolder, error: holderError } = await supabase
        .from('license_holders')
        .insert({
          name: holderName.trim(),
          status: 'active',
        })
        .select()
        .single();

      if (holderError) throw holderError;

      // 2. Insert License Contract
      const parsedRoyalty = parseFloat(royaltyRate) || 10;
      const { data: newContract, error: contractError } = await supabase
        .from('license_contracts')
        .insert({
          license_holder_id: newHolder.id,
          contract_reference: contractReference.trim().toUpperCase(),
          royalty_rate: parsedRoyalty,
          starts_at: startsAt,
          expires_at: expiresAt,
          status: 'active',
        })
        .select()
        .single();

      if (contractError) {
        await supabase.from('license_holders').delete().eq('id', newHolder.id);
        throw contractError;
      }

      // Optimistic Update
      setContracts([{ ...newContract, license_holders: { name: newHolder.name } }, ...contracts]);

      setHolderName('');
      setContractReference('');
      setShowForm(false);
      setCreatedMsg(true);
      setTimeout(() => setCreatedMsg(false), 3000);
      router.refresh();
    } catch (error) {
      console.error('Error creating contract:', error);
      alert('Failed to create contract.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <div>
          <h2 className="text-xl font-black uppercase tracking-wider text-black">
            IP Licensing Contracts &amp; Royalties
          </h2>
          <p className="text-xs text-neutral-600 mt-1">
            Manage intellectual property agreements and automated royalty snapshot percentages.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2.5 rounded-xl bg-black text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-neutral-800 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New License Agreement</span>
        </button>
      </div>

      {createdMsg && (
        <div className="p-4 rounded-xl bg-neutral-100 border border-black flex items-center gap-2 text-xs font-bold text-black">
          <Check className="w-4 h-4" />
          <span>New IP licensing agreement added successfully.</span>
        </div>
      )}

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="p-6 rounded-2xl bg-neutral-100 border border-neutral-300 space-y-4 max-w-2xl"
        >
          <h3 className="text-xs font-bold uppercase tracking-wider text-black">
            License Contract Parameters
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                IP Holder Legal Name *
              </label>
              <input
                type="text"
                required
                value={holderName}
                onChange={(e) => setHolderName(e.target.value)}
                placeholder="Cactus Jack IP Ltd"
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs font-medium text-black focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Contract Reference Code *
              </label>
              <input
                type="text"
                required
                value={contractReference}
                onChange={(e) => setContractReference(e.target.value)}
                placeholder="CJ-2026-LIC-01"
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs font-mono uppercase text-black focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Royalty Percentage (%) *
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={royaltyRate}
                onChange={(e) => setRoyaltyRate(e.target.value)}
                placeholder="12.5"
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs font-medium text-black focus:outline-none focus:border-black"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  required
                  value={startsAt}
                  onChange={(e) => setStartsAt(e.target.value)}
                  className="w-full px-2.5 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs text-black focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  required
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full px-2.5 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs text-black focus:outline-none focus:border-black"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50"
            >
              {isLoading ? 'Registering...' : 'Register Contract'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2.5 rounded-xl border border-neutral-300 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-neutral-200"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Contracts Table */}
      <div className="border border-neutral-200 rounded-2xl bg-white overflow-hidden">
        <div className="divide-y divide-neutral-200">
          {contracts.map((contract) => (
            <div
              key={contract.id}
              className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-neutral-50 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-black text-sm">{contract.license_holders?.name || 'Unknown'}</span>
                  <span className="px-2 py-0.5 rounded bg-black text-white text-[10px] font-bold uppercase tracking-wider">
                    {contract.status}
                  </span>
                </div>
                <div className="text-xs text-neutral-500 mt-1 font-mono">
                  Ref: <span className="font-bold text-black">{contract.contract_reference}</span> &bull; Period: {contract.starts_at} &rarr; {contract.expires_at}
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 block">
                  Royalty Rate
                </span>
                <span className="font-black text-black text-lg">
                  {Number(contract.royalty_rate).toFixed(2)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
