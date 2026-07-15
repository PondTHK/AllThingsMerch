---
name: project-overview
description: High-level overview, goals, core user flow, feature list, and success criteria for the AllThingsMerch platform.
---

# AllThingsMerch

## Overview

AllThingsMerch คือแพลตฟอร์ม E-commerce สำหรับจำหน่ายสินค้าลิขสิทธิ์แท้ ได้แก่ เสื้อ Formula 1, เสื้อศิลปิน, เสื้อทีมฟุตบอล และของสะสม ออกแบบเป็นร้านค้าเจ้าของเดียว (Single-seller) ไม่ใช่ Marketplace ระบบมี Dual-Mode Architecture ที่ทำงานได้ทันทีแบบ Demo Mode โดยไม่ต้องเชื่อมต่อฐานข้อมูล และรองรับการเชื่อมต่อ Supabase PostgreSQL สำหรับ Production โดยเฉพาะ จุดเด่นคือระบบยืนยันความแท้ของสินค้าด้วย Authenticity TAG (1 ชิ้น = 1 รหัสเฉพาะ) และระบบคำนวณส่วนแบ่งค่าลิขสิทธิ์ (Royalty) อัตโนมัติ

## Goals

1. ส่งเป็นโปรเจกต์รายวิชา DIGITAL PLATFORM FOR SOFTWARE DEVELOPMENT พร้อม Git History ที่มีคุณภาพและสาธิตได้จริง
2. แสดงทักษะ Full-stack Development ครบวงจรตั้งแต่ UI, Business Logic ไปจนถึง Database Schema และ Security (RLS)
3. สาธิตระบบยืนยันสินค้าลิขสิทธิ์แท้ด้วย Authenticity TAG และระบบ Royalty Snapshot ที่คำนวณถูกต้องตามหลักบัญชี

## Core User Flow

1. ลูกค้าเรียกดูสินค้าในหน้า Catalog พร้อมค้นหา กรอง และเรียงลำดับ
2. เลือกสินค้าและ Variant (ขนาด/สี) ในหน้า Product Detail
3. เพิ่มสินค้าลงตะกร้า (Cart ที่ Persist ด้วย Zustand + localStorage)
4. ดำเนินการ Checkout กรอกที่อยู่จัดส่ง และเลือกวิธีชำระเงิน (Mock)
5. ระบบยืนยันราคาฝั่ง Server และสร้าง Order พร้อมออก Authenticity TAG ทันที
6. ลูกค้าดูประวัติคำสั่งซื้อและตรวจสอบ TAG ของสินค้าได้ที่ `/verify/[code]`

## Features

### Customer Features

- ลงทะเบียน / เข้าสู่ระบบ / ออกจากระบบ ผ่าน Supabase Auth
- ดู ค้นหา กรอง และเรียงลำดับสินค้าในหน้า Catalog
- เลือก Variant สินค้า (ไซซ์, สี) พร้อมแสดงสถานะสต๊อก (In stock / Low stock / Sold out)
- ระบบตะกร้าสินค้าที่ Persist ข้ามการ Refresh และปิด Browser ด้วย Zustand
- ระบบ Mock Checkout พร้อมการ Recalculate ราคาฝั่ง Server
- ดูสถานะและประวัติคำสั่งซื้อ
- ตรวจสอบความแท้ของสินค้าผ่านหน้า `/verify/[code]` แบบ Public

### Admin Features

- Dashboard สรุปยอดขาย สต๊อก และสัญญาลิขสิทธิ์
- จัดการสินค้า (CRUD) พร้อม Variant, SKU, ราคา และสต๊อก
- อัปเดตสถานะคำสั่งซื้อ
- จัดการสัญญาลิขสิทธิ์ (License Contracts) และอัตรา Royalty
- ตรวจสอบ Authenticity TAG Registry

### Features ที่อยู่ระหว่างพัฒนา (ส่วนที่เพิ่มเติม)

- ระบบคูปองส่วนลด (Coupon System) — CRUD ใน Admin และกรอกใช้ในหน้า Checkout
- หน้ารายงาน Royalty (`/admin/royalties`) — สรุปส่วนแบ่งตาม License Holder และช่วงเวลา
- ระบบรีวิวและให้คะแนนสินค้า (Reviews & Ratings) — เปิดให้รีวิวหลัง Order ถูก Deliver แล้ว

## Scope

### In Scope

- Responsive Storefront (Mobile-first)
- Product Catalog พร้อม Filter, Search, Sort
- Cart และ Mock Checkout Engine
- Authenticity TAG Generation และ Verification
- Admin Operations Portal
- Supabase Schema, RLS Policies, Seed Data
- Customer Auth และ Account Management
- CI Pipeline ด้วย GitHub Actions
- Demo Mode ที่ทำงานได้โดยไม่ต้องมี Supabase Account

### Out of Scope

- Native Mobile Application (iOS / Android)
- ระบบ Marketplace หลายผู้ขาย
- Payment Gateway จริง
- Blockchain หรือ NFT สำหรับการยืนยันสินค้า
- ระบบบัญชีองค์กรและคลังสินค้าหลายสาขา

## Success Criteria

1. `npm run dev` ทำงานได้ทันทีโดยไม่ต้องตั้งค่า Supabase (Demo Mode)
2. ผู้ใช้สามารถเดิน Flow หลัก (Catalog → Product → Cart → Checkout → Success → Verify TAG) ได้ครบ
3. Admin สามารถดู Dashboard, จัดการสินค้า, อัปเดต Order และดูสัญญาลิขสิทธิ์ได้ผ่าน `/admin`
4. `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build` ผ่านทั้งหมด
5. GitHub Actions CI ผ่านทุก Job เมื่อ Push หรือเปิด PR ไปยัง `main` และ `develop`
6. Git History แบ่งตาม Feature Branch อย่างมีความหมาย และทุก Commit อธิบายงานที่ทำจริง
