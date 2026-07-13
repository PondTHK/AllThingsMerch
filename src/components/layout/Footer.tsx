'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      alert(`Subscribed: ${email}`);
      setEmail('');
    }
  };

  return (
    <footer className="bg-black text-white py-14 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          {/* Brand & Description */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-black tracking-tight text-white text-2xl">
                AllThingsMerch
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-neutral-400 max-w-sm">
              Official licensed merchandise from your favorite Formula 1 teams, music artists, and collectible brands. Every item includes 1-to-1 Verified Authenticity TAG tracking.
            </p>
          </div>

          {/* Newsletter Box matching prototype */}
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-wider font-semibold text-neutral-300">
              Subscribe to our news letter
            </span>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email..."
                required
                className="flex-1 px-4 py-2.5 rounded-lg bg-white text-black placeholder:text-neutral-500 text-sm focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Join
              </button>
            </form>
          </div>

          {/* Quick Links matching prototype */}
          <div className="md:text-right space-y-3">
            <span className="text-xs uppercase tracking-wider font-semibold text-neutral-300 block">
              Quick Links
            </span>
            <ul className="space-y-1.5 text-xs text-neutral-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/products?category=formula-1" className="hover:text-white transition-colors">
                  Collection
                </Link>
              </li>
              <li>
                <Link href="/verify/DEMO-TAG-2026" className="hover:text-white transition-colors">
                  Verify Authenticity TAG
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">
                  Admin Demo
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>&copy; {new Date().getFullYear()} AllThingsMerch. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Official Licensed Platform</span>
            <span>1-to-1 TAG Verified</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
