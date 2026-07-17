'use client';

import React, { useState } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { ShieldCheck, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Tag = any; // Representing AuthenticityTag joined with order_items

export function TagsClient({ initialTags }: { initialTags: Tag[] }) {
  const router = useRouter();
  const supabase = getSupabaseBrowserClient();
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTags = tags.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      t.public_code?.toLowerCase().includes(q) ||
      t.serial_number?.toLowerCase().includes(q) ||
      t.order_items?.product_name?.toLowerCase().includes(q) ||
      t.order_items?.sku?.toLowerCase().includes(q)
    );
  });

  const updateStatus = async (tagId: string, newStatus: string) => {
    if (!supabase) return;

    // Optimistic update
    setTags((prev) =>
      prev.map((t) => (t.id === tagId ? { ...t, status: newStatus } : t))
    );

    await supabase
      .from('authenticity_tags')
      .update({ status: newStatus })
      .eq('id', tagId);

    router.refresh();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
        <div>
          <h2 className="text-xl font-black uppercase tracking-wider text-black">
            1-to-1 Authenticity TAG Registry
          </h2>
          <p className="text-xs text-neutral-600 mt-1">
            Monitor serial number assignments and audit public cryptographic verification states.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search TAG or serial..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-neutral-100 border border-neutral-300 text-xs font-medium text-black focus:outline-none focus:border-black"
          />
        </div>
      </div>

      <div className="border border-neutral-200 rounded-2xl bg-white overflow-hidden">
        <div className="divide-y divide-neutral-200">
          {filteredTags.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <ShieldCheck className="w-10 h-10 mx-auto text-neutral-400" />
              {searchQuery ? (
                <>
                  <h3 className="text-base font-bold text-black">No TAGs Found</h3>
                  <p className="text-xs text-neutral-600 max-w-xs mx-auto">
                    No authenticity TAGs match &quot;{searchQuery}&quot;. Try searching by public code, serial number, or product name.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-base font-bold text-black">No Authenticity TAGs Issued</h3>
                  <p className="text-xs text-neutral-600 max-w-xs mx-auto">
                    TAGs are automatically generated when a customer order is fulfilled. They will appear here once orders are processed.
                  </p>
                </>
              )}
            </div>
          ) : filteredTags.map((tag) => (
            <div
              key={tag.id}
              className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-neutral-50 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-black" />
                  <span className="font-mono font-black text-black text-sm">{tag.public_code}</span>
                  <span className="font-mono text-xs text-neutral-500">
                    ({tag.serial_number})
                  </span>
                </div>
                <div className="text-xs font-bold text-black">{tag.order_items?.product_name || 'Unknown Product'}</div>
                <div className="text-xs text-neutral-500">
                  SKU: <span className="font-mono">{tag.order_items?.sku || 'N/A'}</span> &bull; Issued:{' '}
                  {new Date(tag.issued_at).toLocaleDateString()}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  Status:
                </span>
                <select
                  value={tag.status}
                  onChange={(e) => updateStatus(tag.id, e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-black text-white text-xs font-bold uppercase tracking-wider focus:outline-none"
                >
                  <option value="issued">Issued</option>
                  <option value="activated">Activated</option>
                  <option value="revoked">Revoked</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
