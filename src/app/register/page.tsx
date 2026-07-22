'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/auth/useAuthStore';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !email.trim() || !password) {
      setError('Please complete all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const client = getSupabaseBrowserClient();
    if (!client) {
      setError('Supabase credentials are not configured. Real authentication required.');
      setLoading(false);
      return;
    }

    const { data, error: signUpError } = await client.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
          phone: phone.trim(),
          role: 'customer',
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      login({
        id: data.user.id,
        email: data.user.email || email.trim(),
        fullName: data.user.user_metadata?.full_name || fullName.trim(),
        phone: phone.trim(),
        role: 'customer',
        createdAt: data.user.created_at || new Date().toISOString(),
      });
      setLoading(false);
      router.push('/account');
    } else {
      setError('No user returned from Supabase registration.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-16 transition-colors">
      <div className="rounded-3xl bg-surface border border-border p-8 sm:p-10 space-y-8 transition-colors shadow-sm">
        <div className="text-center space-y-2 border-b border-border pb-6 transition-colors">
          <h1 className="text-3xl font-black text-foreground transition-colors">Create Collector Account</h1>
          <p className="text-xs uppercase tracking-wider text-muted transition-colors">
            Register to Track Verified Merch, TAGs &amp; Order History
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1 transition-colors">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full Name"
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-sm font-medium text-foreground focus:outline-none focus:border-foreground transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1 transition-colors">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-sm font-medium text-foreground focus:outline-none focus:border-foreground transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1 transition-colors">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0XX-XXX-XXXX"
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-sm font-medium text-foreground focus:outline-none focus:border-foreground transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1 transition-colors">
                Password *
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

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted mb-1 transition-colors">
                Confirm Password *
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-sm font-medium text-foreground focus:outline-none focus:border-foreground transition-colors"
              />
            </div>
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
            <UserPlus className="w-4 h-4" />
            <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
          </button>
        </form>

        <div className="text-center pt-2 border-t border-border transition-colors">
          <span className="text-xs text-muted transition-colors">Already Registered? </span>
          <Link href="/login" className="text-xs font-bold text-foreground underline hover:text-muted transition-colors">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
