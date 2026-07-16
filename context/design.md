---
version: alpha
name: AllThingsMerch Monochrome Editorial
colors:
  primary: "#000000"
  surface: "#F5F5F5"
  surface-border: "#E5E5E5"
  muted: "#737373"
  primary-hover: "#262626"
  destructive: "#EF4444"
  success: "#16A34A"
  white: "#FFFFFF"
typography:
  h1:
    fontFamily: sans-serif
    fontSize: 36px
    fontWeight: 900
  h2:
    fontFamily: sans-serif
    fontSize: 20px
    fontWeight: 900
    letterSpacing: 0.05em
  h3:
    fontFamily: sans-serif
    fontSize: 14px
    fontWeight: 900
    letterSpacing: 0.05em
  body:
    fontFamily: sans-serif
    fontSize: 14px
    fontWeight: 500
  label:
    fontFamily: sans-serif
    fontSize: 12px
    fontWeight: 700
    letterSpacing: 0.05em
  mono:
    fontFamily: monospace
rounded:
  xl: 12px
  2xl: 16px
spacing:
  container: 1280px
  padding-y: 48px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.white}"
    rounded: "{rounded.xl}"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  card:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.surface-border}"
    rounded: "{rounded.2xl}"
---

# AllThingsMerch Monochrome Editorial Design System

## Overview

ออกแบบด้วยแนวคิด Monochrome Editorial Visual System — พื้นหลังสีขาว, ตัวอักษรสีดำสนิท, และใช้สีเทา (Neutral) สำหรับพื้นที่ผิว (Surface) ระบบนี้จะไม่มี Dark Mode ในเวอร์ชันปัจจุบัน โดยมีคอนเซปต์หลักคือ Premium Streetwear Catalog ที่เน้นความสะอาดตา, พื้นที่ว่าง (White space) ที่กว้างขวาง, และการดึงความสนใจไปที่รูปภาพสินค้าเป็นหลัก

## Colors

พาเลตต์สีพึ่งพาความเปรียบต่างของสีขาวดำ (Monochrome) และสีเทาสำหรับสร้างโครงสร้างของหน้าเว็บ โดยจะใช้สีสันเฉพาะกับสถานะที่มีความหมายสำคัญเท่านั้น (เช่น การทำรายการสำเร็จ หรือ ข้อผิดพลาด/การแจ้งเตือนร้ายแรง)

- **Primary:** สีดำสนิทสำหรับข้อความหลัก, เส้นขอบที่ต้องการเน้น, และปุ่มแอคชันหลัก
- **Surface / Neutral:** สีเทาอ่อน (ใน Tailwind คือ `neutral-100`, `neutral-200`) สำหรับพื้นหลังการ์ด, แถบเมนูด้านข้าง (Sidebar), และเส้นขอบโครงสร้างทั่วไป
- **Muted:** สีเทากลาง (`neutral-500`, `neutral-600`) สำหรับคำอธิบายและข้อมูลประกอบ (Metadata)
- **Semantic:** สีแดงสำหรับสถานะอันตราย/ข้อผิดพลาด และสีเขียวสำหรับสถานะสำเร็จ

## Typography

ระบบตัวอักษรสร้างความรู้สึกแบบงานบรรณาธิการ (Editorial) ที่ดุดัน โดยจับคู่ตัวอักษรน้ำหนักมากเป็นพิเศษ (Black) สำหรับหัวข้อ เข้ากับการจัดช่องไฟแบบกว้าง (Tracking) ของตัวพิมพ์ใหญ่สำหรับหัวข้อย่อยและป้ายกำกับ

- **Page & Section Headings:** ใช้ฟอนต์น้ำหนักมากสุด (`font-black`) เพื่อสร้างความเปรียบต่างระดับสูงกับพื้นหลังสีขาว
- **Sub-headings & Labels:** บังคับเป็นตัวพิมพ์ใหญ่ (Uppercase) พร้อมขยายระยะห่างตัวอักษร (`tracking-wider`) เพื่อลุคที่ดูทันสมัยและเป็นระบบ
- **Mono / Code:** ใช้ฟอนต์แบบ Monospace เฉพาะกับข้อความทางเทคนิค เช่น รหัส TAG, SKU, และรหัสสัญญาลิขสิทธิ์

