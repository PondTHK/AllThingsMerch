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
      queueMicrotask(() => {
        if (mounted) setRecord(null);
      });
      return;
    }
    if (decodedCode.toUpperCase() === 'DEMO-TAG-2026') {
      queueMicrotask(() => {
        if (mounted) setRecord({
          tagCode: 'DEMO-TAG-2026',
          serialNumber: 'DEMO-SERIAL-2026',
          productId: 'e1111111-1111-4111-8111-111111111111',
          productName: 'Red Bull Racing 2026 Team Polo',
          brandName: 'Oracle Red Bull Racing',
          sku: 'RBR-POLO26-M',
          size: 'M',
          status: 'active',
          issuedAt: new Date().toISOString(),
          orderNumber: 'ATM-DEMO-ORDER',
        });
      });
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
    return <div className="p-16 text-center text-muted font-bold transition-colors">Checking Official Cryptographic Provenance Registry...</div>;
  }

  if (!record) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 transition-colors">
        <div className="rounded-3xl bg-surface border border-border p-8 sm:p-12 text-center space-y-6 transition-colors shadow-sm">
          <div className="w-16 h-16 rounded-full bg-rose-600 text-white mx-auto flex items-center justify-center shadow-sm">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded bg-rose-600 text-white text-xs font-bold uppercase tracking-wider">
              Verification Failed
            </span>
            <h1 className="text-3xl font-black text-foreground transition-colors">TAG Not Registered</h1>
            <p className="text-xs text-muted max-w-md mx-auto transition-colors">
              Serial code <span className="font-mono font-bold text-foreground">{decodedCode}</span> does not match any verified 1-to-1 merchandise in our cryptographic registry.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/verify"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity shadow-sm"
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 transition-colors">
      <div className="rounded-3xl border border-border bg-surface p-8 sm:p-12 space-y-8 shadow-sm transition-colors">
        {/* Verification Status Header */}
        <div className="border-b border-border pb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted block transition-colors">
                Official Provenance Certificate
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-foreground uppercase tracking-tight transition-colors">
                Authentic Release
              </h1>
            </div>
          </div>

          <div className="text-right">
            <span
              className={`inline-block px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-sm ${
                isVerifiedActive
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {isVerifiedActive ? '100% Verified Authentic' : `Status: ${record.status}`}
            </span>
          </div>
        </div>

        {/* Merchandise Parameter Sheet */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 rounded-2xl bg-background border border-border text-xs transition-colors">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted block transition-colors">
              Merchandise Title
            </span>
            <div className="font-black text-foreground text-base transition-colors">{record.productName}</div>
            <div className="text-muted transition-colors">Brand: {record.brandName}</div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted block transition-colors">
              Serial Registry Parameter
            </span>
            <div className="font-mono font-bold text-foreground text-sm transition-colors">{record.serialNumber}</div>
            <div className="text-muted transition-colors">SKU Code: {record.sku}</div>
          </div>

          <div className="space-y-1 pt-4 border-t border-border transition-colors">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted block transition-colors">
              Public Verification TAG
            </span>
            <div className="font-mono font-black text-foreground text-base transition-colors">{record.tagCode}</div>
          </div>

          <div className="space-y-1 pt-4 border-t border-border transition-colors">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted block transition-colors">
              Registration Timestamp
            </span>
            <div className="font-bold text-foreground transition-colors">
              {new Date(record.issuedAt).toLocaleDateString()}
            </div>
            {record.orderNumber && (
              <div className="text-muted transition-colors">Order Ref: {record.orderNumber}</div>
            )}
          </div>
        </div>

        {/* Certificate Guarantee Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border transition-colors">
          <Link
            href="/verify"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Verify Another TAG</span>
          </Link>

          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity shadow-sm"
          >
            <span>View Catalog Listing</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
