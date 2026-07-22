-- Migration: Seed SASOM Pop Mart products
-- Created: 2026-07-22

DO $$
DECLARE
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
  b_id uuid := '7a7c58d5-5ac1-4828-8518-118f06ef6c78'; -- POP MART
  c_id uuid := 'c3333333-3333-4333-8333-333333333333'; -- Art Toys & Collectibles
BEGIN
  -- Insert POP MART brand if it doesn't exist
  INSERT INTO brands (id, name, slug, description, is_active)
  VALUES (b_id, 'POP MART', 'pop-mart', 'Pop Mart Art Toys & Figures', true)
  ON CONFLICT (slug) DO NOTHING;

  -- Get the actual brand ID of POP MART in case it was already inserted with a different ID
  SELECT id INTO b_id FROM brands WHERE slug = 'pop-mart';

  -- Product 1
  INSERT INTO products (id, brand_id, category_id, name, slug, description, status, is_preorder, updated_at)
  VALUES (p_id_1, b_id, c_id, 'Pop Mart Mega Collection Space Molly Christmas Multi 1000%', 'pop-mart-mega-collection-space-molly-christmas-multi-1000', 'Mega Collection Space Molly Christmas Multi 1000% Art Toy', 'active', false, now())
  ON CONFLICT (slug) DO NOTHING;
  
  IF EXISTS (SELECT 1 FROM products WHERE slug = 'pop-mart-mega-collection-space-molly-christmas-multi-1000') THEN
    SELECT id INTO p_id_1 FROM products WHERE slug = 'pop-mart-mega-collection-space-molly-christmas-multi-1000';
    INSERT INTO product_variants (product_id, sku, price, stock_quantity, low_stock_threshold, is_active)
    VALUES (p_id_1, 'pop-space-molly-1000', 35900, 20, 3, true)
    ON CONFLICT (sku) DO NOTHING;
    
    INSERT INTO product_images (product_id, storage_path, alt_text, sort_order)
    VALUES (p_id_1, 'https://img.sasom.co.th/pop-mart-mega-collection-space-molly-christmas-multi-1000--1-n.jpg?width=1920&quality=75', 'Pop Mart Mega Collection Space Molly Christmas Multi 1000%', 1)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Product 2
  INSERT INTO products (id, brand_id, category_id, name, slug, description, status, is_preorder, updated_at)
  VALUES (p_id_2, b_id, c_id, 'Pop Mart Labubu The Monsters Fall In Wild Vinyl Plush Pendant', 'pop-mart-labubu-the-monsters-fall-in-wild-pendant', 'THE MONSTERS FALL IN WILD SERIES-Vinyl Plush Doll Pendant', 'active', false, now())
  ON CONFLICT (slug) DO NOTHING;
  
  IF EXISTS (SELECT 1 FROM products WHERE slug = 'pop-mart-labubu-the-monsters-fall-in-wild-pendant') THEN
    SELECT id INTO p_id_2 FROM products WHERE slug = 'pop-mart-labubu-the-monsters-fall-in-wild-pendant';
    INSERT INTO product_variants (product_id, sku, price, stock_quantity, low_stock_threshold, is_active)
    VALUES (p_id_2, 'pop-labubu-fall-in-wild', 550, 20, 3, true)
    ON CONFLICT (sku) DO NOTHING;
    
    INSERT INTO product_images (product_id, storage_path, alt_text, sort_order)
    VALUES (p_id_2, 'https://img.sasom.co.th/pop-mart-labubu-the-monsters-fall-in-wild-series-vinyl-plush-doll-pendant-1-n.jpg?width=1920&quality=75', 'Pop Mart Labubu The Monsters Fall In Wild Vinyl Plush Pendant', 1)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Product 3
  INSERT INTO products (id, brand_id, category_id, name, slug, description, status, is_preorder, updated_at)
  VALUES (p_id_3, b_id, c_id, 'Pop Mart Hirono Mist-Walker Series The Soul Corroder Plush Pendant', 'pop-mart-hirono-mist-walker-the-soul-corroder', 'The Soul Corroder Hirono Mist-Walker Series Plush Doll Pendant', 'active', false, now())
  ON CONFLICT (slug) DO NOTHING;
  
  IF EXISTS (SELECT 1 FROM products WHERE slug = 'pop-mart-hirono-mist-walker-the-soul-corroder') THEN
    SELECT id INTO p_id_3 FROM products WHERE slug = 'pop-mart-hirono-mist-walker-the-soul-corroder';
    INSERT INTO product_variants (product_id, sku, price, stock_quantity, low_stock_threshold, is_active)
    VALUES (p_id_3, 'pop-hirono-soul-corroder', 829, 20, 3, true)
    ON CONFLICT (sku) DO NOTHING;
    
    INSERT INTO product_images (product_id, storage_path, alt_text, sort_order)
    VALUES (p_id_3, 'https://img.sasom.co.th/pm-bbcccpmtschmwspdp-pop-mart-the-soul-corroder-hirono-mist-walker-series-plush-doll-pendant-1-n.jpg?width=1920&quality=75', 'Pop Mart Hirono Mist-Walker Series The Soul Corroder Plush Pendant', 1)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Product 4
  INSERT INTO products (id, brand_id, category_id, name, slug, description, status, is_preorder, updated_at)
  VALUES (p_id_4, b_id, c_id, 'Pop Mart THE MONSTERS Hair Salon Series Warm Oat Vinyl Plush Pendant', 'pop-mart-the-monsters-hair-salon-warm-oat', 'Warm Oat THE MONSTERS Hair Salon Series Vinyl Plush Pendant Blind Box', 'active', false, now())
  ON CONFLICT (slug) DO NOTHING;
  
  IF EXISTS (SELECT 1 FROM products WHERE slug = 'pop-mart-the-monsters-hair-salon-warm-oat') THEN
    SELECT id INTO p_id_4 FROM products WHERE slug = 'pop-mart-the-monsters-hair-salon-warm-oat';
    INSERT INTO product_variants (product_id, sku, price, stock_quantity, low_stock_threshold, is_active)
    VALUES (p_id_4, 'pop-monsters-salon-warm-oat', 956, 20, 3, true)
    ON CONFLICT (sku) DO NOTHING;
    
    INSERT INTO product_images (product_id, storage_path, alt_text, sort_order)
    VALUES (p_id_4, 'https://img.sasom.co.th/pm-bbcccpmwotmhssvppbb-pop-mart-warm-oat-the-monsters-hair-salon-series-vinyl-plush-pendant-blind-box-1-n.jpg?width=1920&quality=75', 'Pop Mart THE MONSTERS Hair Salon Series Warm Oat Vinyl Plush Pendant', 1)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Product 5
  INSERT INTO products (id, brand_id, category_id, name, slug, description, status, is_preorder, updated_at)
  VALUES (p_id_5, b_id, c_id, 'Pop Mart THE MONSTERS Hair Salon Series Velvet Noon Vinyl Plush Pendant', 'pop-mart-the-monsters-hair-salon-velvet-noon', 'Velvet Noon THE MONSTERS Hair Salon Series Vinyl Plush Pendant Blind Box', 'active', false, now())
  ON CONFLICT (slug) DO NOTHING;
  
  IF EXISTS (SELECT 1 FROM products WHERE slug = 'pop-mart-the-monsters-hair-salon-velvet-noon') THEN
    SELECT id INTO p_id_5 FROM products WHERE slug = 'pop-mart-the-monsters-hair-salon-velvet-noon';
    INSERT INTO product_variants (product_id, sku, price, stock_quantity, low_stock_threshold, is_active)
    VALUES (p_id_5, 'pop-monsters-salon-velvet-noon', 1099, 20, 3, true)
    ON CONFLICT (sku) DO NOTHING;
    
    INSERT INTO product_images (product_id, storage_path, alt_text, sort_order)
    VALUES (p_id_5, 'https://img.sasom.co.th/pm-bbcccpmvntmhssvppbb-pop-mart-velvet-noon-the-monsters-hair-salon-series-vinyl-plush-pendant-blind-box-1-n.jpg?width=1920&quality=75', 'Pop Mart THE MONSTERS Hair Salon Series Velvet Noon Vinyl Plush Pendant', 1)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Product 6
  INSERT INTO products (id, brand_id, category_id, name, slug, description, status, is_preorder, updated_at)
  VALUES (p_id_6, b_id, c_id, 'Pop Mart Labubu Soymilk Tasty Macarons Vinyl Face Blind Box', 'pop-mart-labubu-soymilk-tasty-macarons', 'Labubu Soymilk (The Monsters - Tasty Macarons Vinyl Face Blind Box)', 'active', false, now())
  ON CONFLICT (slug) DO NOTHING;
  
  IF EXISTS (SELECT 1 FROM products WHERE slug = 'pop-mart-labubu-soymilk-tasty-macarons') THEN
    SELECT id INTO p_id_6 FROM products WHERE slug = 'pop-mart-labubu-soymilk-tasty-macarons';
    INSERT INTO product_variants (product_id, sku, price, stock_quantity, low_stock_threshold, is_active)
    VALUES (p_id_6, 'pop-labubu-soymilk-macaron', 518, 20, 3, true)
    ON CONFLICT (sku) DO NOTHING;
    
    INSERT INTO product_images (product_id, storage_path, alt_text, sort_order)
    VALUES (p_id_6, 'https://img.sasom.co.th/pm-fgcpmstmtmvfbb49lq-pop-mart-labubu-soymilk-the-monsters-tasty-macarons-vinyl-face-blind-box-1-n.jpg?width=1920&quality=75', 'Pop Mart Labubu Soymilk Tasty Macarons Vinyl Face Blind Box', 1)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Product 7
  INSERT INTO products (id, brand_id, category_id, name, slug, description, status, is_preorder, updated_at)
  VALUES (p_id_7, b_id, c_id, 'Pop Mart Mega Space Molly Planet Series Mercury 400%', 'pop-mart-mega-space-molly-planet-mercury-400', 'Mega Space Molly Planet Series Fiqures 400% Mercury', 'active', false, now())
  ON CONFLICT (slug) DO NOTHING;
  
  IF EXISTS (SELECT 1 FROM products WHERE slug = 'pop-mart-mega-space-molly-planet-mercury-400') THEN
    SELECT id INTO p_id_7 FROM products WHERE slug = 'pop-mart-mega-space-molly-planet-mercury-400';
    INSERT INTO product_variants (product_id, sku, price, stock_quantity, low_stock_threshold, is_active)
    VALUES (p_id_7, 'pop-space-molly-mercury-400', 5790, 20, 3, true)
    ON CONFLICT (sku) DO NOTHING;
    
    INSERT INTO product_images (product_id, storage_path, alt_text, sort_order)
    VALUES (p_id_7, 'https://img.sasom.co.th/pop-mart-mercury--mega-space-molly-planet-series-fiqures-400---1-n.jpg?width=1920&quality=75', 'Pop Mart Mega Space Molly Planet Series Mercury 400%', 1)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Product 8
  INSERT INTO products (id, brand_id, category_id, name, slug, description, status, is_preorder, updated_at)
  VALUES (p_id_8, b_id, c_id, 'Pop Mart Spring Flower Series Fall Into Spring Plush Pendant', 'pop-mart-spring-flower-fall-into-spring-pendant', 'Spring Flower Series Fall Into Spring Vinyl Plush Doll Pendant', 'active', false, now())
  ON CONFLICT (slug) DO NOTHING;
  
  IF EXISTS (SELECT 1 FROM products WHERE slug = 'pop-mart-spring-flower-fall-into-spring-pendant') THEN
    SELECT id INTO p_id_8 FROM products WHERE slug = 'pop-mart-spring-flower-fall-into-spring-pendant';
    INSERT INTO product_variants (product_id, sku, price, stock_quantity, low_stock_threshold, is_active)
    VALUES (p_id_8, 'pop-spring-flower-pendant', 1000, 20, 3, true)
    ON CONFLICT (sku) DO NOTHING;
    
    INSERT INTO product_images (product_id, storage_path, alt_text, sort_order)
    VALUES (p_id_8, 'https://img.sasom.co.th/pm-afcpmvtmlsfisspp1p3ca-pop-mart-spring-floweer-series-fall-into-spring-vinyl-plush-doll-pendant-1-n.jpg?width=1920&quality=75', 'Pop Mart Spring Flower Series Fall Into Spring Plush Pendant', 1)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Product 9
  INSERT INTO products (id, brand_id, category_id, name, slug, description, status, is_preorder, updated_at)
  VALUES (p_id_9, b_id, c_id, 'Pop Mart Hirono Living Wild Fight For Joy Plush Doll', 'pop-mart-hirono-living-wild-fight-for-joy', 'Hirono Living Wild-Fight For Joy Plush Doll', 'active', false, now())
  ON CONFLICT (slug) DO NOTHING;
  
  IF EXISTS (SELECT 1 FROM products WHERE slug = 'pop-mart-hirono-living-wild-fight-for-joy') THEN
    SELECT id INTO p_id_9 FROM products WHERE slug = 'pop-mart-hirono-living-wild-fight-for-joy';
    INSERT INTO product_variants (product_id, sku, price, stock_quantity, low_stock_threshold, is_active)
    VALUES (p_id_9, 'pop-hirono-living-wild-fight', 690, 20, 3, true)
    ON CONFLICT (sku) DO NOTHING;
    
    INSERT INTO product_images (product_id, storage_path, alt_text, sort_order)
    VALUES (p_id_9, 'https://img.sasom.co.th/pm-fgcpmhlwffjpd-pop-mart-hirono-living-wild-fight-for-joy-plush-doll-1-n.jpg?width=1920&quality=75', 'Pop Mart Hirono Living Wild Fight For Joy Plush Doll', 1)
    ON CONFLICT DO NOTHING;
  END IF;

  -- Product 10
  INSERT INTO products (id, brand_id, category_id, name, slug, description, status, is_preorder, updated_at)
  VALUES (p_id_10, b_id, c_id, 'Pop Mart Hirono Mist-Walker The Wingless Follower Plush Pendant', 'pop-mart-hirono-mist-walker-the-wingless-follower', 'The Wingless Follower Hirono Mist-Walker Series Plush Doll Pendant', 'active', false, now())
  ON CONFLICT (slug) DO NOTHING;
  
  IF EXISTS (SELECT 1 FROM products WHERE slug = 'pop-mart-hirono-mist-walker-the-wingless-follower') THEN
    SELECT id INTO p_id_10 FROM products WHERE slug = 'pop-mart-hirono-mist-walker-the-wingless-follower';
    INSERT INTO product_variants (product_id, sku, price, stock_quantity, low_stock_threshold, is_active)
    VALUES (p_id_10, 'pop-hirono-wingless-follower', 920, 20, 3, true)
    ON CONFLICT (sku) DO NOTHING;
    
    INSERT INTO product_images (product_id, storage_path, alt_text, sort_order)
    VALUES (p_id_10, 'https://img.sasom.co.th/pm-bbcccpmtwfhmwspdp-pop-mart-the-wingless-follower-hirono-mist-walker-series-plush-doll-pendant-1-n.jpg?width=1920&quality=75', 'Pop Mart Hirono Mist-Walker The Wingless Follower Plush Pendant', 1)
    ON CONFLICT DO NOTHING;
  END IF;

END $$;
