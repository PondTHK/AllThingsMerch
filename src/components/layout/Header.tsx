'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/cart/useCartStore';
import { useAuthStore } from '@/lib/auth/useAuthStore';
import { useHydrated } from '@/lib/cart/useHydrated';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const router = useRouter();

  const isHydrated = useHydrated();
  const items = useCartStore((s) => s.items);
  const storedUser = useAuthStore((s) => s.user);

  const cartCount = isHydrated ? items.reduce((sum, i) => sum + i.quantity, 0) : 0;
  const user = isHydrated ? storedUser : null;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const baseLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/products' },
    { label: 'Collection', href: '/products?category=formula-1' },
    { label: 'Verify TAG', href: '/verify' },
  ];

  const navLinks = user?.role === 'admin'
    ? [...baseLinks, { label: 'Admin', href: '/admin' }]
    : baseLinks;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand */}
        <Link href="/" className="flex items-center gap-1 group">
          <span className="font-black tracking-tight text-black text-xl sm:text-2xl">
            AllThingsMerch
          </span>
        </Link>

        {/* Center: Clean Nav matching prototype */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-neutral-600 hover:text-black transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right: Action Controls matching prototype */}
        <div className="flex items-center gap-3">
          {/* Quick Search Trigger */}
          <button
            type="button"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Search products"
            className="p-2 text-neutral-700 hover:text-black transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* User Account */}
          <Link
            href={user ? '/account' : '/login'}
            aria-label="User Account"
            className="p-2 text-neutral-700 hover:text-black transition-colors hidden sm:flex items-center gap-1.5"
          >
            <User className="w-5 h-5" />
            {user && (
              <span className="text-xs font-bold text-black uppercase tracking-wider">
                {user.fullName.split(' ')[0]}
              </span>
            )}
          </Link>

          {/* Shopping Cart Button */}
          <Link
            href="/cart"
            aria-label="Shopping Cart"
            className="relative p-2 text-neutral-700 hover:text-black transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-black text-white font-bold text-[10px] flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="md:hidden p-2 text-neutral-700 hover:text-black"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Expandable Search Bar Modal/Drawer */}
      {searchOpen && (
        <div className="border-t border-neutral-200 bg-neutral-50 px-4 py-3">
          <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto relative flex items-center">
            <Search className="w-5 h-5 absolute left-3 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search merchandise, F1 apparel, artist drops..."
              className="w-full pl-10 pr-24 py-2.5 rounded-xl bg-white border border-neutral-300 text-sm text-black placeholder:text-neutral-400 focus:outline-none focus:border-black"
              autoFocus
            />
            <button
              type="submit"
              className="absolute right-1.5 px-4 py-1.5 rounded-lg bg-black hover:bg-neutral-800 text-white font-bold text-xs transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {/* Responsive Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white px-4 py-6 space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search merchandise..."
              className="w-full pl-9 pr-20 py-2 rounded-lg bg-neutral-100 border border-neutral-300 text-sm text-black focus:outline-none focus:border-black"
            />
            <button
              type="submit"
              className="absolute right-1.5 px-3 py-1 rounded bg-black text-white text-xs font-bold"
            >
              Search
            </button>
          </form>

          <nav className="flex flex-col gap-2">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-800 hover:bg-neutral-100"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={user ? '/account' : '/login'}
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider text-black hover:bg-neutral-100 flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              <span>{user ? `My Account (${user.fullName.split(' ')[0]})` : 'Sign In / Register'}</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
