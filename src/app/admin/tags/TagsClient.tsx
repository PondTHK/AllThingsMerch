'use client';

import React, { useState } from 'react';
import { ShieldCheck, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface TagDto {
  id: string;
  publicCode: string;
  serialNumber: string;
  productName: string;
  sku: string;
  status: string;
  issuedAt: string;
  orderNumber: string | null;
}

interface TagsClientProps {
  initialTags: TagDto[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

export function TagsClient({ initialTags, currentPage, totalPages, totalCount }: TagsClientProps) {
  const router = useRouter();
  const tags = initialTags;
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTags = tags.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      t.publicCode?.toLowerCase().includes(q) ||
      t.serialNumber?.toLowerCase().includes(q) ||
      t.productName?.toLowerCase().includes(q) ||
      t.sku?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
        <div>
          <h2 className="text-xl font-black uppercase tracking-wider text-black">1-to-1 Authenticity TAG Registry</h2>
          <p className="text-xs text-neutral-600 mt-1">Monitor serial number assignments and audit public cryptographic verification states.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search TAG or serial..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-neutral-100 border border-neutral-300 text-xs font-medium text-black focus:outline-none focus:border-black" />
        </div>
      </div>

      <div className="border border-neutral-200 rounded-2xl bg-white overflow-hidden">
        <div className="divide-y divide-neutral-200">
          {filteredTags.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <ShieldCheck className="w-10 h-10 mx-auto text-neutral-400" />
              {searchQuery ? (
                <><h3 className="text-base font-bold text-black">No TAGs Found</h3>
                <p className="text-xs text-neutral-600 max-w-xs mx-auto">No authenticity TAGs match &quot;{searchQuery}&quot;.</p></>
              ) : (
                <><h3 className="text-base font-bold text-black">No Authenticity TAGs Issued</h3>
                <p className="text-xs text-neutral-600 max-w-xs mx-auto">TAGs are automatically generated when a customer order is fulfilled.</p></>
              )}
            </div>
          ) : filteredTags.map((tag) => (
            <div key={tag.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-neutral-50 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-black" />
                  <span className="font-mono font-black text-black text-sm">{tag.publicCode}</span>
                  <span className="font-mono text-xs text-neutral-500">({tag.serialNumber})</span>
                </div>
                <div className="text-xs font-bold text-black">{tag.productName || 'Unknown Product'}</div>
                <div className="text-xs text-neutral-500">
                  SKU: <span className="font-mono">{tag.sku || 'N/A'}</span> &bull; Issued: {new Date(tag.issuedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-neutral-200 pt-4">
          <p className="text-xs text-neutral-500">Showing page {currentPage} of {totalPages} ({totalCount} total TAGs)</p>
          <div className="flex items-center gap-2">
            <button onClick={() => router.push(`/admin/tags?page=${currentPage - 1}`)} disabled={currentPage <= 1}
              className="px-3 py-1.5 rounded-xl border border-neutral-300 bg-white text-xs font-bold disabled:opacity-50 hover:bg-neutral-50">Previous</button>
            <button onClick={() => router.push(`/admin/tags?page=${currentPage + 1}`)} disabled={currentPage >= totalPages}
              className="px-3 py-1.5 rounded-xl border border-neutral-300 bg-white text-xs font-bold disabled:opacity-50 hover:bg-neutral-50">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
