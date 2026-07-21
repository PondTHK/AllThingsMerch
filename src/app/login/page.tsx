'use client';

import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { Lock, UserCheck, ShieldAlert, ArrowRight } from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams?.get('redirect') || '/account';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDemoCollectorLogin = async () => {
    setError(null);
    setIsSubmitting(true);
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setError('Supabase not configured.');
      setIsSubmitting(false);
      return;
    }
    
    // In production, you would probably just pre-fill the form, 
    // but here we attempt to login with a known test user
    const { error } = await supabase.auth.signInWithPassword({
      email: 'collector@allthingsmerch.demo',
      password: 'password123',
    });
    
    if (error) {
      setError(error.message);
    } else {
      router.push(redirect);
      router.refresh();
    }
    setIsSubmitting(false);
  };

  const handleDemoAdminLogin = () => {
    setEmail('admin@admin.com');
    // We don't auto-submit since we don't know the user's password for this real account.
    // Focus the password input for convenience.
    document.querySelector<HTMLInputElement>('input[type="password"]')?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!email || !password) {
      setError('Please provide both email address and password.');
      setIsSubmitting(false);
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setError('Supabase not configured.');
      setIsSubmitting(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setError(error.message);
      setIsSubmitting(false);
    } else {
      router.push(redirect);
      router.refresh();
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

        {/* Quick Demo Logins */}
        <div className="space-y-3 p-5 rounded-2xl bg-white border border-neutral-300">
          <div className="flex items-center gap-2 text-xs font-bold text-black uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            <span>Instant Demo Session Access</span>
          </div>
          <p className="text-xs text-neutral-600">
            Test full customer or admin capabilities without password credentials:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={handleDemoCollectorLogin}
              className="py-2.5 px-4 rounded-xl bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Collector Demo</span>
            </button>

            <button
              type="button"
              onClick={handleDemoAdminLogin}
              className="py-2.5 px-4 rounded-xl border border-black bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-neutral-100 transition-colors flex items-center justify-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Demo</span>
            </button>
          </div>
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
              placeholder="collector@allthingsmerch.demo"
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
            disabled={isSubmitting}
            className="w-full py-4 rounded-xl bg-black text-white font-bold text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Signing In...' : 'Sign In'}</span>
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
