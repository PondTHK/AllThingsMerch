import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getAllProducts, MOCK_COLLECTIONS, MOCK_BRANDS } from '@/lib/repositories/mock-data';
import { ProductCard } from '@/components/products/ProductCard';
import { ShieldCheck, Sparkles, ArrowRight, CheckCircle2, QrCode, Lock, BadgePercent } from 'lucide-react';

export default function HomePage() {
  const products = getAllProducts();
  const featuredProducts = products.slice(0, 6);

  return (
    <div className="flex flex-col min-h-screen bg-neutral-950 text-neutral-100">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-white/10">
        {/* Glow Ambient Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-emerald-600/20 via-cyan-600/15 to-transparent blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>THE COLLECTORS & LICENSED MERCH MARKETPLACE</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-none">
              AUTHENTIC <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                LICENSED MERCH
              </span>
            </h1>

            <p className="text-base sm:text-lg text-neutral-300 max-w-2xl mx-auto leading-relaxed">
              สตรีทแวร์ เสื้อทีม Formula 1 ศิลปินระดับโลก เสื้อแข่งสโมสรฟุตบอล และของสะสมลิขสิทธิ์แท้
              ทุกชิ้นยืนยันความถูกต้องด้วยระบบ <strong className="text-white">Authenticity TAG 1-to-1</strong> พร้อมระบบรายงานส่วนแบ่งลิขสิทธิ์
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/products"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm tracking-wide uppercase transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2"
              >
                <span>สำรวจสินค้าทั้งหมด (EXPLORE DROPS)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/verify/DEMO-TAG-2026"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-neutral-900 hover:bg-neutral-800 border border-white/15 text-white font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>ตรวจสอบรหัส Authenticity TAG</span>
              </Link>
            </div>

            {/* Key Trust Badges */}
            <div className="pt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left border-t border-white/10 mt-12">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-neutral-900/60 border border-white/5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">100% Official Licensed</h4>
                  <p className="text-xs text-neutral-400 mt-0.5">สินค้าถูกต้องตามสัญญาลิขสิทธิ์</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-neutral-900/60 border border-white/5">
                <QrCode className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">1-to-1 TAG Serial</h4>
                  <p className="text-xs text-neutral-400 mt-0.5">ออกรหัสตรวจสอบแยกรายชิ้น</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-neutral-900/60 border border-white/5">
                <BadgePercent className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Royalty Transparency</h4>
                  <p className="text-xs text-neutral-400 mt-0.5">บันทึก snapshot ค่าลิขสิทธิ์โปร่งใส</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BRAND TICKER / SHOWCASE */}
      <section className="py-8 bg-neutral-900/40 border-b border-white/10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
              FEATURED LICENSED BRANDS
            </span>
            <Link
              href="/products"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <span>ดูทั้งหมด</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {MOCK_BRANDS.map((brand) => (
              <Link
                key={brand.id}
                href={`/products?brand=${brand.slug}`}
                className="flex items-center justify-center p-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-xs font-semibold text-neutral-300 hover:text-white transition-all text-center"
              >
                {brand.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED COLLECTIONS */}
      <section className="py-16 sm:py-24 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                CURATED DROPS
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
                คอลเลกชันแนะนำ (Featured Collections)
              </h2>
            </div>
            <Link
              href="/products"
              className="text-sm font-semibold text-neutral-300 hover:text-white flex items-center gap-1.5"
            >
              <span>สำรวจคอลเลกชันทั้งหมด</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_COLLECTIONS.map((col) => (
              <Link
                key={col.id}
                href={`/products`}
                className="group relative h-80 sm:h-96 rounded-3xl overflow-hidden border border-white/10 bg-neutral-900 flex flex-col justify-end p-6 sm:p-8 transition-transform hover:-translate-y-1.5"
              >
                <Image
                  src={col.imageUrl}
                  alt={col.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/50 to-transparent" />

                <div className="relative z-10 space-y-2">
                  <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                    {col.subtitle}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white group-hover:text-emerald-300 transition-colors">
                    {col.title}
                  </h3>
                  <p className="text-xs text-neutral-300 line-clamp-2">{col.description}</p>
                  <div className="pt-2 flex items-center text-xs font-bold text-white group-hover:text-emerald-400">
                    <span>Explore {col.itemCount} Items</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CURATED NEW ARRIVALS & FEATURED PRODUCTS */}
      <section className="py-16 sm:py-24 border-b border-white/10 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                OFFICIAL RELEASES
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-1">
                สินค้าลิขสิทธิ์แนะนำ (Featured Drops)
              </h2>
            </div>
            <Link
              href="/products"
              className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-white/10 text-sm font-semibold text-white transition-colors flex items-center gap-2"
            >
              <span>ดูสินค้าทั้งหมด {products.length} รายการ</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE AUTHENTICITY TAG SHOWCASE */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-neutral-950 to-neutral-900 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-neutral-900 border border-white/10 p-8 sm:p-12 lg:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative z-10">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  <span>ALLTHINGSMERCH AUTHENTICITY SYSTEM</span>
                </div>

                <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
                  ระบบยืนยันสินค้าลิขสิทธิ์แท้ด้วย <br />
                  <span className="text-emerald-400">Authenticity TAG 1-to-1</span>
                </h2>

                <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                  สินค้าทุกชิ้นที่จำหน่ายและจัดส่งโดย AllThingsMerch จะมาพร้อมบัตรและแท็กเข้ารหัส
                  โดยแต่ละชิ้นมี <strong>Public Verification Code</strong> และ <strong>Serial Number</strong> ไม่ซ้ำกัน
                  ผู้ซื้อสามารถตรวจสอบสถานะออนไลน์ได้ทันที โดยไม่เปิดเผยข้อมูลส่วนบุคคล
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-neutral-200">
                    <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>สร้างรหัสแบบสุ่มที่คาดเดายาก (Secure Cryptographic Code)</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-neutral-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>สถานะชัดเจน: Valid (ถูกต้อง), Revoked (ถูกยกเลิก), หรือ Not Found</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/verify/DEMO-TAG-2026"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm transition-all"
                  >
                    <span>ลองทดสอบตรวจสอบรหัส DEMO-TAG-2026</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Tag Demo Card Visual */}
              <div className="p-6 sm:p-8 rounded-2xl bg-neutral-950 border border-emerald-500/30 shadow-2xl space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase">
                      VERIFICATION TAG PREVIEW
                    </span>
                  </div>
                  <span className="text-xs text-neutral-400 font-mono">CODE: DEMO-TAG-2026</span>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-neutral-900 border border-white/5 space-y-1">
                    <div className="text-[10px] uppercase text-neutral-400 font-semibold">Product Name</div>
                    <div className="font-bold text-white text-sm">Scuderia Ferrari 2026 Team Softshell Jacket</div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-neutral-900 border border-white/5">
                      <div className="text-[10px] uppercase text-neutral-400 font-semibold">Status</div>
                      <div className="text-xs font-bold text-emerald-400 flex items-center gap-1 mt-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>ISSUED & ACTIVE</span>
                      </div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-neutral-900 border border-white/5">
                      <div className="text-[10px] uppercase text-neutral-400 font-semibold">Serial Number</div>
                      <div className="text-xs font-mono text-white mt-1 font-semibold">SN-FER-2026-00129</div>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
                  ⚡ หมายเหตุ: หน้ายืนยันจะแสดงเฉพาะข้อมูลสินค้าและสถานะการรับรอง ไม่แสดงชื่อ ที่อยู่ หรืออีเมลของลูกค้า
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
