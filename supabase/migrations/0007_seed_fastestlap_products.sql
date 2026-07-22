-- =============================================================================
-- Migration 0007: Seed F1 Products from FastestLap Store (25 Products)
-- =============================================================================
-- This migration inserts/upserts real F1 merchandise with high-resolution images,
-- descriptions, variants, and THB pricing.

DO $$
DECLARE
  v_brand_id UUID;
  v_category_id UUID;
  v_product_id UUID;
BEGIN

-- 1. Upsert Brands

  INSERT INTO public.brands (id, name, slug, description, is_active)
  VALUES ('487f7705-c55f-551a-b4d7-8b21d6355ba3', 'Oracle Red Bull Racing', 'oracle-red-bull-racing', 'Official F1 Team & Motorsport Merchandise', true)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, is_active = true;

  INSERT INTO public.brands (id, name, slug, description, is_active)
  VALUES ('28b205bc-7905-5fa1-9021-21fd82406cbb', 'Scuderia Ferrari F1', 'scuderia-ferrari-f1', 'Official F1 Team & Motorsport Merchandise', true)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, is_active = true;

  INSERT INTO public.brands (id, name, slug, description, is_active)
  VALUES ('3c1148bf-091d-5420-987d-5ff95e628667', 'Williams Racing', 'williams-racing', 'Official F1 Team & Motorsport Merchandise', true)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, is_active = true;

  INSERT INTO public.brands (id, name, slug, description, is_active)
  VALUES ('f694020d-d7ed-5e4f-bbb5-312827b3de59', 'McLaren Formula 1 Team', 'mclaren-f1', 'Official F1 Team & Motorsport Merchandise', true)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, is_active = true;

  INSERT INTO public.brands (id, name, slug, description, is_active)
  VALUES ('1e56354f-a63e-5761-b379-1628c8e59a9c', 'Mercedes-AMG Petronas F1', 'mercedes-amg-petronas-f1', 'Official F1 Team & Motorsport Merchandise', true)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, is_active = true;

  INSERT INTO public.brands (id, name, slug, description, is_active)
  VALUES ('d0f953bc-fa01-5b80-b524-77d99bb85de8', 'Pirelli Motorsport', 'pirelli', 'Official F1 Team & Motorsport Merchandise', true)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, is_active = true;

  INSERT INTO public.brands (id, name, slug, description, is_active)
  VALUES ('1154f8fb-3013-508f-bfa2-b2ddffaebe0a', 'Aston Martin F1 Team', 'aston-martin-f1', 'Official F1 Team & Motorsport Merchandise', true)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, is_active = true;

  INSERT INTO public.brands (id, name, slug, description, is_active)
  VALUES ('56300953-a843-534b-8957-693fe0987cd8', 'Ayrton Senna Collection', 'ayrton-senna', 'Official F1 Team & Motorsport Merchandise', true)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, is_active = true;

-- 2. Upsert Categories

  INSERT INTO public.categories (id, name, slug, parent_id)
  VALUES ('b0429312-bc52-53cd-89a2-d506d4856bff', 'Formula 1 Apparel', 'formula-1', null)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

  INSERT INTO public.categories (id, name, slug, parent_id)
  VALUES ('b0429312-bc52-53cd-89a2-d506d4856bff', 'Formula 1 Apparel', 'formula-1', null)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

  INSERT INTO public.categories (id, name, slug, parent_id)
  VALUES ('e5c9f0cf-ce3a-5a67-b4bb-7a11cb89795b', 'Headwear & Caps', 'headwear', null)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

  INSERT INTO public.categories (id, name, slug, parent_id)
  VALUES ('899799fb-76d5-5486-a741-31db70633f32', 'F1 Collectibles & Models', 'f1-collectibles', null)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

  INSERT INTO public.categories (id, name, slug, parent_id)
  VALUES ('44fc7a48-8d3c-5239-9135-d0da818bc275', 'Accessories & Gear', 'accessories', null)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

  INSERT INTO public.categories (id, name, slug, parent_id)
  VALUES ('44fc7a48-8d3c-5239-9135-d0da818bc275', 'Accessories & Gear', 'accessories', null)
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

