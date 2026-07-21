'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';

export function AnnouncementBar() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  return (
    <div className="bg-black text-white px-4 py-2 text-xs border-b border-neutral-800">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-white shrink-0" />
          <span>
            Official Licensed Merchandise &bull; 1-to-1 Verified Authenticity TAG Included
          </span>
        </div>
        <div className="flex items-center gap-4 text-neutral-400">
          <span className="hidden sm:inline">
            Free Nationwide Shipping on Orders over 3,000 THB
          </span>
          <span className="px-2 py-0.5 rounded-full bg-neutral-900 text-neutral-300 text-[10px] font-semibold tracking-wider uppercase border border-neutral-700">
            Live Supabase
          </span>
        </div>
      </div>
    </div>
  );
}
