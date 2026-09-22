-- =============================================================================
-- Sync database with Prisma schema — add missing columns
-- The initial migration (20260920000000) missed several columns that Prisma expects.
-- =============================================================================

-- Categories: tambah kolom yang ada di Prisma schema tapi tidak di migration awal
ALTER TABLE "categories"
  ADD COLUMN IF NOT EXISTS "bg_color"  VARCHAR(20),
  ADD COLUMN IF NOT EXISTS "type"      VARCHAR(20) NOT NULL DEFAULT 'PENGELUARAN',
  ADD COLUMN IF NOT EXISTS "is_active" BOOLEAN    NOT NULL DEFAULT true;

-- Rab Items: tambah specs & notes
ALTER TABLE "rab_items"
  ADD COLUMN IF NOT EXISTS "specs" TEXT,
  ADD COLUMN IF NOT EXISTS "notes" TEXT;
