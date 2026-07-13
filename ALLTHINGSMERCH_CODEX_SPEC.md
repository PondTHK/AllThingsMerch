# AllThingsMerch — Development Specification for Codex

เอกสารนี้เป็นข้อกำหนดสำหรับให้ Codex พัฒนาโปรเจกต์ **AllThingsMerch** ใน VS Code โดยตรง

Repository:

```text
/Users/thanakron/Documents/GitHub/AllThingsMerch
```

## 1. เป้าหมายของโปรเจกต์

สร้างเว็บไซต์ E-commerce สำหรับขายสินค้าลิขสิทธิ์แท้ เช่น เสื้อ Formula 1 เสื้อศิลปิน เสื้อทีมฟุตบอล และของสะสม โดยได้แรงบันดาลใจจากประสบการณ์ใช้งานของเว็บไซต์แนว SASOM แต่ไม่คัดลอกชื่อ แบรนด์ เนื้อหา หรือหน้าตาแบบตรงตัว

โปรเจกต์นี้จัดทำเพื่อ:

1. ส่งเป็นโปรเจกต์ในรายวิชา DIGITAL PLATFORM FOR SOFTWARE DEVELOPMENT
2. แสดงเป็นผลงานใน GitHub Portfolio
3. สาธิตการออกแบบและพัฒนา Full-stack Web Application
4. สาธิตระบบยืนยันสินค้าลิขสิทธิ์แท้ด้วย Authenticity TAG
5. สาธิตการคำนวณส่วนแบ่งลิขสิทธิ์หรือ Royalty

ระบบในเวอร์ชันนี้เป็น **ร้านค้าเจ้าของเดียว** ไม่ใช่ Marketplace ที่เปิดให้บุคคลทั่วไปสมัครเป็นผู้ขาย

## 2. ข้อกำหนดสำคัญในการทำงานของ Codex

Codex ต้อง:

1. ตรวจสอบไฟล์และ Git status ก่อนแก้ไขทุกครั้ง
2. รักษาไฟล์เดิมของผู้ใช้และไม่ลบงานโดยไม่จำเป็น
3. พัฒนาทีละ milestone และทดสอบก่อน commit
4. ไม่เขียนโค้ดทั้งหมดแล้ว commit รวมครั้งเดียว
5. ใช้ commit message ที่อธิบายงานจริง
6. ไม่ปลอมผู้เขียน commit วันเวลา หรือประวัติ Git
7. ไม่ push ไปยัง remote โดยไม่ได้รับคำสั่งจากผู้ใช้
8. ไม่ใช้ข้อมูลลับจริง และห้าม commit `.env.local`
9. ทำให้โปรเจกต์สามารถรันใน Demo mode ได้ แม้ยังไม่ได้เชื่อม Supabase จริง
10. เมื่อจบแต่ละ milestone ให้รายงานไฟล์ที่เปลี่ยน ผลการทดสอบ และ commit hash

หากพบ requirement ที่ไม่ชัดเจน ให้เลือกแนวทางที่เหมาะกับโปรเจกต์นักศึกษาและบันทึกสมมติฐานไว้ใน README แทนการหยุดถามในรายละเอียดเล็กน้อย

## 3. Tech Stack

ใช้เทคโนโลยีต่อไปนี้:

- Next.js รุ่น stable ที่ติดตั้งได้ในวันที่เริ่มพัฒนา
- React
- TypeScript แบบ strict
- Next.js App Router
- Tailwind CSS
- shadcn/ui หรือ component ที่สร้างตามแนวทางเดียวกัน
- Supabase PostgreSQL
- Supabase Auth
- Supabase Storage สำหรับรูปสินค้า
- Row Level Security หรือ RLS
- Zod สำหรับ validation
- React Hook Form สำหรับ form ที่ซับซ้อน
- Zustand สำหรับ cart state และ local persistence
- Lucide React สำหรับ icon
- Vitest สำหรับ unit test
- Playwright สำหรับ smoke test หรือ end-to-end test
- ESLint
- GitHub Actions สำหรับ lint, typecheck, test และ build
- Vercel เป็น deployment target

