-- =============================================
-- AllThingsMerch: Coupons Table Setup
-- NOTE: The coupons table already exists from 0001_initial_schema.sql
-- This migration adds the trigger and correct RLS policies.
-- Run this in Supabase > SQL Editor
-- =============================================

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

CREATE POLICY "Admins have full access to coupons"
ON public.coupons
FOR ALL
USING (
  (auth.jwt() ->> 'role') = 'admin'
  OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

-- Public can read active coupons (to validate codes at checkout)
CREATE POLICY "Anyone can view active coupons"
ON public.coupons
FOR SELECT
USING (is_active = true);

-- Seed with a sample coupon
INSERT INTO public.coupons (code, discount_type, discount_amount, is_active)
VALUES ('WELCOME10', 'percentage', 10, true)
ON CONFLICT (code) DO NOTHING;

