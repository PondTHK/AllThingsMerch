'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { verifyAuthenticityTagAction } from '@/app/verify/actions';
import { AuthenticityTagRecord } from '@/types';
import { ShieldCheck, ShieldAlert, ArrowLeft, ExternalLink } from 'lucide-react';

export default function VerifyTagDetailPage({
  params,
}: {
  params: Promise<{ tagCode: string }>;
}) {
  const { tagCode } = use(params);
  const decodedCode = decodeURIComponent(tagCode);
  const [record, setRecord] = useState<AuthenticityTagRecord | null | undefined>(undefined);

  useEffect(() => {
    let mounted = true;
    if (!decodedCode) {
      setRecord(null);
      return;
    }
    verifyAuthenticityTagAction(decodedCode)
      .then((data) => {
        if (mounted) setRecord(data);
      })
      .catch((err) => {
        console.error('Failed to verify TAG code against database:', err);
        if (mounted) setRecord(null);
      });
    return () => {
      mounted = false;
    };
  }, [decodedCode]);

  if (record === undefined) {
    return <div className="p-16 text-center text-neutral-500 font-bold">Checking Official Cryptographic Provenance Registry...</div>;
  }

  if (!record) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20">
        <div className="rounded-3xl bg-neutral-100 border border-black p-8 sm:p-12 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-black text-white mx-auto flex items-center justify-center">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded bg-black text-white text-xs font-bold uppercase tracking-wider">
              Verification Failed
            </span>
            <h1 className="text-3xl font-black text-black">TAG Not Registered</h1>
            <p className="text-xs text-neutral-600 max-w-md mx-auto">
              Serial code <span className="font-mono font-bold text-black">{decodedCode}</span> does not match any verified 1-to-1 merchandise in our cryptographic registry.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/verify"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-black text-white font-bold text-xs uppercase tracking-wider hover:bg-neutral-800"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Verify Another Code</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isVerifiedActive = record.status === 'active';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <div className="rounded-3xl border border-black bg-white p-8 sm:p-12 space-y-8 shadow-xl">
        {/* Verification Status Header */}
        <div className="border-b border-neutral-200 pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 block">
                Official Provenance Certificate
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-black uppercase tracking-tight">
                Authentic Release
              </h1>
            </div>
          </div>

          <div className="text-right">
            <span
              className={`inline-block px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                isVerifiedActive ? 'bg-black text-white' : 'bg-neutral-200 text-neutral-700'
              }`}
            >
              {isVerifiedActive ? '100% Verified Authentic' : `Status: ${record.status}`}
            </span>
          </div>
        </div>

        {/* Merchandise Parameter Sheet */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 rounded-2xl bg-neutral-100 border border-neutral-200 text-xs">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block">
              Merchandise Title
            </span>
            <div className="font-black text-black text-base">{record.productName}</div>
            <div className="text-neutral-600">Brand: {record.brandName}</div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block">
              Serial Registry Parameter
            </span>
            <div className="font-mono font-bold text-black text-sm">{record.serialNumber}</div>
            <div className="text-neutral-600">SKU Code: {record.sku}</div>
          </div>

          <div className="space-y-1 pt-4 border-t border-neutral-300">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block">
              Public Verification TAG
            </span>
            <div className="font-mono font-black text-black text-base">{record.tagCode}</div>
          </div>

          <div className="space-y-1 pt-4 border-t border-neutral-300">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block">
              Registration Timestamp
            </span>
            <div className="font-bold text-black">
              {new Date(record.issuedAt).toLocaleDateString()}
            </div>
            {record.orderNumber && (
              <div className="text-neutral-500">Order Ref: {record.orderNumber}</div>
            )}
          </div>
        </div>

        {/* Certificate Guarantee Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-neutral-200">
          <Link
            href="/verify"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-black"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Verify Another TAG</span>
          </Link>

          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800"
          >
            <span>View Catalog Listing</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