ไม่ต้องใช้ Express, Redux, Microservices, Redis หรือ Queue ใน MVP เว้นแต่มีเหตุผลที่ชัดเจนและได้รับอนุญาตก่อน

## 4. Git Workflow

### Branch หลัก

- `main` — เวอร์ชันที่เสถียรและพร้อมสาธิต
- `develop` — branch รวมงานที่ผ่านการตรวจสอบเบื้องต้น

### Feature branches

สร้าง branch ตามงานจริง เช่น:

```text
feature/project-foundation
feature/storefront-design
feature/product-catalog
feature/shopping-cart
feature/mock-checkout
feature/supabase-schema
feature/authentication
feature/admin-dashboard
feature/authenticity-tags
feature/royalty-reporting
chore/testing-and-docs
```

หากเป็นการทำคนเดียวในเครื่อง ให้ merge feature branch เข้า `develop` แบบ `--no-ff` เพื่อให้ดูขอบเขตของแต่ละฟีเจอร์ได้ชัดเจน เมื่อทุกอย่างผ่านการตรวจสอบจึง merge `develop` เข้า `main`

### Commit convention

ตัวอย่าง commit ที่เหมาะสม:

```text
chore: initialize Next.js application
chore: configure linting and environment template
feat: add storefront navigation and responsive layout
feat: build product catalog and filtering
feat: persist shopping cart locally
feat: add mock checkout flow
feat: define Supabase commerce schema
feat: implement customer authentication
feat: add product and order administration
feat: generate authenticity tags for fulfilled items
feat: calculate royalty transaction snapshots
test: cover pricing and royalty calculations
ci: validate pull requests with GitHub Actions
docs: add setup guide and architecture overview
```

Commit ต้องตรงกับสิ่งที่ทำจริง ไม่ควรแตก commit เพียงเพื่อทำให้ประวัติดูเยอะ และไม่ควร commit โค้ดที่ build ไม่ผ่านหากหลีกเลี่ยงได้

## 5. User Roles

### Customer

ลูกค้าสามารถ:

1. สมัครสมาชิก เข้าสู่ระบบ และออกจากระบบ
2. แก้ไขข้อมูลส่วนตัวและที่อยู่จัดส่ง
3. ดู ค้นหา เรียงลำดับ และกรองสินค้า
4. เลือกสีหรือขนาดของสินค้า
5. เพิ่ม ปรับจำนวน และลบสินค้าในตะกร้า
6. Checkout ผ่านระบบชำระเงินจำลอง
7. ใช้คูปองส่วนลด
8. ดูสถานะและประวัติคำสั่งซื้อ
9. ตรวจสอบ Authenticity TAG ของสินค้าที่ซื้อ
10. รีวิวและให้คะแนนสินค้าที่ซื้อสำเร็จแล้ว

### Admin

ผู้ดูแลระบบสามารถ:

1. ดู Dashboard สรุปยอดขาย คำสั่งซื้อ สต๊อก และ Royalty
2. เพิ่ม แก้ไข ซ่อน และจัดการสินค้า
3. จัดการ Product Variant, SKU, ราคา และสต๊อก
4. จัดการหมวดหมู่ แบรนด์ และผู้ถือครองลิขสิทธิ์
5. จัดการสัญญาลิขสิทธิ์และอัตรา Royalty
6. ดูและอัปเดตสถานะคำสั่งซื้อ
7. ออก Authenticity TAG เมื่อคำสั่งซื้อสำเร็จ
8. จัดการคูปอง
9. ดูรายงาน Royalty

### License Holder

MVP ยังไม่ต้องมีหน้า Portal แยกสำหรับผู้ถือสิทธิ์ ให้ Admin เป็นผู้จัดการข้อมูลทั้งหมด แต่โครงสร้างฐานข้อมูลต้องรองรับการเพิ่ม role นี้ในอนาคต

