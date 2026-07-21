-- Add payment_method column to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method TEXT;

-- Notify PostgREST to reload the schema cache so the new column is immediately accessible via API
NOTIFY pgrst, 'reload schema';
