# Architecture Context

## Stack

| Layer     | Technology                        | Role                                                               |
| --------- | --------------------------------- | ------------------------------------------------------------------ |
| Framework | Next.js 16 + TypeScript (strict)  | App Router, SSR/SSG, API Routes                                    |
| UI        | Tailwind CSS v4 + Lucide React    | Styling System ด้วย Monochrome Editorial Design                    |
| Auth      | Supabase Auth                     | การ Login/Register, Session Management, JWT                        |
| Database  | Supabase PostgreSQL + RLS         | ข้อมูล Products, Orders, Tags, Contracts, Reviews                  |
| Storage   | Supabase Storage                  | รูปภาพสินค้า                                                       |
| State     | Zustand + localStorage            | Cart State และ Demo Mode State (auth, admin)                       |
| Validation| Zod + React Hook Form             | Form Validation และ Server-side Input Parsing                      |
| Testing   | Vitest + Playwright               | Unit Tests และ E2E Smoke Tests                                     |
| CI        | GitHub Actions                    | Lint, Typecheck, Test, Build ทุก PR ไปยัง main และ develop        |
| Deploy    | Vercel                            | Production Deployment Target                                       |

## System Boundaries

- `src/app/` — Next.js App Router: Route Pages, Layouts, API Routes แต่ละ route รับผิดชอบเรื่องของตัวเองเท่านั้น
- `src/lib/` — Business Logic: Auth, Cart, Admin Store, Money, Order Fulfillment, Repository Pattern
- `src/lib/repositories/` — Data Adapter Layer: `DemoRepository` (in-memory) และ `SupabaseRepository` (cloud) สลับกันโดยอัตโนมัติตาม environment variable
- `src/components/` — Reusable UI Components แยกตาม domain (ui, layout, products, cart, admin)
- `src/types/` — TypeScript Interfaces และ Domain Models ใช้ร่วมกันทั้งโปรเจกต์
- `supabase/migrations/` — SQL Schema Definitions, RLS Policies
- `tests/` — Unit Tests (`tests/unit/`) และ E2E Tests (`tests/e2e/`)

## Storage Model

- **Supabase PostgreSQL**: ข้อมูลหลักทั้งหมด ได้แก่ Products, Variants, Orders, Order Items, Authenticity Tags, License Contracts, Royalty Transactions, Reviews, Profiles, Addresses, Coupons, Stock Movements
- **Zustand + localStorage (Demo Mode)**: จำลอง Cart State, Auth State, Admin Operations, Order History เมื่อไม่มี Supabase credentials
- **Supabase Storage**: รูปภาพสินค้าที่ Upload โดย Admin

## Auth and Access Model

- ผู้ใช้ทุกคน Login/Register ผ่าน Supabase Auth (`supabase.auth`)
- ทุก User มี Profile record ในตาราง `profiles` ที่ระบุ `role`: `customer`, `admin`, หรือ `license_holder`
- **Customer**: อ่าน Catalog สาธารณะ + จัดการ Order, Address, Review และ TAG ของตัวเองเท่านั้น (RLS)
- **Admin**: จัดการสินค้า, สต๊อก, Order, สัญญาลิขสิทธิ์, คูปอง และดูรายงาน Royalty ได้ทั้งหมด
- การตรวจสอบ Role ต้องทำฝั่ง Server ทุกครั้ง ห้ามพึ่งแค่ UI ในการป้องกัน
- Demo Mode ใช้ Zustand Store จำลอง Auth State แทน โดยมีปุ่ม "Instant Demo Login" ใน UI

## Invariants

1. **ราคาต้องถูกยืนยันฝั่ง Server ทุกครั้ง** — ห้ามเชื่อราคาที่ส่งมาจาก Browser ตอน Checkout
2. **Stock ต้องไม่ติดลบ** — การสร้าง Order และลด Stock ต้องทำแบบ Atomic transaction
3. **ทุกการเปลี่ยนแปลง Stock ต้องสร้าง `stock_movement` record** — ห้าม update stock_quantity โดยตรงโดยไม่มี Audit Trail
4. **Authenticity TAG ต้องใช้ Random Code ที่คาดเดายาก** — ห้ามใช้ Running Number เพียงอย่างเดียว
5. **Order Item ต้องเก็บ Snapshot** — ชื่อสินค้า, SKU, ราคา, Royalty Rate ณ เวลาสั่งซื้อต้องไม่เปลี่ยนแปลงเมื่อ Product ถูกแก้ไขภายหลัง
6. **Service Role Key ต้องอยู่ใน Server เท่านั้น** — ห้าม Expose ผ่าน `NEXT_PUBLIC_` prefix
7. **Demo Mode ต้องแยก Logic ออกจาก Production** — ผ่าน Repository Pattern ใน `src/lib/repositories/`
