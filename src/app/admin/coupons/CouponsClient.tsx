'use client';

import React, { useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { Plus, Check, Trash2, Ticket } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function CouponsClient({ 
  initialCoupons,
  currentPage,
  totalPages,
  totalCount,
  dbError
}: { 
  initialCoupons: any[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  dbError?: string;
}) {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const [coupons, setCoupons] = useState<any[]>(initialCoupons);
  
  const [showForm, setShowForm] = useState(false);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState('percentage');
  const [discountAmount, setDiscountAmount] = useState('10');
  const [expiresAt, setExpiresAt] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !supabase) return;

    setIsLoading(true);

    try {
      const { data: newCoupon, error } = await supabase
        .from('coupons')
        .insert({
          code: code.trim().toUpperCase(),
          discount_type: discountType,
          discount_amount: parseFloat(discountAmount),
          expires_at: expiresAt || null,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;

      setCoupons([newCoupon, ...coupons]);
      setCode('');
      setDiscountAmount('10');
      setShowForm(false);
      
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 3000);
      router.refresh();
    } catch (error) {
      console.error('Error creating coupon:', error);
      alert('Failed to create coupon. The code might already exist or the coupons table is missing.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStatus = async (couponId: string, currentStatus: boolean) => {
    if (!supabase) return;
    const nextStatus = !currentStatus;
    const previousCoupons = [...coupons];
    
    setCoupons((prev) => prev.map((c) => c.id === couponId ? { ...c, is_active: nextStatus } : c));

    try {
      const { error } = await supabase.from('coupons').update({ is_active: nextStatus }).eq('id', couponId);
      if (error) throw error;
      router.refresh();
    } catch (error) {
      alert('Failed to update status.');
      setCoupons(previousCoupons);
    }
  };

  const handleDelete = async (couponId: string) => {
    if (!supabase) return;
    if (confirm('Delete this coupon permanently?')) {
      const previousCoupons = [...coupons];
      setCoupons(coupons.filter(c => c.id !== couponId));
      try {
        const { error } = await supabase.from('coupons').delete().eq('id', couponId);
        if (error) throw error;
        router.refresh();
      } catch (error) {
        alert('Failed to delete coupon.');
        setCoupons(previousCoupons);
      }
    }
  };

  if (dbError && dbError.includes('does not exist')) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 rounded-2xl text-red-700">
        <h2 className="text-lg font-bold mb-2">Database Table Missing</h2>
        <p className="text-sm">The <code>coupons</code> table does not exist in your Supabase database. Please run the provided SQL script to create it.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <div>
          <h2 className="text-xl font-black uppercase tracking-wider text-black flex items-center gap-2">
            <Ticket className="w-6 h-6" />
            Discount Coupons
          </h2>
          <p className="text-xs text-neutral-600 mt-1">
            Generate and manage promotional discount codes.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2.5 rounded-xl bg-black text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-neutral-800 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Coupon</span>
        </button>
      </div>

      {savedMsg && (
        <div className="p-4 rounded-xl bg-neutral-100 border border-black flex items-center gap-2 text-xs font-bold text-black">
          <Check className="w-4 h-4" />
          <span>New coupon created successfully.</span>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleCreate} className="p-6 rounded-2xl bg-neutral-100 border border-neutral-300 space-y-4 max-w-2xl">
          <h3 className="text-xs font-bold uppercase tracking-wider text-black border-b border-neutral-200 pb-2">
            Coupon Parameters
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Coupon Code *
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase().replace(/\s/g, ''))}
                placeholder="SUMMER20"
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs font-mono font-bold text-black focus:outline-none focus:border-black uppercase"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Discount Type *
              </label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs font-medium text-black focus:outline-none focus:border-black"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (THB)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Discount Value *
              </label>
              <input
                type="number"
                required
                min="1"
                step={discountType === 'percentage' ? "1" : "0.01"}
                value={discountAmount}
                onChange={(e) => setDiscountAmount(e.target.value)}
                placeholder="10"
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs font-medium text-black focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Expiry Date (Optional)
              </label>
              <input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs font-medium text-black focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Coupon'}
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

      {/* Table */}
      {coupons.length === 0 ? (
        <div className="rounded-2xl bg-neutral-100 border border-neutral-200 p-12 text-center space-y-3">
          <Ticket className="w-10 h-10 mx-auto text-neutral-400" />
          <h3 className="text-base font-bold text-black">No Coupons Found</h3>
        </div>
      ) : (
        <div className="border border-neutral-200 rounded-2xl bg-white overflow-hidden">
          <div className="divide-y divide-neutral-200">
            {coupons.map((coupon) => (
              <div key={coupon.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-neutral-50 transition-colors">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-black text-sm px-2 py-1 bg-neutral-100 rounded border border-neutral-200">{coupon.code}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${coupon.is_active ? 'bg-green-100 text-green-700' : 'bg-neutral-300 text-neutral-700'}`}>
                      {coupon.is_active ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-500 mt-2">
                    Discount: <span className="font-bold text-black">{coupon.discount_amount}{coupon.discount_type === 'percentage' ? '%' : ' THB'}</span>
                    {coupon.expires_at && <span> &bull; Expires: {new Date(coupon.expires_at).toLocaleDateString()}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleStatus(coupon.id, coupon.is_active)}
                    className="px-3.5 py-2 rounded-xl border border-neutral-300 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-neutral-100 flex items-center gap-1.5"
                  >
                    {coupon.is_active ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(coupon.id)}
                    className="p-2.5 rounded-xl border border-neutral-300 bg-white text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete Coupon"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-neutral-200 pt-4">
          <p className="text-xs text-neutral-500">
            Showing page {currentPage} of {totalPages} ({totalCount} total coupons)
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push(`/admin/coupons?page=${currentPage - 1}`)}
              disabled={currentPage <= 1 || isLoading}
              className="px-3 py-1.5 rounded-xl border border-neutral-300 bg-white text-xs font-bold disabled:opacity-50 hover:bg-neutral-50"
            >
              Previous
            </button>
            <button
              onClick={() => router.push(`/admin/coupons?page=${currentPage + 1}`)}
              disabled={currentPage >= totalPages || isLoading}
              className="px-3 py-1.5 rounded-xl border border-neutral-300 bg-white text-xs font-bold disabled:opacity-50 hover:bg-neutral-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
