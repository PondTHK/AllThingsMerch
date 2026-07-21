'use client';

import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/auth/useAuthStore';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { Lock, ArrowRight } from 'lucide-react';

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
      router.push(role === 'admin' ? '/admin' : redirect);
    } else {
      setError('No user returned from Supabase sign in.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-16">
      <div className="rounded-3xl bg-neutral-100 border border-neutral-200 p-8 sm:p-10 space-y-8">
        <div className="text-center space-y-2 border-b border-neutral-300 pb-6">
          <h1 className="text-3xl font-black text-black">Account Sign In</h1>
          <p className="text-xs uppercase tracking-wider text-neutral-600">
            Access Your Verified Orders, Saved Addresses &amp; Authenticity TAGs
          </p>
        </div>

        {/* Standard Email/Password form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="w-full px-4 py-3 rounded-xl bg-white border border-neutral-300 text-sm font-medium text-black focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-white border border-neutral-300 text-sm font-medium text-black focus:outline-none focus:border-black"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-neutral-200 border border-black text-xs font-bold text-black">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-black text-white font-bold text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-neutral-300">
          <span className="text-xs text-neutral-600">New Collector? </span>
          <Link href="/register" className="text-xs font-bold text-black underline hover:text-neutral-600">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-16 text-center text-neutral-500">Loading sign in...</div>}>
      <LoginContent />
    </Suspense>
  );
}
