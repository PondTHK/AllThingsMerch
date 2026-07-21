-- =============================================
-- AllThingsMerch: Add Missing Columns
-- Run this in Supabase > SQL Editor
-- =============================================

-- Add payment_method to orders
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS payment_method TEXT NOT NULL DEFAULT 'unknown';

-- Add usage_count to coupons
ALTER TABLE public.coupons
ADD COLUMN IF NOT EXISTS usage_count INTEGER NOT NULL DEFAULT 0 CHECK (usage_count >= 0);
