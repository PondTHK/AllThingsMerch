'use client';

import { useEffect } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/lib/auth/useAuthStore';

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        login({
          id: session.user.id,
          email: session.user.email || '',
          fullName: session.user.user_metadata?.full_name || session.user.user_metadata?.fullName || 'User',
          phone: session.user.user_metadata?.phone || '',
          role: session.user.app_metadata?.role || session.user.user_metadata?.role || 'customer',
          createdAt: session.user.created_at,
        });
      } else {
        logout();
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        login({
          id: session.user.id,
          email: session.user.email || '',
          fullName: session.user.user_metadata?.full_name || session.user.user_metadata?.fullName || 'User',
          phone: session.user.user_metadata?.phone || '',
          role: session.user.app_metadata?.role || session.user.user_metadata?.role || 'customer',
          createdAt: session.user.created_at,
        });
      } else {
        logout();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [login, logout]);

  return <>{children}</>;
}
