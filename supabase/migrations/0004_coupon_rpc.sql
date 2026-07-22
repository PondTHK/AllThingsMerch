-- Create a secure RPC function to increment coupon usage without bypassing RLS for everything
-- SECURITY DEFINER means this function executes with the privileges of the user who created it (usually superuser/postgres)
-- This allows customers to increment the usage count without needing direct UPDATE access to the coupons table.

CREATE OR REPLACE FUNCTION increment_coupon_usage(p_coupon_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE coupons
  SET current_global_uses = current_global_uses + 1
  WHERE id = p_coupon_id;
END;
$$;
