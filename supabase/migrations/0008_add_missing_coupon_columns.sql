-- Add missing columns to coupons table (safe - does not drop existing data)
-- Columns being added: description, max_global_uses, current_global_uses, max_uses_per_user
-- Also adds aliases for existing columns: min_order_value (= minimum_order_amount)

-- 1. description
ALTER TABLE public.coupons
  ADD COLUMN IF NOT EXISTS description TEXT;

-- 2. max_global_uses (replaces usage_limit concept but keeps usage_limit for backward compat)
ALTER TABLE public.coupons
  ADD COLUMN IF NOT EXISTS max_global_uses INTEGER CHECK (max_global_uses >= 0);

-- 3. current_global_uses (replaces usage_count concept)
ALTER TABLE public.coupons
  ADD COLUMN IF NOT EXISTS current_global_uses INTEGER NOT NULL DEFAULT 0 CHECK (current_global_uses >= 0);

-- 4. max_uses_per_user
ALTER TABLE public.coupons
  ADD COLUMN IF NOT EXISTS max_uses_per_user INTEGER CHECK (max_uses_per_user >= 0);

-- 5. min_order_value (alias-style: populate from minimum_order_amount if exists, else add fresh)
ALTER TABLE public.coupons
  ADD COLUMN IF NOT EXISTS min_order_value NUMERIC(12,2) CHECK (min_order_value >= 0);

-- Backfill min_order_value from minimum_order_amount
UPDATE public.coupons
  SET min_order_value = minimum_order_amount
  WHERE min_order_value IS NULL AND minimum_order_amount IS NOT NULL;

-- Backfill max_global_uses from usage_limit
UPDATE public.coupons
  SET max_global_uses = usage_limit
  WHERE max_global_uses IS NULL AND usage_limit IS NOT NULL;

-- Make expires_at nullable (old schema had NOT NULL)
ALTER TABLE public.coupons
  ALTER COLUMN expires_at DROP NOT NULL;

-- Make starts_at nullable (no longer needed)
ALTER TABLE public.coupons
  ALTER COLUMN starts_at DROP NOT NULL;
