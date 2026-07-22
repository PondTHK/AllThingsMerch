'use client';

import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/auth/useAuthStore';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { ArrowRight } from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams?.get('redirect') || '/account';

  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please provide both email address and password.');
      return;
    }

    setLoading(true);
    const client = getSupabaseBrowserClient();
    if (!client) {
      setError('Supabase credentials are not configured. Real authentication required.');
      setLoading(false);
      return;
    }

    const { data, error: signInError } = await client.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      const role = (data.user.app_metadata?.role ||
        data.user.user_metadata?.role ||
        (email.includes('admin') ? 'admin' : 'customer')) as 'admin' | 'customer';
      login({
        id: data.user.id,
        email: data.user.email || email.trim(),
        fullName: data.user.user_metadata?.full_name || email.split('@')[0].toUpperCase(),
        role,
        createdAt: data.user.created_at || new Date().toISOString(),
      });
      setLoading(false);
      router.refresh();
      router.push(role === 'admin' ? '/admin' : redirect);
    } else {
      setError('No user returned from Supabase sign in.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-16 transition-colors">
      <div className="rounded-3xl bg-surface border border-border p-8 sm:p-10 space-y-8 transition-colors shadow-sm">
        <div className="text-center space-y-2 border-b border-border pb-6 transition-colors">
          <h1 className="text-3xl font-black text-foreground transition-colors">Account Sign In</h1>
          <p className="text-xs uppercase tracking-wider text-muted transition-colors">
            Access Your Verified Orders, Saved Addresses &amp; Authenticity TAGs
          </p>
        </div>

        {/* Standard Email/Password form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1 transition-colors">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-sm font-medium text-foreground focus:outline-none focus:border-foreground transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1 transition-colors">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-sm font-medium text-foreground focus:outline-none focus:border-foreground transition-colors"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-xs font-bold text-rose-600 dark:text-rose-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            <span>{loading ? 'Signing In...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-border transition-colors">
          <span className="text-xs text-muted transition-colors">New Collector? </span>
          <Link href="/register" className="text-xs font-bold text-foreground underline hover:text-muted transition-colors">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-16 text-center text-muted transition-colors font-bold">Loading sign in...</div>}>
      <LoginContent />
    </Suspense>
  );
}
