-- =============================================================================
-- Add rab_item_id to transactions for direct RAB linking
-- Prioritas: rab_item_id (manual) > category (auto)
-- =============================================================================

ALTER TABLE "transactions"
ADD COLUMN "rab_item_id" UUID REFERENCES "rab_items"("id") ON DELETE SET NULL;

CREATE INDEX "idx_transactions_rab_item" ON "transactions"("rab_item_id");
