'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth/useAuthStore';
import { useHydrated } from '@/lib/cart/useHydrated';
import { User, Package, MapPin, LogOut, ShieldCheck } from 'lucide-react';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isHydrated = useHydrated();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const loginAsDemoCollector = useAuthStore((state) => state.loginAsDemoCollector);

  if (!isHydrated) {
    return <div className="p-16 text-center text-neutral-500">Loading Account Portal...</div>;
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-neutral-100 mx-auto flex items-center justify-center text-neutral-600">
          <User className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-black">Sign In Required</h1>
        <p className="text-sm text-neutral-600 max-w-md mx-auto">
          Please sign in to access your collector profile, view order history, and verify assigned Authenticity TAGs.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-black text-white font-bold text-xs uppercase tracking-wider"
          >
            Go to Sign In
          </Link>
          <button
            type="button"
            onClick={loginAsDemoCollector}
            className="w-full sm:w-auto px-8 py-3 rounded-xl border border-black bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-neutral-100"
          >
            Instant Collector Demo Session
          </button>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: 'Profile Overview', href: '/account', icon: User },
    { label: 'Order History & TAGs', href: '/account/orders', icon: Package },
    { label: 'Saved Addresses', href: '/account/addresses', icon: MapPin },
  ];

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Account Top Banner */}
      <div className="border-b border-neutral-200 pb-6 mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-black text-white text-[10px] font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{user.role === 'admin' ? 'Curator Admin Account' : 'Verified Collector Account'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-black">{user.fullName}</h1>
          <p className="text-xs text-neutral-500 font-mono mt-1">{user.email}</p>
        </div>

        {user.role === 'admin' && (
          <Link
            href="/admin"
            className="px-5 py-2.5 rounded-xl border border-black bg-neutral-100 text-black font-bold text-xs uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
          >
            Go to Admin Dashboard &rarr;
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  active
                    ? 'bg-black text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:text-black'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-neutral-600 hover:bg-neutral-200 hover:text-black transition-all text-left mt-4"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9">{children}</div>
      </div>
    </div>
  );
}
