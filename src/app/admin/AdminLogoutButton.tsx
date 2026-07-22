'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/lib/auth/useAuthStore';

export function AdminLogoutButton() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    logout();
    router.push('/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2.5 rounded-xl border border-white/80 bg-white/50 backdrop-blur-md text-slate-700 font-medium text-sm hover:bg-red-50 hover:text-red-600 hover:border-red-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 shadow-sm"
    >
      <LogOut className="w-4 h-4" />
      <span>Sign Out Admin</span>
    </button>
  );
}
