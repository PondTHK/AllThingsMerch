/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/admin/Modal';
import { createContractAction } from './actions';

const contractSchema = z.object({
  holderName: z.string().min(2, 'Holder name is required'),
  contractReference: z
    .string()
    .min(3, 'Contract reference is required')
    .regex(/^[A-Z0-9\-]+$/, 'Reference must be uppercase letters, numbers, and hyphens only'),
  royaltyRate: z
    .number()
    .min(0.1, 'Rate must be greater than 0')
    .max(100, 'Rate cannot exceed 100%'),
  startsAt: z.string().min(1, 'Start date is required'),
  expiresAt: z.string().min(1, 'Expiry date is required'),
}).refine((d) => d.expiresAt > d.startsAt, {
  message: 'Expiry date must be after start date',
  path: ['expiresAt'],
});

type ContractFormValues = z.infer<typeof contractSchema>;

export interface ContractDto {
  id: string;
  holderName: string;
  contractReference: string;
  royaltyRate: number;
  startsAt: string;
  expiresAt: string;
  status: string;
}

export function ContractsClient({ initialContracts }: { initialContracts: ContractDto[] }) {
  const [contracts, setContracts] = useState<ContractDto[]>(initialContracts);
  const [showModal, setShowModal] = useState(false);
  const [createdMsg, setCreatedMsg] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContractFormValues>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      royaltyRate: 12.5,
      startsAt: '2026-01-01',
      expiresAt: '2027-12-31',
    },
  });

  const onSubmit = async (values: ContractFormValues) => {
    const result = await createContractAction({
      holderName: values.holderName,
      contractReference: values.contractReference.toUpperCase(),
      royaltyRate: values.royaltyRate,
      startsAt: values.startsAt,
      expiresAt: values.expiresAt,
    });

    if (result.success) {
      reset();
      setShowModal(false);
      setCreatedMsg(true);
      setTimeout(() => setCreatedMsg(false), 3000);
    } else {
      alert(result.error || 'Failed to create contract.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            IP Licensing Contracts &amp; Royalties
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage intellectual property agreements and automated royalty snapshot percentages.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600/90 backdrop-blur-md text-white text-sm font-medium flex items-center gap-2 hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-600/20 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 border border-blue-500/50"
        >
          <Plus className="w-4 h-4" />
          <span>New License Agreement</span>
        </button>
      </div>

      {createdMsg && (
        <div className="p-4 rounded-xl bg-green-50/80 backdrop-blur-md border border-green-200/60 flex items-center gap-2 text-sm font-medium text-green-800 shadow-sm">
          <Check className="w-4 h-4" />
          <span>New IP licensing agreement added successfully.</span>
        </div>
      )}

      <div className="border border-white/80 rounded-2xl bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        <div className="divide-y divide-slate-200/50">
          {contracts.map((contract) => (
            <div
              key={contract.id}
              className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-white/60 transition-colors duration-300"
            >
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-slate-900">{contract.holderName}</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">
                    {contract.status}
                  </span>
                </div>
                <div className="text-sm text-slate-500 mt-1">
                  Ref: <span className="font-mono text-slate-600">{contract.contractReference}</span> &bull; Period:{' '}
                  {contract.startsAt} &rarr; {contract.expiresAt}
                </div>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-xs font-medium text-slate-500 block">Royalty Rate</span>
                <span className="font-bold text-slate-900 text-lg">{Number(contract.royaltyRate).toFixed(2)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); reset(); }} title="New License Agreement" size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                IP Holder Legal Name *
              </label>
              <input
                type="text"
                {...register('holderName')}
                placeholder="Cactus Jack IP Ltd"
                className="w-full px-4 py-2.5 rounded-xl bg-white/50 backdrop-blur-sm border border-slate-200/60 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 focus:bg-white transition-all duration-300"
              />
              {errors.holderName && <p className="mt-1 text-xs text-red-600">{errors.holderName.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Contract Reference Code *
              </label>
              <input
                type="text"
                {...register('contractReference')}
                placeholder="CJ-2026-LIC-01"
                className="w-full px-4 py-2.5 rounded-xl bg-white/50 backdrop-blur-sm border border-slate-200/60 text-sm font-mono uppercase text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 focus:bg-white transition-all duration-300"
              />
              {errors.contractReference && (
                <p className="mt-1 text-xs text-red-600">{errors.contractReference.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Royalty Rate (%) *
              </label>
              <input
                type="number"
                step="0.1"
                {...register('royaltyRate', { valueAsNumber: true })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/50 backdrop-blur-sm border border-slate-200/60 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 focus:bg-white transition-all duration-300"
              />
              {errors.royaltyRate && <p className="mt-1 text-xs text-red-600">{errors.royaltyRate.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  {...register('startsAt')}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/50 backdrop-blur-sm border border-slate-200/60 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 focus:bg-white transition-all duration-300"
                />
                {errors.startsAt && <p className="mt-1 text-xs text-red-600">{errors.startsAt.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Expiry Date *
                </label>
                <input
                  type="date"
                  {...register('expiresAt')}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/50 backdrop-blur-sm border border-slate-200/60 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 focus:bg-white transition-all duration-300"
                />
                {errors.expiresAt && <p className="mt-1 text-xs text-red-600">{errors.expiresAt.message}</p>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-4 border-t border-slate-200/50">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-blue-600/90 backdrop-blur-md text-white text-sm font-medium hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-600/20 hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 transition-all duration-300 border border-blue-500/50"
            >
              {isSubmitting ? 'Registering...' : 'Register Contract'}
            </button>
            <button
              type="button"
              onClick={() => { setShowModal(false); reset(); }}
              className="px-6 py-2.5 rounded-xl border border-white/80 bg-white/50 backdrop-blur-md text-slate-700 text-sm font-medium hover:bg-white hover:shadow-sm hover:-translate-y-0.5 active:scale-95 transition-all duration-300 shadow-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
