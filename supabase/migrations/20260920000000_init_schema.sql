-- =============================================================================
-- Initial Schema - Sistem Keuangan & RAB (NevBank)
-- Generated from src/prisma/schema.prisma
-- Lokasi: supabase/migrations/20260920000000_init_schema.sql
--
-- Cara pakai:
--   1. Supabase Dashboard → SQL Editor → paste isi file ini → Run
--   2. Atau pakai Prisma Migrate: npx prisma migrate dev --schema src/prisma/schema.prisma
-- =============================================================================

-- ENUM types
CREATE TYPE "Role" AS ENUM ('super_admin', 'bendahara', 'operasional', 'pemasaran');
CREATE TYPE "TransactionType" AS ENUM ('pemasukan', 'pengeluaran');
CREATE TYPE "RabProjectStatus" AS ENUM ('draft', 'active', 'completed');
CREATE TYPE "RabPriority" AS ENUM ('on-track', 'high', 'medium', 'low');
CREATE TYPE "RabItemStatus" AS ENUM ('on-track', 'warning', 'over-budget');
CREATE TYPE "CashFlowType" AS ENUM ('inflow', 'outflow');
CREATE TYPE "AssetStatus" AS ENUM ('active', 'sold', 'disposed');
CREATE TYPE "AuditAction" AS ENUM ('create', 'update', 'delete');

