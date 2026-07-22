'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile } from '@/types';

export interface AuthState {
  user: UserProfile | null;
  login: (user: UserProfile) => void;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  loginAsDemoCollector: () => void;
  loginAsDemoAdmin: () => void;
}


export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,

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
            fullName: 'Demo Collector',
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
    }),
    {
      name: 'atm-auth-storage',
      skipHydration: true,
    }
  )
);
