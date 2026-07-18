-- =============================================
-- AllThingsMerch: Coupons Table
-- Run this in Supabase > SQL Editor
-- =============================================

CREATE TABLE IF NOT EXISTS public.coupons (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code            TEXT UNIQUE NOT NULL,
  discount_type   TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_amount NUMERIC(10, 2) NOT NULL CHECK (discount_amount > 0),
  is_active       BOOLEAN NOT NULL DEFAULT true,
  expires_at      DATE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create helper function if it doesn't exist yet
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

-- RLS: Only admins can manage coupons, anyone can read active ones
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Admin full access
CREATE POLICY "Admins can manage coupons"
ON public.coupons
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  )
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
