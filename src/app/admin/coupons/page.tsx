'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Coupon } from '@/types';
import { getRepository } from '@/lib/repositories';
import { Ticket, Plus, Search, Trash2, Edit } from 'lucide-react';
import { formatTHB } from '@/lib/money';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchCode, setSearchCode] = useState('');

  useEffect(() => {
    fetchCoupons();
  }, []);

  async function fetchCoupons() {
    setLoading(true);
    try {
      const data = await getRepository().getCoupons();
      setCoupons(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this coupon?')) return;
    try {
      await getRepository().deleteCoupon(id);
      fetchCoupons();
    } catch (err) {
      console.error('Failed to delete', err);
    }
  }

  const filteredCoupons = coupons.filter(c => 
    c.code.toLowerCase().includes(searchCode.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black uppercase tracking-wider text-black flex items-center gap-2">
            <Ticket className="w-5 h-5" />
            Discount Coupons
          </h2>
          <p className="text-xs text-neutral-600 mt-1">
            Manage promotional codes, discounts, and usage limits.
          </p>
        </div>
        <Link
          href="/admin/coupons/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black text-white font-bold text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Coupon</span>
        </Link>
      </div>

      <div className="bg-white border border-neutral-300 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-neutral-300 bg-neutral-50 flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-neutral-400" />
            </div>
            <input
              type="text"
              placeholder="Search code..."
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black placeholder-neutral-400"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-neutral-500">Loading coupons...</div>
        ) : filteredCoupons.length === 0 ? (
          <div className="p-12 text-center text-sm text-neutral-500">
            No coupons found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-black">Code</th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-black">Discount</th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-black">Usage</th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-black">Status</th>
                  <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-black text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredCoupons.map((coupon) => (
                  <tr key={coupon.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-black font-mono">{coupon.code}</div>
                      <div className="text-xs text-neutral-500 truncate max-w-[200px]">{coupon.description || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold">
                        {coupon.discountType === 'percentage' 
                          ? `${coupon.discountValue}%` 
                          : formatTHB(coupon.discountValue)}
                      </span>
                      {coupon.minOrderValue ? (
                        <div className="text-[10px] text-neutral-500 mt-1">Min {formatTHB(coupon.minOrderValue)}</div>
                      ) : null}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs">
                        <span className="font-bold">{coupon.currentGlobalUses}</span>
                        {coupon.maxGlobalUses ? ` / ${coupon.maxGlobalUses}` : ' / ∞'}
                      </div>
                      {coupon.maxUsesPerUser ? (
                        <div className="text-[10px] text-neutral-500 mt-1">Max {coupon.maxUsesPerUser}/user</div>
                      ) : null}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        coupon.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-neutral-200 text-neutral-600'
                      }`}>
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link
                        href={`/admin/coupons/${coupon.id}`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-black transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(coupon.id)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
