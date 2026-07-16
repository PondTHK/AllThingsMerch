-- Drop the foreign key first so we can safely drop/recreate the coupons table
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_coupon_id_fkey;

-- Drop table coupons
DROP TABLE IF EXISTS coupons CASCADE;

-- Recreate table coupons with the requested features (max global uses, current uses, max uses per user, description, min order value)
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  discount_type discount_type NOT NULL DEFAULT 'fixed',
  discount_value NUMERIC(12,2) NOT NULL CHECK (discount_value >= 0),
  min_order_value NUMERIC(12,2) CHECK (min_order_value >= 0),
  max_global_uses INTEGER CHECK (max_global_uses >= 0),
  current_global_uses INTEGER NOT NULL DEFAULT 0 CHECK (current_global_uses >= 0),
  max_uses_per_user INTEGER CHECK (max_uses_per_user >= 0),
  is_active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Reconnect the foreign key on orders
ALTER TABLE orders ADD CONSTRAINT orders_coupon_id_fkey FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE SET NULL;

-- Enable Row Level Security (RLS)
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- 1. Public Select: Customers need to read coupons to verify them at checkout
CREATE POLICY "Allow public read on coupons" ON coupons
  FOR SELECT USING (true);

-- 2. Admin All: Curators need full CRUD control
CREATE POLICY "Admins have full access to coupons" ON coupons
  FOR ALL USING (
    (auth.jwt() ->> 'role') = 'admin' OR 
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
