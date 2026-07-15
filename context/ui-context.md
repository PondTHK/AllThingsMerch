# UI Context

## Theme

ออกแบบด้วย Monochrome Editorial Visual System — พื้นหลังขาว, ตัวอักษรดำสนิท, และ neutral grey เป็น Surface ไม่มี Dark Mode ในเวอร์ชันนี้ แนวคิดคือ Premium Streetwear Catalog ที่เน้นความสะอาด, White space, และภาพสินค้าเป็นจุดสนใจหลัก

## Colors

ใช้ Tailwind utility classes — ห้ามใช้ hex hardcoded ใน JSX โดยตรง

| Role                  | Tailwind Class                    | ความหมาย                              |
| --------------------- | --------------------------------- | ------------------------------------- |
| Page background       | `bg-white`                        | พื้นหน้าหลัก                          |
| Surface / Card        | `bg-neutral-100`                  | พื้น Card, Sidebar, Panel             |
| Surface border        | `border-neutral-200`              | ขอบ Card ทั่วไป                       |
| Emphasis border       | `border-black`                    | ขอบที่ต้องการเน้น, Active state       |
| Primary text          | `text-black`                      | หัวข้อ, ตัวเลข, ป้ายกำกับสำคัญ        |
| Muted text            | `text-neutral-500` / `text-neutral-600` | คำอธิบาย, Placeholder             |
| Primary action        | `bg-black text-white`             | ปุ่มหลัก (Submit, Add to cart)        |
| Hover state (action)  | `hover:bg-neutral-800`            | ปุ่มหลักเมื่อ Hover                   |
| Destructive / Alert   | `border-red-500 text-red-600`     | Error state, ข้อความแจ้งเตือนร้ายแรง  |
| Success               | `text-green-600`                  | การยืนยันที่สำเร็จ                    |
| Low stock badge       | `bg-black text-white` (เล็ก)      | แสดงจำนวนสินค้าที่เหลือน้อย           |

## Typography

| Role                  | Tailwind Class                                   | ตัวอย่างการใช้                     |
| --------------------- | ------------------------------------------------ | ---------------------------------- |
| Page heading (H1)     | `text-3xl sm:text-4xl font-black text-black`     | ชื่อหน้า                           |
| Section heading (H2)  | `text-xl font-black uppercase tracking-wider`    | หัวข้อ Section                     |
| Sub-heading (H3/H4)   | `text-sm font-black uppercase tracking-wider`    | หัวข้อย่อย, Card title            |
| Body text             | `text-sm font-medium text-black`                 | เนื้อหาทั่วไป                      |
| Label / Tag           | `text-xs font-bold uppercase tracking-wider`     | Label ของ Form, Badge              |
| Muted description     | `text-xs text-neutral-500`                       | คำอธิบาย, Metadata                 |
| Price (THB)           | `font-black text-black` (ขนาดขึ้นกับ Context)   | แสดงราคาสินค้า เช่น `฿3,490`      |
| Mono / Code           | `font-mono`                                      | รหัส TAG, SKU, Contract Reference  |

## Border Radius

| Context               | Tailwind Class   | ตัวอย่าง                            |
| --------------------- | ---------------- | ----------------------------------- |
| Input / Button ทั่วไป | `rounded-xl`     | Form fields, ปุ่ม, Badge             |
| Card / Panel / Modal  | `rounded-2xl`    | Product card, Summary box, Dialog   |

## Component Library

ใช้ Custom Components ที่เขียนตาม Monochrome Design System — **ไม่ใช้ shadcn/ui** ในโปรเจกต์นี้ Components ทั้งหมดอยู่ใน `src/components/` ใช้ Lucide React สำหรับ Icon ทั้งหมด ขนาด `w-4 h-4` สำหรับ Inline/Button, `w-5 h-5` สำหรับ Section heading

## Layout Patterns

- **Storefront pages**: Max-width `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` padding ด้วย `py-12`
- **Product Catalog**: CSS Grid responsive `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
- **Checkout**: Split layout `grid grid-cols-1 lg:grid-cols-12` — Form 7 columns, Summary Sidebar 5 columns
- **Admin Portal**: Fixed Sidebar ด้านซ้าย + Main Content พื้นที่ขวา ด้วย `lg:col-span-*`
- **Header**: Sticky top bar `sticky top-0 z-50` พร้อม backdrop blur สำหรับ mobile menu
- **Modals/Overlays**: ใช้ state ใน Component เดิม ไม่ใช้ Dialog library ภายนอก

## Icons

Lucide React — ใช้ทั้งโปรเจกต์ Stroke-based icons เท่านั้น

- Inline / Button: `w-4 h-4`
- Section heading / Feature icon: `w-5 h-5`
- Empty state / Large display: `w-12 h-12` ขึ้นไป
- ตัวอย่างที่ใช้บ่อย: `Package`, `ShieldCheck`, `ShieldAlert`, `Lock`, `ArrowRight`, `Plus`, `Check`, `AlertTriangle`
