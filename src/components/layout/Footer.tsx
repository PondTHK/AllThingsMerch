import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowUpRight } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-neutral-950 border-t border-white/10 text-neutral-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center font-black text-black text-sm">
                AM
              </div>
              <span className="font-extrabold tracking-tight text-white text-lg">
                AllThings<span className="text-emerald-400">Merch</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-neutral-400">
              ร้านจำหน่ายสินค้าลิขสิทธิ์แท้ 100% Formula 1 เสื้อศิลปิน เสื้อทีมฟุตบอล และของสะสม
              พร้อมระบบรับรอง Authenticity TAG และคำนวณส่วนแบ่ง Royalty อัตโนมัติ
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                1-to-1 Verified TAGs
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Catalog & Drops
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  สินค้าทั้งหมด (All Merchandise)
                </Link>
              </li>
              <li>
                <Link href="/products?category=formula-1" className="hover:text-white transition-colors">
                  Formula 1 Racing Apparel
                </Link>
              </li>
              <li>
                <Link href="/products?category=music-merch" className="hover:text-white transition-colors">
                  Artist & Concert Merch
                </Link>
              </li>
              <li>
                <Link href="/products?category=football-kits" className="hover:text-white transition-colors">
                  Official Football Match Kits
                </Link>
              </li>
              <li>
                <Link href="/products?category=collectibles" className="hover:text-white transition-colors">
                  Art Toys & Collectibles
                </Link>
              </li>
            </ul>
          </div>

          {/* Verification & Admin */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Authenticity & Systems
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/verify/DEMO-TAG-2026" className="hover:text-white transition-colors inline-flex items-center gap-1">
                  <span>ตรวจสอบ Authenticity TAG</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">
                  Admin Dashboard (Demo Mode)
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="hover:text-white transition-colors">
                  ประวัติคำสั่งซื้อ (Order History)
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-white transition-colors">
                  ตะกร้าสินค้า (Shopping Cart)
                </Link>
              </li>
            </ul>
          </div>

          {/* Academic & Portfolio Info */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Project Portfolio
            </h4>
            <p className="text-xs text-neutral-400 mb-4">
              จัดทำเพื่อเป็นโปรเจกต์สาธิตระบบ Full-stack Web Application และ Digital Platform Portfolio
            </p>
            <div className="p-3 rounded-xl bg-neutral-900 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">Mode:</span>
                <span className="text-emerald-400 font-semibold">Demo / Local Operable</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">Database:</span>
                <span className="text-white font-medium">Supabase / Memory Adapter</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} AllThingsMerch. All rights reserved. Portfolio Project.</p>
          <div className="flex items-center gap-6">
            <span className="text-neutral-500">Inspired by modern streetwear & collector marketplaces</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
