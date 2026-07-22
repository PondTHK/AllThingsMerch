'use client';

import React, { useState } from 'react';
import { Plus, Check, Trash2, Ticket } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/admin/Modal';
import { createCouponAction, toggleCouponActiveAction, deleteCouponAction } from './actions';

const couponSchema = z.object({
  code: z
    .string()
    .min(3, 'Code must be at least 3 characters')
    .regex(/^[A-Z0-9]+$/, 'Code must be uppercase letters and numbers only'),
  description: z.string().optional(),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z
    .number()
    .positive('Must be greater than 0'),
  minOrderValue: z.number().min(0).optional(),
  maxGlobalUses: z.number().int().min(1).optional(),
  maxUsesPerUser: z.number().int().min(1).optional(),
  isActive: z.boolean(),
  expiresAt: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.discountType === 'percentage' && data.discountValue > 100) {
    ctx.addIssue({
      code: 'too_big' as const,
      origin: 'number' as const,
      maximum: 100,
      inclusive: true,
      message: 'Percentage discount cannot exceed 100%',
      path: ['discountValue'],
    });
  }
});

type CouponFormValues = z.infer<typeof couponSchema>;

export interface CouponDto {
  id: string;
  code: string;
  description: string | null;
  discountType: string;
  discountValue: number;
  minOrderValue: number | null;
  maxGlobalUses: number | null;
  currentGlobalUses: number;
  maxUsesPerUser: number | null;
  isActive: boolean;
  expiresAt: string | null;
}

