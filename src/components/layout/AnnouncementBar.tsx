'use strict';

import React from 'react';
import { ShieldCheck, Sparkles } from 'lucide-react';

export function AnnouncementBar() {
  return (
    <div className="bg-gradient-to-r from-emerald-900/60 via-zinc-900 to-cyan-900/60 border-b border-white/10 px-4 py-2 text-xs text-neutral-300">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            สินค้าลิขสิทธิ์แท้ 100% ทุกชิ้นรับรองด้วย <strong className="text-white">Authenticity TAG</strong> 1-to-1 Verification
          </span>
        </div>
        <div className="flex items-center gap-4 text-neutral-400">
          <span className="hidden sm:inline flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 inline mr-1" />
            จัดส่งฟรีทั่วประเทศเมื่อสั่งครบ ฿3,000
          </span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold tracking-wider uppercase border border-emerald-500/30">
            Demo Mode Active
          </span>
        </div>
      </div>
    </div>
  );
}
