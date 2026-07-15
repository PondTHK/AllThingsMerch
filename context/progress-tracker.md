# Progress Tracker

อัปเดตไฟล์นี้หลังจาก Implement แต่ละ Feature Unit เสร็จ

## Current Phase

- Milestone 9 เสร็จสมบูรณ์ (v1.0.0 ถูก Merge เข้า `main` แล้ว) — ขณะนี้อยู่ระหว่างพัฒนาฟีเจอร์เพิ่มเติม

## Current Goal

- พัฒนาระบบรายงานส่วนแบ่งลิขสิทธิ์และรายงานยอดขาย (Royalty & Sales Reports Dashboard)

## Completed

- **Milestone 1** — Project Foundation: Next.js 16, TypeScript strict, Tailwind CSS v4, ESLint, Vitest, GitHub Actions CI
- **Milestone 2** — Design System & Storefront Shell: Monochrome editorial UI, Header, Footer, Home Page
- **Milestone 3** — Product Catalog: Filtering, Sorting, Search, Product Detail, Variant Selection, Low-stock badges
- **Milestone 4** — Shopping Cart & Mock Checkout: Zustand cart, Coupon code placeholder (`F1WELCOME`), THB money formatting, Mock order fulfillment, Order success page
- **Milestone 5** — Supabase Foundation: 13-table SQL Schema, RLS Policies, Seed Data, Repository Pattern (`DemoRepository` / `SupabaseRepository`)
- **Milestone 6** — Customer Auth & Account: Register, Login, Logout, Account Portal, Address Book, Order History
- **Milestone 7** — Admin Portal: Dashboard, Product CRUD, Stock Management, Order Management, License Contracts
- **Milestone 8** — Authenticity TAG System: TAG Generation (1 ชิ้น = 1 TAG), Public Verification Page (`/verify/[code]`), Admin TAG Registry
- **Milestone 9** — QA & Documentation: Vitest unit tests (7 suites, 22 tests), Playwright E2E smoke test, GitHub Actions CI (`ci.yml`), Architecture docs

### งานที่ bew เพิ่มเติม (branch: bew)

- **Context Files** — เขียนเอกสาร Context ทั้ง 6 ไฟล์ใน `context/` ให้ตรงกับโปรเจกต์จริง (project-overview, architecture, code-standards, ui-context, ai-workflow-rules, progress-tracker)
- **Merge priest's seed update** — Merge `origin/priest` เข้า `bew` เพื่อรับ Supabase seed script ที่อัปเดตข้อมูล brands, categories, products (`supabase/seed.sql`)
- **Feature: Coupon System** — เพิ่มช่องกรอก Coupon Code ในหน้า Checkout, เขียน Logic ตรวจสอบและคำนวณส่วนลด, สร้างหน้า Admin Coupon CRUD (`/admin/coupons`), รองรับการกำหนด Max global uses และ Max uses per user, รวมทั้งเขียน SQL migration สำหรับ Supabase และอัปเดตโมเดล DemoRepository
- **Feature: Royalty & Sales Reports Dashboard** — พัฒนาระบบรายงานยอดขายและส่วนแบ่งลิขสิทธิ์ฝั่ง Admin รวมถึงการ Snapshot อัตราลิขสิทธิ์ตอนสั่งซื้อสินค้า โดยมีระบบ Reversal ย้อนธุรกรรมเมื่อยกเลิกออเดอร์ตามคู่มือ SADS

<!-- เพิ่ม bullet ใหม่ที่นี่ทุกครั้งที่ทำ Feature เสร็จ -->

## In Progress

- ไม่มี

## Next Up

- **Feature: Reviews & Ratings** — ระบบรีวิวสินค้าหลัง Order ถูก Delivered, แสดงคะแนนดาว in Product Detail, Admin Review Moderation

## Open Questions

- Reviews: ต้องการ Moderation (Admin approve ก่อน publish) หรือ Auto-publish ทันที?

## Architecture Decisions

- ใช้ Dual-Mode Repository Pattern (`getRepository()`) เพื่อแยก Demo Mode ออกจาก Supabase Mode — ทำให้ทดสอบได้โดยไม่ต้องมี Database จริง
- ใช้ Zustand สำหรับ Cart State และ Demo Auth/Admin State แทน React Context เพื่อให้ Persist ข้าม Session ได้ง่ายผ่าน localStorage
- Order Item ใช้ Snapshot Pattern — เก็บชื่อสินค้า, ราคา, SKU, Royalty Rate ณ เวลาสั่งซื้อ ป้องกัน Historical order เปลี่ยนเมื่อ Product ถูกแก้ไข
- Authenticity TAG ใช้ Random Hex suffix เพิ่มท้าย Order Number เพื่อให้ Public Code คาดเดายาก

## Session Notes

— งานที่เพิ่มเติมใหม่ต้องตั้งค่า `git config user.name` ให้ถูกต้องก่อนเริ่ม Commit
- Deploy Target คือ Vercel — ยังไม่ได้ Deploy ขึ้น Production
- CI (`ci.yml`) ผ่านทุก Job แล้ว: lint, typecheck, test, build