export function CouponsClient({
  initialCoupons,
  currentPage,
  totalPages,
  totalCount,
}: {
  initialCoupons: CouponDto[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
}) {
  const router = useRouter();
  const [coupons, setCoupons] = useState<CouponDto[]>(initialCoupons);
  const [showModal, setShowModal] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: { discountType: 'percentage', discountValue: 10, isActive: true },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const discountType = watch('discountType');

  const onSubmit = async (values: CouponFormValues) => {
    const result = await createCouponAction({
      code: values.code.toUpperCase(),
      description: values.description || undefined,
      discountType: values.discountType,
      discountValue: values.discountValue,
      minOrderValue: values.minOrderValue || undefined,
      maxGlobalUses: values.maxGlobalUses || undefined,
      maxUsesPerUser: values.maxUsesPerUser || undefined,
      isActive: values.isActive,
      expiresAt: values.expiresAt || undefined,
    });

    if (result.success) {
      reset();
      setShowModal(false);
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 3000);
      router.refresh();
    } else {
      alert(result.error || 'Failed to create coupon.');
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    const prev = [...coupons];
    setCoupons((p) => p.map((c) => (c.id === id ? { ...c, isActive: !isActive } : c)));
    const result = await toggleCouponActiveAction(id);
    if (!result.success) { alert(result.error); setCoupons(prev); }
  };

  const handleDelete = async (id: string, couponCode: string) => {
    if (!confirm(`Delete coupon "${couponCode}"?`)) return;
    const result = await deleteCouponAction(id);
    if (result.success) setCoupons((p) => p.filter((c) => c.id !== id));
    else alert(result.error);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <div>
          <h2 className="text-xl font-black uppercase tracking-wider text-black flex items-center gap-2">
            <Ticket className="w-6 h-6" />
            Coupon &amp; Discount Manager
          </h2>
          <p className="text-xs text-neutral-600 mt-1">Create and manage promotional discount codes for customers.</p>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-black text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-neutral-800 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Coupon</span>
        </button>
      </div>

      {savedMsg && (
        <div className="p-4 rounded-xl bg-neutral-100 border border-black flex items-center gap-2 text-xs font-bold text-black">
          <Check className="w-4 h-4" />
          <span>Coupon created successfully.</span>
        </div>
      )}

      <div className="border border-neutral-200 rounded-2xl bg-white overflow-hidden">
        <div className="divide-y divide-neutral-200">
          {coupons.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Ticket className="w-10 h-10 mx-auto text-neutral-400" />
              <h3 className="text-base font-bold text-black">No Coupons Found</h3>
              <p className="text-xs text-neutral-600">Create your first discount coupon using the button above.</p>
            </div>
          ) : (
            coupons.map((coupon) => (
              <div
                key={coupon.id}
                className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-neutral-50 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-black text-sm">{coupon.code}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        coupon.isActive ? 'bg-black text-white' : 'bg-neutral-300 text-neutral-700'
                      }`}
                    >
                      {coupon.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-500 mt-1">
                    {coupon.description && <span className="block text-neutral-400 italic mb-0.5">{coupon.description}</span>}
                    {coupon.discountType === 'percentage'
                      ? `${coupon.discountValue}% off`
                      : `฿${coupon.discountValue} off`}
                    {coupon.minOrderValue && <> &bull; Min order: ฿{coupon.minOrderValue}</>}
                    {coupon.expiresAt && <> &bull; Expires: {new Date(coupon.expiresAt).toLocaleDateString()}</>}
                    &bull; Used: {coupon.currentGlobalUses}
                    {coupon.maxGlobalUses ? `/${coupon.maxGlobalUses}` : ''} times
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleActive(coupon.id, coupon.isActive)}
                    className="px-3.5 py-2 rounded-xl border border-neutral-300 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-neutral-100"
                  >
                    {coupon.isActive ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(coupon.id, coupon.code)}
                    className="p-2 rounded-xl border border-red-200 bg-white text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-neutral-200 pt-4">
          <p className="text-xs text-neutral-500">
            Showing page {currentPage} of {totalPages} ({totalCount} total coupons)
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push(`/admin/coupons?page=${currentPage - 1}`)}
              disabled={currentPage <= 1}
              className="px-3 py-1.5 rounded-xl border border-neutral-300 bg-white text-xs font-bold disabled:opacity-50 hover:bg-neutral-50"
            >
              Previous
            </button>
            <button
              onClick={() => router.push(`/admin/coupons?page=${currentPage + 1}`)}
              disabled={currentPage >= totalPages}
              className="px-3 py-1.5 rounded-xl border border-neutral-300 bg-white text-xs font-bold disabled:opacity-50 hover:bg-neutral-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); reset(); }} title="New Coupon">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Code */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
              Coupon Code * <span className="text-neutral-400 font-normal normal-case">(uppercase, no spaces)</span>
            </label>
            <input
              type="text"
              {...register('code')}
              onChange={(e) => {
                const el = e.target;
                el.value = el.value.toUpperCase().replace(/\s/g, '');
                register('code').onChange(e);
              }}
              placeholder="SALE20"
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-xs font-mono text-black focus:outline-none focus:border-black"
            />
            {errors.code && <p className="mt-1 text-xs text-red-600">{errors.code.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
              Description <span className="text-neutral-400 font-normal normal-case">(optional)</span>
            </label>
            <input
              type="text"
              {...register('description')}
              placeholder="e.g. Summer sale coupon"
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-black focus:outline-none focus:border-black"
            />
          </div>

          {/* Discount Type + Value */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Discount Type *
              </label>
              <select
                {...register('discountType')}
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-xs font-medium text-black focus:outline-none focus:border-black"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (THB)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Value ({discountType === 'percentage' ? '%' : 'THB'}) *
              </label>
              <input
                type="number"
                step="0.01"
                {...register('discountValue', { valueAsNumber: true })}
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-xs font-medium text-black focus:outline-none focus:border-black"
              />
              {errors.discountValue && <p className="mt-1 text-xs text-red-600">{errors.discountValue.message}</p>}
            </div>
          </div>

          {/* Min Order Value */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
              Min Order Value (THB) <span className="text-neutral-400 font-normal normal-case">(optional)</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              {...register('minOrderValue', { valueAsNumber: true })}
              placeholder="Leave blank for no minimum"
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-black focus:outline-none focus:border-black"
            />
          </div>

          {/* Max Uses */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Max Uses (Global) <span className="text-neutral-400 font-normal normal-case">(optional)</span>
              </label>
              <input
                type="number"
                min="1"
                {...register('maxGlobalUses', { valueAsNumber: true })}
                placeholder="Unlimited"
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-black focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Max Uses (Per User) <span className="text-neutral-400 font-normal normal-case">(optional)</span>
              </label>
              <input
                type="number"
                min="1"
                {...register('maxUsesPerUser', { valueAsNumber: true })}
                placeholder="Unlimited"
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-black focus:outline-none focus:border-black"
              />
            </div>
          </div>

          {/* Expires At */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
              Expires At <span className="text-neutral-400 font-normal normal-case">(optional)</span>
            </label>
            <input
              type="date"
              {...register('expiresAt')}
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 text-xs text-black focus:outline-none focus:border-black"
            />
          </div>

          {/* Is Active */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="modal-isActive"
              {...register('isActive')}
              defaultChecked
              className="w-4 h-4 rounded border-neutral-300 text-black focus:ring-black"
            />
            <label htmlFor="modal-isActive" className="text-xs font-bold text-black">
              Coupon is active and ready to use
            </label>
          </div>

          <div className="flex items-center gap-3 pt-2 border-t border-neutral-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Coupon'}
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
