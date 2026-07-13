'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthenticityTagRecord } from '@/types';

export interface TagState {
  tags: AuthenticityTagRecord[];
  verifyTag: (code: string) => AuthenticityTagRecord | undefined;
  registerTag: (record: AuthenticityTagRecord) => AuthenticityTagRecord;
  updateTagStatus: (tagCode: string, status: AuthenticityTagRecord['status']) => void;
}

const DEFAULT_TAGS: AuthenticityTagRecord[] = [
  {
    tagCode: 'DEMO-TAG-2026',
    serialNumber: 'SN-RBR-00001',
    productId: 'p1111111-1111-4111-8111-111111111111',
    productName: 'Red Bull Racing 2026 Team Polo',
    brandName: 'Oracle Red Bull Racing',
    sku: 'RBR-POLO26-M',
    size: 'M',
    status: 'active',
    issuedAt: '2026-06-01T12:00:00Z',
    orderNumber: 'DEMO-ORD-2026',
  },
  {
    tagCode: 'SF-2026-SF1-00042',
    serialNumber: 'SN-SF-00042',
    productId: 'p2222222-2222-4222-8222-222222222222',
    productName: 'Scuderia Ferrari 2026 Team Softshell Jacket',
    brandName: 'Scuderia Ferrari F1',
    sku: 'SF-JKT26-M',
    size: 'M',
    status: 'active',
    issuedAt: '2026-06-02T15:30:00Z',
    orderNumber: 'DEMO-ORD-FERRARI',
  },
  {
    tagCode: 'CJ-2026-UTOPIA-007',
    serialNumber: 'SN-CJ-00007',
    productId: 'p3333333-3333-4333-8333-333333333333',
    productName: 'Cactus Jack Heavyweight Hoodie',
    brandName: 'Cactus Jack Merch',
    sku: 'CJ-HOODIE-L',
    size: 'L',
    status: 'active',
    issuedAt: '2026-06-05T09:15:00Z',
    orderNumber: 'DEMO-ORD-CJ',
  },
];

export const useTagStore = create<TagState>()(
  persist(
    (set, get) => ({
      tags: DEFAULT_TAGS,

      verifyTag: (code) => {
        const normalized = code.trim().toUpperCase();
        return get().tags.find((t) => t.tagCode.toUpperCase() === normalized);
      },

      registerTag: (record) => {
        const current = get().tags;
        if (current.some((t) => t.tagCode.toUpperCase() === record.tagCode.toUpperCase())) {
          return record;
        }
        set({ tags: [record, ...current] });
        return record;
      },

      updateTagStatus: (tagCode, status) => {
        set({
          tags: get().tags.map((t) =>
            t.tagCode.toUpperCase() === tagCode.toUpperCase() ? { ...t, status } : t
          ),
        });
      },
    }),
    {
      name: 'allthingsmerch-tags',
    }
  )
);
