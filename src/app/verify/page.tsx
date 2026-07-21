'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Search, ArrowRight } from 'lucide-react';

export default function VerifySearchPage() {
  const router = useRouter();
  const [tagCode, setTagCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanCode = tagCode.trim().toUpperCase();
    if (!cleanCode) {
      setError('Please enter a 1-to-1 Authenticity TAG serial code.');
      return;
    }

    router.push(`/verify/${encodeURIComponent(cleanCode)}`);
  };

  const sampleCodes = [
    { code: 'TAG-2026-RBR-001', label: 'Oracle Red Bull Racing Team Polo' },
    { code: 'SF-2026-SF1-00042', label: 'Scuderia Ferrari Softshell Jacket' },
    { code: 'CJ-2026-UTOPIA-007', label: 'Cactus Jack Heavyweight Hoodie' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <div className="rounded-3xl bg-neutral-100 border border-neutral-200 p-8 sm:p-12 space-y-8 text-center">
        <div className="w-16 h-16 rounded-full bg-black text-white mx-auto flex items-center justify-center">
          <ShieldCheck className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black text-black uppercase tracking-tight">
            Authenticity TAG Verification
          </h1>
          <p className="text-xs uppercase tracking-wider text-neutral-600 max-w-lg mx-auto">
            Every verified merchandise item is assigned a cryptographic 1-to-1 public serial code. Verify item provenance and licensing credentials instantly.
          </p>
        </div>

        <form onSubmit={handleVerify} className="max-w-lg mx-auto space-y-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-4 text-neutral-400" />
            <input
              type="text"
              value={tagCode}
              onChange={(e) => setTagCode(e.target.value)}
              placeholder="Enter TAG code e.g. DEMO-TAG-2026"
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-neutral-300 text-sm font-mono font-bold text-black uppercase focus:outline-none focus:border-black"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-neutral-200 border border-black text-xs font-bold text-black">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-black text-white font-bold text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
          >
            <span>Verify Provenance</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="border-t border-neutral-300 pt-6 space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block">
            Try Verification With Sample Serial Registries
          </span>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {sampleCodes.map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => router.push(`/verify/${item.code}`)}
                className="px-3.5 py-2 rounded-xl border border-neutral-300 bg-white text-xs font-mono font-bold text-black hover:border-black transition-colors"
              >
                {item.code}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