-- 3. Insert Products, Variants, and Images

  -- Product: Funko Pop! Rides - Max Verstappen
  SELECT id INTO v_brand_id FROM public.brands WHERE slug = 'oracle-red-bull-racing' LIMIT 1;
  SELECT id INTO v_category_id FROM public.categories WHERE slug = 'f1-collectibles' LIMIT 1;

  INSERT INTO public.products (id, brand_id, category_id, name, slug, description, status, is_preorder, created_at, updated_at)
  VALUES (
    '0d69b23a-aa62-51dd-987f-6f539fe9cd41',
    COALESCE(v_brand_id, '487f7705-c55f-551a-b4d7-8b21d6355ba3'),
    COALESCE(v_category_id, '899799fb-76d5-5486-a741-31db70633f32'),
    'Funko Pop! Rides - Max Verstappen',
    'funko-pop-rides-max-verstappen',
    'Funko Pop! Ride Max Verstappen  – Oracle Red Bull Racing

เพิ่มความพิเศษให้คอลเลกชัน Formula 1 ของคุณด้วย Funko Pop! Ride Max Verstappen #307 ฟิกเกอร์สไตล์ Funko Pop ที่ถ่ายทอดแชมป์โลก F1 อย่าง Max Verstappen ในรถแข่ง Oracle Red Bull Racing RB19 ฤดูกาล 2023 ได้อย่างน่ารักและโดดเด่น

โมเดลชิ้นนี้เป็นส่วนหนึ่งของซีรีส์ Pop! Ride Collection ซึ่งแตกต่างจาก Funko Pop ทั่วไปด้วยการรวมตัวนักแข่งและรถแข่งไว้ในชิ้นเดียว ทำให้เป็นไอเท็มสะสมที่แฟน Red Bull Racing และ Max Verstappen ไม่ควรพลาด

ไม่ว่าจะวางโชว์บนโต๊ะทำงาน ชั้นสะสม หรือมุมโปรดในบ้าน Funko Pop! Ride Max Verstappen ก็พร้อมคว้าตำแหน่ง "Pole Position" ในคอลเลกชันของคุณ

ผลิตจากวัสดุ Vinyl คุณภาพสูง

ความสูงประมาณ 10 ซม.

ความยาวประมาณ 15 ซม.

เหมาะสำหรับสะสมและตกแต่ง

ของขวัญยอดนิยมสำหรับแฟน Formula 1 และ Red Bull Racing

This unique Max Verstappen Funko Pop is an absolute must-have addition to your collection. This Funko Pop! Ride shows Max in his 2023 Oracle Redbull Racing car.

Put this Max Verstappen Funko Pop on poleposition in your home!

Features Funko Pop Ride Max Verstappen

• Heigth: 10 centimeter

• Length: 15 centimeter

• Material: Vinyl

• Number 307 within the Pop! Ride Collectie of Funko

FASTEST LAP: จำหน่ายสินค้า F1 Merchandise ลิขสิทธิ์แท้จากทีมฟอร์มูล่าวันครบทั้ง 11 ทีม',
    'active',
    false,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    brand_id = EXCLUDED.brand_id,
    category_id = EXCLUDED.category_id,
    status = EXCLUDED.status,
    updated_at = now();
  DELETE FROM public.product_variants WHERE product_id = '0d69b23a-aa62-51dd-987f-6f539fe9cd41';
  DELETE FROM public.product_images WHERE product_id = '0d69b23a-aa62-51dd-987f-6f539fe9cd41';
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('4d036d25-3af0-56cb-bde7-ad91e253a166', '0d69b23a-aa62-51dd-987f-6f539fe9cd41', 'FUNKO-POP-RIDES-DefaultTitle-DefaultTitle-0', null, null, 2690, null, 15, 3, true, now());
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('5447a1f9-b590-5dff-be12-21a07426f9b0', '0d69b23a-aa62-51dd-987f-6f539fe9cd41', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/MVRFK1.webp?v=1727535641', 'Funko Pop! Rides - Max Verstappen', 0);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('37564d4e-42ad-5040-aed4-1f8aeb707417', '0d69b23a-aa62-51dd-987f-6f539fe9cd41', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/MVRFK5.png?v=1727535641', 'Funko Pop! Rides - Max Verstappen', 1);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('ad75e223-078c-5c94-9575-f323fbdba637', '0d69b23a-aa62-51dd-987f-6f539fe9cd41', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/MVRFK4.png?v=1727535641', 'Funko Pop! Rides - Max Verstappen', 2);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('5e54c578-b790-5077-81df-52cd97c290a9', '0d69b23a-aa62-51dd-987f-6f539fe9cd41', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/MVRFK3.png?v=1727535641', 'Funko Pop! Rides - Max Verstappen', 3);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('738af7e7-2c81-5671-a77a-373d410a1aec', '0d69b23a-aa62-51dd-987f-6f539fe9cd41', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/MVRFK2.webp?v=1727535641', 'Funko Pop! Rides - Max Verstappen', 4);


  -- Product: Williams Racing New Era 2026 Silverstone GP Team Cap
  SELECT id INTO v_brand_id FROM public.brands WHERE slug = 'williams-racing' LIMIT 1;
  SELECT id INTO v_category_id FROM public.categories WHERE slug = 'headwear' LIMIT 1;

  INSERT INTO public.products (id, brand_id, category_id, name, slug, description, status, is_preorder, created_at, updated_at)
  VALUES (
    '6565e283-35ba-5a2b-8233-abeea7003020',
    COALESCE(v_brand_id, '3c1148bf-091d-5420-987d-5ff95e628667'),
    COALESCE(v_category_id, 'e5c9f0cf-ce3a-5a67-b4bb-7a11cb89795b'),
    'Williams Racing New Era 2026 Silverstone GP Team Cap',
    'williams-racing-new-era-2026-silverstone-gp-team-cap',
    'Williams Racing 2026 Race Special Barcelona Cap – หมวกลิมิเต็ดเอดิชั่นจากสนาม Silverstone Grand Prix

ร่วมเป็นส่วนหนึ่งของสุดสัปดาห์การแข่งขัน Formula 1 ที่บาร์เซโลนาด้วย Williams Racing 2026 Race Special Silverstone Cap หมวกรุ่นพิเศษที่ออกแบบเพื่อเฉลิมฉลองการแข่งขัน Silverstone Grand Prix 2026 โดยเฉพาะ

โดดเด่นด้วยดีไซน์ที่ได้รับแรงบันดาลใจจากสนามแข่งและสีสันที่สะท้อนบรรยากาศของเมืองบาร์เซโลนา พร้อมโลโก้ Atlassian Williams Racing อย่างเป็นทางการ เหมาะสำหรับแฟน F1 ที่ต้องการสะสมหมวก Race Special Edition หรือสวมใส่ในช่วง Race Week เพื่อแสดงความภักดีต่อทีม Williams

ผลิตจากวัสดุคุณภาพสูง สวมใส่สบาย น้ำหนักเบา พร้อมสายปรับขนาดด้านหลัง รองรับการใช้งานในชีวิตประจำวัน ไม่ว่าจะเชียร์ทีมข้างสนาม เดินทาง หรือเพิ่มสไตล์ Motorsport ให้กับลุคของคุณ

• 
 Official Licensed Williams Racing Product

• Silverstone GP 2026 Race Special Edition

• ดีไซน์พิเศษเฉพาะสนาม Silverstone Grand Prix

• ปรับขนาดได้ สวมใส่สบาย

Celebrate the excitement of the 2026 Silverstone Grand Prix with the official Williams Racing 2026 Race Special Silverstone Cap.

Designed exclusively for the Silverstone race weekend, this limited-edition cap features race-inspired graphics and distinctive detailing that capture the spirit of one of Formula 1''s most iconic venues. Finished with official Atlassian Williams Racing branding, it is the perfect accessory for dedicated F1 fans and collectors.

Crafted for comfort and everyday wear, the cap features a lightweight construction and an adjustable rear closure for a secure fit. Whether you''re supporting Williams Racing trackside, watching from home, or adding to your Formula 1 collection, this race special cap delivers authentic motorsport style.

Official Atlassian Williams Racing merchandise

2026 Silverstone Grand Prix Race Special Edition

Exclusive Barcelona-inspired design

Adjustable fit for all-day comfort',
    'active',
    false,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    brand_id = EXCLUDED.brand_id,
    category_id = EXCLUDED.category_id,
    status = EXCLUDED.status,
    updated_at = now();
  DELETE FROM public.product_variants WHERE product_id = '6565e283-35ba-5a2b-8233-abeea7003020';
  DELETE FROM public.product_images WHERE product_id = '6565e283-35ba-5a2b-8233-abeea7003020';
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('8d7b6532-9737-56c3-8f0f-c19a6b304ff8', '6565e283-35ba-5a2b-8233-abeea7003020', '199842961171', null, null, 1790, null, 15, 3, true, now());
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('1d0fda98-a1c0-5d7e-ae7f-0f7bd84ec4be', '6565e283-35ba-5a2b-8233-abeea7003020', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/60955256.webp?v=1781239737', 'Williams Racing New Era 2026 Silverstone GP Team Cap', 0);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('cb8808b1-999b-5543-8ecb-722d44c37fd8', '6565e283-35ba-5a2b-8233-abeea7003020', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/60955256_1.webp?v=1781239737', 'Williams Racing New Era 2026 Silverstone GP Team Cap', 1);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('ab3c825e-7947-5366-a4ff-471fadc75fb7', '6565e283-35ba-5a2b-8233-abeea7003020', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/60955256_2.webp?v=1781239737', 'Williams Racing New Era 2026 Silverstone GP Team Cap', 2);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('9b46e768-30ad-512a-9b00-3b8ebbf4b405', '6565e283-35ba-5a2b-8233-abeea7003020', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/60955256_3.webp?v=1781239737', 'Williams Racing New Era 2026 Silverstone GP Team Cap', 3);


  -- Product: Atlassian Williams Racing 2026 Silverstone GP Team Tech T-shirt
  SELECT id INTO v_brand_id FROM public.brands WHERE slug = 'williams-racing' LIMIT 1;
  SELECT id INTO v_category_id FROM public.categories WHERE slug = 'formula-1' LIMIT 1;

  INSERT INTO public.products (id, brand_id, category_id, name, slug, description, status, is_preorder, created_at, updated_at)
  VALUES (
    'bb946a8e-da0f-5473-9cd3-e24aa81e58d8',
    COALESCE(v_brand_id, '3c1148bf-091d-5420-987d-5ff95e628667'),
    COALESCE(v_category_id, 'b0429312-bc52-53cd-89a2-d506d4856bff'),
    'Atlassian Williams Racing 2026 Silverstone GP Team Tech T-shirt',
    'atlassian-williams-racing-2026-silverstone-gp-team-tech-t-shirt',
    'Atlassian Williams Racing 2026 Silverstone Race Special Team Tech T-Shirt

ฉลองการแข่งขัน Formula 1 British Grand Prix 2026 ที่สนาม Silverstone ด้วย Atlassian Williams Racing Silverstone Race Special Team Tech T-Shirt เสื้อยืดรุ่นพิเศษที่ออกแบบขึ้นเพื่อการแข่งขันสนามเหย้าของทีม Williams Racing โดยเฉพาะ

โดดเด่นด้วยกราฟิกและรายละเอียดพิเศษที่ได้รับแรงบันดาลใจจากสนาม Silverstone พร้อมโลโก้ทีม Atlassian Williams Racing และพาร์ทเนอร์ประจำฤดูกาล 2026 ถ่ายทอดบรรยากาศแห่งความเร็วและประวัติศาสตร์ของหนึ่งในสนามแข่งที่เป็นตำนานที่สุดของ Formula 1

ผลิตจากเนื้อผ้าน้ำหนักเบา สวมใส่สบาย ระบายอากาศได้ดี เหมาะสำหรับใส่ในวันแข่งขัน เดินทาง หรือสวมใส่ในชีวิตประจำวันสำหรับแฟน F1 ตัวจริง

เสื้อยืด Atlassian Williams Racing รุ่นพิเศษ Silverstone 2026

คอลเลกชัน Race Special British Grand Prix

กราฟิกพิเศษเฉพาะสนาม Silverstone

โลโก้ทีมและพาร์ทเนอร์ประจำฤดูกาล 2026

เนื้อผ้านุ่ม น้ำหนักเบา ระบายอากาศดี

ทรง Regular Fit สวมใส่สบาย

สินค้าลิขสิทธิ์แท้ Official Licensed Williams Racing Merchandise

Atlassian Williams Racing 2026 Silverstone Race Special Team Tech T-Shirt

Celebrate the team''s home race with the Atlassian Williams Racing 2026 Silverstone Race Special Team Tech T-Shirt, a special edition piece inspired by the iconic British Grand Prix at Silverstone.

Featuring exclusive race-specific graphics, official Atlassian Williams Racing branding, and authentic 2026 team details, this T-shirt captures the spirit of one of Formula 1''s most historic circuits. Designed for comfort and style, the lightweight fabric makes it perfect for race weekends, everyday wear, or adding to your F1 collection.

Whether you''re supporting Alex Albon, Carlos Sainz, or the Williams Racing team, this Silverstone Race Special T-shirt is a standout addition to any Formula 1 wardrobe.

Official Atlassian Williams Racing 2026 Team Tech T-Shirt

Special Edition British Grand Prix / Silverstone design

Official team and partner branding

Lightweight and breathable fabric

Comfortable regular fit

Perfect for race weekends and everyday wear

Official Licensed Williams Racing Merchandise',
    'active',
    false,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    brand_id = EXCLUDED.brand_id,
    category_id = EXCLUDED.category_id,
    status = EXCLUDED.status,
    updated_at = now();
  DELETE FROM public.product_variants WHERE product_id = 'bb946a8e-da0f-5473-9cd3-e24aa81e58d8';
  DELETE FROM public.product_images WHERE product_id = 'bb946a8e-da0f-5473-9cd3-e24aa81e58d8';
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('3dae4d04-6fcd-58cc-a32a-b529336b71a2', 'bb946a8e-da0f-5473-9cd3-e24aa81e58d8', '199842961492', 'XS', null, 3290, null, 15, 3, true, now());
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('32fa478e-8c9b-5618-95ed-1ffd7f32db14', 'bb946a8e-da0f-5473-9cd3-e24aa81e58d8', '199842961478', 'S', null, 3290, null, 15, 3, true, now());
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('707b084d-09c4-5acc-a5b5-c22a3899ce44', 'bb946a8e-da0f-5473-9cd3-e24aa81e58d8', '199842961461', 'M', null, 3290, null, 15, 3, true, now());
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('3aec3bc3-972e-51fa-ad6e-4323b85b784f', 'bb946a8e-da0f-5473-9cd3-e24aa81e58d8', '199842961454', 'L', null, 3290, null, 15, 3, true, now());
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('f790f30a-5eb4-5b6f-9fb8-2bdb5ca0ffb2', 'bb946a8e-da0f-5473-9cd3-e24aa81e58d8', '199842961485', 'XL', null, 3290, null, 15, 3, true, now());
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('87f67182-3848-567f-845b-09135bc6c395', 'bb946a8e-da0f-5473-9cd3-e24aa81e58d8', '199842961508', '2XL', null, 3290, null, 15, 3, true, now());
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('62782568-9a78-5bb9-9168-3715efd40c65', 'bb946a8e-da0f-5473-9cd3-e24aa81e58d8', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/26netkmttsil_-_picture_1.webp?v=1782290669', 'Atlassian Williams Racing 2026 Silverstone GP Team Tech T-shirt', 0);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('b611d8b8-5678-5af5-821b-a8b87a48bce5', 'bb946a8e-da0f-5473-9cd3-e24aa81e58d8', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/26netkmttsil_-_picture_3.webp?v=1782290669', 'Atlassian Williams Racing 2026 Silverstone GP Team Tech T-shirt', 1);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('7ffeda15-5d7d-562e-acd1-19c3d6fa5950', 'bb946a8e-da0f-5473-9cd3-e24aa81e58d8', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/26netkmttsil_-_picture_4.webp?v=1782290669', 'Atlassian Williams Racing 2026 Silverstone GP Team Tech T-shirt', 2);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('fffb2b62-e0fb-5799-b92d-0d871360a480', 'bb946a8e-da0f-5473-9cd3-e24aa81e58d8', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/26netkmttsil_-_picture_2.webp?v=1782290669', 'Atlassian Williams Racing 2026 Silverstone GP Team Tech T-shirt', 3);


  -- Product: Atlassian Williams Racing 2026 Silverstone GP Team Tech Polo
  SELECT id INTO v_brand_id FROM public.brands WHERE slug = 'williams-racing' LIMIT 1;
  SELECT id INTO v_category_id FROM public.categories WHERE slug = 'formula-1' LIMIT 1;

  INSERT INTO public.products (id, brand_id, category_id, name, slug, description, status, is_preorder, created_at, updated_at)
  VALUES (
    'c4c1fd1e-aa2b-5765-8d9b-8fb09890d1a6',
    COALESCE(v_brand_id, '3c1148bf-091d-5420-987d-5ff95e628667'),
    COALESCE(v_category_id, 'b0429312-bc52-53cd-89a2-d506d4856bff'),
    'Atlassian Williams Racing 2026 Silverstone GP Team Tech Polo',
    'atlassian-williams-racing-2026-silverstone-gp-team-tech-polo',
    'Williams Racing 2026 British GP Team Tech Polo เสื้อโปโลทีมรุ่นพิเศษสำหรับการแข่งขัน British Grand Prix 2026 ที่ถ่ายทอดจิตวิญญาณของทีม Williams Racing ในสนามเหย้าอย่าง Silverstone ได้อย่างลงตัว

ดีไซน์สปอร์ตพรีเมียมพร้อมลวดลายพิเศษเฉพาะ British GP ผสานโลโก้ทีมและพาร์ทเนอร์ประจำฤดูกาล 2026 ผลิตจากวัสดุคุณภาพสูง ระบายอากาศได้ดี สวมใส่สบายทั้งวัน ไม่ว่าจะใส่เชียร์การแข่งขัน เดินทาง หรือสวมใส่ในชีวิตประจำวัน

 เสื้อโปโล Williams Racing British GP 2026 รุ่นพิเศษ

ดีไซน์ Team Tech Polo แบบเดียวกับคอลเลกชันทีมแข่ง

ลวดลายเฉพาะสำหรับสนาม Silverstone

โลโก้ทีมและพาร์ทเนอร์ประจำฤดูกาล 2026

เนื้อผ้าน้ำหนักเบา ระบายอากาศดี สวมใส่สบาย

สินค้าลิขสิทธิ์แท้ Official Licensed Product

Celebrate the home race of Williams Racing with the 2026 British GP Team Tech Polo, a special edition performance polo inspired by the team''s appearance at Silverstone.

Featuring exclusive British Grand Prix graphics, official Williams Racing team branding, and premium technical fabric, this polo delivers the perfect combination of motorsport style and everyday comfort. Whether you''re watching the race, attending a motorsport event, or representing your favorite Formula 1 team, this is a must-have piece for the 2026 season.

Official Williams Racing British GP 2026 Special Edition Polo

Exclusive Silverstone-inspired design

 Official 2026 team and partner branding

Lightweight, breathable technical fabric

Comfortable regular fit for everyday wear

Official Licensed Williams Racing merchandise

FASTEST LAP: จำหน่ายสินค้า F1 Merchandise ลิขสิทธิ์แท้จากทีมฟอร์มูล่าวันครบทั้ง 11 ทีม',
    'active',
    false,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    brand_id = EXCLUDED.brand_id,
    category_id = EXCLUDED.category_id,
    status = EXCLUDED.status,
    updated_at = now();
  DELETE FROM public.product_variants WHERE product_id = 'c4c1fd1e-aa2b-5765-8d9b-8fb09890d1a6';
  DELETE FROM public.product_images WHERE product_id = 'c4c1fd1e-aa2b-5765-8d9b-8fb09890d1a6';
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('7905a794-ca99-5632-8aac-8233fde97904', 'c4c1fd1e-aa2b-5765-8d9b-8fb09890d1a6', '199842961577', 'XS', null, 3990, null, 15, 3, true, now());
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('c0381f31-4d50-5e06-a254-a1ae4b407439', 'c4c1fd1e-aa2b-5765-8d9b-8fb09890d1a6', '199842961553', 'S', null, 3990, null, 15, 3, true, now());
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('b83d0f53-d453-5a51-9838-ece49d5b43e3', 'c4c1fd1e-aa2b-5765-8d9b-8fb09890d1a6', '199842961546', 'M', null, 3990, null, 15, 3, true, now());
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('5bd6ea35-5b3c-5a8a-b0b4-e6691484a454', 'c4c1fd1e-aa2b-5765-8d9b-8fb09890d1a6', '199842961539', 'L', null, 3990, null, 15, 3, true, now());
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('5eba2787-307d-5552-b668-935c0597eed8', 'c4c1fd1e-aa2b-5765-8d9b-8fb09890d1a6', '4199777371560', 'XL', null, 3990, null, 15, 3, true, now());
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('634ee88a-bc89-553d-a419-e87f575d11d8', 'c4c1fd1e-aa2b-5765-8d9b-8fb09890d1a6', '4199777371560-2XL-5', '2XL', null, 3990, null, 15, 3, true, now());
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('a78fab4f-fcd7-5368-992f-2919c25ed490', 'c4c1fd1e-aa2b-5765-8d9b-8fb09890d1a6', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/26netkmtpsil_-_picture_1.webp?v=1782290465', 'Atlassian Williams Racing 2026 Silverstone GP Team Tech Polo', 0);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('9aecbd90-9473-58e1-8eff-790ee0e7f3dd', 'c4c1fd1e-aa2b-5765-8d9b-8fb09890d1a6', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/26netkmtpsil_-_picture_3.webp?v=1782290465', 'Atlassian Williams Racing 2026 Silverstone GP Team Tech Polo', 1);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('8e0233dc-4e0b-5600-a703-5a3c7a5ec71d', 'c4c1fd1e-aa2b-5765-8d9b-8fb09890d1a6', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/26netkmtpsil_-_picture_2.webp?v=1782290465', 'Atlassian Williams Racing 2026 Silverstone GP Team Tech Polo', 2);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('9d46efdc-0651-53b7-8e07-e567228594ca', 'c4c1fd1e-aa2b-5765-8d9b-8fb09890d1a6', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/26netkmtpsil-_picture_4.webp?v=1782290465', 'Atlassian Williams Racing 2026 Silverstone GP Team Tech Polo', 3);


  -- Product: Pirelli F1® 2026 British GP Podium Cap
  SELECT id INTO v_brand_id FROM public.brands WHERE slug = 'pirelli' LIMIT 1;
  SELECT id INTO v_category_id FROM public.categories WHERE slug = 'headwear' LIMIT 1;

  INSERT INTO public.products (id, brand_id, category_id, name, slug, description, status, is_preorder, created_at, updated_at)
  VALUES (
    'c136b4b0-9d13-5849-a6b7-4280a333ebf1',
    COALESCE(v_brand_id, 'd0f953bc-fa01-5b80-b524-77d99bb85de8'),
    COALESCE(v_category_id, 'e5c9f0cf-ce3a-5a67-b4bb-7a11cb89795b'),
    'Pirelli F1® 2026 British GP Podium Cap',
    'pirelli-f1®-2026-british-gp-podium-cap',
    'Pirelli Podium Cap Silverstone 2026 หมวก F1 ลิมิเต็ดอิดิชั่นจากสนาม British Grand Prix
สัมผัสบรรยากาศแห่งความเร็วจากสนาม Silverstone หนึ่งในสนามแข่งที่มีประวัติศาสตร์ยาวนานที่สุดของ Formula 1® กับ Pirelli Podium Cap Silverstone 2026 หมวกลิมิเต็ดอิดิชั่นที่ได้รับแรงบันดาลใจจากการแข่งขัน British Grand Prix 2026

หมวกรุ่นพิเศษนี้โดดเด่นด้วยดีไซน์ที่สะท้อนเอกลักษณ์ของสนาม Silverstone ผสานงานออกแบบสไตล์มอเตอร์สปอร์ตระดับพรีเมียม พร้อมรายละเอียดที่ได้รับแรงบันดาลใจจากโลก Formula 1® เหมาะสำหรับแฟน F1 นักสะสม และผู้ที่ชื่นชอบแฟชั่นสไตล์ Racing Lifestyle

ผลิตจากวัสดุคุณภาพสูง สวมใส่สบายในชีวิตประจำวัน ไม่ว่าจะใส่เชียร์การแข่งขันใน Race Weekend หรือใช้เป็นไอเท็มสะสมในคอลเลกชัน F1 ของคุณ

จุดเด่นสินค้า

• หมวก Pirelli Podium Cap รุ่น Silverstone 2026

• คอลเลกชันลิมิเต็ดอิดิชั่นจาก British Grand Prix

• ดีไซน์ได้รับแรงบันดาลใจจาก Formula 1® และสนาม Silverstone

• งานผลิตคุณภาพสูง พร้อมรายละเอียดพิเศษเฉพาะสนามแข่งขัน

• เหมาะสำหรับแฟน F1 นักสะสม และสาย Motorsport Lifestyle

• สินค้าลิขสิทธิ์แท้จาก Pirelli

Pirelli Podium Cap Silverstone 2026 – Limited Edition British Grand Prix Formula 1 Cap
Celebrate one of the most iconic venues in Formula 1® with the Pirelli Podium Cap Silverstone 2026, a limited-edition cap inspired by the legendary British Grand Prix at Silverstone Circuit.

Designed for motorsport enthusiasts, collectors, and Formula 1 fans, this exclusive podium cap combines premium craftsmanship with distinctive race-inspired details that pay tribute to one of the sport''s most historic events.

Whether you''re attending a race weekend, building your F1 collection, or looking for a stylish motorsport accessory, the Silverstone 2026 Podium Cap delivers authentic racing heritage and everyday wearability.

Key Features

• Official Pirelli Podium Cap Silverstone 2026

• Limited Edition British Grand Prix collection

• Inspired by the iconic Silverstone Circuit and Formula 1®

• Premium construction and comfortable fit

• Ideal for F1 fans, collectors, and motorsport enthusiasts

• Authentic licensed Pirelli merchandise

Available at FASTESTLAP.STORE',
    'active',
    false,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    brand_id = EXCLUDED.brand_id,
    category_id = EXCLUDED.category_id,
    status = EXCLUDED.status,
    updated_at = now();
  DELETE FROM public.product_variants WHERE product_id = 'c136b4b0-9d13-5849-a6b7-4280a333ebf1';
  DELETE FROM public.product_images WHERE product_id = 'c136b4b0-9d13-5849-a6b7-4280a333ebf1';
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('34ce76e6-0f42-553d-8f59-74ca6581ca9d', 'c136b4b0-9d13-5849-a6b7-4280a333ebf1', '806812551729', null, null, 3200, null, 15, 3, true, now());
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('af96c6d7-cc1e-5685-bf83-4421b1cec6eb', 'c136b4b0-9d13-5849-a6b7-4280a333ebf1', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/pdp-uk26-left45-a.webp?v=1782185094', 'Pirelli F1® 2026 British GP Podium Cap', 0);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('958bd46d-1ed1-5fa9-a16c-995e8abb7329', 'c136b4b0-9d13-5849-a6b7-4280a333ebf1', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/pdp-uk26-front.png?v=1782185087', 'Pirelli F1® 2026 British GP Podium Cap', 1);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('910cec7d-7f8a-5f32-b5f5-793b5db0719b', 'c136b4b0-9d13-5849-a6b7-4280a333ebf1', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/pdp-uk26-2.png?v=1782185087', 'Pirelli F1® 2026 British GP Podium Cap', 2);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('391ef107-3267-5af7-9dfc-8cf92904e6df', 'c136b4b0-9d13-5849-a6b7-4280a333ebf1', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/pdp-uk26-right.png?v=1782185087', 'Pirelli F1® 2026 British GP Podium Cap', 3);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('d8f9a63a-1123-5274-a954-97c7986f1a48', 'c136b4b0-9d13-5849-a6b7-4280a333ebf1', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/pdp-uk26-back.png?v=1782185087', 'Pirelli F1® 2026 British GP Podium Cap', 4);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('7bb9cc07-82c9-5ff5-a50e-8b350c8cc0f1', 'c136b4b0-9d13-5849-a6b7-4280a333ebf1', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/pdp-uk26-top.png?v=1782185087', 'Pirelli F1® 2026 British GP Podium Cap', 5);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('db1df7d5-4c72-528c-b1f3-20f4557c7689', 'c136b4b0-9d13-5849-a6b7-4280a333ebf1', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/pdp-uk26.jpg?v=1782185094', 'Pirelli F1® 2026 British GP Podium Cap', 6);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('78e304bf-cd1f-5b14-90bb-54a2dc8cdead', 'c136b4b0-9d13-5849-a6b7-4280a333ebf1', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/pdp-uk26-left-b.webp?v=1782185094', 'Pirelli F1® 2026 British GP Podium Cap', 7);


  -- Product: OP81 Fan Essential Bundle Kit
  SELECT id INTO v_brand_id FROM public.brands WHERE slug = 'mclaren-f1' LIMIT 1;
  SELECT id INTO v_category_id FROM public.categories WHERE slug = 'formula-1' LIMIT 1;

  INSERT INTO public.products (id, brand_id, category_id, name, slug, description, status, is_preorder, created_at, updated_at)
  VALUES (
    '09ff6a3d-fffa-5000-a5b5-654dc7bbff5c',
    COALESCE(v_brand_id, 'f694020d-d7ed-5e4f-bbb5-312827b3de59'),
    COALESCE(v_category_id, 'b0429312-bc52-53cd-89a2-d506d4856bff'),
    'OP81 Fan Essential Bundle Kit',
    'op81-fan-essential-bundle-kit',
    'Essential Bundle Kit 
ฟูลเซ็ท ออนกริด
เสื้อยืดนักแข่ง + หมวกนักแข่ง = ครบเซ็ทที่ต้องการ คุ้มกว่า กับดีลแพ็คคู่

เสื้อยืดนักแข่งทางการของ Oscar Piastri ฤดูกาล Formula 1 ปี 2026 จากทีม McLaren Formula 1 Team ที่แฟนมอเตอร์สปอร์ตตัวจริงไม่ควรพลาด! ดีไซน์ถอดแบบจากชุดที่นักแข่งสวมใส่จริง ส่งตรงจากสนามแข่งสู่สไตล์ประจำวันของคุณ โดดเด่นด้วยลุคสปอร์ตทันสมัย ใส่สบาย ระบายอากาศดี เหมาะทั้งวันแข่งขันและการสวมใส่ในชีวิตประจำวัน

• เสื้อยืด Oscar Piastri Driver T-Shirt ฤดูกาล 2026 ของแท้ (Official Licensed Replica)

• แบบเดียวกับที่นักแข่งสวมใส่

• โลโก้ทีมและพาร์ทเนอร์ครบล่าสุด

• แขนสั้น คอกลม ใส่สบาย

• ทรง Unisex Regular Fit เหมาะกับทุกเพศ

• วัสดุคุณภาพ: 94% Polyester, 6% Elastane

Straight from the pit lane to your wardrobe, this is the official Oscar Piastri driver t-shirt for the 2026 Formula 1 season. Designed for comfort with a modern, everyday fit, it provides a sleek, race-ready appearance that looks as sharp as it feels. Perfect for race weekends or daily wear, it’s the ideal way to show your support for Oscar and the McLaren Mastercard Formula 1 Team.

• Official Licensed Replica Collection

• 2026 Oscar Piastri Driver T-Shirt

• As Worn by Oscar Piastri

• All the Latest McLaren Mastercard Formula 1 Team and Partner Logos

• Short Sleeve with Round Neck Collar

• Unisex Regular Fit

• Manufacturer: PUMA - Official Partner

• Made in Vietnam

• Material: 94% Polyester, 6% Elastane

• Responsibly Sourced',
    'active',
    false,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    brand_id = EXCLUDED.brand_id,
    category_id = EXCLUDED.category_id,
    status = EXCLUDED.status,
    updated_at = now();
  DELETE FROM public.product_variants WHERE product_id = '09ff6a3d-fffa-5000-a5b5-654dc7bbff5c';
  DELETE FROM public.product_images WHERE product_id = '09ff6a3d-fffa-5000-a5b5-654dc7bbff5c';
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('c88f8155-4263-5174-a9c8-aa81aa9f8f9a', '09ff6a3d-fffa-5000-a5b5-654dc7bbff5c', 'OP81-FAN-ESSENT-XS-XS-0', 'XS', null, 4418, null, 15, 3, true, now());
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('75d5be9f-b078-5932-a4dc-a8cd4c129ee8', '09ff6a3d-fffa-5000-a5b5-654dc7bbff5c', 'OP81-FAN-ESSENT-S-S-1', 'S', null, 4418, null, 15, 3, true, now());
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('f8b4cee0-fed6-5545-90ad-d73f90ab9dce', '09ff6a3d-fffa-5000-a5b5-654dc7bbff5c', 'OP81-FAN-ESSENT-M-M-2', 'M', null, 4418, null, 15, 3, true, now());
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('2cce2865-0848-5612-b01a-bcf23386a831', '09ff6a3d-fffa-5000-a5b5-654dc7bbff5c', 'OP81-FAN-ESSENT-L-L-3', 'L', null, 4418, null, 15, 3, true, now());
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('f87a2d4d-f33f-5e98-bb76-885c2d9d5259', '09ff6a3d-fffa-5000-a5b5-654dc7bbff5c', 'OP81-FAN-ESSENT-XL-XL-4', 'XL', null, 4418, null, 15, 3, true, now());
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('7d1d83d4-e2e4-57fd-90bc-7a1500e27f98', '09ff6a3d-fffa-5000-a5b5-654dc7bbff5c', 'OP81-FAN-ESSENT-2XL-2XL-5', '2XL', null, 4418, null, 15, 3, true, now());
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('31b75f68-e094-5dd1-a53b-e7357e6a6562', '09ff6a3d-fffa-5000-a5b5-654dc7bbff5c', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/mobile_banner_f94f3236-0f4d-4657-9ce0-4810a4c17ee8.png?v=1782105349', 'OP81 Fan Essential Bundle Kit', 0);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('b26c9514-84eb-5e3f-93bc-b3f11ee2657d', '09ff6a3d-fffa-5000-a5b5-654dc7bbff5c', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/701241091001_pp_02_mclaren.jpg?v=1778051075', 'OP81 Fan Essential Bundle Kit', 1);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('2057de69-5b9d-5d47-bd5e-bde37b88b384', '09ff6a3d-fffa-5000-a5b5-654dc7bbff5c', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/701241091001_mp_03_mclaren.jpg?v=1778051075', 'OP81 Fan Essential Bundle Kit', 2);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('611cc40f-39f4-58a8-b7e7-c48080a321ba', '09ff6a3d-fffa-5000-a5b5-654dc7bbff5c', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/701241091001_mp_01_mclaren.jpg?v=1778051075', 'OP81 Fan Essential Bundle Kit', 3);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('a8a8e0db-46e5-57f6-a2aa-3cf98e75c23c', '09ff6a3d-fffa-5000-a5b5-654dc7bbff5c', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/701241091001_mp_02_mclaren.jpg?v=1778051075', 'OP81 Fan Essential Bundle Kit', 4);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('ede4d325-da79-5804-b68c-83f750efdd0a', '09ff6a3d-fffa-5000-a5b5-654dc7bbff5c', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/701241101001_pp_01_mclaren.jpg?v=1774526527', 'OP81 Fan Essential Bundle Kit', 5);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('ea8286ae-7b4d-5724-9714-17cd9714bc88', '09ff6a3d-fffa-5000-a5b5-654dc7bbff5c', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/701241101001_pp_03_mclaren.jpg?v=1774526527', 'OP81 Fan Essential Bundle Kit', 6);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('1ad0be4c-0cc0-583e-9363-ca0315cdbe1b', '09ff6a3d-fffa-5000-a5b5-654dc7bbff5c', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/701241101001_pp_05_mclaren.jpg?v=1774526527', 'OP81 Fan Essential Bundle Kit', 7);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('f645b7e4-0cf9-5a3a-943a-792ebe16a6ea', '09ff6a3d-fffa-5000-a5b5-654dc7bbff5c', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/701241101001_pp_02_mclaren.jpg?v=1774526527', 'OP81 Fan Essential Bundle Kit', 8);


  -- Product: Mercedes-AMG F1 adidas women's 2026 Team Engineers Polo - Black
  SELECT id INTO v_brand_id FROM public.brands WHERE slug = 'mercedes-amg-petronas-f1' LIMIT 1;
  SELECT id INTO v_category_id FROM public.categories WHERE slug = 'formula-1' LIMIT 1;

  INSERT INTO public.products (id, brand_id, category_id, name, slug, description, status, is_preorder, created_at, updated_at)
  VALUES (
    'e6726c57-ef76-57bd-a267-c43db243daec',
    COALESCE(v_brand_id, '1e56354f-a63e-5761-b379-1628c8e59a9c'),
    COALESCE(v_category_id, 'b0429312-bc52-53cd-89a2-d506d4856bff'),
    'Mercedes-AMG F1 adidas women''s 2026 Team Engineers Polo - Black',
    'mercedes-amg-f1-adidas-womens-2026-team-engineers-polo-black',
    'แสดงการสนับสนุนทีม Mercedes-AMG F1 ด้วยเสื้อโปโลทีมสิทธิ์แท้ ออกแบบด้วยโลโก้ทีมอย่างละเอียด และมาพร้อมทรงยูนิเซ็กส์ที่สวมใส่สบาย เหมาะสำหรับแฟน ๆ ที่ต้องการสวมใส่เครื่องแต่งกายทีมแท้ที่สะท้อนจิตวิญญาณของกีฬา

• ลิขสิทธิ์แท้

• แบบเดียวกับที่ทีมและนักแข่งสวมใส่

• โลโก้พาร์ทเนอร์ทีมประจำฤดูกาล

• แขนสั้น คอกลม

• สำหรับผู้หญิง

• วัสดุ 100% โพลีเอสเทอร์

Size:
XS อก 33-34" / 22"
S อก 36-37" / 22"
M อก 38-39" / 22.5"
L อก 42-43" / 23"
XL อก 44-45" / 23.5"

Show your team spirit with this official licensed Mercedes-AMG F1 Engineers Polo, featuring all the latest team and partner logos in a comfortable unisex regular fit. Perfect for fans and enthusiasts alike, it offers a sleek short-sleeve design with a placket collar for a polished look.

• Official licensed Replica collection

• As seen worn by the team and drivers

• All the latest team and partner logos

• Short sleeve with placket collar

• Women''s fit

• Manufacturer: adidas - official partner

• Made in Vietnam

• Composition: 57% Cotton, 39% Modal, 4% Elastane

• Responsibly sourced

FASTEST LAP: จำหน่ายสินค้า F1 Merchandise ลิขสิทธิ์แท้จากทีมฟอร์มูล่าวันครบทั้ง 11 ทีม',
    'active',
    false,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    brand_id = EXCLUDED.brand_id,
    category_id = EXCLUDED.category_id,
    status = EXCLUDED.status,
    updated_at = now();
  DELETE FROM public.product_variants WHERE product_id = 'e6726c57-ef76-57bd-a267-c43db243daec';
  DELETE FROM public.product_images WHERE product_id = 'e6726c57-ef76-57bd-a267-c43db243daec';
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('06682215-a7ec-58a6-98db-aa2aa36f8777', 'e6726c57-ef76-57bd-a267-c43db243daec', 'MERCEDES-AMG-F1-XS-XS-0', 'XS', null, 2900, null, 15, 3, true, now());
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('a5c1eb4f-4177-52f3-b7e4-dc5c3da5d60c', 'e6726c57-ef76-57bd-a267-c43db243daec', 'MERCEDES-AMG-F1-S-S-1', 'S', null, 2900, null, 15, 3, true, now());
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('e8055c11-f4bc-5f97-af80-2cdeb22be1fc', 'e6726c57-ef76-57bd-a267-c43db243daec', 'MERCEDES-AMG-F1-M-M-2', 'M', null, 2900, null, 15, 3, true, now());
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('4f30cd3d-9e38-55f9-97e1-1eb956117fa6', 'e6726c57-ef76-57bd-a267-c43db243daec', 'MERCEDES-AMG-F1-L-L-3', 'L', null, 2900, null, 15, 3, true, now());
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('6bf27040-82ee-58b0-9935-d934ed12d851', 'e6726c57-ef76-57bd-a267-c43db243daec', 'MERCEDES-AMG-F1-XL-XL-4', 'XL', null, 2900, null, 15, 3, true, now());
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('9e4afd9f-4227-5142-9786-37ba77bd16af', 'e6726c57-ef76-57bd-a267-c43db243daec', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/MERCEDES_-_AMG_PETRONAS_FORMULA_1_TEAM_ENGINEERS_POLO_REGULAR_Shirt_Black_KE5525_HM5.avif?v=1782316437', 'Mercedes-AMG F1 adidas women''s 2026 Team Engineers Polo - Black', 0);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('15b5e917-a052-5cbc-b580-0a429df82eeb', 'e6726c57-ef76-57bd-a267-c43db243daec', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/MERCEDES_-_AMG_PETRONAS_FORMULA_1_TEAM_ENGINEERS_POLO_REGULAR_Shirt_Black_KE5525_HM3_hover.avif?v=1782316437', 'Mercedes-AMG F1 adidas women''s 2026 Team Engineers Polo - Black', 1);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('95d54279-a7e8-5612-a728-884c58fa1c66', 'e6726c57-ef76-57bd-a267-c43db243daec', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/MERCEDES_-_AMG_PETRONAS_FORMULA_1_TEAM_ENGINEERS_POLO_REGULAR_Shirt_Black_KE5525_HM11.avif?v=1782316437', 'Mercedes-AMG F1 adidas women''s 2026 Team Engineers Polo - Black', 2);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('7da5c97b-1abc-54f2-bb1d-674b83e2a0ac', 'e6726c57-ef76-57bd-a267-c43db243daec', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/MERCEDES_-_AMG_PETRONAS_FORMULA_1_TEAM_ENGINEERS_POLO_REGULAR_Shirt_Black_KE5525_HM8.avif?v=1782316437', 'Mercedes-AMG F1 adidas women''s 2026 Team Engineers Polo - Black', 3);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('bf64b632-f815-510b-89cd-eb67563d6ee4', 'e6726c57-ef76-57bd-a267-c43db243daec', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/MERCEDES_-_AMG_PETRONAS_FORMULA_1_TEAM_ENGINEERS_POLO_REGULAR_Shirt_Black_KE5525_HM7.avif?v=1782316437', 'Mercedes-AMG F1 adidas women''s 2026 Team Engineers Polo - Black', 4);


  -- Product: Red Bull Racing Women's 2026 Max Verstappen Driver T-shirt
  SELECT id INTO v_brand_id FROM public.brands WHERE slug = 'oracle-red-bull-racing' LIMIT 1;
  SELECT id INTO v_category_id FROM public.categories WHERE slug = 'formula-1' LIMIT 1;

  INSERT INTO public.products (id, brand_id, category_id, name, slug, description, status, is_preorder, created_at, updated_at)
  VALUES (
    'c8cf619d-4ea9-5376-91e9-39b2cc3f1810',
    COALESCE(v_brand_id, '487f7705-c55f-551a-b4d7-8b21d6355ba3'),
    COALESCE(v_category_id, 'b0429312-bc52-53cd-89a2-d506d4856bff'),
    'Red Bull Racing Women''s 2026 Max Verstappen Driver T-shirt',
    'red-bull-racing-womens-2026-max-verstappen-driver-t-shirt',
    'แสดงพลังแห่งการเชียร์แชมป์โลก 4 สมัยไปกับ Red Bull Racing Max Verstappen Replica Driver T-Shirt เสื้อทีม Max Verstappen อย่างเป็นทางการสำหรับผู้หญิง ที่ได้รับแรงบันดาลใจจากชุดที่นักแข่งสวมใส่ตลอดสุดสัปดาห์การแข่งขัน Formula 1®

โดดเด่นด้วยโลโก้ทีม Oracle Red Bull Racing, โลโก้ผู้สนับสนุนล่าสุด และรายละเอียดที่ถ่ายทอดจิตวิญญาณแห่งมอเตอร์สปอร์ตได้อย่างสมบูรณ์แบบ ผลิตโดย Castore ด้วยมาตรฐานคุณภาพระดับพรีเมียม ให้สัมผัสสวมใส่สบายในทรง Unisex เหมาะสำหรับทั้งการเชียร์ข้างสนาม การรับชมการแข่งขัน หรือการสวมใส่ในชีวิตประจำวัน

ไม่ว่าคุณจะเป็นแฟนพันธุ์แท้ของ Max Verstappen หรือทีม Red Bull Racing เสื้อรุ่นนี้คือไอเทมที่ช่วยให้คุณใกล้ชิดกับโลกของ Formula 1 ได้มากยิ่งขึ้น

Show your support for Red Bull Racing and Max Verstappen with this officially licensed replica driver T-shirt featuring the latest team logos and a comfortable unisex fit. Crafted with premium craftsmanship by Castore, it offers an authentic racing experience suitable for any fan.

• Official licensed Replica collection

• As seen worn by Max Verstappen

• All the latest team and partner logos

• Women''s fit

• Manufacturer: Castore - official partner

• Made in Vietnam

• Composition: 100% Polyester

• Responsibly sourced

FASTEST LAP: จำหน่ายสินค้า F1 Merchandise ลิขสิทธิ์แท้จากทีมฟอร์มูล่าวันครบทั้ง 11 ทีม',
    'active',
    false,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    brand_id = EXCLUDED.brand_id,
    category_id = EXCLUDED.category_id,
    status = EXCLUDED.status,
    updated_at = now();
  DELETE FROM public.product_variants WHERE product_id = 'c8cf619d-4ea9-5376-91e9-39b2cc3f1810';
  DELETE FROM public.product_images WHERE product_id = 'c8cf619d-4ea9-5376-91e9-39b2cc3f1810';
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('01b4ca00-0fcb-5343-a1bd-29538bb45b89', 'c8cf619d-4ea9-5376-91e9-39b2cc3f1810', 'RED-BULL-RACING-6-6-0', '6', null, 3411, 3790, 15, 3, true, now());
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('f0be5870-f8c4-5da3-b33b-37a576ad534b', 'c8cf619d-4ea9-5376-91e9-39b2cc3f1810', '5063606454931', '8', null, 3411, 3790, 15, 3, true, now());
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('58cbe3c0-09b1-5e4b-bced-242fba21b5ea', 'c8cf619d-4ea9-5376-91e9-39b2cc3f1810', '5063606454924', '10', null, 3411, 3790, 15, 3, true, now());
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('de06e5d0-71d9-5862-898e-b339d3cd09ef', 'c8cf619d-4ea9-5376-91e9-39b2cc3f1810', '5063606454917', '12', null, 3411, 3790, 15, 3, true, now());
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('fdcc37b2-f94e-5165-a8fa-49c6fe9c591f', 'c8cf619d-4ea9-5376-91e9-39b2cc3f1810', '5063606454900', '14', null, 3411, 3790, 15, 3, true, now());
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('570234b6-54ad-57d8-b412-90eb3b63ba7e', 'c8cf619d-4ea9-5376-91e9-39b2cc3f1810', '5063606454894', '16', null, 3411, 3790, 15, 3, true, now());
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('5eb4f9a1-b45a-5eb4-969a-662ede8c93d9', 'c8cf619d-4ea9-5376-91e9-39b2cc3f1810', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/TF14196.png?v=1781614992', 'Red Bull Racing Women''s 2026 Max Verstappen Driver T-shirt', 0);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('4fbda1fe-f44b-5bd1-8bbf-72dab7c648e3', 'c8cf619d-4ea9-5376-91e9-39b2cc3f1810', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/TF14196_2.png?v=1781614990', 'Red Bull Racing Women''s 2026 Max Verstappen Driver T-shirt', 1);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('945df3fd-a67e-59a4-979a-a3b183b3af19', 'c8cf619d-4ea9-5376-91e9-39b2cc3f1810', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/TF14196_3.png?v=1781614991', 'Red Bull Racing Women''s 2026 Max Verstappen Driver T-shirt', 2);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('4c8583d8-dcdd-5fa0-b28b-bcf1328212b4', 'c8cf619d-4ea9-5376-91e9-39b2cc3f1810', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/TF14196_4.png?v=1781615032', 'Red Bull Racing Women''s 2026 Max Verstappen Driver T-shirt', 3);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('5c6816e8-67b9-569a-b632-0adc4d20efa2', 'c8cf619d-4ea9-5376-91e9-39b2cc3f1810', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/TF14196_5.png?v=1781614990', 'Red Bull Racing Women''s 2026 Max Verstappen Driver T-shirt', 4);


  -- Product: Red Bull Racing Women's 2026 Max Verstappen Driver Polo
  SELECT id INTO v_brand_id FROM public.brands WHERE slug = 'oracle-red-bull-racing' LIMIT 1;
  SELECT id INTO v_category_id FROM public.categories WHERE slug = 'formula-1' LIMIT 1;

  INSERT INTO public.products (id, brand_id, category_id, name, slug, description, status, is_preorder, created_at, updated_at)
  VALUES (
    '053766cd-27e9-5b62-922b-c345abedac1a',
    COALESCE(v_brand_id, '487f7705-c55f-551a-b4d7-8b21d6355ba3'),
    COALESCE(v_category_id, 'b0429312-bc52-53cd-89a2-d506d4856bff'),
    'Red Bull Racing Women''s 2026 Max Verstappen Driver Polo',
    'red-bull-racing-womens-2026-max-verstappen-driver-polo',
    'แสดงพลังแห่งการเชียร์แชมป์โลก 4 สมัยไปกับ Red Bull Racing Max Verstappen Replica Driver Polo เสื้อโปโล Max Verstappen อย่างเป็นทางการสำหรับผู้หญิง ที่ได้รับแรงบันดาลใจจากชุดที่นักแข่งสวมใส่ตลอดสุดสัปดาห์การแข่งขัน Formula 1®

โดดเด่นด้วยโลโก้ทีม Oracle Red Bull Racing, โลโก้ผู้สนับสนุนล่าสุด และรายละเอียดที่ถ่ายทอดจิตวิญญาณแห่งมอเตอร์สปอร์ตได้อย่างสมบูรณ์แบบ ผลิตโดย Castore ด้วยมาตรฐานคุณภาพระดับพรีเมียม ให้สัมผัสสวมใส่สบายในทรง Unisex เหมาะสำหรับทั้งการเชียร์ข้างสนาม การรับชมการแข่งขัน หรือการสวมใส่ในชีวิตประจำวัน

ไม่ว่าคุณจะเป็นแฟนพันธุ์แท้ของ Max Verstappen หรือทีม Red Bull Racing เสื้อรุ่นนี้คือไอเทมที่ช่วยให้คุณใกล้ชิดกับโลกของ Formula 1 ได้มากยิ่งขึ้น

Show your support for Red Bull Racing and Max Verstappen with this officially licensed replica driver T-shirt featuring the latest team logos and a comfortable unisex fit. Crafted with premium craftsmanship by Castore, it offers an authentic racing experience suitable for any fan.

• Official licensed Replica collection

• As seen worn by Max Verstappen

• All the latest team and partner logos

• Women''s fit

• Manufacturer: Castore - official partner

• Made in Vietnam

• Composition: 100% Polyester

• Responsibly sourced

FASTEST LAP: จำหน่ายสินค้า F1 Merchandise ลิขสิทธิ์แท้จากทีมฟอร์มูล่าวันครบทั้ง 11 ทีม',
    'active',
    false,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    brand_id = EXCLUDED.brand_id,
    category_id = EXCLUDED.category_id,
    status = EXCLUDED.status,
    updated_at = now();
  DELETE FROM public.product_variants WHERE product_id = '053766cd-27e9-5b62-922b-c345abedac1a';
  DELETE FROM public.product_images WHERE product_id = '053766cd-27e9-5b62-922b-c345abedac1a';
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('ed00084f-4213-5d09-bddc-056a4342a3a7', '053766cd-27e9-5b62-922b-c345abedac1a', 'RED-BULL-RACING-6-6-0-171', '6', null, 4311, 4790, 15, 3, true, now());
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('9f6aa32c-6ad7-536e-8242-3affbbd92c2e', '053766cd-27e9-5b62-922b-c345abedac1a', '5063606455297', '8', null, 4311, 4790, 15, 3, true, now());
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('75fd9955-19b5-5967-8560-4e1d669b81ee', '053766cd-27e9-5b62-922b-c345abedac1a', '5063606455280', '10', null, 4311, 4790, 15, 3, true, now());
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('acf94556-e847-53e7-b877-ac2c078599e8', '053766cd-27e9-5b62-922b-c345abedac1a', '5063606455273', '12', null, 4311, 4790, 15, 3, true, now());
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('931d44fe-8dbf-514e-b168-aa85abd4f719', '053766cd-27e9-5b62-922b-c345abedac1a', '5063606455266', '14', null, 4311, 4790, 15, 3, true, now());
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('4fb8df9d-f641-59fd-b0c2-8cd8ef5b205a', '053766cd-27e9-5b62-922b-c345abedac1a', 'RED-BULL-RACING-16-16-5', '16', null, 4311, 4790, 15, 3, true, now());
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('78794988-c35f-59cf-b928-e1a6d529c80e', '053766cd-27e9-5b62-922b-c345abedac1a', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/TF14194-023.png?v=1781614350', 'Red Bull Racing Women''s 2026 Max Verstappen Driver Polo', 0);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('cbc6f8b6-21f4-5fe5-9b75-d31efc11008c', '053766cd-27e9-5b62-922b-c345abedac1a', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/TF14194-023_2.png?v=1781614350', 'Red Bull Racing Women''s 2026 Max Verstappen Driver Polo', 1);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('34f9a3d0-525a-561a-9dcd-425f29cfbc03', '053766cd-27e9-5b62-922b-c345abedac1a', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/TF14194-023_3.png?v=1781614351', 'Red Bull Racing Women''s 2026 Max Verstappen Driver Polo', 2);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('8bd48bdd-0963-5d58-a2bb-bd32843e32d0', '053766cd-27e9-5b62-922b-c345abedac1a', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/TF14194-023_4.png?v=1781614350', 'Red Bull Racing Women''s 2026 Max Verstappen Driver Polo', 3);


  -- Product: Pirelli Formula 1® 2026 Tyre Magnet
  SELECT id INTO v_brand_id FROM public.brands WHERE slug = 'pirelli' LIMIT 1;
  SELECT id INTO v_category_id FROM public.categories WHERE slug = 'accessories' LIMIT 1;

  INSERT INTO public.products (id, brand_id, category_id, name, slug, description, status, is_preorder, created_at, updated_at)
  VALUES (
    '98ae26cc-ab08-5f56-ace2-2addf2b9714a',
    COALESCE(v_brand_id, 'd0f953bc-fa01-5b80-b524-77d99bb85de8'),
    COALESCE(v_category_id, '44fc7a48-8d3c-5239-9135-d0da818bc275'),
    'Pirelli Formula 1® 2026 Tyre Magnet',
    'pirelli-formula-1®-2026-tyre-magnet',
    'เพิ่มกลิ่นอายสนามแข่ง Formula 1® ให้กับพื้นที่ของคุณด้วย Pirelli Tyre Magnet แม่เหล็กดีไซน์พิเศษที่จำลองยางแต่ละคอมพาวด์ของ Pirelli ผู้ผลิตยางอย่างเป็นทางการของ Formula 1®

ตัวแม่เหล็กถูกออกแบบให้มีรายละเอียดเสมือนจริง ทั้งลายดอกยาง ตัวอักษร P ZERO™ และล้อแม็กสไตล์รถแข่ง F1 เหมาะสำหรับติดตู้เย็น ตู้เหล็ก หรือพื้นที่แม่เหล็กต่าง ๆ เพื่อเพิ่มความโดดเด่นให้กับมุมสะสมของแฟนมอเตอร์สปอร์ต

• สีแดง จำลองยาง Pirelli P ZERO™ Soft Compound

• สีเหลือง จำลองยาง Pirelli P ZERO™ Medium Compound

• สีขาว จำลองยาง Pirelli P ZERO™ Hard Compound

• 
สีเขียว จำลองยาง Pirelli P ZERO™ Intermediate Compound

• สีน้ำเงิน จำลองยาง Pirelli P ZERO™ Wet Compound

ไม่ว่าจะเป็นของสะสมสำหรับแฟน Formula 1®, ของตกแต่งโต๊ะทำงาน หรือของขวัญสำหรับคนรักความเร็ว Pirelli Tyre Magnet ชิ้นนี้คือไอเทมที่ไม่ควรพลาด

สินค้า Official Pirelli Merchandise

จำลองยาง Pirelli P ZERO™ 

ดีไซน์สมจริง พร้อมรายละเอียดล้อรถแข่ง

แม่เหล็กด้านหลัง ใช้งานได้จริง

เหมาะสำหรับสะสมและตกแต่ง

ของขวัญสำหรับแฟน Formula 1® และ Motorsport

ขนาดกะทัดรัด วางหรือใช้งานได้ทุกพื้นที่

Bring the excitement of Formula 1® into your everyday space with the Pirelli Tyre Magnet, a detailed collectible inspired by the iconic Pirelli P ZERO™ Soft compound tyre used in Formula 1 racing.

Featuring realistic tyre tread patterns, authentic colou markings, and a motorsport-inspired wheel design, this magnet is the perfect accessory for refrigerators, lockers, office spaces, or any magnetic surface. Its compact size and premium detailing make it an excellent collectible for F1 enthusiasts and motorsport fans alike.

Whether you''re expanding your Formula 1 memorabilia collection or searching for a unique gift, the Pirelli Tyre Magnet delivers a distinctive racing touch wherever it''s displayed.

Official Pirelli Merchandise

Inspired by the Pirelli P ZERO™ tyre

Realistic tyre and wheel detailing

Functional magnet backing

Perfect for collectors and motorsport enthusiasts

Ideal gift for Formula 1® fans

Compact and easy to display

Pirelli Tyre Magnet, Formula 1 Magnet, Pirelli P Zero Soft, F1 Collectible, ของสะสม F1, แม่เหล็กยาง Pirelli',
    'active',
    false,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    brand_id = EXCLUDED.brand_id,
    category_id = EXCLUDED.category_id,
    status = EXCLUDED.status,
    updated_at = now();
  DELETE FROM public.product_variants WHERE product_id = '98ae26cc-ab08-5f56-ace2-2addf2b9714a';
  DELETE FROM public.product_images WHERE product_id = '98ae26cc-ab08-5f56-ace2-2addf2b9714a';
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('1c665722-491e-5f3f-b913-1da9a5ae648f', '98ae26cc-ab08-5f56-ace2-2addf2b9714a', '806812552016', 'Red', null, 950, null, 15, 3, true, now());
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('5ba89e67-be62-5e5e-ba39-8da9fe07c12f', '98ae26cc-ab08-5f56-ace2-2addf2b9714a', '806812552023', 'Yellow', null, 950, null, 15, 3, true, now());
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('9ef7f617-8bb9-5598-bd9d-0d712693dc88', '98ae26cc-ab08-5f56-ace2-2addf2b9714a', '806812552009', 'White', null, 950, null, 15, 3, true, now());
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('7bc78c0b-d16d-5216-8863-366d15abff54', '98ae26cc-ab08-5f56-ace2-2addf2b9714a', '806812552047', 'Blue', null, 950, null, 15, 3, true, now());
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('8d778fc1-4c97-5aa0-9767-67a60195014e', '98ae26cc-ab08-5f56-ace2-2addf2b9714a', '806812552030', 'Green', null, 950, null, 15, 3, true, now());
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('0cd0c65a-d294-5dec-b88f-79fdcf7014eb', '98ae26cc-ab08-5f56-ace2-2addf2b9714a', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/PirelliFormula1_2026TireMagnet.png?v=1780910085', 'Pirelli Formula 1® 2026 Tyre Magnet', 0);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('27eb06a2-60b3-5429-924b-1cb68dc0c854', '98ae26cc-ab08-5f56-ace2-2addf2b9714a', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/TireMagnet_Red.png?v=1780909964', 'Pirelli Formula 1® 2026 Tyre Magnet', 1);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('2cfa2d70-640d-5b23-b515-2f3fa61ef0a0', '98ae26cc-ab08-5f56-ace2-2addf2b9714a', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/TireMagnet_Yellow.png?v=1780909964', 'Pirelli Formula 1® 2026 Tyre Magnet', 2);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('a1dc2ba4-570f-5b0e-86ea-1565d93e5c51', '98ae26cc-ab08-5f56-ace2-2addf2b9714a', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/TireMagnet_White.png?v=1780909964', 'Pirelli Formula 1® 2026 Tyre Magnet', 3);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('1bea7218-50f3-54cc-a626-c1cf4fcb5ad5', '98ae26cc-ab08-5f56-ace2-2addf2b9714a', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/TireMagnet_Blue.png?v=1780909964', 'Pirelli Formula 1® 2026 Tyre Magnet', 4);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('c8361c7f-7070-5d60-b805-c6cf19a23fa1', '98ae26cc-ab08-5f56-ace2-2addf2b9714a', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/TireMagnet_Green.png?v=1780909964', 'Pirelli Formula 1® 2026 Tyre Magnet', 5);


  -- Product: Pirelli F1® 2026 Podium cap
  SELECT id INTO v_brand_id FROM public.brands WHERE slug = 'pirelli' LIMIT 1;
  SELECT id INTO v_category_id FROM public.categories WHERE slug = 'headwear' LIMIT 1;

  INSERT INTO public.products (id, brand_id, category_id, name, slug, description, status, is_preorder, created_at, updated_at)
  VALUES (
    '46eb6e4a-a37a-5c68-8114-0719c6273056',
    COALESCE(v_brand_id, 'd0f953bc-fa01-5b80-b524-77d99bb85de8'),
    COALESCE(v_category_id, 'e5c9f0cf-ce3a-5a67-b4bb-7a11cb89795b'),
    'Pirelli F1® 2026 Podium cap',
    'pirelli-f1®-2026-podium-cap',
    'สุคดลาสสิค! Formula 1® Pirelli ที่แฟน F1 ห้ามพลาด! ใบเดียวกับที่นักแข่งผู้ชนะได้ใส่ขึ้นโพเดียม! 🎉

• โลโก้ Pirelli ปักเด่นอยู่ด้านหน้าแบบเท่ ๆ

• มีคำว่า ‘1st’ ปักอยู่ด้านข้าง ให้รู้กันไปเลยว่านี่คือของแชมป์ตัวจริง

• ด้านหลังปัก “P ZERO™” เพิ่มความแรงให้กับลุค

• มาพร้อมสาย Snapback ปรับได้ ใส่ได้ทุกไซส์

• ผลิตจากผ้าคอตตอน 100% ใส่สบายตลอดวัน

เป็นทั้งหมวกแฟชั่นสุดคูลและไอเทมสะสมที่สายแข่งต้องมี! 🏁🔥

Part of a collectible Formula 1® Pirelli podium cap collection and as worn by the Grand Prix winning driver throughout the 2025 F1® season. Features the Pirelli logo and ''1st'' position embroidered on the side.

• As worn on the podium by the winner of the 2025 Formula 1® Grand Prix

• Pirelli logo on front

• ''1st'' position embroidered on side

• P ZERO™ embroidered on rear

• Snapback

• Adult adjustable fit

• Material: 100% Cotton

FASTEST LAP: จำหน่ายสินค้า F1 Merchandise ลิขสิทธิ์แท้จากทีมฟอร์มูล่าวันครบทั้ง 11 ทีม',
    'active',
    false,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    brand_id = EXCLUDED.brand_id,
    category_id = EXCLUDED.category_id,
    status = EXCLUDED.status,
    updated_at = now();
  DELETE FROM public.product_variants WHERE product_id = '46eb6e4a-a37a-5c68-8114-0719c6273056';
  DELETE FROM public.product_images WHERE product_id = '46eb6e4a-a37a-5c68-8114-0719c6273056';
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('cef9db31-b4c4-50c1-aa8a-40e08c950007', '46eb6e4a-a37a-5c68-8114-0719c6273056', '806812551561', null, null, 2200, null, 15, 3, true, now());
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('eeeed28b-2060-5e59-a786-7aa9d8f4e757', '46eb6e4a-a37a-5c68-8114-0719c6273056', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/701244129001_PP_01_Pirelli.webp?v=1773034108', 'Pirelli F1® 2026 Podium cap', 0);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('d4a48bb9-f16c-523e-8f02-f0e903944f8e', '46eb6e4a-a37a-5c68-8114-0719c6273056', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/701244129001_PP_03_Pirelli.webp?v=1773034108', 'Pirelli F1® 2026 Podium cap', 1);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('831dffac-174d-5383-b302-39e5f69992a7', '46eb6e4a-a37a-5c68-8114-0719c6273056', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/701244129001_PP_02_Pirelli.webp?v=1773034108', 'Pirelli F1® 2026 Podium cap', 2);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('4a39a927-cd92-549a-83e1-03528fd6aeaa', '46eb6e4a-a37a-5c68-8114-0719c6273056', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/Pirellipodiumchange.png?v=1780902043', 'Pirelli F1® 2026 Podium cap', 3);


  -- Product: Williams Racing New Era 2026 Barcelona GP Sainz Cap
  SELECT id INTO v_brand_id FROM public.brands WHERE slug = 'williams-racing' LIMIT 1;
  SELECT id INTO v_category_id FROM public.categories WHERE slug = 'headwear' LIMIT 1;

  INSERT INTO public.products (id, brand_id, category_id, name, slug, description, status, is_preorder, created_at, updated_at)
  VALUES (
    'df018525-49ca-5a00-9a60-3f47ed61241f',
    COALESCE(v_brand_id, '3c1148bf-091d-5420-987d-5ff95e628667'),
    COALESCE(v_category_id, 'e5c9f0cf-ce3a-5a67-b4bb-7a11cb89795b'),
    'Williams Racing New Era 2026 Barcelona GP Sainz Cap',
    'williams-racing-new-era-2026-barcelona-gp-sainz-cap',
    'Atlassian Williams Racing 2026 Race Special Barcelona Carlos Sainz Cap

ร่วมเชียร์ Carlos Sainz ในการแข่งขัน Formula 1 ฤดูกาล 2026 กับ Atlassian Williams Racing 2026 Race Special Barcelona Carlos Sainz Cap หมวกนักแข่งรุ่นพิเศษที่สร้างขึ้นเพื่อเฉลิมฉลองการแข่งขัน Spanish Grand Prix 2026 ณ เมืองบาร์เซโลนา บ้านเกิดของ Carlos Sainz

หมวกคอลเลกชัน Race Special Edition ใบนี้โดดเด่นด้วยดีไซน์ที่ได้รับแรงบันดาลใจจากสีสันและบรรยากาศของสนาม Barcelona-Catalunya ผสานรายละเอียดเฉพาะของ Carlos Sainz และโลโก้ทีม Atlassian Williams Racing อย่างเป็นทางการ สะท้อนความภาคภูมิใจของหนึ่งในนักแข่งชาวสเปนที่ได้รับความนิยมมากที่สุดใน Formula 1

ผลิตจากวัสดุคุณภาพสูง สวมใส่สบาย น้ำหนักเบา พร้อมสายปรับขนาดด้านหลัง เหมาะสำหรับใส่ในช่วง Race Week สะสมเป็นของที่ระลึก หรือเติมสไตล์ Motorsport ให้กับทุกวันของคุณ

สินค้าลิขสิทธิ์แท้ Atlassian Williams Racing

หมวก Carlos Sainz รุ่นพิเศษ Barcelona GP 2026

ดีไซน์ Race Special Edition สำหรับ Spanish Grand Prix

โลโก้ทีมและรายละเอียดนักแข่งอย่างเป็นทางการ

สายปรับขนาดด้านหลัง

🏁 หมวกพิเศษสำหรับแฟน Carlos Sainz และ Williams Racing ในการแข่งขันสนามบ้านเกิดของเขา

Atlassian Williams Racing 2026 Race Special Barcelona Carlos Sainz Cap

Celebrate the 2026 Spanish Grand Prix with the official Atlassian Williams Racing Race Special Barcelona Carlos Sainz Cap.

Created exclusively for the Barcelona race weekend, this special-edition driver cap pays tribute to Carlos Sainz''s home Grand Prix with unique race-inspired graphics and authentic Williams Racing branding. Combining premium quality with motorsport heritage, it is the perfect cap for fans of both Carlos Sainz and Williams Racing.

Featuring lightweight construction, an adjustable closure, and exclusive Barcelona-themed detailing, this cap is ideal for race weekends, everyday wear, or adding to your Formula 1 collection.

Official Atlassian Williams Racing merchandise

Carlos Sainz Driver Cap

2026 Spanish Grand Prix Race Special Edition

Exclusive Barcelona-inspired design

Adjustable fit for all-day comfort

Perfect for Formula 1 fans and collectors

FASTEST LAP: จำหน่ายสินค้า F1 Merchandise ลิขสิทธิ์แท้จากทีมฟอร์มูล่าวันครบทั้ง 11 ทีม',
    'active',
    false,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    brand_id = EXCLUDED.brand_id,
    category_id = EXCLUDED.category_id,
    status = EXCLUDED.status,
    updated_at = now();
  DELETE FROM public.product_variants WHERE product_id = 'df018525-49ca-5a00-9a60-3f47ed61241f';
  DELETE FROM public.product_images WHERE product_id = 'df018525-49ca-5a00-9a60-3f47ed61241f';
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('12eeed07-b1a3-5356-93eb-63a00437628f', 'df018525-49ca-5a00-9a60-3f47ed61241f', '199842961249', null, null, 1990, null, 15, 3, true, now());
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('bd593a29-a8d0-55bc-ab11-9ec716e7db80', 'df018525-49ca-5a00-9a60-3f47ed61241f', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/barcelona_cap_carlos_sainz_-_product_imagery_1.webp?v=1780891193', 'Williams Racing New Era 2026 Barcelona GP Sainz Cap', 0);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('dc34670f-328f-5765-9e67-d024abdc19bc', 'df018525-49ca-5a00-9a60-3f47ed61241f', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/barcelona_cap_carlos_sainz_-_product_imagery_4.webp?v=1780891193', 'Williams Racing New Era 2026 Barcelona GP Sainz Cap', 1);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('d67a606d-a375-5605-b44e-e49edc5c6328', 'df018525-49ca-5a00-9a60-3f47ed61241f', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/barcelona_cap_carlos_sainz_-_product_imagery_2.webp?v=1780891194', 'Williams Racing New Era 2026 Barcelona GP Sainz Cap', 2);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('1130e121-0343-513b-8925-7a876df512d5', 'df018525-49ca-5a00-9a60-3f47ed61241f', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/barcelona_cap_carlos_sainz_-_product_imagery_3.webp?v=1780891193', 'Williams Racing New Era 2026 Barcelona GP Sainz Cap', 3);


  -- Product: Williams Racing New Era 2026 Barcelona GP Albon Cap
  SELECT id INTO v_brand_id FROM public.brands WHERE slug = 'williams-racing' LIMIT 1;
  SELECT id INTO v_category_id FROM public.categories WHERE slug = 'headwear' LIMIT 1;

  INSERT INTO public.products (id, brand_id, category_id, name, slug, description, status, is_preorder, created_at, updated_at)
  VALUES (
    '76957eb9-7139-598e-9123-8606c543b623',
    COALESCE(v_brand_id, '3c1148bf-091d-5420-987d-5ff95e628667'),
    COALESCE(v_category_id, 'e5c9f0cf-ce3a-5a67-b4bb-7a11cb89795b'),
    'Williams Racing New Era 2026 Barcelona GP Albon Cap',
    'williams-racing-new-era-2026-barcelona-gp-albon-cap',
    'Atlassian Williams Racing 2026 Race Special Barcelona Alex Albon Cap

สนับสนุน Alex Albon ในการแข่งขัน Formula 1 ฤดูกาล 2026 ด้วย Williams Racing 2026 Race Special Barcelona Albon Cap หมวกนักแข่งรุ่นพิเศษที่ออกแบบขึ้นสำหรับการแข่งขัน Spanish Grand Prix 2026 ที่บาร์เซโลนา

หมวกใบนี้มาพร้อมรายละเอียดเฉพาะของ Alex Albon และดีไซน์พิเศษที่ได้รับแรงบันดาลใจจากสนาม Barcelona-Catalunya หนึ่งในสนามคลาสสิกของ Formula 1 พร้อมโลโก้ Atlassian Williams Racing และรายละเอียดประจำตัวนักแข่งอย่างเป็นทางการ

ผลิตจากวัสดุคุณภาพสูง น้ำหนักเบา ระบายอากาศได้ดี และมีสายปรับขนาดด้านหลัง สวมใส่สบายทั้งในวันแข่งขันและการใช้งานประจำวัน เหมาะสำหรับแฟน Williams Racing และแฟนชาวไทยที่ต้องการสะสมสินค้าของ Alex Albon

สินค้าลิขสิทธิ์แท้ Atlassian Williams Racing

หมวก Alex Albon รุ่นพิเศษ Barcelona GP 2026

ดีไซน์ Race Special Edition สำหรับ Spanish Grand Prix

โลโก้ทีมและรายละเอียดนักแข่งอย่างเป็นทางการ

สายปรับขนาดด้านหลัง

Atlassian Williams Racing 2026 Race Special Barcelona Alex Albon Cap

Show your support for Alex Albon with the official Williams Racing 2026 Race Special Barcelona Cap, created exclusively for the 2026 Spanish Grand Prix.

Inspired by the vibrant atmosphere of Barcelona and one of Formula 1''s most iconic race weekends, this special-edition driver cap features unique race-specific detailing alongside official Atlassian Williams Racing branding and Alex Albon driver elements.

Designed for comfort and everyday wear, the cap includes lightweight materials, an adjustable closure, and premium construction, making it an essential addition to any Formula 1 collection.

Official Atlassian Williams Racing merchandise

Alex Albon Driver Cap

2026 Spanish Grand Prix Race Special Edition

Exclusive Barcelona-inspired design

Adjustable fit for all-day comfort

FASTEST LAP: จำหน่ายสินค้า F1 Merchandise ลิขสิทธิ์แท้จากทีมฟอร์มูล่าวันครบทั้ง 11 ทีม',
    'active',
    false,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    brand_id = EXCLUDED.brand_id,
    category_id = EXCLUDED.category_id,
    status = EXCLUDED.status,
    updated_at = now();
  DELETE FROM public.product_variants WHERE product_id = '76957eb9-7139-598e-9123-8606c543b623';
  DELETE FROM public.product_images WHERE product_id = '76957eb9-7139-598e-9123-8606c543b623';
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('53dd5779-ce6f-5104-814a-14b5732e3b63', '76957eb9-7139-598e-9123-8606c543b623', '199842961263', null, null, 1990, null, 15, 3, true, now());
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('8c0035fd-6883-5dbf-8f5f-1d042fce8e0b', '76957eb9-7139-598e-9123-8606c543b623', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/barcelona_cap_alex_albon_-_product_imagery_1.webp?v=1780890942', 'Williams Racing New Era 2026 Barcelona GP Albon Cap', 0);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('360d0305-c64f-5dfd-ba1b-56a726efd2c4', '76957eb9-7139-598e-9123-8606c543b623', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/barcelona_cap_alex_albon_-_product_imagery_4.webp?v=1780890942', 'Williams Racing New Era 2026 Barcelona GP Albon Cap', 1);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('1f8e1d11-17b3-5afa-90dd-2c33e09a5a8e', '76957eb9-7139-598e-9123-8606c543b623', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/barcelona_cap_alex_albon_-_product_imagery_2.webp?v=1780890942', 'Williams Racing New Era 2026 Barcelona GP Albon Cap', 2);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('de6aaa08-fc92-576a-8090-8b0b333d7b84', '76957eb9-7139-598e-9123-8606c543b623', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/barcelona_cap_alex_albon_-_product_imagery_3.webp?v=1780890942', 'Williams Racing New Era 2026 Barcelona GP Albon Cap', 3);


  -- Product: Williams Racing New Era 2026 Barcelona GP Team Cap
  SELECT id INTO v_brand_id FROM public.brands WHERE slug = 'williams-racing' LIMIT 1;
  SELECT id INTO v_category_id FROM public.categories WHERE slug = 'headwear' LIMIT 1;

  INSERT INTO public.products (id, brand_id, category_id, name, slug, description, status, is_preorder, created_at, updated_at)
  VALUES (
    'd51173a5-d63c-5c78-b851-a9a15dd73096',
    COALESCE(v_brand_id, '3c1148bf-091d-5420-987d-5ff95e628667'),
    COALESCE(v_category_id, 'e5c9f0cf-ce3a-5a67-b4bb-7a11cb89795b'),
    'Williams Racing New Era 2026 Barcelona GP Team Cap',
    'williams-racing-new-era-2026-barcelona-gp-team-cap',
    'Williams Racing 2026 Race Special Barcelona Cap – หมวกลิมิเต็ดเอดิชั่นจากสนาม Spanish Grand Prix

ร่วมเป็นส่วนหนึ่งของสุดสัปดาห์การแข่งขัน Formula 1 ที่บาร์เซโลนาด้วย Williams Racing 2026 Race Special Barcelona Cap หมวกรุ่นพิเศษที่ออกแบบเพื่อเฉลิมฉลองการแข่งขัน Spanish Grand Prix 2026 โดยเฉพาะ

โดดเด่นด้วยดีไซน์ที่ได้รับแรงบันดาลใจจากสนามแข่งและสีสันที่สะท้อนบรรยากาศของเมืองบาร์เซโลนา พร้อมโลโก้ Atlassian Williams Racing อย่างเป็นทางการ เหมาะสำหรับแฟน F1 ที่ต้องการสะสมหมวก Race Special Edition หรือสวมใส่ในช่วง Race Week เพื่อแสดงความภักดีต่อทีม Williams

ผลิตจากวัสดุคุณภาพสูง สวมใส่สบาย น้ำหนักเบา พร้อมสายปรับขนาดด้านหลัง รองรับการใช้งานในชีวิตประจำวัน ไม่ว่าจะเชียร์ทีมข้างสนาม เดินทาง หรือเพิ่มสไตล์ Motorsport ให้กับลุคของคุณ

• 
 Official Licensed Williams Racing Product

• Barcelona GP 2026 Race Special Edition

• ดีไซน์พิเศษเฉพาะสนาม Spanish Grand Prix

• ปรับขนาดได้ สวมใส่สบาย

Celebrate the excitement of the 2026 Spanish Grand Prix with the official Williams Racing 2026 Race Special Barcelona Cap.

Designed exclusively for the Barcelona race weekend, this limited-edition cap features race-inspired graphics and distinctive detailing that capture the spirit of one of Formula 1''s most iconic venues. Finished with official Atlassian Williams Racing branding, it is the perfect accessory for dedicated F1 fans and collectors.

Crafted for comfort and everyday wear, the cap features a lightweight construction and an adjustable rear closure for a secure fit. Whether you''re supporting Williams Racing trackside, watching from home, or adding to your Formula 1 collection, this race special cap delivers authentic motorsport style.

Official Atlassian Williams Racing merchandise

2026 Spanish Grand Prix Race Special Edition

Exclusive Barcelona-inspired design

Adjustable fit for all-day comfort',
    'active',
    false,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    brand_id = EXCLUDED.brand_id,
    category_id = EXCLUDED.category_id,
    status = EXCLUDED.status,
    updated_at = now();
  DELETE FROM public.product_variants WHERE product_id = 'd51173a5-d63c-5c78-b851-a9a15dd73096';
  DELETE FROM public.product_images WHERE product_id = 'd51173a5-d63c-5c78-b851-a9a15dd73096';
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('044409d4-d223-563a-8ab0-14fd376a1d30', 'd51173a5-d63c-5c78-b851-a9a15dd73096', '199842961256', null, null, 1790, null, 15, 3, true, now());
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('d907ebe9-581d-5276-beb0-7ec722232734', 'd51173a5-d63c-5c78-b851-a9a15dd73096', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/team_barcelona_cap_-_product_imagery_1.webp?v=1780890611', 'Williams Racing New Era 2026 Barcelona GP Team Cap', 0);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('e5267dca-4301-526a-bc26-0c5d46f5229e', 'd51173a5-d63c-5c78-b851-a9a15dd73096', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/team_barcelona_cap_-_product_imagery_2.webp?v=1780890611', 'Williams Racing New Era 2026 Barcelona GP Team Cap', 1);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('7b11fa27-921e-56f2-9b37-2487a4ab84a6', 'd51173a5-d63c-5c78-b851-a9a15dd73096', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/team_barcelona_cap_-_product_imagery_3.webp?v=1780890611', 'Williams Racing New Era 2026 Barcelona GP Team Cap', 2);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('99c75da3-045b-5b0e-8db2-5f92f57d7e9f', 'd51173a5-d63c-5c78-b851-a9a15dd73096', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/team_barcelona_cap_-_product_imagery_4.webp?v=1780890611', 'Williams Racing New Era 2026 Barcelona GP Team Cap', 3);


  -- Product: Aston Martin F1 Team 2026 Replica Stroll Trucker cap - Black
  SELECT id INTO v_brand_id FROM public.brands WHERE slug = 'aston-martin-f1' LIMIT 1;
  SELECT id INTO v_category_id FROM public.categories WHERE slug = 'headwear' LIMIT 1;

  INSERT INTO public.products (id, brand_id, category_id, name, slug, description, status, is_preorder, created_at, updated_at)
  VALUES (
    'a41d2fc0-2e98-5a35-89bc-4af64454e09b',
    COALESCE(v_brand_id, '1154f8fb-3013-508f-bfa2-b2ddffaebe0a'),
    COALESCE(v_category_id, 'e5c9f0cf-ce3a-5a67-b4bb-7a11cb89795b'),
    'Aston Martin F1 Team 2026 Replica Stroll Trucker cap - Black',
    'aston-martin-f1-team-2026-replica-stroll-trucker-cap-black',
    'Show your support for Lance Stroll and the Aston Martin F1 Team with the official PUMA 2026 Trucker Cap, featuring all team and partner logos, a curved brim, and an adjustable fastener for a comfortable, authentic fit. Crafted with eco-friendly materials, it’s a perfect accessory for any Formula 1 fan.

• Official licensed Replica collection

• As seen worn by Lance Stroll

• All the latest team and partner logos

• Curved brim with adjustable rear fastener

• Unisex regular fit

• Manufacturer: PUMA - official partner

• Made in Philippines

• Composition: 100% Polyester

• Responsibly sourced: made with 100% recycled materials, excluding trims & decorations',
    'active',
    false,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    brand_id = EXCLUDED.brand_id,
    category_id = EXCLUDED.category_id,
    status = EXCLUDED.status,
    updated_at = now();
  DELETE FROM public.product_variants WHERE product_id = 'a41d2fc0-2e98-5a35-89bc-4af64454e09b';
  DELETE FROM public.product_images WHERE product_id = 'a41d2fc0-2e98-5a35-89bc-4af64454e09b';
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('ce22fdb9-3743-572d-a751-6aca58db8ed6', 'a41d2fc0-2e98-5a35-89bc-4af64454e09b', 'ASTON-MARTIN-F1-DefaultTitle-DefaultTitle-0', null, null, 1990, null, 15, 3, true, now());
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('83dd8cb5-505d-56e2-8289-8832a6a00ac4', 'a41d2fc0-2e98-5a35-89bc-4af64454e09b', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/701239672001_pp_01_astonmartin.jpg?v=1780809101', 'Aston Martin F1 Team 2026 Replica Stroll Trucker cap - Black', 0);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('92b9cef8-a65f-5f67-b18e-c74fb5d788e4', 'a41d2fc0-2e98-5a35-89bc-4af64454e09b', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/701239672001_pp_02_astonmartin.jpg?v=1780809101', 'Aston Martin F1 Team 2026 Replica Stroll Trucker cap - Black', 1);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('f3666178-036b-5826-aebb-600a7e2cb49e', 'a41d2fc0-2e98-5a35-89bc-4af64454e09b', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/701239672001_pp_03_astonmartin.jpg?v=1780809101', 'Aston Martin F1 Team 2026 Replica Stroll Trucker cap - Black', 2);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('a479ff26-7b6a-5b71-874f-28cc46422758', 'a41d2fc0-2e98-5a35-89bc-4af64454e09b', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/701239672001_pp_04_astonmartin.jpg?v=1780809101', 'Aston Martin F1 Team 2026 Replica Stroll Trucker cap - Black', 3);


  -- Product: Aston Martin F1 Team 2026 Replica Alonso cap - Green
  SELECT id INTO v_brand_id FROM public.brands WHERE slug = 'aston-martin-f1' LIMIT 1;
  SELECT id INTO v_category_id FROM public.categories WHERE slug = 'headwear' LIMIT 1;

  INSERT INTO public.products (id, brand_id, category_id, name, slug, description, status, is_preorder, created_at, updated_at)
  VALUES (
    '50b303fe-d8ef-5bcb-9eba-e62b2e53eeb7',
    COALESCE(v_brand_id, '1154f8fb-3013-508f-bfa2-b2ddffaebe0a'),
    COALESCE(v_category_id, 'e5c9f0cf-ce3a-5a67-b4bb-7a11cb89795b'),
    'Aston Martin F1 Team 2026 Replica Alonso cap - Green',
    'aston-martin-f1-team-2026-replica-alonso-cap-green',
    'Show your support for the Aston Martin F1 Team with the official AMF1 RP Alonso BB Cap, featuring all the latest team and partner logos, a curved brim with an adjustable rear fastener, and crafted from recycled materials for a modern, comfortable fit suitable for race days or everyday wear.

• Official licensed Replica collection

• As seen worn by Fernando Alonso

• All the latest team and partner logos

• Curved brim with adjustable rear fastener

• Unisex regular fit

• Manufacturer: PUMA - official partner

• Made in Philippines

• Composition: 100% Polyester

• Responsibly sourced: made with 100% recycled materials, excluding trims & decorations',
    'active',
    false,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    brand_id = EXCLUDED.brand_id,
    category_id = EXCLUDED.category_id,
    status = EXCLUDED.status,
    updated_at = now();
  DELETE FROM public.product_variants WHERE product_id = '50b303fe-d8ef-5bcb-9eba-e62b2e53eeb7';
  DELETE FROM public.product_images WHERE product_id = '50b303fe-d8ef-5bcb-9eba-e62b2e53eeb7';
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('021365c2-d16a-55f5-85c7-48c6bf4f0f7a', '50b303fe-d8ef-5bcb-9eba-e62b2e53eeb7', 'ASTON-MARTIN-F1-DefaultTitle-DefaultTitle-0-618', null, null, 1990, null, 15, 3, true, now());
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('257b21e7-011e-524b-bce0-2466edac7da2', '50b303fe-d8ef-5bcb-9eba-e62b2e53eeb7', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/701239668002_pp_01_astonmartin.jpg?v=1780808988', 'Aston Martin F1 Team 2026 Replica Alonso cap - Green', 0);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('24ca6d9b-1e8e-50c5-8266-5d7ff10a0e11', '50b303fe-d8ef-5bcb-9eba-e62b2e53eeb7', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/701239668002_pp_02_astonmartin.jpg?v=1780808988', 'Aston Martin F1 Team 2026 Replica Alonso cap - Green', 1);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('f3a50da2-5de5-56b6-9236-9387ce5092bc', '50b303fe-d8ef-5bcb-9eba-e62b2e53eeb7', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/701239668002_pp_03_astonmartin.jpg?v=1780808988', 'Aston Martin F1 Team 2026 Replica Alonso cap - Green', 2);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('8fdbe718-75f3-5348-97b5-7dd690015df1', '50b303fe-d8ef-5bcb-9eba-e62b2e53eeb7', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/701239668002_pp_04_astonmartin.jpg?v=1780808988', 'Aston Martin F1 Team 2026 Replica Alonso cap - Green', 3);


  -- Product: Red Bull Racing 2026 Isack Hadjar Driver Polo
  SELECT id INTO v_brand_id FROM public.brands WHERE slug = 'oracle-red-bull-racing' LIMIT 1;
  SELECT id INTO v_category_id FROM public.categories WHERE slug = 'formula-1' LIMIT 1;

  INSERT INTO public.products (id, brand_id, category_id, name, slug, description, status, is_preorder, created_at, updated_at)
  VALUES (
    '8c74809c-f49f-5ffd-9d53-a546a4f4c457',
    COALESCE(v_brand_id, '487f7705-c55f-551a-b4d7-8b21d6355ba3'),
    COALESCE(v_category_id, 'b0429312-bc52-53cd-89a2-d506d4856bff'),
    'Red Bull Racing 2026 Isack Hadjar Driver Polo',
    'red-bull-racing-2026-isack-hadjar-driver-polo',
    'ส่งต่อจิตวิญญาณแห่ง Formula 1® กับ Oracle Red Bull Racing 2026 Isack Hadjar Driver Polo เสื้อโปโลนักแข่งอย่างเป็นทางการที่ Isack Hadjar สวมใส่ตลอดฤดูกาลแข่งขัน F1 2026

ตัวเสื้อมาในสี ORBR Navy Blue อันเป็นเอกลักษณ์ของทีม Oracle Red Bull Racing พร้อมรายละเอียดหมายเลขประจำตัวนักแข่งด้านหน้า และโลโก้ทีมรวมถึงผู้สนับสนุนอย่างเป็นทางการประจำฤดูกาล 2026 ครบถ้วน ถ่ายทอดลุคเดียวกับที่เห็นในสนามแข่งตลอดสุดสัปดาห์การแข่งขัน

ผลิตโดย Castore พาร์ทเนอร์อย่างเป็นทางการของทีม ด้วยมาตรฐานคุณภาพระดับพรีเมียม ให้ความสบายในการสวมใส่ เหมาะทั้งสำหรับวันแข่งขัน การเชียร์ทีมโปรด หรือสวมใส่ในชีวิตประจำวัน

Isack Hadjar''s official 2026 Red Bull Racing Driver Polo, as worn by Isack throughout the 2026 Formula 1 season. In ORBR Navy Blue, the driver polo features a small driver number on the front and all official 2026 season team and partner branding. Produced by official team partner Castore.

• Official licensed Replica collection

• All the latest team and partner logos

• Unisex regular fit

• Manufacturer: Castore - official partner

• Made in Vietnam

• Composition: 100% Polyester

• Responsibly sourced

 FASTEST LAP: จำหน่ายสินค้า F1 Merchandise ลิขสิทธิ์แท้จากทีมฟอร์มูล่าวันครบทั้ง 11 ทีม',
    'active',
    false,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    brand_id = EXCLUDED.brand_id,
    category_id = EXCLUDED.category_id,
    status = EXCLUDED.status,
    updated_at = now();
  DELETE FROM public.product_variants WHERE product_id = '8c74809c-f49f-5ffd-9d53-a546a4f4c457';
  DELETE FROM public.product_images WHERE product_id = '8c74809c-f49f-5ffd-9d53-a546a4f4c457';
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('a1396f56-0f51-55eb-851f-11819c151d54', '8c74809c-f49f-5ffd-9d53-a546a4f4c457', '5063606455198', 'S', null, 4311, 4790, 15, 3, true, now());
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('68ea5f45-8291-59ab-95bf-795ff67f125c', '8c74809c-f49f-5ffd-9d53-a546a4f4c457', '5063606455181', 'M', null, 4311, 4790, 15, 3, true, now());
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('8145a15d-6958-5657-92d1-398149f5b1e7', '8c74809c-f49f-5ffd-9d53-a546a4f4c457', '5063606455174', 'L', null, 4311, 4790, 15, 3, true, now());
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('889a0de8-392c-52b9-be37-40c6b8e21948', '8c74809c-f49f-5ffd-9d53-a546a4f4c457', '5063606455167', 'XL', null, 4311, 4790, 15, 3, true, now());
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('b040c039-6102-5c96-a20c-7d13a0360c8a', '8c74809c-f49f-5ffd-9d53-a546a4f4c457', '5063606455150', '2XL', null, 4311, 4790, 15, 3, true, now());
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('7012ad78-18e6-56d7-9789-a2f6d7812e54', '8c74809c-f49f-5ffd-9d53-a546a4f4c457', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/701242201001_pp_01_redbull.jpg?v=1780686721', 'Red Bull Racing 2026 Isack Hadjar Driver Polo', 0);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('7af0015d-37d4-52bb-bb74-21de71b61f7a', '8c74809c-f49f-5ffd-9d53-a546a4f4c457', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/701242201001_pp_02_redbull.jpg?v=1780686721', 'Red Bull Racing 2026 Isack Hadjar Driver Polo', 1);


  -- Product: Red Bull Racing 2026 Max Verstappen Driver T-shirt
  SELECT id INTO v_brand_id FROM public.brands WHERE slug = 'oracle-red-bull-racing' LIMIT 1;
  SELECT id INTO v_category_id FROM public.categories WHERE slug = 'formula-1' LIMIT 1;

  INSERT INTO public.products (id, brand_id, category_id, name, slug, description, status, is_preorder, created_at, updated_at)
  VALUES (
    '6bfb8833-6ceb-59fa-aeb2-15593fddcef6',
    COALESCE(v_brand_id, '487f7705-c55f-551a-b4d7-8b21d6355ba3'),
    COALESCE(v_category_id, 'b0429312-bc52-53cd-89a2-d506d4856bff'),
    'Red Bull Racing 2026 Max Verstappen Driver T-shirt',
    'red-bull-racing-2026-max-verstappen-driver-t-shirt',
    'แสดงพลังแห่งการเชียร์แชมป์โลก 4 สมัยไปกับ Red Bull Racing Max Verstappen Replica Driver T-Shirt เสื้อทีมอย่างเป็นทางการที่ได้รับแรงบันดาลใจจากชุดที่นักแข่งสวมใส่ตลอดสุดสัปดาห์การแข่งขัน Formula 1®

โดดเด่นด้วยโลโก้ทีม Oracle Red Bull Racing, โลโก้ผู้สนับสนุนล่าสุด และรายละเอียดที่ถ่ายทอดจิตวิญญาณแห่งมอเตอร์สปอร์ตได้อย่างสมบูรณ์แบบ ผลิตโดย Castore ด้วยมาตรฐานคุณภาพระดับพรีเมียม ให้สัมผัสสวมใส่สบายในทรง Unisex เหมาะสำหรับทั้งการเชียร์ข้างสนาม การรับชมการแข่งขัน หรือการสวมใส่ในชีวิตประจำวัน

ไม่ว่าคุณจะเป็นแฟนพันธุ์แท้ของ Max Verstappen หรือทีม Red Bull Racing เสื้อรุ่นนี้คือไอเทมที่ช่วยให้คุณใกล้ชิดกับโลกของ Formula 1 ได้มากยิ่งขึ้น

Show your support for Red Bull Racing and Max Verstappen with this officially licensed replica driver T-shirt featuring the latest team logos and a comfortable unisex fit. Crafted with premium craftsmanship by Castore, it offers an authentic racing experience suitable for any fan.

• Official licensed Replica collection

• As seen worn by Max Verstappen

• All the latest team and partner logos

• Unisex regular fit

• Manufacturer: Castore - official partner

• Made in Vietnam

• Composition: 100% Polyester

• Responsibly sourced

 FASTEST LAP: จำหน่ายสินค้า F1 Merchandise ลิขสิทธิ์แท้จากทีมฟอร์มูล่าวันครบทั้ง 11 ทีม',
    'active',
    false,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    brand_id = EXCLUDED.brand_id,
    category_id = EXCLUDED.category_id,
    status = EXCLUDED.status,
    updated_at = now();
  DELETE FROM public.product_variants WHERE product_id = '6bfb8833-6ceb-59fa-aeb2-15593fddcef6';
  DELETE FROM public.product_images WHERE product_id = '6bfb8833-6ceb-59fa-aeb2-15593fddcef6';
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('e57f8aa3-f7aa-572c-a407-307de96d49cc', '6bfb8833-6ceb-59fa-aeb2-15593fddcef6', 'RED-BULL-RACING-S-S-0', 'S', null, 3411, 3790, 15, 3, true, now());
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('fcb3d773-04f4-5968-a2fe-554aa1de36c4', '6bfb8833-6ceb-59fa-aeb2-15593fddcef6', 'RED-BULL-RACING-M-M-1', 'M', null, 3411, 3790, 15, 3, true, now());
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('76aa8040-7d6f-5212-b397-3987781b7728', '6bfb8833-6ceb-59fa-aeb2-15593fddcef6', 'RED-BULL-RACING-L-L-2', 'L', null, 3411, 3790, 15, 3, true, now());
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('dd361ac5-ccce-5bf0-8ca8-c49e251f9535', '6bfb8833-6ceb-59fa-aeb2-15593fddcef6', 'RED-BULL-RACING-XL-XL-3', 'XL', null, 3411, 3790, 15, 3, true, now());
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('4a4f5e59-6cc6-5b14-b3fd-3ea86fa997cf', '6bfb8833-6ceb-59fa-aeb2-15593fddcef6', 'RED-BULL-RACING-2XL-2XL-4', '2XL', null, 3411, 3790, 15, 3, true, now());
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('f0ce3016-2f86-5f0d-8315-40dff7c2d167', '6bfb8833-6ceb-59fa-aeb2-15593fddcef6', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/701242203001_pp_01_redbull.jpg?v=1780686332', 'Red Bull Racing 2026 Max Verstappen Driver T-shirt', 0);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('92b0cc15-c016-5f8e-8b29-e57d48d3805f', '6bfb8833-6ceb-59fa-aeb2-15593fddcef6', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/701242203001_pp_02_redbull.jpg?v=1780686331', 'Red Bull Racing 2026 Max Verstappen Driver T-shirt', 1);


  -- Product: Williams F1 Cap Keyring
  SELECT id INTO v_brand_id FROM public.brands WHERE slug = 'williams-racing' LIMIT 1;
  SELECT id INTO v_category_id FROM public.categories WHERE slug = 'accessories' LIMIT 1;

  INSERT INTO public.products (id, brand_id, category_id, name, slug, description, status, is_preorder, created_at, updated_at)
  VALUES (
    'aa32a1a7-fd72-5803-8c58-5c719815c62f',
    COALESCE(v_brand_id, '3c1148bf-091d-5420-987d-5ff95e628667'),
    COALESCE(v_category_id, '44fc7a48-8d3c-5239-9135-d0da818bc275'),
    'Williams F1 Cap Keyring',
    'williams-f1-cap-keyring',
    'พกความเป็น Williams Racing ติดตัวไปทุกที่!

𝗔𝘁𝗹𝗮𝘀𝘀𝗶𝗮𝗻 𝗪𝗶𝗹𝗹𝗶𝗮𝗺𝘀 𝗥𝗮𝗰𝗶𝗻𝗴 𝗖𝗮𝗽 𝗞𝗲𝘆𝗿𝗶𝗻𝗴 – Navy พวงกุญแจดีไซน์หมวกทีม Williams F1 ขนาดกะทัดรัด พร้อมโลโก้ทีมอย่างเป็นทางการ เหมาะสำหรับแฟน F1 ที่อยากเพิ่มกลิ่นอายสนามแข่งให้กับกุญแจ กระเป๋า หรือของสะสมชิ้นโปรด

• สินค้าลิขสิทธิ์แท้จาก Atlassian Williams Racing

• ดีไซน์หมวกทีมสุดน่ารัก รายละเอียดครบถ้วน

•  น้ำหนักเบา พกพาสะดวก

เติมความเป็น Williams Racing ให้ทุกวันของคุณ 🏎️💙

Take your Williams Racing passion wherever you go.

The 𝗔𝘁𝗹𝗮𝘀𝘀𝗶𝗮𝗻 𝗪𝗶𝗹𝗹𝗶𝗮𝗺𝘀 𝗥𝗮𝗰𝗶𝗻𝗴 𝗖𝗮𝗽 𝗞𝗲𝘆𝗿𝗶𝗻𝗴 – Navy is the perfect everyday accessory for Formula 1 fans. Designed as a miniature Williams team cap and finished with official team branding, it adds a touch of motorsport style to your keys, bag, or collection.

•  Official Atlassian Williams Racing merchandise

•  Mini cap-inspired design with authentic team branding

•  Lightweight and easy to carry

A small accessory with true racing spirit. 💙🏎️

#WilliamsRacing #WilliamsF1 #F1Merchandise #Formula1 #FastestLapStore',
    'active',
    false,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    brand_id = EXCLUDED.brand_id,
    category_id = EXCLUDED.category_id,
    status = EXCLUDED.status,
    updated_at = now();
  DELETE FROM public.product_variants WHERE product_id = 'aa32a1a7-fd72-5803-8c58-5c719815c62f';
  DELETE FROM public.product_images WHERE product_id = 'aa32a1a7-fd72-5803-8c58-5c719815c62f';
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('8edb3894-1a92-5d65-9028-b56d99f4eff9', 'aa32a1a7-fd72-5803-8c58-5c719815c62f', '199841670203', null, null, 990, null, 15, 3, true, now());
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('764b310c-6db5-501c-8bff-36050fac71fd', 'aa32a1a7-fd72-5803-8c58-5c719815c62f', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/60942729_grande_0f5e1fe5-4c8c-469e-abf7-4e303f899e29.webp?v=1780469388', 'Williams F1 Cap Keyring', 0);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('daa951bd-4494-574b-9f6c-7ae0d9dcba61', 'aa32a1a7-fd72-5803-8c58-5c719815c62f', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/60942729_1.webp?v=1780469388', 'Williams F1 Cap Keyring', 1);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('d533b19a-82e1-58c3-81fc-b96bb78641ad', 'aa32a1a7-fd72-5803-8c58-5c719815c62f', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/60942729_2.webp?v=1780469388', 'Williams F1 Cap Keyring', 2);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('92038e57-1f69-56ad-8af4-f155bb096a27', 'aa32a1a7-fd72-5803-8c58-5c719815c62f', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/60942729_3.webp?v=1780469388', 'Williams F1 Cap Keyring', 3);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('e23786b0-15d5-563e-a0e0-50f016e4eb0c', 'aa32a1a7-fd72-5803-8c58-5c719815c62f', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/60942729_4.webp?v=1780469388', 'Williams F1 Cap Keyring', 4);


  -- Product: Atlassian Williams Racing 2026 Women's Albon Tech T-shirt
  SELECT id INTO v_brand_id FROM public.brands WHERE slug = 'williams-racing' LIMIT 1;
  SELECT id INTO v_category_id FROM public.categories WHERE slug = 'formula-1' LIMIT 1;

  INSERT INTO public.products (id, brand_id, category_id, name, slug, description, status, is_preorder, created_at, updated_at)
  VALUES (
    'b5cac6d5-b62f-5ef3-94d3-833d3dd533b7',
    COALESCE(v_brand_id, '3c1148bf-091d-5420-987d-5ff95e628667'),
    COALESCE(v_category_id, 'b0429312-bc52-53cd-89a2-d506d4856bff'),
    'Atlassian Williams Racing 2026 Women''s Albon Tech T-shirt',
    'atlassian-williams-racing-2026-womens-albon-tech-t-shirt-10',
    'เสื้อทีม Alex Albon อย่างเป็นทางการ Atlassian Williams Racing ฤดูกาล 2026 โดย New Era มาพร้อมกับโลโก้ทีมพาร์ทเนอร์ประจำฤดูกาลล่าสุด เนื้อผ้ายืดหยุ่น สามารถใส่ออกกำลังกายหรือใส่ลำลองได้

• เสื้อโปโล Replica ลิขสิทธิ์แท้จาก New Era

• แขนสั้น

• สำหรับผู้หญิง

• สี กรมท่า

• วัสดุ: 100% โพลิเอสเทอร์

The official Atlassian Williams F1 Team Mens Tech Polo, designed by New Era as part of the 2026 team collection. Featuring Williams and selected sponsor branding, our team tech polo combines performance and comfort for fans while representing the team.

• Women''s fit

• Colour: Navy

• Material: Front Body, Back Body, Sleeves: 100% Polyester

• Made in Turkey

FASTEST LAP: จำหน่ายสินค้า F1 Merchandise ลิขสิทธิ์แท้จากทีมฟอร์มูล่าวันครบทั้ง 11 ทีม',
    'active',
    false,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    brand_id = EXCLUDED.brand_id,
    category_id = EXCLUDED.category_id,
    status = EXCLUDED.status,
    updated_at = now();
  DELETE FROM public.product_variants WHERE product_id = 'b5cac6d5-b62f-5ef3-94d3-833d3dd533b7';
  DELETE FROM public.product_images WHERE product_id = 'b5cac6d5-b62f-5ef3-94d3-833d3dd533b7';
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('3029b784-f2b3-5c54-be76-e9dd424a04ad', 'b5cac6d5-b62f-5ef3-94d3-833d3dd533b7', 'ATLASSIAN-WILLI-6-6-0', '6', null, 3490, null, 15, 3, true, now());
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('cb06ab0f-3fe6-5578-8302-a55de68bdf1b', 'b5cac6d5-b62f-5ef3-94d3-833d3dd533b7', 'ATLASSIAN-WILLI-8-8-1', '8', null, 3490, null, 15, 3, true, now());
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('5d79756d-647c-5b08-8b3d-d2784f74fffe', 'b5cac6d5-b62f-5ef3-94d3-833d3dd533b7', 'ATLASSIAN-WILLI-10-10-2', '10', null, 3490, null, 15, 3, true, now());
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('c08928d8-7f00-5985-86fa-34dc9a2399c0', 'b5cac6d5-b62f-5ef3-94d3-833d3dd533b7', 'ATLASSIAN-WILLI-12-12-3', '12', null, 3490, null, 15, 3, true, now());
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('0195561d-c4ce-5fbe-ae85-2a4e08d930b4', 'b5cac6d5-b62f-5ef3-94d3-833d3dd533b7', 'ATLASSIAN-WILLI-14-14-4', '14', null, 3490, null, 15, 3, true, now());
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('a9b2dc55-2119-5473-8c0e-31699956d271', 'b5cac6d5-b62f-5ef3-94d3-833d3dd533b7', 'ATLASSIAN-WILLI-16-16-5', '16', null, 3490, null, 15, 3, true, now());
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('f698aac0-4c38-5cf2-bf7a-b0a23ea5d501', 'b5cac6d5-b62f-5ef3-94d3-833d3dd533b7', 'ATLASSIAN-WILLI-18-18-6', '18', null, 3490, null, 15, 3, true, now());
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('31e94aaf-3b04-51e1-bee5-dbf5e59ca735', 'b5cac6d5-b62f-5ef3-94d3-833d3dd533b7', 'ATLASSIAN-WILLI-20-20-7', '20', null, 3490, null, 15, 3, true, now());
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('18042a15-a665-5ceb-8d1b-78d7532bd9ee', 'b5cac6d5-b62f-5ef3-94d3-833d3dd533b7', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/26netkwttaa-nvy_2.webp?v=1780684508', 'Atlassian Williams Racing 2026 Women''s Albon Tech T-shirt', 0);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('b3001169-76b4-5362-bf71-c06fef73fb8e', 'b5cac6d5-b62f-5ef3-94d3-833d3dd533b7', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/26netkwttaa-nvy_1.webp?v=1780684508', 'Atlassian Williams Racing 2026 Women''s Albon Tech T-shirt', 1);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('58f6b281-101f-5318-ab93-802a8b8b1d2e', 'b5cac6d5-b62f-5ef3-94d3-833d3dd533b7', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/26netkwttaa-nvy_6.webp?v=1780684508', 'Atlassian Williams Racing 2026 Women''s Albon Tech T-shirt', 2);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('e35f02e3-049b-528c-a341-03f715e47058', 'b5cac6d5-b62f-5ef3-94d3-833d3dd533b7', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/26netkwttaa-nvy_5.webp?v=1780684508', 'Atlassian Williams Racing 2026 Women''s Albon Tech T-shirt', 3);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('ee37d223-202c-5fc4-83fc-34233b30278f', 'b5cac6d5-b62f-5ef3-94d3-833d3dd533b7', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/26netkwttaa-nvy_4.webp?v=1780684508', 'Atlassian Williams Racing 2026 Women''s Albon Tech T-shirt', 4);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('41931903-1112-59ef-accd-9a4d040f3d5f', 'b5cac6d5-b62f-5ef3-94d3-833d3dd533b7', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/26netkwttaa-nvy_3.webp?v=1780684508', 'Atlassian Williams Racing 2026 Women''s Albon Tech T-shirt', 5);


  -- Product: Scuderia Ferrari F1 PUMA 2026 Charles Leclerc Monaco GP Cap
  SELECT id INTO v_brand_id FROM public.brands WHERE slug = 'scuderia-ferrari-f1' LIMIT 1;
  SELECT id INTO v_category_id FROM public.categories WHERE slug = 'headwear' LIMIT 1;

  INSERT INTO public.products (id, brand_id, category_id, name, slug, description, status, is_preorder, created_at, updated_at)
  VALUES (
    '6d156fe0-caca-5f42-85e4-9eca9bf008a6',
    COALESCE(v_brand_id, '28b205bc-7905-5fa1-9021-21fd82406cbb'),
    COALESCE(v_category_id, 'e5c9f0cf-ce3a-5a67-b4bb-7a11cb89795b'),
    'Scuderia Ferrari F1 PUMA 2026 Charles Leclerc Monaco GP Cap',
    'scuderia-ferrari-f1-puma-2026-charles-leclerc-monaco-gp-cap',
    'หมวก Scuderia Ferrari F1 PUMA 2026 Charles Leclerc Monaco GP Cap รุ่นพิเศษที่ได้รับแรงบันดาลใจจากการแข่งขันสนาม Home Race ของ Charles Leclerc ณ ถนนสายประวัติศาสตร์แห่งมอนติคาร์โลแโดดเด่นด้วยดีไซน์พิเศษที่สะท้อนกลิ่นอายของ Monaco ผสานเอกลักษณ์ของ Scuderia Ferrari และนักขับหมายเลข 16 ได้อย่างลงตัว

*สินค้ารุ่น Limied Edition จำนวนจำกัด*

• หมวก Replica Collection ลิขสิทธิ์แท้ Formula 1®

• เปิดตัวในโอกาส Monaco Grand Prix 2026

• ดีไซน์เดียวกับที่ทีมและนักแข่งใช้งานจริง

• โลโก้ Scuderia Ferrari และสปอนเซอร์ครบ

• ปีกหมวกโค้ง + สายปรับด้านหลัง

• ทรง Unisex ใส่สบายทุกวัน

• ผลิตโดย PUMA (Official Partner)

• ผลิตในประเทศฟิลิปปินส์

• วัสดุ: โพลีเอสเตอร์ 100%

• ผลิตจากวัสดุรีไซเคิล 100% (ยกเว้นส่วนตกแต่ง)

🇲🇨 Home Race. Home Hero.

Celebrate Charles Leclerc''s iconic connection with Monaco with the Scuderia Ferrari F1 PUMA 2026 Charles Leclerc Monaco GP Cap.

Inspired by Formula 1''s most prestigious street circuit, this special edition cap combines Ferrari racing heritage with Monaco-inspired details, making it a must-have for Ferrari fans and collectors alike.

• Official licensed Replica collection

• Launched to coincide with the 2026 China GP

• As seen worn by Charles Leclerc

• All the latest team and partner logos

• Curved brim with adjustable rear fastener

• Unisex regular fit

• Manufacturer: PUMA - official partner

• Made in Philippines

• Composition: 100% Polyester

• Responsibly sourced: made with 100% recycled materials, excluding trims & decorations

FASTEST LAP: จำหน่ายสินค้า F1 Merchandise ลิขสิทธิ์แท้จากทีมฟอร์มูล่าวันครบทั้ง 11 ทีม',
    'active',
    false,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    brand_id = EXCLUDED.brand_id,
    category_id = EXCLUDED.category_id,
    status = EXCLUDED.status,
    updated_at = now();
  DELETE FROM public.product_variants WHERE product_id = '6d156fe0-caca-5f42-85e4-9eca9bf008a6';
  DELETE FROM public.product_images WHERE product_id = '6d156fe0-caca-5f42-85e4-9eca9bf008a6';
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('c0587fc3-4e13-577f-8891-57574c98ef1b', '6d156fe0-caca-5f42-85e4-9eca9bf008a6', '4070033826546', null, null, 2300, null, 15, 3, true, now());
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('5879deae-1862-50d1-9a4d-a2e9a4b2edaf', '6d156fe0-caca-5f42-85e4-9eca9bf008a6', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/701239025001_pp_01_scuderiaferrari1.webp?v=1780303548', 'Scuderia Ferrari F1 PUMA 2026 Charles Leclerc Monaco GP Cap', 0);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('a0a86ac2-cb1e-55f8-9f66-a9319e14bfd3', '6d156fe0-caca-5f42-85e4-9eca9bf008a6', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/701239025001_pp_05_scuderiaferrari1.webp?v=1780303548', 'Scuderia Ferrari F1 PUMA 2026 Charles Leclerc Monaco GP Cap', 1);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('3d75ee90-8b79-5bec-8672-a74c0ff0d24c', '6d156fe0-caca-5f42-85e4-9eca9bf008a6', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/701239025001_pp_02_scuderiaferrari1.webp?v=1780303548', 'Scuderia Ferrari F1 PUMA 2026 Charles Leclerc Monaco GP Cap', 2);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('3b2485ed-d2c8-53f0-8b09-e760fcd2f7c7', '6d156fe0-caca-5f42-85e4-9eca9bf008a6', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/701239025001_pp_06_scuderiaferrari1.webp?v=1780303548', 'Scuderia Ferrari F1 PUMA 2026 Charles Leclerc Monaco GP Cap', 3);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('3d949c06-05d0-55a5-b341-ff657b82bc1d', '6d156fe0-caca-5f42-85e4-9eca9bf008a6', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/701239025001_pp_04_scuderiaferrari1.webp?v=1780303548', 'Scuderia Ferrari F1 PUMA 2026 Charles Leclerc Monaco GP Cap', 4);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('1201fa48-ffaa-5831-a9b9-12aa93ed66ab', '6d156fe0-caca-5f42-85e4-9eca9bf008a6', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/701239025001_pp_03_scuderiaferrari1.webp?v=1780303548', 'Scuderia Ferrari F1 PUMA 2026 Charles Leclerc Monaco GP Cap', 5);


  -- Product: Funko Pop! Lotus F1 Team Ayrton Senna Formula 1 Car Mini Figure
  SELECT id INTO v_brand_id FROM public.brands WHERE slug = 'ayrton-senna' LIMIT 1;
  SELECT id INTO v_category_id FROM public.categories WHERE slug = 'f1-collectibles' LIMIT 1;

  INSERT INTO public.products (id, brand_id, category_id, name, slug, description, status, is_preorder, created_at, updated_at)
  VALUES (
    'a1776462-b6d9-5a55-87b5-a5a7c341c404',
    COALESCE(v_brand_id, '56300953-a843-534b-8957-693fe0987cd8'),
    COALESCE(v_category_id, '899799fb-76d5-5486-a741-31db70633f32'),
    'Funko Pop! Lotus F1 Team Ayrton Senna Formula 1 Car Mini Figure',
    'funko-pop-lotus-f1-team-ayrton-senna-formula-1-car-mini-figure',
    'Funko Pop! Ayrton Senna #314 – Lotus

ย้อนรำลึกถึงจุดเริ่มต้นของตำนาน Formula 1 กับ Funko Pop! Ayrton Senna #314 – Lotus ฟิกเกอร์สะสมที่ถ่ายทอดภาพของ Ayrton Senna ในช่วงเวลาที่ลงแข่งขันให้กับทีม Lotus หนึ่งในยุคสำคัญที่แสดงให้โลกได้เห็นพรสวรรค์อันโดดเด่นของนักแข่งชาวบราซิลผู้กลายเป็นตำนานแห่งวงการมอเตอร์สปอร์ต

ออกแบบในสไตล์ Funko Pop! อันเป็นเอกลักษณ์ พร้อมรายละเอียดที่ได้รับแรงบันดาลใจจากช่วงเวลาการแข่งขันของ Senna กับทีม Lotus ทำให้ฟิกเกอร์ชิ้นนี้เป็นไอเท็มที่มีคุณค่าสำหรับทั้งนักสะสม Funko Pop และแฟน Formula 1

ผลิตจากวัสดุ Vinyl คุณภาพสูง ขนาดกะทัดรัด เหมาะสำหรับจัดแสดงบนโต๊ะทำงาน ชั้นสะสม หรือมุมโชว์ของที่ระลึกเกี่ยวกับ Formula 1

ผลิตจากวัสดุ Vinyl คุณภาพสูง

ความสูงประมาณ 9.5 ซม. (3.75 นิ้ว)

เหมาะสำหรับนักสะสม Funko Pop และแฟน Formula 1

ของขวัญสำหรับแฟน McLaren และ Ayrton Senna

Celebrate the early Formula 1 career of a true motorsport legend with the Funko Pop! Ayrton Senna #314 – Lotus collectible vinyl figure. Inspired by Ayrton Senna’s memorable years with the iconic Lotus Formula 1 Team, this figure pays tribute to one of the most influential drivers in racing history.

Styled in Funko’s signature Pop! design, this collectible captures the spirit of Senna during a pivotal chapter of his Formula 1 journey. A perfect addition for Formula 1 enthusiasts, Ayrton Senna fans, and dedicated Funko collectors.

Crafted from premium vinyl and standing approximately 9.5 cm (3.75 inches) tall, this figure is ideal for display on desks, shelves, or alongside other motorsport memorabilia.

Official Funko Pop! Ayrton Senna collectible figure

Inspired by Ayrton Senna''s era with Lotus Formula 1 Team

Premium vinyl construction

Approximately 9.5 cm (3.75 inches) tall

Classic Funko Pop! design

Perfect for Formula 1 fans and collectors

Great addition to any Ayrton Senna or motorsport collection

FASTEST LAP: จำหน่ายสินค้า F1 Merchandise ลิขสิทธิ์แท้จากทีมฟอร์มูล่าวันครบทั้ง 11 ทีม',
    'active',
    false,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    brand_id = EXCLUDED.brand_id,
    category_id = EXCLUDED.category_id,
    status = EXCLUDED.status,
    updated_at = now();
  DELETE FROM public.product_variants WHERE product_id = 'a1776462-b6d9-5a55-87b5-a5a7c341c404';
  DELETE FROM public.product_images WHERE product_id = 'a1776462-b6d9-5a55-87b5-a5a7c341c404';
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('bfc2c8b1-a33e-5a2a-9168-4d5cc4006275', 'a1776462-b6d9-5a55-87b5-a5a7c341c404', '889698861816', null, null, 2390, null, 15, 3, true, now());
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('c9f43fec-ec93-5585-90b9-588c47578329', 'a1776462-b6d9-5a55-87b5-a5a7c341c404', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/Senna-In-Car-Yellow-_314-Img_2_b94352a1-2960-41f5-ae06-340510eff112.webp?v=1780158928', 'Funko Pop! Lotus F1 Team Ayrton Senna Formula 1 Car Mini Figure', 0);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('e347559b-0e96-5d3a-bed6-4f3de804a3ec', 'a1776462-b6d9-5a55-87b5-a5a7c341c404', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/Senna-In-Car-Yellow-_314-Img_1.webp?v=1780158929', 'Funko Pop! Lotus F1 Team Ayrton Senna Formula 1 Car Mini Figure', 1);


  -- Product: Funko Pop! McLaren F1 Team Ayrton Senna Formula 1 Car Mini Figure
  SELECT id INTO v_brand_id FROM public.brands WHERE slug = 'ayrton-senna' LIMIT 1;
  SELECT id INTO v_category_id FROM public.categories WHERE slug = 'f1-collectibles' LIMIT 1;

  INSERT INTO public.products (id, brand_id, category_id, name, slug, description, status, is_preorder, created_at, updated_at)
  VALUES (
    '6e7face2-cb12-501b-a654-beaf43463f9d',
    COALESCE(v_brand_id, '56300953-a843-534b-8957-693fe0987cd8'),
    COALESCE(v_category_id, '899799fb-76d5-5486-a741-31db70633f32'),
    'Funko Pop! McLaren F1 Team Ayrton Senna Formula 1 Car Mini Figure',
    'funko-pop-mclaren-f1-team-ayrton-senna-formula-1-car-mini-figure',
    'Funko Pop! Senna McLaren #12

เติมเต็มคอลเลกชัน Formula 1 ของคุณด้วย Funko Pop! Senna McLaren #12 ฟิกเกอร์สะสมที่ได้รับแรงบันดาลใจจาก Ayrton Senna ในช่วงเวลาที่สร้างตำนานร่วมกับทีม McLaren หนึ่งในนักแข่งที่ได้รับการยกย่องมากที่สุดในประวัติศาสตร์มอเตอร์สปอร์ต

ฟิกเกอร์ไวนิลชิ้นนี้ถูกออกแบบในสไตล์ Funko Pop! อันเป็นเอกลักษณ์ พร้อมรายละเอียดที่แฟน Formula 1 และนักสะสมจะต้องชื่นชอบ เหมาะสำหรับจัดแสดงบนโต๊ะทำงาน ชั้นสะสม หรือมุมโชว์ของสะสมภายในบ้าน

ผลิตโดย Funko แบรนด์ชั้นนำระดับโลกด้านสินค้าสะสมจากวัฒนธรรมป๊อป ที่มีชื่อเสียงในด้านฟิกเกอร์คุณภาพสูงและคอลเลกชันลิขสิทธิ์จากหลากหลายวงการกีฬา ภาพยนตร์ และเกม

ผลิตจากวัสดุ Vinyl คุณภาพสูง

ความสูงประมาณ 9.5 ซม. (3.75 นิ้ว)

เหมาะสำหรับนักสะสม Funko Pop และแฟน Formula 1

ของขวัญสำหรับแฟน McLaren และ Ayrton Senna

Celebrate one of Formula 1’s most legendary partnerships with the Funko Pop! Senna McLaren #12 collectible vinyl figure. Inspired by Ayrton Senna’s iconic years with McLaren, this figure is a must-have for Formula 1 enthusiasts, McLaren supporters, and dedicated Funko collectors.

Designed in Funko’s signature Pop! style, this collectible perfectly captures the spirit of one of motorsport’s greatest legends. Whether displayed on a shelf, desk, or alongside other racing memorabilia, it makes a standout addition to any collection.

Created by Funko, the leading brand in pop culture collectibles, this figure is part of a globally recognized range of premium vinyl figures loved by collectors around the world.

Official Funko Pop! Senna McLaren collectible figure

Inspired by Ayrton Senna and the legendary McLaren Formula 1 team

Premium vinyl construction

Approximately 9.5 cm (3.75 inches) tall

Ideal for Formula 1 fans and Funko Pop collectors

Perfect display piece for home, office, or collection shelves

FASTEST LAP: จำหน่ายสินค้า F1 Merchandise ลิขสิทธิ์แท้จากทีมฟอร์มูล่าวันครบทั้ง 11 ทีม',
    'active',
    false,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    brand_id = EXCLUDED.brand_id,
    category_id = EXCLUDED.category_id,
    status = EXCLUDED.status,
    updated_at = now();
  DELETE FROM public.product_variants WHERE product_id = '6e7face2-cb12-501b-a654-beaf43463f9d';
  DELETE FROM public.product_images WHERE product_id = '6e7face2-cb12-501b-a654-beaf43463f9d';
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('471fc24e-f46b-5803-8e5b-a4c942633080', '6e7face2-cb12-501b-a654-beaf43463f9d', '889698893299', null, null, 2390, null, 15, 3, true, now());
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('5b4479b3-f717-58da-9f26-bec6ae77ad9c', '6e7face2-cb12-501b-a654-beaf43463f9d', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/Senna-In-Car-Red-White-_12-Img_2_04903a47-dd9d-46da-9c08-4d7b3c0b8943.webp?v=1780158833', 'Funko Pop! McLaren F1 Team Ayrton Senna Formula 1 Car Mini Figure', 0);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('fc6118c5-48a1-5d44-aca3-2517ef101dce', '6e7face2-cb12-501b-a654-beaf43463f9d', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/Senna-In-Car-Red-White-_12-Img_1.webp?v=1780158833', 'Funko Pop! McLaren F1 Team Ayrton Senna Formula 1 Car Mini Figure', 1);


  -- Product: Funko Pop! McLaren F1 Team Ayrton Senna
  SELECT id INTO v_brand_id FROM public.brands WHERE slug = 'ayrton-senna' LIMIT 1;
  SELECT id INTO v_category_id FROM public.categories WHERE slug = 'f1-collectibles' LIMIT 1;

  INSERT INTO public.products (id, brand_id, category_id, name, slug, description, status, is_preorder, created_at, updated_at)
  VALUES (
    '66bec7c0-29a0-58f1-b69d-50c36fdc412d',
    COALESCE(v_brand_id, '56300953-a843-534b-8957-693fe0987cd8'),
    COALESCE(v_category_id, '899799fb-76d5-5486-a741-31db70633f32'),
    'Funko Pop! McLaren F1 Team Ayrton Senna',
    'funko-pop-mclaren-f1-team-ayrton-senna',
    'Funko Pop! Ayrton Senna #11 – McLaren

ร่วมรำลึกถึงหนึ่งในตำนานที่ยิ่งใหญ่ที่สุดของวงการมอเตอร์สปอร์ตกับ Funko Pop! Ayrton Senna #11 ฟิกเกอร์สะสมที่ถ่ายทอดภาพของ Ayrton Senna นักแข่ง Formula 1 ระดับตำนาน ผู้สร้างชื่อเสียงให้กับทีม McLaren และยังคงเป็นแรงบันดาลใจให้แฟน F1 ทั่วโลกจนถึงปัจจุบัน

ออกแบบในสไตล์ Funko Pop! อันเป็นเอกลักษณ์ พร้อมรายละเอียดที่สะท้อนตัวตนของ Senna ได้อย่างโดดเด่น เหมาะสำหรับนักสะสม Funko Pop แฟน McLaren และผู้ที่ชื่นชอบประวัติศาสตร์ Formula 1

ไม่ว่าจะจัดวางบนโต๊ะทำงาน ชั้นสะสม หรือมุมโชว์ของสะสม ฟิกเกอร์ Ayrton Senna ชิ้นนี้ถือเป็นไอเท็มที่ควรมีในคอลเลกชันของแฟนมอเตอร์สปอร์ตทุกคน

ผลิตจากวัสดุ Vinyl คุณภาพสูง

ความสูงประมาณ 10 ซม.

เหมาะสำหรับสะสมและตกแต่ง

ของขวัญสำหรับแฟน Formula 1 และ McLaren

Celebrate the legacy of one of Formula 1’s greatest icons with the Funko Pop! Ayrton Senna #11 collectible vinyl figure. Honouring the legendary Brazilian driver and his unforgettable achievements with McLaren, this figure is an essential piece for Formula 1 enthusiasts and Funko collectors alike.

Styled in Funko’s signature Pop! design, this collectible captures the spirit of Ayrton Senna, whose passion, talent, and determination continue to inspire motorsport fans around the world.

Add this unique Ayrton Senna figure to your growing Funko Pop! collection and pair it with other Formula 1 legends to create the ultimate motorsport display.

Official Funko Pop! Ayrton Senna collectible figure

Inspired by the legendary Formula 1 driver

Represents Ayrton Senna''s iconic McLaren era

Premium vinyl construction

Approximately 10.3 cm (4.05 inches) tall

Perfect for collectors, Formula 1 fans, and motorsport enthusiasts

Great display piece for home, office, or collection shelves

FASTEST LAP: จำหน่ายสินค้า F1 Merchandise ลิขสิทธิ์แท้จากทีมฟอร์มูล่าวันครบทั้ง 11 ทีม',
    'active',
    false,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    brand_id = EXCLUDED.brand_id,
    category_id = EXCLUDED.category_id,
    status = EXCLUDED.status,
    updated_at = now();
  DELETE FROM public.product_variants WHERE product_id = '66bec7c0-29a0-58f1-b69d-50c36fdc412d';
  DELETE FROM public.product_images WHERE product_id = '66bec7c0-29a0-58f1-b69d-50c36fdc412d';
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('965eb5f8-a4c2-54bf-80c3-bb663d7e84a3', '66bec7c0-29a0-58f1-b69d-50c36fdc412d', '889698861809', null, null, 1390, null, 15, 3, true, now());
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('7e133ba7-9caf-5147-9158-9f1eee9dabd6', '66bec7c0-29a0-58f1-b69d-50c36fdc412d', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/Aryton_With-Helmet-Red-_11-Img_2_66f23742-ba71-4807-8978-f2ed63d40354.webp?v=1780158493', 'Funko Pop! McLaren F1 Team Ayrton Senna', 0);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('bc325436-1712-5f0b-af23-bbf7f17cd89f', '66bec7c0-29a0-58f1-b69d-50c36fdc412d', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/Aryton_With-Helmet-Red-_11-Img_1.webp?v=1780158493', 'Funko Pop! McLaren F1 Team Ayrton Senna', 1);


  -- Product: Aston Martin F1 2026 Team Umbrella
  SELECT id INTO v_brand_id FROM public.brands WHERE slug = 'aston-martin-f1' LIMIT 1;
  SELECT id INTO v_category_id FROM public.categories WHERE slug = 'accessories' LIMIT 1;

  INSERT INTO public.products (id, brand_id, category_id, name, slug, description, status, is_preorder, created_at, updated_at)
  VALUES (
    'ea8621ff-3921-532f-a754-75c93ab0e18e',
    COALESCE(v_brand_id, '1154f8fb-3013-508f-bfa2-b2ddffaebe0a'),
    COALESCE(v_category_id, '44fc7a48-8d3c-5239-9135-d0da818bc275'),
    'Aston Martin F1 2026 Team Umbrella',
    'aston-martin-f1-team-umbrella',
    'พร้อมรับมือทุกสภาพอากาศและแสดงความเป็นแฟนตัวจริงของ Aston Martin Aramco Formula One® Team ด้วย Aston Martin F1 Team 2026 Team Umbrella ร่มลิขสิทธิ์แท้จากคอลเลกชัน Fanwear ประจำฤดูกาล 2026

โดดเด่นด้วยดีไซน์ที่ได้รับแรงบันดาลใจจากทีม Aston Martin F1 พร้อมโลโก้และรายละเอียดประจำทีมในโทนสี Racing Green อันเป็นเอกลักษณ์ ช่วยเติมลุคมอเตอร์สปอร์ตให้โดดเด่นในทุกวัน ไม่ว่าจะใช้งานในเมือง เดินทาง หรือชมการแข่งขัน Formula 1

มาพร้อมระบบ เปิดอัตโนมัติด้วยปุ่มกด (Automatic Opening) ใช้งานสะดวก รวดเร็ว พร้อมผ้าโพลีเอสเตอร์คุณภาพสูงที่ช่วยปกป้องคุณจากฝนและแสงแดดได้อย่างมีประสิทธิภาพ

ร่ม Aston Martin F1 Team ของแท้

คอลเลกชัน Fanwear อย่างเป็นทางการประจำปี 2026

ดีไซน์และโลโก้ที่ได้รับแรงบันดาลใจจากทีม Aston Martin F1

ระบบเปิดอัตโนมัติด้วยปุ่มกด

โครงสร้างแข็งแรง ใช้งานสะดวก

ผลิตจากผ้าโพลีเอสเตอร์ 100%

Show your support for the Aston Martin F1 Team with the team umbrella, an official licensed fanwear accessory featuring team-inspired branding and automatic opening for convenient use while showcasing your team pride in 2026.

• Official licensed Fanwear collection

• Designed for Aston Martin F1 Team fans

• Team inspired design and branding

• Automatic opening with push button

• Composition: 100% Polyester

FASTEST LAP: จำหน่ายสินค้า F1 Merchandise ลิขสิทธิ์แท้จากทีมฟอร์มูล่าวันครบทั้ง 11 ทีม',
    'active',
    false,
    now(),
    now()
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    brand_id = EXCLUDED.brand_id,
    category_id = EXCLUDED.category_id,
    status = EXCLUDED.status,
    updated_at = now();
  DELETE FROM public.product_variants WHERE product_id = 'ea8621ff-3921-532f-a754-75c93ab0e18e';
  DELETE FROM public.product_images WHERE product_id = 'ea8621ff-3921-532f-a754-75c93ab0e18e';
  INSERT INTO public.product_variants (id, product_id, sku, size, color, price, compare_at_price, stock_quantity, low_stock_threshold, is_active, created_at)
  VALUES ('8332953a-56a6-51ce-bbeb-c19518f19c18', 'ea8621ff-3921-532f-a754-75c93ab0e18e', '8719203575841', null, null, 1990, null, 15, 3, true, now());
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('b769fda4-9b3d-5701-8877-0e7ab52ed377', 'ea8621ff-3921-532f-a754-75c93ab0e18e', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/701238143001_PP_01_AstonMartinf1.jpg?v=1780160839', 'Aston Martin F1 2026 Team Umbrella', 0);
  INSERT INTO public.product_images (id, product_id, storage_path, alt_text, sort_order)
  VALUES ('660c26c7-e5fb-5c87-bcff-9a9ecc0fed4f', 'ea8621ff-3921-532f-a754-75c93ab0e18e', 'https://cdn.shopify.com/s/files/1/0661/2477/5609/files/701238143001_PP_02_AstonMartinf1.jpg?v=1780160839', 'Aston Martin F1 2026 Team Umbrella', 1);

END $$;

NOTIFY pgrst, 'reload schema';
