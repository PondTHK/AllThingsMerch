'use client';

import { useEffect } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/lib/auth/useAuthStore';
import { useCartStore } from '@/lib/cart/useCartStore';
import { syncLocalCartToDbAction } from '@/app/cart/actions';

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    const handleLoginSync = async (user: any) => {
      login(user);
      try {
        const localItems = useCartStore.getState().items;
        await syncLocalCartToDbAction(localItems);
        await useCartStore.getState().syncWithDb();
      } catch (err) {
        console.error('Failed to sync local cart to DB:', err);
      }
    };

    const handleLogoutSync = () => {
      logout();
      useCartStore.getState().clearCartWithoutRelease();
    };

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        handleLoginSync({
          id: session.user.id,
          email: session.user.email || '',
          fullName: session.user.user_metadata?.full_name || session.user.user_metadata?.fullName || 'User',
          phone: session.user.user_metadata?.phone || '',
          role: session.user.app_metadata?.role || session.user.user_metadata?.role || 'customer',
          createdAt: session.user.created_at,
        });
      } else {
        handleLogoutSync();
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        handleLoginSync({
          id: session.user.id,
          email: session.user.email || '',
          fullName: session.user.user_metadata?.full_name || session.user.user_metadata?.fullName || 'User',
          phone: session.user.user_metadata?.phone || '',
          role: session.user.app_metadata?.role || session.user.user_metadata?.role || 'customer',
          createdAt: session.user.created_at,
        });
      } else {
        handleLogoutSync();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [login, logout]);

  return <>{children}</>;
}