## 6. MVP Scope

สิ่งที่ต้องทำให้เสร็จก่อน:

1. Responsive storefront
2. Home page
3. Product catalog
4. Product detail และ variant selection
5. Search, filter และ sort
6. Cart ที่เก็บข้อมูลใน localStorage
7. Mock checkout
8. Order success และ order history
9. Admin dashboard ขั้นพื้นฐาน
10. Product และ stock management
11. Authenticity verification page
12. Royalty calculation/report ขั้นพื้นฐาน
13. Supabase migration และ seed data
14. Demo mode ที่ใช้งานได้โดยไม่ต้องตั้ง Supabase
15. Automated checks และเอกสารติดตั้ง

### ฟีเจอร์ที่ทำหลัง Core flow สำเร็จ

- Pre-order
- Coupon administration
- Review และ rating
- Advanced analytics
- Payment gateway จริง
- API บริษัทขนส่งจริง

## 7. Out of Scope

ยังไม่ต้องทำ:

- ระบบผู้ขายหลายราย
- ระบบรับฝากขายจากบุคคลทั่วไป
- การตรวจสินค้าทางกายภาพ
- การจ่ายเงินให้ผู้ขาย
- ระบบข้อพิพาทและคืนเงินเต็มรูปแบบ
- ระบบบัญชีองค์กร
- ระบบคลังสินค้าหลายสาขา
- Native mobile application
- Blockchain หรือ NFT สำหรับ TAG
- Payment gateway จริงสำหรับงาน Demo

## 8. UI/UX Direction

ออกแบบให้มีลักษณะ premium streetwear และ collectibles marketplace โดยใช้เอกลักษณ์ของ AllThingsMerch เอง

แนวทาง:

- Mobile-first และ responsive
- เน้นภาพสินค้า การจัดวางสะอาด และ whitespace
- สีพื้นโทน neutral เช่น off-white, charcoal และสี accent ที่จำง่าย
- Card และ control ต้องมีสถานะ hover, focus, disabled และ loading
- Navigation ต้องเข้าถึง Catalog, New Arrivals, Brands, Collections และ Authenticity
- แสดงราคาเป็นเงินบาท เช่น `฿3,490`
- รองรับข้อความภาษาไทยเป็นหลัก แต่ชื่อสินค้าและแบรนด์ใช้ภาษาอังกฤษได้
- ทุก form ต้องมี label, validation message และ keyboard focus ที่ชัดเจน
- หลีกเลี่ยงการคัดลอก layout, copywriting หรือ visual identity ของ SASOM โดยตรง

### หน้าหลักที่ต้องมี

```text
/
/products
/products/[slug]
/collections/[slug]
/cart
/checkout
/checkout/success
/login
/register
/account
/account/orders
/account/orders/[id]
/verify/[code]
/admin
/admin/products
/admin/products/new
/admin/products/[id]
/admin/orders
/admin/orders/[id]
/admin/licenses
/admin/royalties
```

## 9. Data Model

ใช้ UUID เป็น primary key และใช้ `timestamptz` สำหรับวันเวลา

### ตารางหลัก

#### profiles

```text
id uuid PK references auth.users
display_name text
phone text nullable
role enum(customer, admin, license_holder)
avatar_url text nullable
created_at timestamptz
updated_at timestamptz
```

#### addresses

```text
id uuid PK
user_id uuid FK
recipient_name text
phone text
address_line_1 text
address_line_2 text nullable
district text
province text
postal_code text
is_default boolean
```

#### brands

```text
id uuid PK
name text
slug text unique
description text nullable
logo_url text nullable
is_active boolean
```

#### categories

```text
id uuid PK
name text
slug text unique
parent_id uuid nullable FK categories
```

#### license_holders

```text
id uuid PK
name text
contact_email text nullable
status enum(active, inactive)
```

#### license_contracts

```text
id uuid PK
license_holder_id uuid FK
contract_reference text unique
royalty_rate numeric
starts_at date
expires_at date
status enum(draft, active, expired, terminated)
```

