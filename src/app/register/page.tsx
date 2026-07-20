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
    if (client) {
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
        setError(`Supabase Registration Error: ${signUpError.message}`);
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
        return;
      }
    }

    login({
      id: `usr-${Date.now()}`,
      email: email.trim(),
      fullName: fullName.trim(),
      phone: phone.trim(),
      role: 'customer',
      createdAt: new Date().toISOString(),
    });

    setLoading(false);
    router.push('/account');
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-16">
      <div className="rounded-3xl bg-neutral-100 border border-neutral-200 p-8 sm:p-10 space-y-8">
        <div className="text-center space-y-2 border-b border-neutral-300 pb-6">
          <h1 className="text-3xl font-black text-black">Create Collector Account</h1>
          <p className="text-xs uppercase tracking-wider text-neutral-600">
            Register to Track Verified Merch, TAGs &amp; Order History
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Thanakhon Collector"
              className="w-full px-4 py-3 rounded-xl bg-white border border-neutral-300 text-sm font-medium text-black focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
              Email Address *
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
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="089-123-4567"
              className="w-full px-4 py-3 rounded-xl bg-white border border-neutral-300 text-sm font-medium text-black focus:outline-none focus:border-black"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Password *
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

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Confirm Password *
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-white border border-neutral-300 text-sm font-medium text-black focus:outline-none focus:border-black"
              />
            </div>
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
            <UserPlus className="w-4 h-4" />
            <span>Create Account</span>
          </button>
        </form>

        <div className="text-center pt-2 border-t border-neutral-300">
          <span className="text-xs text-neutral-600">Already Registered? </span>
          <Link href="/login" className="text-xs font-bold text-black underline hover:text-neutral-600">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
