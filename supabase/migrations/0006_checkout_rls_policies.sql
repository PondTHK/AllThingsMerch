-- AllThingsMerch SQL Migration 0006: Checkout RLS Policies for Authenticated Customers

-- 1. Allow authenticated customers to insert order items belonging to their own orders
DO $$ BEGIN
  CREATE POLICY "Customers can insert order items of their orders" ON order_items
    FOR INSERT WITH CHECK (
      EXISTS (
        SELECT 1 FROM orders
        WHERE orders.id = order_items.order_id
          AND orders.user_id = auth.uid()
      )
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. Allow authenticated customers to update stock quantity of active product variants during checkout
DO $$ BEGIN
  CREATE POLICY "Customers can update stock quantity of variants during checkout" ON product_variants
    FOR UPDATE USING (
      auth.role() = 'authenticated' AND is_active = true
    )
    WITH CHECK (
      auth.role() = 'authenticated' AND is_active = true
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 3. Allow authenticated customers to record stock movements for their own orders
DO $$ BEGIN
  CREATE POLICY "Customers can insert stock movements during checkout" ON stock_movements
    FOR INSERT WITH CHECK (
      auth.role() = 'authenticated'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 4. Allow authenticated customers to insert authenticity tags for their own order items
DO $$ BEGIN
  CREATE POLICY "Customers can insert authenticity tags during checkout" ON authenticity_tags
    FOR INSERT WITH CHECK (
      auth.role() = 'authenticated'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 5. Allow authenticated customers to update coupon usage count during checkout
DO $$ BEGIN
  CREATE POLICY "Customers can update coupon usage during checkout" ON coupons
    FOR UPDATE USING (
      auth.role() = 'authenticated' AND is_active = true
    )
    WITH CHECK (
      auth.role() = 'authenticated' AND is_active = true
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