#### products

```text
id uuid PK
brand_id uuid FK
category_id uuid FK
license_contract_id uuid FK
name text
slug text unique
description text
status enum(draft, active, archived)
is_preorder boolean
preorder_release_at timestamptz nullable
created_at timestamptz
updated_at timestamptz
```

#### product_variants

```text
id uuid PK
product_id uuid FK
sku text unique
size text nullable
color text nullable
price numeric
compare_at_price numeric nullable
stock_quantity integer
low_stock_threshold integer
is_active boolean
```

#### product_images

```text
id uuid PK
product_id uuid FK
storage_path text
alt_text text
sort_order integer
```

#### coupons

```text
id uuid PK
code text unique
discount_type enum(fixed, percentage)
discount_value numeric
minimum_order_amount numeric nullable
usage_limit integer nullable
starts_at timestamptz
expires_at timestamptz
is_active boolean
```

#### orders

```text
id uuid PK
order_number text unique
user_id uuid FK
status enum(pending_payment, paid, processing, shipped, delivered, cancelled)
payment_status enum(pending, paid, failed, refunded)
subtotal numeric
discount_amount numeric
shipping_amount numeric
total_amount numeric
coupon_id uuid nullable FK
shipping_address jsonb
created_at timestamptz
updated_at timestamptz
```

#### order_items

ต้องเก็บ snapshot เพื่อไม่ให้คำสั่งซื้อเก่าเปลี่ยนเมื่อแก้สินค้า

```text
id uuid PK
order_id uuid FK
product_id uuid FK
product_variant_id uuid FK
product_name text
variant_name text nullable
sku text
unit_price numeric
quantity integer
line_total numeric
royalty_rate_snapshot numeric
```

#### authenticity_tags

TAG หนึ่งรายการแทนสินค้าจริงหนึ่งชิ้น หากซื้อ quantity 3 ต้องสร้าง 3 TAG

```text
id uuid PK
public_code text unique
serial_number text unique
order_item_id uuid FK
product_variant_id uuid FK
status enum(issued, activated, revoked)
issued_at timestamptz
activated_at timestamptz nullable
revoked_at timestamptz nullable
```

#### royalty_transactions

```text
id uuid PK
order_item_id uuid FK
license_contract_id uuid FK
gross_amount numeric
royalty_rate numeric
royalty_amount numeric
status enum(pending, confirmed, reversed, paid)
transaction_date timestamptz
```

#### stock_movements

```text
id uuid PK
product_variant_id uuid FK
movement_type enum(receive, reserve, release, sale, return, adjustment)
quantity integer
reference_type text nullable
reference_id uuid nullable
note text nullable
created_at timestamptz
```

#### reviews

```text
id uuid PK
product_id uuid FK
user_id uuid FK
order_item_id uuid FK unique
rating integer check 1-5
comment text
status enum(pending, published, hidden)
created_at timestamptz
```

## 10. Business Rules

### Price and cart

1. ราคาที่เชื่อถือได้ต้องอ่านจาก server/database ตอน Checkout ห้ามเชื่อราคาจาก browser
2. ห้ามสั่งจำนวนติดลบ ศูนย์ หรือเกินสต๊อก
3. คำนวณเงินด้วย decimal ที่กำหนด precision ชัดเจน ห้ามพึ่ง floating point แบบไม่มีการปัดเศษ
4. Order item ต้องเก็บชื่อ SKU และราคาขณะซื้อเป็น snapshot

### Inventory

1. การสร้าง order และการลด/จอง stock ต้องทำแบบ transaction หรือ database function ที่ atomic
2. ห้ามให้ stock ติดลบ
3. ทุกการเปลี่ยน stock ต้องสร้าง stock movement
4. Demo mode อาจจำลอง flow นี้ใน memory/local data แต่ต้องแยก logic ให้เปลี่ยนเป็น Supabase ได้

### Authenticity TAG

