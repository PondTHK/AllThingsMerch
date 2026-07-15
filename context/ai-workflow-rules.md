# AI Workflow Rules

## Approach

พัฒนาโปรเจกต์แบบ Incremental โดยยึด Context Files ใน `context/` เป็นแหล่งความจริงเสมอ ก่อนลงมือเขียนโค้ด ให้อ่านไฟล์ที่เกี่ยวข้องใน `context/` เพื่อเข้าใจขอบเขต, สถาปัตยกรรม, และสถานะปัจจุบันของโปรเจกต์ก่อน อย่าเดาหรือสร้างพฤติกรรมใหม่ที่ไม่ได้กำหนดไว้ใน Spec

## Scoping Rules

- ทำงานทีละ Feature Unit เท่านั้น อย่ารวมหลาย Feature ใน Commit เดียว
- เลือก Increment ที่เล็กที่สุดที่สามารถ Verify ได้จากปลายทาง (End-to-end verifiable)
- อย่ารวม Logic หลาย Domain ที่ไม่เกี่ยวกันไว้ใน Implementation Step เดียวกัน
- หลังจาก Implement แต่ละ Unit ให้รัน `npm run build` ก่อนเสมอ

## When to Split Work

แยก Implementation Step ออกเป็นชิ้นเล็กๆ เมื่องานนั้นรวมหลายเรื่องต่อไปนี้:

- เปลี่ยนแปลงทั้ง UI Layer และ Business Logic/Repository พร้อมกัน
- แตะหลาย API Route หรือหลาย Zustand Store ที่ไม่เกี่ยวกัน
- มีพฤติกรรมที่ยังไม่ได้กำหนดไว้ชัดเจนใน Context Files

ถ้า Verify ผลการเปลี่ยนแปลงได้ยาก นั่นหมายความว่า Scope ใหญ่เกินไป — ให้แบ่งออกก่อน

## Handling Missing Requirements

- อย่าสร้างพฤติกรรมของโปรเจกต์จากการเดา (Inference) โดยไม่มี Spec อ้างอิง
- ถ้า Requirement ไม่ชัดเจน ให้แก้ไขใน Context File ที่เกี่ยวข้องก่อน แล้วค่อย Implement
- ถ้า Requirement หายไปหรือขัดแย้งกัน ให้เพิ่มเป็น Open Question ใน `progress-tracker.md` และหยุดรอ

## Protected Files

ห้ามแก้ไขไฟล์ต่อไปนี้โดยไม่ได้รับคำสั่งโดยตรง:

- `supabase/migrations/*.sql` — Migration ที่ถูก Apply ไปแล้วห้ามแก้ ต้องสร้าง Migration ใหม่เท่านั้น
- `.env.example` — ห้ามใส่ค่า Secret จริง และห้ามลบ Key ที่มีอยู่
- `context/*.md` — แก้ได้เฉพาะเมื่อมีการตัดสินใจ Architecture หรือ Scope เปลี่ยนแปลง

## Keeping Docs in Sync

อัปเดต Context File ที่เกี่ยวข้องทันทีเมื่อมีการเปลี่ยนแปลงดังนี้:

- สถาปัตยกรรมหรือ System Boundary เปลี่ยนแปลง → `architecture.md`
- ฟีเจอร์ใหม่ถูกเพิ่มหรือตัดออกจาก Scope → `project-overview.md`
- มี Convention หรือ Pattern ใหม่ที่ทั้งโปรเจกต์ต้องใช้ตาม → `code-standards.md`
- มีการตัดสินใจ UI/Design System → `ui-context.md`
- หลังจาก Implement Feature Unit สำเร็จ → `progress-tracker.md`

## Before Moving to the Next Unit

ตรวจสอบ Checklist ต่อไปนี้ก่อนเริ่ม Unit ถัดไปทุกครั้ง:

1. Unit ปัจจุบันทำงานได้ครบ End-to-end ตามขอบเขตที่กำหนด
2. ไม่มี Invariant ใน `architecture.md` ถูกละเมิด
3. `progress-tracker.md` สะท้อนสถานะงานล่าสุดแล้ว
4. `npm run build` ผ่าน
5. Commit message อธิบายงานที่ทำจริงในรูปแบบ Conventional Commits
