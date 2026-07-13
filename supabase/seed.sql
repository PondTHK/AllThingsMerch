-- AllThingsMerch Seed Data for Supabase

-- 1. Insert Brands
INSERT INTO brands (id, name, slug, description, is_active)
VALUES
  ('b1111111-1111-4111-8111-111111111111', 'Oracle Red Bull Racing', 'oracle-red-bull-racing', 'Championship Formula 1 Team Merch', true),
  ('b2222222-2222-4222-8222-222222222222', 'Scuderia Ferrari F1', 'scuderia-ferrari-f1', 'Legendary Italian F1 Team Merch', true),
  ('b3333333-3333-4333-8333-333333333333', 'Cactus Jack Merch', 'cactus-jack-merch', 'Official Travis Scott Apparel & Collectibles', true),
  ('b4444444-4444-4444-8444-444444444444', 'KAWS Collectibles', 'kaws-collectibles', 'Limited Edition Art Toys & Vinyl Figures', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Categories
INSERT INTO categories (id, name, slug)
VALUES
  ('c1111111-1111-4111-8111-111111111111', 'Formula 1 Apparel', 'formula-1'),
  ('c2222222-2222-4222-8222-222222222222', 'Artist & Concert Merch', 'music-merch'),
  ('c3333333-3333-4333-8333-333333333333', 'Art Toys & Collectibles', 'collectibles')
ON CONFLICT (id) DO NOTHING;

-- 3. Insert License Holders
INSERT INTO license_holders (id, name, contact_email, status)
VALUES
  ('l1111111-1111-4111-8111-111111111111', 'Red Bull Technology Ltd', 'licensing@redbullracing.com', 'active'),
  ('l2222222-2222-4222-8222-222222222222', 'Ferrari S.p.A.', 'licensing@ferrari.it', 'active')
ON CONFLICT (id) DO NOTHING;

-- 4. Insert License Contracts
INSERT INTO license_contracts (id, license_holder_id, contract_reference, royalty_rate, starts_at, expires_at, status)
VALUES
  ('lc111111-1111-4111-8111-111111111111', 'l1111111-1111-4111-8111-111111111111', 'RBR-2026-MERCH-01', 12.5000, '2026-01-01', '2027-12-31', 'active'),
  ('lc222222-2222-4222-8222-222222222222', 'l2222222-2222-4222-8222-222222222222', 'SF-2026-MERCH-01', 14.0000, '2026-01-01', '2027-12-31', 'active')
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Products
INSERT INTO products (id, brand_id, category_id, license_contract_id, name, slug, description, status, is_preorder)
VALUES
  (
    'p1111111-1111-4111-8111-111111111111',
    'b1111111-1111-4111-8111-111111111111',
    'c1111111-1111-4111-8111-111111111111',
    'lc111111-1111-4111-8111-111111111111',
    'Red Bull Racing 2026 Team Polo',
    'red-bull-racing-2026-team-polo',
    'Official Oracle Red Bull Racing team polo shirt engineered with breathable performance fabric.',
    'active',
    false
  ),
  (
    'p2222222-2222-4222-8222-222222222222',
    'b2222222-2222-4222-8222-222222222222',
    'c1111111-1111-4111-8111-111111111111',
    'lc222222-2222-4222-8222-222222222222',
    'Scuderia Ferrari 2026 Team Softshell Jacket',
    'scuderia-ferrari-2026-team-softshell-jacket',
    'Official Scuderia Ferrari water-repellent trackside softshell jacket with Scudetto shield badge.',
    'active',
    false
  )
ON CONFLICT (id) DO NOTHING;

-- 6. Insert Product Variants
INSERT INTO product_variants (id, product_id, sku, size, color, price, stock_quantity, low_stock_threshold, is_active)
VALUES
  ('v1111111-1111-4111-8111-111111111111', 'p1111111-1111-4111-8111-111111111111', 'RBR-POLO26-M', 'M', 'Night Navy', 3990.00, 15, 3, true),
  ('v2222222-2222-4222-8222-222222222222', 'p2222222-2222-4222-8222-222222222222', 'SF-JKT26-M', 'M', 'Rosso Corsa', 6890.00, 10, 3, true)
ON CONFLICT (id) DO NOTHING;
