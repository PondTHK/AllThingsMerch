# Code Standards

## General

- โมดูลแต่ละชิ้นต้องมีหน้าที่เดียว (Single-purpose) — ห้าม Component หรือ Route Handler ทำหลายอย่างพร้อมกัน
- แก้ Root Cause เสมอ อย่าวาง Workaround ซ้อนทับ Bug เดิม
- Business Logic ต้องอยู่ใน `src/lib/` เท่านั้น ห้ามเขียน Logic ใน Page Component โดยตรง
- ห้ามผสม UI changes กับ Backend/Logic changes ในการ Commit เดียวกัน

## TypeScript

- ใช้ `strict` mode ตลอดทั้งโปรเจกต์ (กำหนดใน `tsconfig.json` แล้ว)
- ห้ามใช้ `any` — ให้ใช้ Interface ที่ชัดเจน หรือ Type Narrowing ด้วย `unknown` แทน
- ทุก Input จากภายนอก (Form, API request body, localStorage) ต้องผ่าน Zod validation ก่อนนำไปใช้งาน
- ทุก Type และ Interface ต้องอยู่ในไฟล์ `src/types/` เพื่อให้ใช้ร่วมกันได้ทั้งโปรเจกต์

## Next.js (App Router)

- ใช้ Server Component เป็น Default — ใส่ `'use client'` เฉพาะเมื่อต้องการ Browser Interactivity (state, event, browser API)
- Route Handler ใน `app/api/` ต้องตรวจสอบ Auth และ Ownership ก่อน Mutation ทุกครั้ง
- ห้ามใส่ Logic การ Fetch ข้อมูลหลักไว้ใน Page Component โดยตรง — ใช้ผ่าน Repository Pattern
- ชื่อ Feature Branch ใช้รูปแบบ `feature/[feature-name]` เสมอ

## Styling

- ใช้ Tailwind CSS utility classes ตามที่กำหนดใน `ui-context.md`
- ไม่ใช้ค่าสีแบบ Hardcoded hex ใน JSX — ให้ใช้ Tailwind class เท่านั้น (เช่น `text-black`, `bg-neutral-100`)
- Border Radius: ใช้ `rounded-xl` สำหรับ Input/Button, `rounded-2xl` สำหรับ Card/Panel
- ทุก Interactive Element ต้องมีสถานะ `hover`, `focus`, `disabled`, และ `loading`

## Commit Convention (Conventional Commits)

- `feat:` — เพิ่มฟีเจอร์ใหม่
- `fix:` — แก้ Bug
- `test:` — เพิ่มหรือแก้ไข Test
- `docs:` — แก้ Documentation
- `chore:` — งาน Setup, Config, Dependencies
- `ci:` — เปลี่ยนแปลง CI/CD Pipeline
- ตัวอย่างที่ถูกต้อง: `feat: implement coupon validation logic and checkout UI`
- **ห้ามรวมงานหลาย Feature ใน Commit เดียว** — ให้แตก Commit ตาม Concern

## API Routes

- ตรวจสอบและ Parse Input ด้วย Zod ก่อน Logic ทุก Route
- ตรวจสอบ Auth และ Role ก่อน Mutation ทุกครั้ง (ห้ามพึ่ง UI เพียงอย่างเดียว)
- Return Response ที่มีโครงสร้างสม่ำเสมอ: `{ data: ... }` หรือ `{ error: string }`

## Data and Storage

- ข้อมูล Relational ทั้งหมด (Products, Orders, Users, Contracts) อยู่ใน Supabase PostgreSQL
- Demo Mode ใช้ In-memory/localStorage ผ่าน `DemoRepository` ใน `src/lib/repositories/`
- ห้ามเก็บ Blob ขนาดใหญ่ (รูปภาพ) ลงในฐานข้อมูล — ให้ใช้ Supabase Storage และเก็บแค่ URL
- Order Item ต้องเก็บ Snapshot (ชื่อสินค้า, ราคา, SKU, Royalty Rate) ณ เวลาสั่งซื้อเสมอ

## File Organization

- `src/app/` — Pages, Layouts, API Routes (Next.js App Router)
- `src/lib/` — Business Logic, Repository Pattern, Stores, Utilities
- `src/components/` — UI Components แยกตาม domain (`ui/`, `layout/`, `products/`, `cart/`, `admin/`)
- `src/types/` — TypeScript Interface ทั้งหมดของโปรเจกต์
- `supabase/migrations/` — SQL Migration files เท่านั้น ห้ามใส่ Business Logic
- `tests/unit/` — Unit Tests ด้วย Vitest
- `tests/e2e/` — End-to-End Tests ด้วย Playwright
