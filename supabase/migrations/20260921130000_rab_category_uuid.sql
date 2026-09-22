-- =============================================================================
-- Migrasi rab_items.category dari free-text → UUID FK ke categories
--
-- Logic:
-- 1. Insert kategori yang belum ada di table categories
-- 2. Update rab_items.category dari free-text → categories.id (UUID)
-- =============================================================================

-- Insert kategori baru yang belum ada di master categories
-- (hanya untuk kategori RAB yang belum tersedia)
INSERT INTO "categories" ("name", "emoji", "color", "bg_color", "type")
SELECT v.name, v.emoji, v.color, v.bg_color, 'PENGELUARAN'
FROM (VALUES
  ('Biaya Hidup', '🏠', '#06b6d4', '#ecfeff'),
  ('Operasional', '⚙️', '#6366f1', '#eef2ff'),
  ('Praktikum', '🔬', '#14b8a6', '#f0fdfa')
) AS v(name, emoji, color, bg_color)
WHERE NOT EXISTS (
  SELECT 1 FROM "categories" c WHERE c."name" = v.name
);

-- Map free-text values ke categories.id
-- "kuliah" → "Kuliah" (case-insensitive match)
UPDATE "rab_items" r
SET "category" = c."id"
FROM "categories" c
WHERE LOWER(r."category"::text) = LOWER(c."name")
  AND r."category" IS NOT NULL;

-- Handle nilai free-text yang tidak cocok otomatis:
-- Insert sebagai kategori baru lalu update
DO $$
DECLARE
  rec RECORD;
  new_cat_id UUID;
BEGIN
  FOR rec IN
    SELECT DISTINCT r."category" AS free_text
    FROM "rab_items" r
    WHERE r."category" IS NOT NULL
      AND NOT EXISTS (
        SELECT 1 FROM "categories" c WHERE c."id"::text = r."category"
      )
  LOOP
    -- Buat kategori baru dari free-text
    INSERT INTO "categories" ("name", "emoji", "color", "bg_color", "type")
    VALUES (
      INITCAP(REPLACE(rec.free_text, '-', ' ')),
      '📦',
      '#94a3b8',
      '#f1f5f9',
      'PENGELUARAN'
    )
    RETURNING "id" INTO new_cat_id;

    -- Update rab_items yang punya free-text ini
    UPDATE "rab_items"
    SET "category" = new_cat_id
    WHERE "category" = rec.free_text;
  END LOOP;
END $$;
