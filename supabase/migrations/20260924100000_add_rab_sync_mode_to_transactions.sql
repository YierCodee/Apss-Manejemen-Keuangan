-- =============================================================================
-- Add RabSyncMode enum + rab_sync_mode column to transactions
-- Controls whether a pengeluaran transaction is synced to RAB realization
--
-- Values:
--   'auto'   — match by category + name contains (otomatis)
--   'manual' — direct link to specific RabItem
--   'none'   — di luar RAB, tidak di-sync (DEFAULT)
-- =============================================================================

CREATE TYPE "RabSyncMode" AS ENUM ('auto', 'manual', 'none');

ALTER TABLE "transactions"
ADD COLUMN "rab_sync_mode" "RabSyncMode" NOT NULL DEFAULT 'none';
