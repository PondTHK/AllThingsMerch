'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, User, Menu, X, ShieldCheck, ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: 'Catalog', href: '/products' },
    { label: 'Formula 1', href: '/products?category=formula-1' },
    { label: 'Artist Merch', href: '/products?category=music-merch' },
    { label: 'Football Kits', href: '/products?category=football-kits' },
    { label: 'Collectibles', href: '/products?category=collectibles' },
    { label: 'Verify TAG', href: '/verify/DEMO-TAG-2026', highlight: true },
  ];

  return (
    <header className="sticky top-0 z-50 bg-neutral-950/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center font-black text-black text-lg shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            AM
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold tracking-tight text-white text-lg leading-tight">
              AllThings<span className="text-emerald-400">Merch</span>
            </span>
            <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold -mt-1">
              Licensed & Authenticated
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors ${
                item.highlight
                  ? 'flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                  : 'text-neutral-300 hover:text-white'
              }`}
            >
              {item.highlight && <ShieldCheck className="w-4 h-4" />}
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search Trigger */}
          <button
            type="button"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Search products"
            className="p-2 rounded-full text-neutral-300 hover:text-white hover:bg-neutral-900 transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Admin Demo Link */}
          <Link
            href="/admin"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs text-neutral-300 transition-colors font-medium"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Admin</span>
          </Link>

          {/* Account */}
          <Link
            href="/login"
            aria-label="User Account"
            className="p-2 rounded-full text-neutral-300 hover:text-white hover:bg-neutral-900 transition-colors"
          >
            <User className="w-5 h-5" />
          </Link>

          {/* Shopping Cart Button */}
          <Link
            href="/cart"
            aria-label="Shopping Cart"
            className="relative p-2 rounded-full text-neutral-300 hover:text-white hover:bg-neutral-900 transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-500 text-black font-extrabold text-[10px] flex items-center justify-center">
              0
            </span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="lg:hidden p-2 rounded-lg text-neutral-300 hover:text-white hover:bg-neutral-900"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Expandable Search Bar Modal/Drawer */}
      {searchOpen && (
        <div className="border-t border-white/10 bg-neutral-900/95 px-4 py-3">
          <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto relative flex items-center">
            <Search className="w-5 h-5 absolute left-3 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาสินค้า เช่น Ferrari, Travis Scott, Real Madrid, KAWS..."
              className="w-full pl-10 pr-24 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500"
              autoFocus
            />
            <button
              type="submit"
              className="absolute right-1.5 px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-colors"
            >
              ค้นหา
            </button>
          </form>
        </div>
      )}

      {/* Responsive Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-neutral-950 px-4 py-6 space-y-4">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาสินค้า..."
              className="w-full pl-9 pr-20 py-2 rounded-lg bg-neutral-900 border border-white/10 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="absolute right-1.5 px-3 py-1 rounded bg-emerald-500 text-black text-xs font-bold"
            >
              ค้นหา
            </button>
          </form>

          <nav className="flex flex-col gap-2">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium ${
                  item.highlight
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'text-neutral-300 hover:bg-neutral-900'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-medium text-amber-400 hover:bg-neutral-900 flex items-center gap-2"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Admin Dashboard (Demo)</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
