-- AllThingsMerch SQL Migration 0007: Real-time Coupon Limits & Per-User Tracking

-- 1. Add usage_count column if it doesn't exist
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS usage_count INTEGER NOT NULL DEFAULT 0 CHECK (usage_count >= 0);

-- 2. Add max_uses_per_user column if it doesn't exist (e.g. 1 means 1 time per user)
ALTER TABLE coupons ADD COLUMN IF NOT EXISTS max_uses_per_user INTEGER CHECK (max_uses_per_user >= 0);

-- 3. Create or replace RPC function for safe atomic coupon usage increment
CREATE OR REPLACE FUNCTION increment_coupon_usage(p_coupon_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE coupons
  SET usage_count = usage_count + 1,
      updated_at = now()
  WHERE id = p_coupon_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
