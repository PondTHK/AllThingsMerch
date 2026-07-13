'use client';

import React, { useState } from 'react';
import { useTagStore } from '@/lib/authenticity/useTagStore';
import { AuthenticityTagRecord } from '@/types';
import { ShieldCheck, Search } from 'lucide-react';

export default function AdminTagsPage() {
  const tags = useTagStore((state) => state.tags);
  const updateStatus = useTagStore((state) => state.updateTagStatus);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTags = tags.filter(
    (t) =>
      t.tagCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          {filteredTags.map((tag) => (
            <div
              key={tag.tagCode}
              className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-neutral-50 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-black" />
                  <span className="font-mono font-black text-black text-sm">{tag.tagCode}</span>
                  <span className="font-mono text-xs text-neutral-500">
                    ({tag.serialNumber})
                  </span>
                </div>
                <div className="text-xs font-bold text-black">{tag.productName}</div>
                <div className="text-xs text-neutral-500">
                  Brand: {tag.brandName} &bull; SKU: <span className="font-mono">{tag.sku}</span> &bull; Issued:{' '}
                  {new Date(tag.issuedAt).toLocaleDateString()}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  Status:
                </span>
                <select
                  value={tag.status}
                  onChange={(e) =>
                    updateStatus(tag.tagCode, e.target.value as AuthenticityTagRecord['status'])
                  }
                  className="px-3 py-1.5 rounded-xl bg-black text-white text-xs font-bold uppercase tracking-wider"
                >
                  <option value="active">Active (Verified)</option>
                  <option value="flagged">Flagged</option>
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
