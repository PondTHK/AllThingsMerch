'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { useCartStore } from '@/lib/cart/useCartStore';
import { useAuthStore } from '@/lib/auth/useAuthStore';
import { useHydrated } from '@/lib/cart/useHydrated';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const isHydrated = useHydrated();
  const items = useCartStore((s) => s.items);
  const storedUser = useAuthStore((s) => s.user);
  const releaseExpiredReservation = useCartStore((s) => s.releaseExpiredReservation);

  useEffect(() => {
    if (isHydrated) {
      releaseExpiredReservation();
      const interval = setInterval(() => {
        releaseExpiredReservation();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isHydrated, releaseExpiredReservation]);

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

  if (pathname?.startsWith('/admin')) return null;

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand */}
        <Link href="/" className="flex items-center gap-1 group">
          <span className="font-black tracking-tight text-foreground text-xl sm:text-2xl transition-colors">
            AllThingsMerch
          </span>
        </Link>

        {/* Center: Clean Nav matching prototype */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right: Action Controls matching prototype */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search Trigger */}
          <button
            type="button"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Search products"
            className="p-2 text-muted hover:text-foreground transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Theme Switcher Toggle */}
          <ThemeToggle />

          {/* User Account */}
          <Link
            href={user ? '/account' : '/login'}
            aria-label="User Account"
            className="p-2 text-muted hover:text-foreground transition-colors hidden sm:flex items-center gap-1.5"
          >
            <User className="w-5 h-5" />
            {user && (
              <span className="text-xs font-bold text-foreground uppercase tracking-wider">
                {user.fullName.split(' ')[0]}
              </span>
            )}
          </Link>

          {/* Shopping Cart Button */}
          <Link
            href="/cart"
            aria-label="Shopping Cart"
            className="relative p-2 text-muted hover:text-foreground transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground font-bold text-[10px] flex items-center justify-center transition-colors">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="md:hidden p-2 text-muted hover:text-foreground"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Expandable Search Bar Modal/Drawer */}
      {searchOpen && (
        <div className="border-t border-border bg-surface px-4 py-3 transition-colors">
          <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto relative flex items-center">
            <Search className="w-5 h-5 absolute left-3 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search merchandise, F1 apparel, artist drops..."
              className="w-full pl-10 pr-24 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-foreground transition-colors"
              autoFocus
            />
            <button
              type="submit"
              className="absolute right-1.5 px-4 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 font-bold text-xs transition-opacity"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {/* Responsive Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-6 space-y-4 transition-colors">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search merchandise..."
              className="w-full pl-9 pr-20 py-2 rounded-lg bg-surface border border-border text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-foreground transition-colors"
            />
            <button
              type="submit"
              className="absolute right-1.5 px-3 py-1 rounded bg-primary text-primary-foreground text-xs font-bold transition-opacity"
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
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-surface transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={user ? '/account' : '/login'}
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider text-foreground hover:bg-surface flex items-center gap-2 transition-colors"
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
