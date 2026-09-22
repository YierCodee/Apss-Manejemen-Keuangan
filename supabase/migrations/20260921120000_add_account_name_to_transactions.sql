-- Add account_name column to transactions table
-- This replaces the accountId foreign key approach with a simple string field
ALTER TABLE "transactions"
  ADD COLUMN IF NOT EXISTS "account_name" VARCHAR(100);