--- USERS ---
CREATE TABLE "users" (
    "id"         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name"       VARCHAR(255) NOT NULL,
    "email"      VARCHAR(255) NOT NULL UNIQUE,
    "role"       "Role" NOT NULL,
    "is_active"  BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- TRANSACTIONS Keuangan Pribadi (Data Pribadi - hanya pemilik yang bisa akses) -- 
CREATE TABLE "transactions" (
    "id"             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id"        UUID NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "name"           VARCHAR(255) NOT NULL,
    "type"           "TransactionType" NOT NULL, -- Jenis (pemasukan / pengeluaran uang)
    "category"       UUID REFERENCES "categories"("id" ON DELETE SET NULL), -- pakai data master -- 
    "quantity"       INTEGER NOT NULL,
    "price"          DECIMAL(12,2) NOT NULL, 
    "total_amount"   DECIMAL(12,2) NOT NULL, -- total pembayaran --
    "payment_method" VARCHAR(50) NOT NULL, -- metode pembayaran --
    "date"           DATE NOT NULL,
    "time"           TIME(6) NOT NULL,
    "created_at"     TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at"     TIMESTAMPTZ NOT NULL DEFAULT now()

    --- CHECK CONSTRAINT ---
    CONSTRAINT "quantity_positif" CHECK ("quantity" > 0)
    CONSTRAINT "quantity_price" CHECK ("price" > 0)
    --- Logic untuk memastikan bahwa total = price * quantity ---
    CONSTRAINT "total_amount" CHECK ("total_amount" = ("quantity" * "price"))
);
--- logic untuk efisiensi query pencarian di dalam tabel --- 
CREATE INDEX "idx_transactions_user_date" ON "transactions"("user_id", "date");

-- MASTER DATA KHUSUS DATA PRIBADI (akan digunakan di semua tabel yang berhubungan dengan kategori dan metode pembayaran) ----
CREATE TABLE "categories" (
    "id"         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name"       VARCHAR(50) NOT NULL,
    "emoji"      VARCHAR(10),
    "color"      VARCHAR(20),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE "payment_methods" (
    "id"         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name"       VARCHAR(100) NOT NULL,
    "type"       VARCHAR(50) NOT NULL,
    "is_active"  BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);
 
---- RAB ITEMS ----
CREATE TABLE "rab_items" (
    "id"               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "rab_project_id"   UUID NOT NULL REFERENCES "rab_projects"("id") ON DELETE CASCADE,
    "name"             VARCHAR(255) NOT NULL,
    "category"         UUID REFERENCES "categories"("id" ON DELETE SET NULL), -- pakai data master -- 
    "priority"         "RabPriority" NOT NULL,
    "quantity"         INTEGER NOT NULL,
    "price_per_unit"   DECIMAL(12,2) NOT NULL,
    "total_budget"     DECIMAL(12,2) NOT NULL,
    "realization"      DECIMAL(12,2) NOT NULL DEFAULT 0,
    "target_progress"  INTEGER NOT NULL DEFAULT 0,
    "created_at"       TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at"       TIMESTAMPTZ NOT NULL DEFAULT now(),
    "deleted_at"       TIMESTAMPTZ,
);

CREATE INDEX "idx_rab_items_project" ON "rab_items"("rab_project_id");

-- ==============================================================--
                -- (Data Bisnis Kelompok) --    
-- ==============================================================--
--- RAB PROJECTS (Data Bisnis Kelompok) --
CREATE TABLE "rab_projects" (
    "id"                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "project_name"      VARCHAR(255) NOT NULL,
    "quarter"           VARCHAR(20) NOT NULL,
    "year"              INTEGER NOT NULL,
    "total_budget"      DECIMAL(15,2) NOT NULL,
    "total_realization" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "status"            "RabProjectStatus" NOT NULL DEFAULT 'draft',
    "created_at"        TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at"        TIMESTAMPTZ NOT NULL DEFAULT now(),
    "deleted_at"        TIMESTAMPTZ,
    "created_by"        UUID NOT NULL REFERENCES "users"("id"),
    "updated_by"        UUID REFERENCES "users"("id")
);

CREATE INDEX "idx_rab_projects_year_quarter" ON "rab_projects"("year", "quarter");


-- PRODUCTS --
CREATE TABLE "products" (
    "id"          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name"        VARCHAR(255) NOT NULL,
    "description" TEXT,
    "category"    VARCHAR(100) NOT NULL,
    "price"       DECIMAL(12,2) NOT NULL,
    "cost"        DECIMAL(12,2) NOT NULL,
    "sku"         VARCHAR(50) NOT NULL UNIQUE,
    "created_at"  TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at"  TIMESTAMPTZ NOT NULL DEFAULT now(),
    "deleted_at"  TIMESTAMPTZ,
    "created_by"  UUID NOT NULL REFERENCES "users"("id"),
    "updated_by"  UUID REFERENCES "users"("id")
);

-- =============================================================================
-- STOCK
-- =============================================================================
CREATE TABLE "stock" (
    "id"           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "product_id"   UUID NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
    "quantity"     INTEGER NOT NULL,
    "min_stock"    INTEGER NOT NULL DEFAULT 0,
    "max_stock"    INTEGER,
    "last_restock" TIMESTAMPTZ,
    "created_at"   TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at"   TIMESTAMPTZ NOT NULL DEFAULT now(),
    "deleted_at"   TIMESTAMPTZ,
    "created_by"   UUID NOT NULL REFERENCES "users"("id"),
    "updated_by"   UUID REFERENCES "users"("id")
);

CREATE INDEX "idx_stock_product" ON "stock"("product_id");

-- =============================================================================
-- SALES TRANSACTIONS
-- =============================================================================
CREATE TABLE "sales_transactions" (
    "id"             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "product_id"     UUID NOT NULL REFERENCES "products"("id"),
    "quantity"       INTEGER NOT NULL,
    "unit_price"     DECIMAL(12,2) NOT NULL,
    "total_amount"   DECIMAL(12,2) NOT NULL,
    "payment_method" VARCHAR(50) NOT NULL,
    "customer_name"  VARCHAR(255),
    "date"           DATE NOT NULL,
    "notes"          TEXT,
    "created_at"     TIMESTAMPTZ NOT NULL DEFAULT now(),
    "deleted_at"     TIMESTAMPTZ,
    "created_by"     UUID NOT NULL REFERENCES "users"("id")
);

CREATE INDEX "idx_sales_date" ON "sales_transactions"("date");
CREATE INDEX "idx_sales_product" ON "sales_transactions"("product_id");

-- =============================================================================
-- CASH FLOW
-- =============================================================================
CREATE TABLE "cash_flow" (
    "id"             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "type"           "CashFlowType" NOT NULL,
    "category"       VARCHAR(100) NOT NULL,
    "amount"         DECIMAL(12,2) NOT NULL,
    "description"    TEXT,
    "reference_id"   UUID,
    "reference_type" VARCHAR(50),
    "date"           DATE NOT NULL,
    "created_at"     TIMESTAMPTZ NOT NULL DEFAULT now(),
    "deleted_at"     TIMESTAMPTZ,
    "created_by"     UUID NOT NULL REFERENCES "users"("id")
);

CREATE INDEX "idx_cash_flow_date" ON "cash_flow"("date");

-- =============================================================================
-- ASSETS
-- =============================================================================
CREATE TABLE "assets" (
    "id"                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name"              VARCHAR(255) NOT NULL,
    "category"          VARCHAR(100) NOT NULL,
    "purchase_price"    DECIMAL(15,2) NOT NULL,
    "current_value"     DECIMAL(15,2) NOT NULL,
    "purchase_date"     DATE NOT NULL,
    "depreciation_rate" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "status"            "AssetStatus" NOT NULL DEFAULT 'active',
    "created_at"        TIMESTAMPTZ NOT NULL DEFAULT now(),
    "updated_at"        TIMESTAMPTZ NOT NULL DEFAULT now(),
    "deleted_at"        TIMESTAMPTZ,
    "created_by"        UUID NOT NULL REFERENCES "users"("id"),
    "updated_by"        UUID REFERENCES "users"("id")
);

-- =============================================================================
-- AUDIT LOGS (append-only, hanya untuk data bisnis)
-- =============================================================================
CREATE TABLE "audit_logs" (
    "id"         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "actor_id"   UUID NOT NULL REFERENCES "users"("id"),
    "action"     "AuditAction" NOT NULL,
    "table_name" VARCHAR(100) NOT NULL,
    "record_id"  UUID NOT NULL,
    "old_data"   JSONB,
    "new_data"   JSONB,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX "idx_audit_logs_table_record" ON "audit_logs"("table_name", "record_id");
CREATE INDEX "idx_audit_logs_actor" ON "audit_logs"("actor_id");
CREATE INDEX "idx_audit_logs_created" ON "audit_logs"("created_at");

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================
-- Aktifkan RLS untuk semua tabel
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "transactions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "categories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "payment_methods" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "rab_projects" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "rab_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "products" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "stock" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "sales_transactions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "cash_flow" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "assets" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "audit_logs" ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- FUNCTIONS (trigger updated_at otomatis)
-- =============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON "users"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON "transactions"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rab_projects_updated_at BEFORE UPDATE ON "rab_projects"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rab_items_updated_at BEFORE UPDATE ON "rab_items"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON "products"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stock_updated_at BEFORE UPDATE ON "stock"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON "assets"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