## Layout

ระบบเลย์เอาต์ใช้ Grid System และข้อจำกัดความกว้าง (Container) มาตรฐานของ Tailwind

- **Storefront:** จำกัดความกว้างสูงสุดที่ 7xl (`max-w-7xl`) จัดกึ่งกลาง พร้อมเว้นระยะขอบบนล่างอย่างจุใจ (`py-12`)
- **Product Catalog:** ใช้ Responsive CSS Grid ที่ปรับขยายตั้งแต่ 1 คอลัมน์บนมือถือ ไปจนถึง 4 คอลัมน์บนหน้าจอเดสก์ท็อปขนาดใหญ่
- **Checkout:** แบ่งเลย์เอาต์แบบไม่สมมาตร (Asymmetrical Split) โดยใช้ 7 คอลัมน์สำหรับแบบฟอร์ม และ 5 คอลัมน์สำหรับสรุปยอดด้านข้าง
- **Admin Portal:** เมนูด้านข้าง (Sidebar) แบบ Fix ตำแหน่งทางซ้าย และพื้นที่เนื้อหาหลัก (Main Content) จะใช้พื้นที่คอลัมน์ที่เหลือทั้งหมด

## Elevation & Depth

ดีไซน์เน้นความแบนราบ (Strictly Flat) ไม่มีเงา (Drop shadows) หรือการยกตัว (Elevation) แต่อย่างใด ความลึกและลำดับความสำคัญจะถูกสื่อสารผ่านความเปรียบต่างของสีพื้นหลัง (เช่น การ์ด `bg-neutral-100` วางบนหน้า `bg-white`) และการจัดการเส้นขอบ (เช่น `border-black` สำหรับสถานะ Active/เน้นย้ำ เทียบกับ `border-neutral-200` สำหรับโครงสร้างปกติ)

## Shapes

รูปทรงจะมีการลบมุม (Rounding) ในระดับปานกลาง เพื่อลดทอนความแข็งกระด้างของสไตล์ Monochrome

- **UI Elements (Inputs, Buttons, Badges):** ลบมุมรัศมี 12px (`rounded-xl`)
- **Containers (Cards, Panels, Modals):** ลบมุมรัศมี 16px (`rounded-2xl`)

## Components

ระบบใช้ Custom Components ที่พัฒนาขึ้นมาเอง แทนที่จะใช้ UI Library ภายนอกอย่าง shadcn/ui

- **Icons:** ใช้ `Lucide React` เท่านั้น ไอคอนทั้งหมดเป็นแบบลายเส้น (Stroke-based) ขนาดมาตรฐานคือ `w-4 h-4` สำหรับการแทรกในปุ่ม/ข้อความ และ `w-5 h-5` สำหรับหัวข้อ Section
- **Modals:** สร้างเป็นการแสดงผลซ้อนทับ (Overlay) แบบใช้ State ใน Component นั้นๆ แทนที่จะใช้ Dialog Library ภายนอก
- **Badges:** ป้ายกำกับขนาดเล็กที่มีความเปรียบต่างสูง (มักใช้พื้นหลังดำตัวอักษรขาว) สำหรับการแจ้งเตือนสำคัญ เช่น "Low stock"

## Do's and Don'ts

- **Do** ใช้สีดำสนิทและขาวบริสุทธิ์เพื่อความเปรียบต่างหลัก
- **Don't** ฮาร์ดโค้ด (Hardcode) รหัสสี Hex ใน JSX โดยตรงเด็ดขาด ให้ใช้ Tailwind Utility Classes เสมอ
- **Do** พึ่งพาน้ำหนักของฟอนต์ (Font weights) และการใช้ตัวพิมพ์ใหญ่ (Uppercase) ในการแบ่งลำดับชั้นของตัวอักษร
- **Don't** ใช้เงา (Drop shadows) ให้ใช้สีพื้นหลังแบบแบนราบและเส้นขอบในการกำหนดขอบเขตแทน
- **Don't** ใช้ Component Library ภายนอกอย่าง shadcn/ui ให้พัฒนาต่อยอดจาก Custom Components ในโฟลเดอร์ `src/components/` เท่านั้น
