-- =============================================================================
-- Migration 0004: Fix Admin RLS Policies across all tables
-- =============================================================================
-- This migration updates all admin RLS policies to check for the 'admin' role
-- inside app_metadata, user_metadata (raw_user_meta_data), and top-level role.
-- It also creates missing write policies for categories, tags, contracts,
-- license holders, stock movements, and product images, and enables RLS on coupons.

-- 1. Enable RLS on coupons if not already enabled
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing admin policies to replace them with complete metadata check
DROP POLICY IF EXISTS "Admins have full access to brands" ON public.brands;
DROP POLICY IF EXISTS "Admins have full access to products" ON public.products;
DROP POLICY IF EXISTS "Admins have full access to variants" ON public.product_variants;
DROP POLICY IF EXISTS "Admins have full access to orders" ON public.orders;
DROP POLICY IF EXISTS "Admins have full access to royalty transactions" ON public.royalty_transactions;
DROP POLICY IF EXISTS "Admins have full access to coupons" ON public.coupons;
DROP POLICY IF EXISTS "Admins have full access to categories" ON public.categories;
DROP POLICY IF EXISTS "Admins have full access to tags" ON public.authenticity_tags;
DROP POLICY IF EXISTS "Admins have full access to contracts" ON public.license_contracts;
DROP POLICY IF EXISTS "Admins have full access to license holders" ON public.license_holders;
DROP POLICY IF EXISTS "Admins have full access to stock movements" ON public.stock_movements;
DROP POLICY IF EXISTS "Admins have full access to reviews" ON public.reviews;
DROP POLICY IF EXISTS "Admins have full access to product images" ON public.product_images;

-- 3. Create full access admin policies across all tables
CREATE POLICY "Admins have full access to brands" ON public.brands
  FOR ALL USING (
    (auth.jwt() ->> 'role'::text) = 'admin'::text OR
    ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = 'admin'::text OR
    ((auth.jwt() -> 'user_metadata'::text) ->> 'role'::text) = 'admin'::text
  );

CREATE POLICY "Admins have full access to products" ON public.products
  FOR ALL USING (
    (auth.jwt() ->> 'role'::text) = 'admin'::text OR
    ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = 'admin'::text OR
    ((auth.jwt() -> 'user_metadata'::text) ->> 'role'::text) = 'admin'::text
  );

CREATE POLICY "Admins have full access to variants" ON public.product_variants
  FOR ALL USING (
    (auth.jwt() ->> 'role'::text) = 'admin'::text OR
    ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = 'admin'::text OR
    ((auth.jwt() -> 'user_metadata'::text) ->> 'role'::text) = 'admin'::text
  );

CREATE POLICY "Admins have full access to orders" ON public.orders
  FOR ALL USING (
    (auth.jwt() ->> 'role'::text) = 'admin'::text OR
    ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = 'admin'::text OR
    ((auth.jwt() -> 'user_metadata'::text) ->> 'role'::text) = 'admin'::text
  );

CREATE POLICY "Admins have full access to royalty transactions" ON public.royalty_transactions
  FOR ALL USING (
    (auth.jwt() ->> 'role'::text) = 'admin'::text OR
    ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = 'admin'::text OR
    ((auth.jwt() -> 'user_metadata'::text) ->> 'role'::text) = 'admin'::text
  );

CREATE POLICY "Admins have full access to coupons" ON public.coupons
  FOR ALL USING (
    (auth.jwt() ->> 'role'::text) = 'admin'::text OR
    ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = 'admin'::text OR
    ((auth.jwt() -> 'user_metadata'::text) ->> 'role'::text) = 'admin'::text
  );

CREATE POLICY "Admins have full access to categories" ON public.categories
  FOR ALL USING (
    (auth.jwt() ->> 'role'::text) = 'admin'::text OR
    ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = 'admin'::text OR
    ((auth.jwt() -> 'user_metadata'::text) ->> 'role'::text) = 'admin'::text
  );

CREATE POLICY "Admins have full access to tags" ON public.authenticity_tags
  FOR ALL USING (
    (auth.jwt() ->> 'role'::text) = 'admin'::text OR
    ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = 'admin'::text OR
    ((auth.jwt() -> 'user_metadata'::text) ->> 'role'::text) = 'admin'::text
  );

CREATE POLICY "Admins have full access to contracts" ON public.license_contracts
  FOR ALL USING (
    (auth.jwt() ->> 'role'::text) = 'admin'::text OR
    ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = 'admin'::text OR
    ((auth.jwt() -> 'user_metadata'::text) ->> 'role'::text) = 'admin'::text
  );

CREATE POLICY "Admins have full access to license holders" ON public.license_holders
  FOR ALL USING (
    (auth.jwt() ->> 'role'::text) = 'admin'::text OR
    ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = 'admin'::text OR
    ((auth.jwt() -> 'user_metadata'::text) ->> 'role'::text) = 'admin'::text
  );

CREATE POLICY "Admins have full access to stock movements" ON public.stock_movements
  FOR ALL USING (
    (auth.jwt() ->> 'role'::text) = 'admin'::text OR
    ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = 'admin'::text OR
    ((auth.jwt() -> 'user_metadata'::text) ->> 'role'::text) = 'admin'::text
  );

CREATE POLICY "Admins have full access to reviews" ON public.reviews
  FOR ALL USING (
    (auth.jwt() ->> 'role'::text) = 'admin'::text OR
    ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = 'admin'::text OR
    ((auth.jwt() -> 'user_metadata'::text) ->> 'role'::text) = 'admin'::text
  );

CREATE POLICY "Admins have full access to product images" ON public.product_images
  FOR ALL USING (
    (auth.jwt() ->> 'role'::text) = 'admin'::text OR
    ((auth.jwt() -> 'app_metadata'::text) ->> 'role'::text) = 'admin'::text OR
    ((auth.jwt() -> 'user_metadata'::text) ->> 'role'::text) = 'admin'::text
  );
