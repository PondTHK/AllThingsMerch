-- Migration: Seed PUN merchandise products from UMusic
-- Created: 2026-07-22

DO $$
DECLARE
  b_id uuid;
  p_id_1 uuid := gen_random_uuid();
  p_id_2 uuid := gen_random_uuid();
  p_id_3 uuid := gen_random_uuid();
  p_id_4 uuid := gen_random_uuid();
  p_id_5 uuid := gen_random_uuid();
  p_id_6 uuid := gen_random_uuid();
  p_id_7 uuid := gen_random_uuid();
  p_id_8 uuid := gen_random_uuid();
  p_id_9 uuid := gen_random_uuid();
  p_id_10 uuid := gen_random_uuid();
  c_id uuid := 'c2222222-2222-4222-8222-222222222222'; -- Artist & Concert Merch
BEGIN
  -- Insert PUN brand if it doesn't exist
  INSERT INTO brands (name, slug, description, is_active)
  VALUES ('PUN', 'pun', 'PUN Official Merchandise', true)
  ON CONFLICT (slug) DO NOTHING;

  -- Get brand ID
  SELECT id INTO b_id FROM brands WHERE slug = 'pun';

  -- Product 1: PUN 'WIA' Stormy Gray Sleeveless Tee
  INSERT INTO products (id, brand_id, category_id, name, slug, description, status, is_preorder, updated_at)
  VALUES (p_id_1, b_id, c_id, 'PUN ''WIA'' Stormy Gray Sleeveless Tee', 'pun-wia-stormy-gray-sleeveless-tee', 'PUN ''While I''m away'' - Stormy Gray Sleeveless Tee', 'active', false, now())
  ON CONFLICT (slug) DO NOTHING;
  
  IF EXISTS (SELECT 1 FROM products WHERE slug = 'pun-wia-stormy-gray-sleeveless-tee') THEN
    SELECT id INTO p_id_1 FROM products WHERE slug = 'pun-wia-stormy-gray-sleeveless-tee';
    INSERT INTO product_variants (product_id, sku, price, stock_quantity, low_stock_threshold, is_active)
    VALUES (p_id_1, 'pun-wia-sleeveless', 750, 30, 3, true)
    ON CONFLICT (sku) DO NOTHING;
    
    INSERT INTO product_images (product_id, storage_path, alt_text, sort_order)
    VALUES (p_id_1, 'https://umusic.co.th/cdn/shop/files/WIASleeveless.png?v=1780903740&width=800', 'PUN WIA Stormy Gray Sleeveless Tee', 1)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Product 2: PUN 'WIA' Cloudy Blue Short Sleeves Tee
  INSERT INTO products (id, brand_id, category_id, name, slug, description, status, is_preorder, updated_at)
  VALUES (p_id_2, b_id, c_id, 'PUN ''WIA'' Cloudy Blue Short Sleeves Tee', 'pun-wia-cloudy-blue-short-sleeves-tee', 'PUN ''While I''m away'' - Cloudy Blue Short Sleeves Tee', 'active', false, now())
  ON CONFLICT (slug) DO NOTHING;
  
  IF EXISTS (SELECT 1 FROM products WHERE slug = 'pun-wia-cloudy-blue-short-sleeves-tee') THEN
    SELECT id INTO p_id_2 FROM products WHERE slug = 'pun-wia-cloudy-blue-short-sleeves-tee';
    INSERT INTO product_variants (product_id, sku, price, stock_quantity, low_stock_threshold, is_active)
    VALUES (p_id_2, 'pun-wia-cloudy-tee', 750, 30, 3, true)
    ON CONFLICT (sku) DO NOTHING;
    
    INSERT INTO product_images (product_id, storage_path, alt_text, sort_order)
    VALUES (p_id_2, 'https://umusic.co.th/cdn/shop/files/WIAFadedBlueTee.png?v=1780901358&width=800', 'PUN WIA Cloudy Blue Short Sleeves Tee', 1)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Product 3: PUN Collectible Photo - Random Polaroid Set
  INSERT INTO products (id, brand_id, category_id, name, slug, description, status, is_preorder, updated_at)
  VALUES (p_id_3, b_id, c_id, 'PUN Collectible Photo - Random Polaroid Set', 'pun-collectible-photo-polaroid-set', 'Collectible Photo - Random Polaroid Set by PUN', 'active', false, now())
  ON CONFLICT (slug) DO NOTHING;
  
  IF EXISTS (SELECT 1 FROM products WHERE slug = 'pun-collectible-photo-polaroid-set') THEN
    SELECT id INTO p_id_3 FROM products WHERE slug = 'pun-collectible-photo-polaroid-set';
    INSERT INTO product_variants (product_id, sku, price, stock_quantity, low_stock_threshold, is_active)
    VALUES (p_id_3, 'pun-polaroid-set', 100, 50, 3, true)
    ON CONFLICT (sku) DO NOTHING;
    
    INSERT INTO product_images (product_id, storage_path, alt_text, sort_order)
    VALUES (p_id_3, 'https://umusic.co.th/cdn/shop/files/07-PUN_Polaroidpack_sale02_04f65a8d-a120-4429-a893-211490c81873.jpg?v=1741595904&width=800', 'PUN Collectible Photo Random Polaroid Set', 1)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Product 4: PUN ‘Bandage’ Stickers Set
  INSERT INTO products (id, brand_id, category_id, name, slug, description, status, is_preorder, updated_at)
  VALUES (p_id_4, b_id, c_id, 'PUN ''Bandage'' Stickers Set', 'pun-bandage-stickers-set', 'PUN Bandage Stickers Set Official Merchandise', 'active', false, now())
  ON CONFLICT (slug) DO NOTHING;
  
  IF EXISTS (SELECT 1 FROM products WHERE slug = 'pun-bandage-stickers-set') THEN
    SELECT id INTO p_id_4 FROM products WHERE slug = 'pun-bandage-stickers-set';
    INSERT INTO product_variants (product_id, sku, price, stock_quantity, low_stock_threshold, is_active)
    VALUES (p_id_4, 'pun-bandage-stickers', 90, 100, 3, true)
    ON CONFLICT (sku) DO NOTHING;
    
    INSERT INTO product_images (product_id, storage_path, alt_text, sort_order)
    VALUES (p_id_4, 'https://umusic.co.th/cdn/shop/files/PUN_Badage_Sticker_Pack_final.jpg?v=1761112884&width=800', 'PUN Bandage Stickers Set', 1)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Product 5: PUN BASIC SOCKS
  INSERT INTO products (id, brand_id, category_id, name, slug, description, status, is_preorder, updated_at)
  VALUES (p_id_5, b_id, c_id, 'PUN Basic Socks', 'pun-basic-socks', 'Official PUN Basic Socks (Cotton/Polyester)', 'active', false, now())
  ON CONFLICT (slug) DO NOTHING;
  
  IF EXISTS (SELECT 1 FROM products WHERE slug = 'pun-basic-socks') THEN
    SELECT id INTO p_id_5 FROM products WHERE slug = 'pun-basic-socks';
    INSERT INTO product_variants (product_id, sku, price, stock_quantity, low_stock_threshold, is_active)
    VALUES (p_id_5, 'pun-basic-socks-sku', 320, 30, 3, true)
    ON CONFLICT (sku) DO NOTHING;
    
    INSERT INTO product_images (product_id, storage_path, alt_text, sort_order)
    VALUES (p_id_5, 'https://umusic.co.th/cdn/shop/files/NewProject_49f3f75d-a0d4-4cd6-a30e-3d445ee66672.png?v=1713949265&width=800', 'PUN Basic Socks', 1)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Product 6: PUN SELLFISH UNIFORM SET
  INSERT INTO products (id, brand_id, category_id, name, slug, description, status, is_preorder, updated_at)
  VALUES (p_id_6, b_id, c_id, 'PUN Sellfish Uniform Set', 'pun-sellfish-uniform-set', 'PUN Sellfish Uniform Set including T-Shirt and Hat', 'active', false, now())
  ON CONFLICT (slug) DO NOTHING;
  
  IF EXISTS (SELECT 1 FROM products WHERE slug = 'pun-sellfish-uniform-set') THEN
    SELECT id INTO p_id_6 FROM products WHERE slug = 'pun-sellfish-uniform-set';
    INSERT INTO product_variants (product_id, sku, price, stock_quantity, low_stock_threshold, is_active)
    VALUES (p_id_6, 'pun-sellfish-uniform-set-sku', 1399, 15, 3, true)
    ON CONFLICT (sku) DO NOTHING;
    
    INSERT INTO product_images (product_id, storage_path, alt_text, sort_order)
    VALUES (p_id_6, 'https://umusic.co.th/cdn/shop/files/SELLFISHUNIFORMSET-DAYONE_63bb3a99-a437-4dfe-98a0-04f38277fab0.png?v=1724389725&width=800', 'PUN Sellfish Uniform Set', 1)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Product 7: PUN SELLFISH T-SHIRT
  INSERT INTO products (id, brand_id, category_id, name, slug, description, status, is_preorder, updated_at)
  VALUES (p_id_7, b_id, c_id, 'PUN Sellfish T-Shirt', 'pun-sellfish-t-shirt', 'PUN Sellfish Oversized T-Shirt (Heavyweight Cotton)', 'active', false, now())
  ON CONFLICT (slug) DO NOTHING;
  
  IF EXISTS (SELECT 1 FROM products WHERE slug = 'pun-sellfish-t-shirt') THEN
    SELECT id INTO p_id_7 FROM products WHERE slug = 'pun-sellfish-t-shirt';
    INSERT INTO product_variants (product_id, sku, price, stock_quantity, low_stock_threshold, is_active)
    VALUES (p_id_7, 'pun-sellfish-tee', 899, 25, 3, true)
    ON CONFLICT (sku) DO NOTHING;
    
    INSERT INTO product_images (product_id, storage_path, alt_text, sort_order)
    VALUES (p_id_7, 'https://umusic.co.th/cdn/shop/files/NewProject_5_a53fabfa-1d09-4eb8-accf-a4206da1061f.png?v=1724301647&width=800', 'PUN Sellfish T-Shirt', 1)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Product 8: PUN LOGO HAT (CHOCOLATE BROWN)
  INSERT INTO products (id, brand_id, category_id, name, slug, description, status, is_preorder, updated_at)
  VALUES (p_id_8, b_id, c_id, 'PUN Logo Hat (Chocolate Brown)', 'pun-logo-hat-chocolate-brown', '6-Panel Hat with embroidered PUN logo', 'active', false, now())
  ON CONFLICT (slug) DO NOTHING;
  
  IF EXISTS (SELECT 1 FROM products WHERE slug = 'pun-logo-hat-chocolate-brown') THEN
    SELECT id INTO p_id_8 FROM products WHERE slug = 'pun-logo-hat-chocolate-brown';
    INSERT INTO product_variants (product_id, sku, price, stock_quantity, low_stock_threshold, is_active)
    VALUES (p_id_8, 'pun-hat-brown', 450, 10, 3, true)
    ON CONFLICT (sku) DO NOTHING;
    
    INSERT INTO product_images (product_id, storage_path, alt_text, sort_order)
    VALUES (p_id_8, 'https://umusic.co.th/cdn/shop/files/Brown_Front.png?v=1711102729&width=800', 'PUN Logo Hat Chocolate Brown', 1)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Product 9: PUN SMILEY HAT (FOREST GREEN)
  INSERT INTO products (id, brand_id, category_id, name, slug, description, status, is_preorder, updated_at)
  VALUES (p_id_9, b_id, c_id, 'PUN Smiley Hat (Forest Green)', 'pun-smiley-hat-forest-green', 'Smiley logo embroidered 6-panel hat', 'active', false, now())
  ON CONFLICT (slug) DO NOTHING;
  
  IF EXISTS (SELECT 1 FROM products WHERE slug = 'pun-smiley-hat-forest-green') THEN
    SELECT id INTO p_id_9 FROM products WHERE slug = 'pun-smiley-hat-forest-green';
    INSERT INTO product_variants (product_id, sku, price, stock_quantity, low_stock_threshold, is_active)
    VALUES (p_id_9, 'pun-hat-green', 450, 12, 3, true)
    ON CONFLICT (sku) DO NOTHING;
    
    INSERT INTO product_images (product_id, storage_path, alt_text, sort_order)
    VALUES (p_id_9, 'https://umusic.co.th/cdn/shop/files/Green_Front.png?v=1711104202&width=800', 'PUN Smiley Hat Forest Green', 1)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Product 10: PUN SMILEY HAT (OLD NAVY)
  INSERT INTO products (id, brand_id, category_id, name, slug, description, status, is_preorder, updated_at)
  VALUES (p_id_10, b_id, c_id, 'PUN Smiley Hat (Old Navy)', 'pun-smiley-hat-old-navy', 'Smiley logo embroidered 6-panel hat in old navy', 'active', false, now())
  ON CONFLICT (slug) DO NOTHING;
  
  IF EXISTS (SELECT 1 FROM products WHERE slug = 'pun-smiley-hat-old-navy') THEN
    SELECT id INTO p_id_10 FROM products WHERE slug = 'pun-smiley-hat-old-navy';
    INSERT INTO product_variants (product_id, sku, price, stock_quantity, low_stock_threshold, is_active)
    VALUES (p_id_10, 'pun-hat-navy', 450, 15, 3, true)
    ON CONFLICT (sku) DO NOTHING;
    
    INSERT INTO product_images (product_id, storage_path, alt_text, sort_order)
    VALUES (p_id_10, 'https://umusic.co.th/cdn/shop/files/Image20240403145946.png?v=1712131249&width=800', 'PUN Smiley Hat Old Navy', 1)
    ON CONFLICT DO NOTHING;
  END IF;

END $$;
