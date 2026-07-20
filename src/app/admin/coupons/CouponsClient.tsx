'use client';

import React, { useState } from 'react';
import { Plus, Check, Trash2, Ticket } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createCouponAction, toggleCouponActiveAction, deleteCouponAction } from './actions';

export interface CouponDto {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  minOrderAmount: number | null;
  maxUsageCount: number | null;
  usageCount: number;
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
  const [showForm, setShowForm] = useState(false);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState('10');
  const [expiresAt, setExpiresAt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setIsLoading(true);

    const result = await createCouponAction({
      code: code.trim().toUpperCase(),
      discountType,
      discountValue: parseFloat(discountValue),
      expiresAt: expiresAt || undefined,
    });

    if (result.success) {
      setCode(''); setDiscountValue('10'); setExpiresAt(''); setShowForm(false);
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 3000);
      router.refresh();
    } else {
      alert(result.error || 'Failed to create coupon.');
    }
    setIsLoading(false);
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    const prev = [...coupons];
    setCoupons((p) => p.map((c) => c.id === id ? { ...c, isActive: !isActive } : c));
    const result = await toggleCouponActiveAction(id);
    if (!result.success) { alert(result.error); setCoupons(prev); }
  };

  const handleDelete = async (id: string, couponCode: string) => {
    if (!confirm(`Delete coupon "${couponCode}"?`)) return;
    const result = await deleteCouponAction(id);
    if (result.success) {
      setCoupons((p) => p.filter((c) => c.id !== id));
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <div>
          <h2 className="text-xl font-black uppercase tracking-wider text-black flex items-center gap-2">
            <Ticket className="w-6 h-6" />Coupon &amp; Discount Manager
          </h2>
          <p className="text-xs text-neutral-600 mt-1">Create and manage promotional discount codes for customers.</p>
        </div>
        <button type="button" onClick={() => setShowForm(!showForm)}
          className="px-4 py-2.5 rounded-xl bg-black text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-neutral-800 transition-colors">
          <Plus className="w-3.5 h-3.5" /><span>New Coupon</span>
        </button>
      </div>

      {savedMsg && (
        <div className="p-4 rounded-xl bg-neutral-100 border border-black flex items-center gap-2 text-xs font-bold text-black">
          <Check className="w-4 h-4" /><span>Coupon created successfully.</span>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleCreate} className="p-6 rounded-2xl bg-neutral-100 border border-neutral-300 space-y-4 max-w-2xl">
          <h3 className="text-xs font-bold uppercase tracking-wider text-black">New Coupon Parameters</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">Coupon Code *</label>
              <input type="text" required value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="SALE20"
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs font-mono text-black focus:outline-none focus:border-black" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">Discount Type *</label>
              <select value={discountType} onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'fixed')}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs font-medium text-black focus:outline-none focus:border-black">
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (THB)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Discount Value ({discountType === 'percentage' ? '%' : 'THB'}) *
              </label>
              <input type="number" required value={discountValue} onChange={(e) => setDiscountValue(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs font-medium text-black focus:outline-none focus:border-black" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">Expires At (optional)</label>
              <input type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs text-black focus:outline-none focus:border-black" />
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={isLoading} className="px-6 py-2.5 rounded-xl bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50">
              {isLoading ? 'Creating...' : 'Create Coupon'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-xl border border-neutral-300 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-neutral-200">Cancel</button>
          </div>
        </form>
      )}

      <div className="border border-neutral-200 rounded-2xl bg-white overflow-hidden">
        <div className="divide-y divide-neutral-200">
          {coupons.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Ticket className="w-10 h-10 mx-auto text-neutral-400" />
              <h3 className="text-base font-bold text-black">No Coupons Found</h3>
              <p className="text-xs text-neutral-600">Create your first discount coupon using the button above.</p>
            </div>
          ) : coupons.map((coupon) => (
            <div key={coupon.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-neutral-50 transition-colors">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-black text-black text-sm">{coupon.code}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${coupon.isActive ? 'bg-black text-white' : 'bg-neutral-300 text-neutral-700'}`}>
                    {coupon.isActive ? 'Active' : 'Disabled'}
                  </span>
                </div>
                <div className="text-xs text-neutral-500 mt-1">
                  {coupon.discountType === 'percentage' ? `${coupon.discountValue}% off` : `฿${coupon.discountValue} off`}
                  {coupon.expiresAt && <> &bull; Expires: {new Date(coupon.expiresAt).toLocaleDateString()}</>}
                  &bull; Used: {coupon.usageCount}{coupon.maxUsageCount ? `/${coupon.maxUsageCount}` : ''} times
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => toggleActive(coupon.id, coupon.isActive)}
                  className="px-3.5 py-2 rounded-xl border border-neutral-300 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-neutral-100">
                  {coupon.isActive ? 'Disable' : 'Enable'}
                </button>
                <button type="button" onClick={() => handleDelete(coupon.id, coupon.code)}
                  className="p-2 rounded-xl border border-red-200 bg-white text-red-600 hover:bg-red-50">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-neutral-200 pt-4">
          <p className="text-xs text-neutral-500">Showing page {currentPage} of {totalPages} ({totalCount} total coupons)</p>
          <div className="flex items-center gap-2">
            <button onClick={() => router.push(`/admin/coupons?page=${currentPage - 1}`)} disabled={currentPage <= 1}
              className="px-3 py-1.5 rounded-xl border border-neutral-300 bg-white text-xs font-bold disabled:opacity-50 hover:bg-neutral-50">Previous</button>
            <button onClick={() => router.push(`/admin/coupons?page=${currentPage + 1}`)} disabled={currentPage >= totalPages}
              className="px-3 py-1.5 rounded-xl border border-neutral-300 bg-white text-xs font-bold disabled:opacity-50 hover:bg-neutral-50">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
