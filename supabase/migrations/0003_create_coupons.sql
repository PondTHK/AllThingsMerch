-- =============================================
-- AllThingsMerch: Coupons Table Setup
-- Run this in Supabase > SQL Editor
-- =============================================

-- Drop the old incorrect table if it was created by mistake
DROP TABLE IF EXISTS public.coupons CASCADE;

-- Create the correct table matching the real schema
CREATE TABLE public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_type discount_type NOT NULL DEFAULT 'fixed',
  discount_value NUMERIC(12,2) NOT NULL CHECK (discount_value >= 0),
  minimum_order_amount NUMERIC(12,2),
  usage_limit INTEGER,
  starts_at TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create helper function (safe to run multiple times)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Auto-update updated_at on row changes
CREATE OR REPLACE TRIGGER update_coupons_updated_at
BEFORE UPDATE ON public.coupons
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS is already enabled by 0002_rls_policies.sql
-- Just add the missing admin write policy for coupons

-- Drop existing policies first (idempotent)
DROP POLICY IF EXISTS "Admins have full access to coupons" ON public.coupons;
DROP POLICY IF EXISTS "Admins can manage coupons" ON public.coupons;

CREATE POLICY "Admins have full access to coupons"
ON public.coupons
FOR ALL
USING (
  (auth.jwt() ->> 'role') = 'admin'
  OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

DROP POLICY IF EXISTS "Anyone can view active coupons" ON public.coupons;

CREATE POLICY "Anyone can view active coupons"
ON public.coupons
FOR SELECT
USING (is_active = true);

-- Seed with a sample coupon
INSERT INTO public.coupons (code, discount_type, discount_value, minimum_order_amount, starts_at, expires_at, is_active)
VALUES ('WELCOME10', 'percentage', 10, 0, now(), now() + interval '1 year', true)
ON CONFLICT (code) DO NOTHING;

