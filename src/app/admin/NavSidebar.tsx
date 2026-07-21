'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Layers,
  ClipboardList,
  FileText,
  ShieldCheck,
  FolderTree,
  Ticket,
  BarChart2,
} from 'lucide-react';

const navItems = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Catalog Products', href: '/admin/products', icon: Package },
  { label: 'Inventory & Stock', href: '/admin/inventory', icon: Layers },
  { label: 'Customer Orders', href: '/admin/orders', icon: ClipboardList },
  { label: 'Authenticity TAGs', href: '/admin/tags', icon: ShieldCheck },
  { label: 'Licensed Brands', href: '/admin/brands', icon: ShieldCheck },
  { label: 'Categories', href: '/admin/categories', icon: FolderTree },
  { label: 'License Contracts', href: '/admin/contracts', icon: FileText },
  { label: 'Royalty Report', href: '/admin/royalties', icon: BarChart2 },
  { label: 'Coupons', href: '/admin/coupons', icon: Ticket },
];

export function NavSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white/40 backdrop-blur-xl border-r border-white/60 h-full flex flex-col shrink-0 shadow-[4px_0_24px_rgb(0,0,0,0.01)]">
      <div className="p-6">
        <div className="inline-block px-3 py-1 rounded-md bg-blue-500/10 text-blue-700 text-[10px] font-bold uppercase tracking-wider mb-2 border border-blue-500/20 shadow-sm backdrop-blur-md">
          Admin Portal
        </div>
        <div className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-br from-slate-900 to-slate-600 tracking-tight">MerchOps</div>
      </div>
      <nav className="flex-1 overflow-y-auto px-4 pb-6 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                active
                  ? 'bg-blue-600/10 text-blue-700 shadow-sm border border-blue-600/20'
                  : 'text-slate-600 hover:bg-white/60 hover:text-slate-900 hover:shadow-sm border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 transition-colors duration-300 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