1. TAG ต้องเป็นรหัสสุ่มที่คาดเดายาก ห้ามใช้ running number เพียงอย่างเดียวเป็น public code
2. สร้าง TAG ตามจำนวนสินค้าจริงเมื่อ order อยู่ในสถานะที่กำหนด
3. หน้า public verification แสดงเฉพาะข้อมูลที่ไม่เป็นข้อมูลส่วนตัวของลูกค้า
4. หน้า verification ต้องแยก Valid, Revoked และ Not Found อย่างชัดเจน
5. ห้ามอ้างว่า TAG พิสูจน์ของแท้โดยอัตโนมัติ ให้ระบุว่าเป็นการรับรองสินค้าที่ออกและจำหน่ายโดยร้าน

### Royalty

สูตร MVP:

```text
royalty amount = royalty base amount × royalty rate snapshot / 100
```

1. กำหนดให้ชัดเจนใน README ว่า royalty base ใช้ยอดก่อนหรือหลังส่วนลด
2. เก็บ rate และยอดคำนวณเป็น snapshot
3. หากยกเลิก/คืน order ต้องสร้าง reversal ห้ามแก้หรือลบ transaction เดิมแบบไร้ประวัติ
4. เขียน unit test สำหรับการปัดเศษ ส่วนลด และ reversal

### Review

ผู้ใช้รีวิวได้เมื่อเป็นเจ้าของ order item และ order อยู่ในสถานะ delivered เท่านั้น รีวิว order item เดิมซ้ำไม่ได้

## 11. Authentication and Security

1. ใช้ Supabase Auth ไม่สร้างระบบเก็บ password เอง
2. ใช้ server-side authorization ทุก admin action
3. ห้ามตรวจ role เฉพาะใน UI
4. เปิด RLS สำหรับตารางที่ client เข้าถึงได้
5. ลูกค้าอ่าน order, address, review และ TAG ที่เกี่ยวข้องกับตนเองเท่านั้น
6. Catalog ที่ active อ่านแบบ public ได้
7. เฉพาะ admin จัดการสินค้า สต๊อก สัญญา คูปอง และรายงานทั้งหมดได้
8. Service role key ใช้เฉพาะ server และห้ามขึ้นต้นด้วย `NEXT_PUBLIC_`
9. สร้าง `.env.example` โดยไม่มี secret จริง
10. ตรวจ input ด้วย Zod ก่อนบันทึกข้อมูล
11. หน้า verification ห้ามเปิดเผยชื่อ ที่อยู่ อีเมล หรือ order detail ของลูกค้า

## 12. Demo Mode

เพื่อให้อาจารย์เปิดดูได้ง่าย ระบบต้องมี Demo mode:

1. หากไม่มี Supabase environment variables เว็บไซต์ยัง build และเปิดหน้าหลักได้
2. ใช้ typed mock repository หรือ data adapter แทนการกระจาย mock dataใน component
3. มีสินค้าอย่างน้อย 12 รายการ ครอบคลุม F1, Music, Football และ Collectibles
4. มีสินค้า variant หลายไซซ์และหลายสถานะ เช่น in stock, low stock, sold out, preorder
5. มี mock customer และ mock admin flow ที่อธิบายใน README
6. Checkout เป็นการจำลองและต้องติดป้ายว่าไม่มีการเรียกเก็บเงินจริง
7. ห้ามใช้ภาพที่ไม่ทราบสิทธิ์ใน repository ถ้าไม่มี asset ให้ใช้ placeholder ที่สร้างเองหรือ remote image ที่มีสิทธิ์เหมาะสมและระบุแหล่งที่มา

## 13. Suggested Project Structure

