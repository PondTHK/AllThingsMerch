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
    <div className="lg:col-span-3 space-y-1.5">
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
  );
}
