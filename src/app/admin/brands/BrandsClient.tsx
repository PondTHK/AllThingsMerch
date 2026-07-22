'use client';

import React, { useState } from 'react';
import { Plus, Check, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/admin/Modal';
import { createBrandAction, toggleBrandActiveAction } from './actions';

const brandSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
  description: z.string().optional(),
});
type BrandFormValues = z.infer<typeof brandSchema>;

export interface BrandDto {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

export function BrandsClient({
  initialBrands,
  currentPage,
  totalPages,
  totalCount,
}: {
  initialBrands: BrandDto[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
}) {
  const router = useRouter();
  const [brands, setBrands] = useState<BrandDto[]>(initialBrands);
  const [showModal, setShowModal] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BrandFormValues>({ resolver: zodResolver(brandSchema) });

  const handleNameChange = (val: string) => {
    setValue('name', val);
    setValue(
      'slug',
      val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    );
  };

  const onSubmit = async (values: BrandFormValues) => {
    const result = await createBrandAction(values);
    if (result.success) {
      reset();
      setShowModal(false);
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 3000);
      router.refresh();
    } else {
      alert(result.error || 'Failed to create brand.');
    }
  };

  const toggleStatus = async (brandId: string, isActive: boolean) => {
    const previous = [...brands];
    setBrands((prev) => prev.map((b) => (b.id === brandId ? { ...b, isActive: !isActive } : b)));
    const result = await toggleBrandActiveAction(brandId);
    if (!result.success) {
      alert(result.error);
      setBrands(previous);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <div>
          <h2 className="text-xl font-black uppercase tracking-wider text-black flex items-center gap-2">
            <ShieldCheck className="w-6 h-6" />
            Licensed Brands
          </h2>
          <p className="text-xs text-neutral-600 mt-1">Manage official IP partners and merchandising brands.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-black text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-neutral-800 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Brand</span>
        </button>
      </div>

      {savedMsg && (
        <div className="p-4 rounded-xl bg-neutral-100 border border-black flex items-center gap-2 text-xs font-bold text-black">
          <Check className="w-4 h-4" />
          <span>New brand created successfully.</span>
        </div>
      )}

      {brands.length === 0 ? (
        <div className="rounded-2xl bg-neutral-100 border border-neutral-200 p-12 text-center space-y-3">
          <ShieldCheck className="w-10 h-10 mx-auto text-neutral-400" />
          <h3 className="text-base font-bold text-black">No Brands Found</h3>
        </div>
      ) : (
        <div className="border border-neutral-200 rounded-2xl bg-white overflow-hidden">
          <div className="divide-y divide-neutral-200">
            {brands.map((brand) => (
              <div
                key={brand.id}
                className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-neutral-50 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-black text-sm">{brand.name}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        brand.isActive ? 'bg-black text-white' : 'bg-neutral-300 text-neutral-700'
                      }`}
                    >
                      {brand.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-500 mt-1 font-mono">Slug: {brand.slug}</div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleStatus(brand.id, brand.isActive)}
                  className="px-3.5 py-2 rounded-xl border border-neutral-300 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-neutral-100 flex items-center gap-1.5"
                >
                  {brand.isActive ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Disable</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 text-black" />
                      <span>Enable</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-neutral-200 pt-4">
          <p className="text-xs text-neutral-500">
            Showing page {currentPage} of {totalPages} ({totalCount} total brands)
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push(`/admin/brands?page=${currentPage - 1}`)}
              disabled={currentPage <= 1}
              className="px-3 py-1.5 rounded-xl border border-neutral-300 bg-white text-xs font-bold disabled:opacity-50 hover:bg-neutral-50"
            >
              Previous
            </button>
            <button
              onClick={() => router.push(`/admin/brands?page=${currentPage + 1}`)}
              disabled={currentPage >= totalPages}
              className="px-3 py-1.5 rounded-xl border border-neutral-300 bg-white text-xs font-bold disabled:opacity-50 hover:bg-neutral-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); reset(); }} title="New Brand">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
              Brand Name *
            </label>
            <input
              type="text"
              {...register('name')}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Red Bull Racing"
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-xs font-medium text-black focus:outline-none focus:border-black"
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
              URL Slug *
            </label>
            <input
              type="text"
              {...register('slug')}
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-xs font-mono text-black focus:outline-none focus:border-black"
            />
            {errors.slug && <p className="mt-1 text-xs text-red-600">{errors.slug.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              {...register('description')}
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-black focus:outline-none focus:border-black"
            />
          </div>
          <div className="flex items-center gap-3 pt-2 border-t border-neutral-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Brand'}
            </button>
            <button
              type="button"
              onClick={() => { setShowModal(false); reset(); }}
              className="px-6 py-2.5 rounded-xl border border-neutral-300 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-neutral-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