```text
src/
├── app/
│   ├── (store)/
│   ├── account/
│   ├── admin/
│   ├── api/
│   └── verify/[code]/
├── components/
│   ├── ui/
│   ├── layout/
│   ├── products/
│   ├── cart/
│   └── admin/
├── features/
│   ├── auth/
│   ├── catalog/
│   ├── cart/
│   ├── checkout/
│   ├── orders/
│   ├── authenticity/
│   └── royalties/
├── lib/
│   ├── supabase/
│   ├── repositories/
│   ├── validations/
│   └── money/
├── stores/
└── types/

supabase/
├── migrations/
├── seed.sql
└── tests/

tests/
├── unit/
└── e2e/
```

หลีกเลี่ยง component ขนาดใหญ่มาก แยก business logic ออกจาก UI และไม่สร้าง abstraction ที่ยังไม่มีการใช้งานจริง

## 14. Milestones and Definition of Done

### Milestone 1 — Project foundation

- ตั้ง Next.js, TypeScript, Tailwind และ ESLint
- เพิ่ม `.env.example`
- เพิ่ม scripts: `dev`, `build`, `lint`, `typecheck`, `test`
- สร้าง `develop` และ feature branch
- อัปเดต README ขั้นต้น
- `npm run lint`, `npm run typecheck` และ `npm run build` ผ่าน

### Milestone 2 — Design system and storefront shell

- Typography, color tokens และ reusable UI
- Responsive header, navigation, search trigger และ footer
- Home page พร้อม hero, featured collections และ product sections
- Mobile navigation ใช้งานได้
- ไม่มี horizontal overflow

### Milestone 3 — Product catalog

- Typed mock products
- Product listing และ product card
- Search, brand/category/price filters
- Sorting
- Empty state และ loading skeleton
- Product detail และ variant selection
- URL รองรับ filter ที่ควร share ได้

### Milestone 4 — Cart and mock checkout

- Zustand cart พร้อม local persistence
- Add/update/remove item
- Cart summary
- Checkout form validation
- Server-side price recalculation หรือ equivalent adapter ใน Demo mode
- Mock payment confirmation
- Order success page
- แสดงคำเตือนว่าไม่มีการชำระเงินจริง

### Milestone 5 — Supabase foundation

- SQL migrations สำหรับ schema, enum, index และ constraint
- RLS policies
- Seed data
- Supabase browser/server clients
- Repository/data adapter รองรับ Demo และ Supabase mode
- README อธิบายการสร้าง Supabase project และการรัน migration

### Milestone 6 — Auth and account

- Register, login, logout
- Session-aware navigation
- Account profile
- Address management
- Order list และ order detail
- Route protection และ server authorization

### Milestone 7 — Admin

- Admin guard
- Dashboard cards
- Product CRUD
- Variant และ stock management
- Order list/detail และ status update
- License contract management ขั้นพื้นฐาน
- Validation และ error states

### Milestone 8 — Authenticity and royalty

- สร้าง TAG หนึ่งรหัสต่อสินค้าหนึ่งชิ้น
- Verification page
- Admin TAG status
- Royalty snapshot calculation
- Report by contract/holder/date
- Tests ครอบคลุมกฎสำคัญ

### Milestone 9 — Quality and portfolio documentation

- Unit tests
- Playwright smoke tests สำหรับ home → product → cart → checkout
- GitHub Actions
- Accessibility pass เบื้องต้น
- Responsive check
- README ฉบับสมบูรณ์
- Architecture และ ER diagram
- Screenshots หรือ demo GIF หากผู้ใช้จัดเตรียมได้
- ตรวจ build production

## 15. Testing Requirements

อย่างน้อยต้องทดสอบ:

- money formatting และ rounding
- cart subtotal
- fixed และ percentage discount
- minimum coupon amount
- royalty calculation และ rounding
- royalty reversal
- variant stock validation
- TAG generation uniqueness
- review eligibility
- catalog filter logic

Smoke test อย่างน้อย:

1. เปิดหน้าแรก
2. เปิด catalog
3. เลือกสินค้าและ variant
4. เพิ่มตะกร้า
5. เปิด checkout
6. กรอกข้อมูลที่ถูกต้อง
7. ทำ Mock payment สำเร็จ
8. เห็นหน้าสรุปคำสั่งซื้อ
9. เปิด public TAG verification fixture

