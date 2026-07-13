-- AllThingsMerch SQL Migration 0002: Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE license_holders ENABLE ROW LEVEL SECURITY;
ALTER TABLE license_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE authenticity_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE royalty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- ========================================================
-- 1. PUBLIC READ POLICIES (Catalog & Verification)
-- ========================================================

CREATE POLICY "Allow public read on active brands" ON brands
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow public read on categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Allow public read on active products" ON products
  FOR SELECT USING (status = 'active');

CREATE POLICY "Allow public read on active product variants" ON product_variants
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow public read on product images" ON product_images
  FOR SELECT USING (true);

CREATE POLICY "Allow public read on published reviews" ON reviews
  FOR SELECT USING (status = 'published');

CREATE POLICY "Allow public verification read on authenticity tags" ON authenticity_tags
  FOR SELECT USING (true);

-- ========================================================
-- 2. CUSTOMER POLICIES (Orders & Reviews)
-- ========================================================

CREATE POLICY "Customers can view their own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Customers can insert their own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Customers can view order items of their orders" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Customers can insert reviews for fulfilled order items" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ========================================================
-- 3. ADMIN / SERVICE ROLE POLICIES (Full Access)
-- ========================================================

-- Service role bypasses RLS automatically in Supabase, but we also create
-- explicit policies for authenticated users carrying admin metadata/role.

CREATE POLICY "Admins have full access to brands" ON brands
  FOR ALL USING ((auth.jwt() ->> 'role') = 'admin' OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins have full access to products" ON products
  FOR ALL USING ((auth.jwt() ->> 'role') = 'admin' OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins have full access to variants" ON product_variants
  FOR ALL USING ((auth.jwt() ->> 'role') = 'admin' OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins have full access to orders" ON orders
  FOR ALL USING ((auth.jwt() ->> 'role') = 'admin' OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

CREATE POLICY "Admins have full access to royalty transactions" ON royalty_transactions
  FOR ALL USING ((auth.jwt() ->> 'role') = 'admin' OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
