'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getRepository } from '@/lib/repositories';
import { ArrowLeft, Save } from 'lucide-react';

export default function NewCouponPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: '',
    minOrderValue: '',
    maxGlobalUses: '',
    maxUsesPerUser: '',
    isActive: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.code || !formData.discountValue) {
        throw new Error('Code and Discount Value are required');
      }

      const discountValue = Number(formData.discountValue);
      if (isNaN(discountValue) || discountValue <= 0) {
        throw new Error('Discount value must be a positive number');
      }

      await getRepository().createCoupon({
        code: formData.code.toUpperCase(),
        description: formData.description,
        discountType: formData.discountType,
        discountValue,
        minOrderValue: formData.minOrderValue ? Number(formData.minOrderValue) : undefined,
        maxGlobalUses: formData.maxGlobalUses ? Number(formData.maxGlobalUses) : undefined,
        maxUsesPerUser: formData.maxUsesPerUser ? Number(formData.maxUsesPerUser) : undefined,
        isActive: formData.isActive,
      });

      router.push('/admin/coupons');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create coupon');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/coupons"
          className="w-10 h-10 rounded-xl bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-black" />
        </Link>
        <div>
          <h2 className="text-xl font-black uppercase tracking-wider text-black">
            Create Coupon
          </h2>
        </div>
      </div>

      <div className="bg-white border border-neutral-300 rounded-2xl p-6">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                Coupon Code *
              </label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="e.g. WELCOME10"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-black focus:border-black font-mono uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Internal or customer-facing description"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                  Discount Type *
                </label>
                <select
                  value={formData.discountType}
                  onChange={(e) => setFormData({ ...formData, discountType: e.target.value as 'percentage' | 'fixed' })}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-black focus:border-black bg-white"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (THB)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                  Value *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.discountValue}
                  onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                  placeholder="e.g. 10 or 500"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                Minimum Order Value (THB)
              </label>
              <input
                type="number"
                min="0"
                value={formData.minOrderValue}
                onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
                placeholder="Leave blank for no minimum"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                  Max Uses (Global)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.maxGlobalUses}
                  onChange={(e) => setFormData({ ...formData, maxGlobalUses: e.target.value })}
                  placeholder="Unlimited if blank"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                  Max Uses (Per User)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.maxUsesPerUser}
                  onChange={(e) => setFormData({ ...formData, maxUsesPerUser: e.target.value })}
                  placeholder="Unlimited if blank"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 text-black border-neutral-300 rounded focus:ring-black"
              />
              <label htmlFor="isActive" className="text-sm font-bold text-black">
                Coupon is active and ready to use
              </label>
            </div>
          </div>

          <div className="pt-6 border-t border-neutral-200">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-black text-white font-bold text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving...' : 'Save Coupon'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