## 16. README Requirements

README สำหรับ Portfolio ต้องมี:

1. ชื่อและคำอธิบายโปรเจกต์
2. Problem statement
3. Key features
4. Screenshots
5. Tech stack
6. Architecture diagram
7. ER diagram
8. วิธีติดตั้งและรัน Demo mode
9. วิธีตั้งค่า Supabase
10. Environment variables
11. Test commands
12. Demo accounts หรือขั้นตอน Demo โดยไม่มีรหัสลับจริง
13. Business rules ของ Authenticity TAG และ Royalty
14. Project limitations
15. Future improvements
16. รายชื่อสมาชิกและหน้าที่ หากเป็นงานกลุ่ม

## 17. Acceptance Criteria

ถือว่างานพร้อม merge เข้า `main` เมื่อ:

- ติดตั้ง dependency จาก clean clone ได้
- `.env.example` ครบและไม่มี secret ใน Git
- Demo mode เปิดได้โดยไม่ต้องมี Supabase account
- หน้า Home, Catalog, Product, Cart, Checkout, Admin demo และ Verify ใช้งานได้
- Mobile และ desktop layout ไม่แตก
- TypeScript ไม่มี error
- ESLint ผ่าน
- Unit tests ผ่าน
- Production build ผ่าน
- GitHub Actions ถูกต้อง
- Git history แบ่งตาม feature อย่างมีความหมาย
- README ทำให้บุคคลอื่นเปิดโปรเจกต์และสาธิตได้

## 18. Prompt สำหรับส่งให้ Codex ใน VS Code

คัดลอก prompt ด้านล่างไปใช้เริ่มงาน:

```text
คุณเป็น coding agent หลักของโปรเจกต์ AllThingsMerch กรุณาอ่านไฟล์
ALLTHINGSMERCH_CODEX_SPEC.md ให้ครบก่อนลงมือ และปฏิบัติตาม requirement ในนั้น

Repository อยู่ที่ /Users/thanakron/Documents/GitHub/AllThingsMerch

เริ่มจาก:
1. ตรวจ README, ไฟล์ทั้งหมด, git status, git log และ branch ปัจจุบัน
2. สรุปสิ่งที่มีอยู่และแจ้งแผน milestone แบบสั้น
3. สร้าง develop จาก main และสร้าง feature/project-foundation
4. ทำเฉพาะ Milestone 1 ให้เสร็จ
5. รัน lint, typecheck และ production build
6. แก้ปัญหาจน checks ผ่าน
7. commit งานเป็น commit ขนาดเหมาะสมและใช้ Conventional Commits
8. รายงานไฟล์สำคัญ ผลการตรวจสอบ และ commit hash

ห้ามทำทุก milestone ใน commit เดียว ห้ามปลอม commit history ห้าม push remote
และห้าม commit secret หากพบงานเดิมของผู้ใช้ให้รักษาไว้

เมื่อ Milestone 1 เสร็จ ให้ทำ Milestone ถัดไปต่อได้โดยสร้าง feature branch ใหม่
จาก develop ทำงาน ทดสอบ commit แล้ว merge กลับ develop แบบ --no-ff ทีละ milestone
หยุดถามเฉพาะเมื่อจำเป็นต้องใช้ secret, external account, การ push/deploy
หรือมีการตัดสินใจที่กระทบขอบเขตโปรเจกต์อย่างมีนัยสำคัญ
```

## 19. คำแนะนำสำหรับผู้ใช้

วางไฟล์นี้ไว้ที่ root ของ repository โดยใช้ชื่อ:

```text
ALLTHINGSMERCH_CODEX_SPEC.md
```

จากนั้นเปิด repository ใน VS Code เปิด Codex และส่ง prompt ในหัวข้อ 18 ได้ทันที ควรตรวจผลหลังจบแต่ละ milestone และ push ขึ้น GitHub เป็นช่วง ๆ หลังจากตรวจ commit แล้ว

