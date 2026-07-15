'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/auth/useAuthStore';
import { useAdminStore } from '@/lib/admin/useAdminStore';
import { useHydrated } from '@/lib/cart/useHydrated';
import {
  LayoutDashboard,
  Package,
  Layers,
  ClipboardList,
  FileText,
  ShieldCheck,
  ArrowLeft,
  ShieldAlert,
  Ticket,
  Coins,
  MessageSquare,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHydrated = useHydrated();
  const user = useAuthStore((state) => state.user);
  const loginAsDemoAdmin = useAuthStore((state) => state.loginAsDemoAdmin);
  const syncOrders = useAdminStore((state) => state.syncOrdersFromStorage);

  useEffect(() => {
    if (isHydrated) {
      syncOrders();
    }
  }, [isHydrated, syncOrders]);

  if (!isHydrated) {
    return <div className="p-16 text-center text-neutral-500">Loading Curator Admin Portal...</div>;
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-neutral-100 border border-black mx-auto flex items-center justify-center text-black">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-black">Curator Admin Access Required</h1>
        <p className="text-sm text-neutral-600 max-w-md mx-auto">
          This portal is reserved for authorized merchandising curators, inventory controllers, and IP licensing administrators.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => loginAsDemoAdmin()}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-black text-white font-bold text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors"
          >
            Instant Admin Demo Session
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-neutral-300 bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-neutral-100"
          >
            Return to Storefront
          </Link>
        </div>
      </div>
    );
  }

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Catalog Products', href: '/admin/products', icon: Package },
    { label: 'Inventory & Stock', href: '/admin/inventory', icon: Layers },
    { label: 'Customer Orders', href: '/admin/orders', icon: ClipboardList },
    { label: 'Authenticity TAGs', href: '/admin/tags', icon: ShieldCheck },
    { label: 'Discount Coupons', href: '/admin/coupons', icon: Ticket },
    { label: 'License Contracts', href: '/admin/contracts', icon: FileText },
    { label: 'Royalty Reports', href: '/admin/royalties', icon: Coins },
    { label: 'Customer Reviews', href: '/admin/reviews', icon: MessageSquare },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Admin Top Banner */}
      <div className="border-b border-neutral-300 pb-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-block px-2.5 py-1 rounded bg-black text-white text-[10px] font-bold uppercase tracking-wider mb-2">
            Curator Admin Control Center
          </div>
          <h1 className="text-3xl font-black text-black">Merchandise &amp; IP Operations</h1>
          <p className="text-xs text-neutral-600 mt-1">
            Logged in as <span className="font-bold text-black">{user.fullName}</span> ({user.email})
          </p>
        </div>

        <Link
          href="/"
          className="px-4 py-2.5 rounded-xl border border-neutral-300 bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-neutral-100 transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit to Storefront</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
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
        </div>

        {/* Admin Main Content Area */}
        <div className="lg:col-span-9">{children}</div>
      </div>
    </div>
  );
}
