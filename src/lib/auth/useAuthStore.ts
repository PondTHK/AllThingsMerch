'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile, SavedAddress } from '@/types';

export interface AuthState {
  user: UserProfile | null;
  addresses: SavedAddress[];
  login: (user: UserProfile) => void;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  loginAsDemoCollector: () => void;
  loginAsDemoAdmin: () => void;
  addAddress: (address: Omit<SavedAddress, 'id'>) => SavedAddress;
  updateAddress: (id: string, updates: Partial<SavedAddress>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
}

const DEFAULT_DEMO_ADDRESSES: SavedAddress[] = [
  {
    id: 'addr-demo-1',
    label: 'Primary Bangkok Residence',
    fullName: 'Thanakhon Demo Collector',
    email: 'collector@allthingsmerch.demo',
    phone: '089-123-4567',
    street: '999 Sukhumvit Road, Khlong Toei',
    city: 'Bangkok',
    postalCode: '10110',
    isDefault: true,
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      addresses: DEFAULT_DEMO_ADDRESSES,

      login: (user) => {
        if (typeof document !== 'undefined') {
          document.cookie = `atm_demo_role=${user.role}; path=/; max-age=86400;`;
        }
        set({ user });
      },

      logout: () => {
        if (typeof document !== 'undefined') {
          document.cookie = 'atm_demo_role=; path=/; max-age=0;';
        }
        set({ user: null });
      },

      updateProfile: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
        }
      },

      loginAsDemoCollector: () => {
        if (typeof document !== 'undefined') {
          document.cookie = 'atm_demo_role=customer; path=/; max-age=86400;';
        }
        set({
          user: {
            id: 'demo-collector-01',
            email: 'collector@allthingsmerch.demo',
            fullName: 'Thanakhon Demo Collector',
            phone: '089-123-4567',
            role: 'customer',
            createdAt: '2026-06-01T10:00:00Z',
          },
        });
      },

      loginAsDemoAdmin: () => {
        if (typeof document !== 'undefined') {
          document.cookie = 'atm_demo_role=admin; path=/; max-age=86400;';
        }
        set({
          user: {
            id: 'demo-admin-01',
            email: 'admin@allthingsmerch.demo',
            fullName: 'Curator Admin',
            phone: '081-999-9999',
            role: 'admin',
            createdAt: '2026-06-01T10:00:00Z',
          },
        });
      },

      addAddress: (addressData) => {
        const newAddr: SavedAddress = {
          ...addressData,
          id: `addr-${Date.now()}`,
        };
        const current = get().addresses;
        const isFirst = current.length === 0 || newAddr.isDefault;

        const updated = isFirst
          ? current.map((a) => ({ ...a, isDefault: false })).concat({ ...newAddr, isDefault: true })
          : current.concat(newAddr);

        set({ addresses: updated });
        return newAddr;
      },

      updateAddress: (id, updates) => {
        const current = get().addresses;
        const updated = current.map((a) => {
          if (a.id !== id) {
            return updates.isDefault ? { ...a, isDefault: false } : a;
          }
          return { ...a, ...updates };
        });
        set({ addresses: updated });
      },

      deleteAddress: (id) => {
        set({
          addresses: get().addresses.filter((a) => a.id !== id),
        });
      },

      setDefaultAddress: (id) => {
        set({
          addresses: get().addresses.map((a) => ({
            ...a,
            isDefault: a.id === id,
          })),
        });
      },
    }),
    {
      name: 'allthingsmerch-auth',
    }
  )
);
