# Desain Database - Sistem Keuangan & RAB (NevBank)

## Informasi Umum

| Item | Keterangan |
|------|------------|
| **Aplikasi** | NevBank - Financial Hub untuk Mahasiswa & Kelompok |
| **Database** | PostgreSQL |
| **ORM** | Prisma |
| **Arsitektur** | Next.js 16 App Router |
| **Autentikasi** | Role-based access control (RBAC) |

---

## Role & Izin Akses

Terdapat 4 role dalam sistem:

| Role | Keterangan |
|------|------------|
| `super_admin` | Akses penuh ke semua modul |
| `bendahara` | Kelola keuangan, RAB, aset (read-only untuk produk & penjualan) |
| `operasional` | Read keuangan & RAB, kelola aset & produk/stok |
| `pemasaran` | Read kecuali data sensitif, akses penuh penjualan |

---

## Daftar Tabel Database

### 1. `users`
Tabel untuk menyimpan data pengguna sistem.

| Field | Tipe | Keterangan |
|-------|------|------------|
| `id` | UUID | Primary Key |
| `name` | VARCHAR(255) | Nama lengkap pengguna |
| `email` | VARCHAR(255) | Email unik pengguna |
| `role` | ENUM(`Role`) | Role: `super_admin`, `bendahara`, `operasional`, `pemasaran` |
| `is_active` | BOOLEAN | Status aktif/tidak (default: true) |
| `created_at` | TIMESTAMP | Waktu pembuatan akun |
| `updated_at` | TIMESTAMP | Waktu update terakhir |

**Relasi:**
- `transactions` (1:N) - Data pribadi, hanya bisa diakses oleh owner
- `audit_logs` (1:N) - Riwayat perubahan yang dilakukan user
- `rab_projects` (1:N) - Sebagai `created_by` dan `updated_by`
- `rab_items` (1:N) - Sebagai `created_by` dan `updated_by`
- `products` (1:N) - Sebagai `created_by` dan `updated_by`
- `stock` (1:N) - Sebagai `created_by` dan `updated_by`
- `sales_transactions` (1:N) - Sebagai `created_by`
- `cash_flow` (1:N) - Sebagai `created_by`
- `assets` (1:N) - Sebagai `created_by` dan `updated_by`

---

### 2. `transactions`
Tabel untuk menyimpan transaksi keuangan **pribadi** milik user. Hanya pemilik yang bisa mengaksesnya (termasuk super_admin).

| Field | Tipe | Keterangan |
|-------|------|------------|
| `id` | UUID | Primary Key |
| `user_id` | UUID | Foreign Key → users.id |
| `name` | VARCHAR(255) | Nama transaksi |
| `type` | ENUM(`TransactionType`) | `pemasukan` atau `pengeluaran` |
| `category` | VARCHAR(100) | Kategori transaksi |
| `quantity` | INTEGER | Jumlah item |
| `price` | DECIMAL(12,2) | Harga per unit |
| `total_amount` | DECIMAL(12,2) | Total nominal transaksi |
| `payment_method` | VARCHAR(50) | Metode pembayaran |
| `date` | DATE | Tanggal transaksi |
| `time` | TIME(6) | Waktu transaksi |
| `notes` | TEXT | Catatan tambahan (opsional) |
| `created_at` | TIMESTAMP | Waktu pencatatan |
| `updated_at` | TIMESTAMP | Waktu update terakhir |

**Indeks:** `(user_id, date)`

---

### 3. `categories`
Tabel master untuk kategori transaksi pribadi.

| Field | Tipe | Keterangan |
|-------|------|------------|
| `id` | UUID | Primary Key |
| `name` | VARCHAR(100) | Nama kategori |
| `emoji` | VARCHAR(10) | Emoji untuk representasi visual |
| `color` | VARCHAR(20) | Warna kategori untuk UI |
| `created_at` | TIMESTAMP | Waktu pembuatan |

---

### 4. `payment_methods`
Tabel master untuk metode pembayaran.

| Field | Tipe | Keterangan |
|-------|------|------------|
| `id` | UUID | Primary Key |
| `name` | VARCHAR(100) | Nama metode pembayaran |
| `type` | VARCHAR(50) | Tipe: `e-wallet`, `bank`, `cash` |
| `is_active` | BOOLEAN | Status aktif/tidak (default: true) |
| `created_at` | TIMESTAMP | Waktu pembuatan |

---

### 5. `rab_projects`
Tabel untuk proyek Rencana Anggaran Biaya (RAB) - **data bisnis kelompok**.

| Field | Tipe | Keterangan |
|-------|------|------------|
| `id` | UUID | Primary Key |
| `project_name` | VARCHAR(255) | Nama proyek/kegiatan |
| `quarter` | VARCHAR(20) | Kuartal (Q1, Q2, Q3, Q4) |
| `year` | INTEGER | Tahun anggaran |
| `total_budget` | DECIMAL(15,2) | Total pagu anggaran |
| `total_realization` | DECIMAL(15,2) | Total realisasi (default: 0) |
| `status` | ENUM(`RabProjectStatus`) | `draft`, `active`, `completed` |
| `created_at` | TIMESTAMP | Waktu pembuatan |
| `updated_at` | TIMESTAMP | Waktu update terakhir |
| `deleted_at` | TIMESTAMP | Soft delete (opsional) |
| `created_by` | UUID | Foreign Key → users.id |
| `updated_by` | UUID | Foreign Key → users.id (opsional) |

**Relasi:**
- `rab_items` (1:N) - Detail pos anggaran dalam RAB
- `created_by` → users (relation: `RabProjectCreatedBy`)
- `updated_by` → users (relation: `RabProjectUpdatedBy`)

**Indeks:** `(year, quarter)`

---

### 6. `rab_items`
Tabel untuk detail pos anggaran dalam RAB - **data bisnis kelompok**.

| Field | Tipe | Keterangan |
|-------|------|------------|
| `id` | UUID | Primary Key |
| `rab_project_id` | UUID | Foreign Key → rab_projects.id |
| `name` | VARCHAR(255) | Nama barang/pos anggaran |
| `category` | VARCHAR(100) | Kategori anggaran |
| `specs` | TEXT | Rincian spesifikasi/sub-item |
| `priority` | ENUM(`RabPriority`) | `on-track`, `high`, `medium`, `low` |
| `quantity` | INTEGER | Jumlah unit |
| `price_per_unit` | DECIMAL(12,2) | Estimasi biaya per unit |
| `total_budget` | DECIMAL(12,2) | Total pagu (quantity × price_per_unit) |
| `realization` | DECIMAL(12,2) | Realisasi pengeluaran (default: 0) |
| `target_progress` | INTEGER | Target progress (0-100%) |
| `current_progress` | INTEGER | Progress aktual (0-100%, default: 0) |
| `status` | ENUM(`RabItemStatus`) | `on-track`, `warning`, `over-budget` |
| `notes` | TEXT | Catatan tambahan |
| `created_at` | TIMESTAMP | Waktu pembuatan |
| `updated_at` | TIMESTAMP | Waktu update terakhir |
| `deleted_at` | TIMESTAMP | Soft delete |
| `created_by` | UUID | Foreign Key → users.id |
| `updated_by` | UUID | Foreign Key → users.id |

**Relasi:**
- `rab_project_id` → rab_projects (Cascade delete)
- `created_by` → users (relation: `RabItemCreatedBy`)
- `updated_by` → users (relation: `RabItemUpdatedBy`)

**Indeks:** `(rab_project_id)`

---

### 7. `products`
Tabel untuk data produk bisnis kelompok.

| Field | Tipe | Keterangan |
|-------|------|------------|
| `id` | UUID | Primary Key |
| `name` | VARCHAR(255) | Nama produk |
| `description` | TEXT | Deskripsi produk |
| `category` | VARCHAR(100) | Kategori produk |
| `price` | DECIMAL(12,2) | Harga jual |
| `cost` | DECIMAL(12,2) | Harga beli/modal (SENSITIF - filter di server) |
| `sku` | VARCHAR(50) | Kode produk unik |
| `created_at` | TIMESTAMP | Waktu pembuatan |
| `updated_at` | TIMESTAMP | Waktu update terakhir |
| `deleted_at` | TIMESTAMP | Soft delete |
| `created_by` | UUID | Foreign Key → users.id |
| `updated_by` | UUID | Foreign Key → users.id |

**Relasi:**
- `stock` (1:N) - Stok produk
- `sales_transactions` (1:N) - Transaksi penjualan
- `created_by` → users (relation: `ProductCreatedBy`)
- `updated_by` → users (relation: `ProductUpdatedBy`)

---

### 8. `stock`
Tabel untuk mengelola stok produk bisnis kelompok.

| Field | Tipe | Keterangan |
|-------|------|------------|
| `id` | UUID | Primary Key |
| `product_id` | UUID | Foreign Key → products.id |
| `quantity` | INTEGER | Jumlah stok saat ini |
| `min_stock` | INTEGER | Stok minimum untuk alert (default: 0) |
| `max_stock` | INTEGER | Stok maksimum (opsional) |
| `last_restock` | TIMESTAMP | Waktu restock terakhir |
| `created_at` | TIMESTAMP | Waktu pembuatan |
| `updated_at` | TIMESTAMP | Waktu update terakhir |
| `deleted_at` | TIMESTAMP | Soft delete |
| `created_by` | UUID | Foreign Key → users.id |
| `updated_by` | UUID | Foreign Key → users.id |

**Relasi:**
- `product_id` → products (Cascade delete)
- `created_by` → users (relation: `StockCreatedBy`)
- `updated_by` → users (relation: `StockUpdatedBy`)

**Indeks:** `(product_id)`

---

### 9. `sales_transactions`
Tabel untuk transaksi penjualan bisnis kelompok.

| Field | Tipe | Keterangan |
|-------|------|------------|
| `id` | UUID | Primary Key |
| `product_id` | UUID | Foreign Key → products.id |
| `quantity` | INTEGER | Jumlah terjual |
| `unit_price` | DECIMAL(12,2) | Harga satuan |
| `total_amount` | DECIMAL(12,2) | Total penjualan |
| `payment_method` | VARCHAR(50) | Metode pembayaran |
| `customer_name` | VARCHAR(255) | Nama pelanggan (opsional) |
| `date` | DATE | Tanggal transaksi |
| `notes` | TEXT | Catatan |
| `created_at` | TIMESTAMP | Waktu pencatatan |
| `deleted_at` | TIMESTAMP | Soft delete |
| `created_by` | UUID | Foreign Key → users.id |

**Relasi:**
- `product_id` → products (relation: `SalesCreatedBy`)
- `created_by` → users (relation: `SalesCreatedBy`)

**Indeks:** `(date)`, `(product_id)`

---

### 10. `cash_flow`
Tabel untuk laporan arus kas bisnis kelompok.

| Field | Tipe | Keterangan |
|-------|------|------------|
| `id` | UUID | Primary Key |
| `type` | ENUM(`CashFlowType`) | `inflow` (masuk) atau `outflow` (keluar) |
| `category` | VARCHAR(100) | Kategori arus kas |
| `amount` | DECIMAL(12,2) | Nominal |
| `description` | TEXT | Keterangan |
| `reference_id` | UUID | Referensi ke data bisnis lain (opsional) |
| `reference_type` | VARCHAR(50) | Tipe referensi (e.g., "sales") |
| `date` | DATE | Tanggal arus kas |
| `created_at` | TIMESTAMP | Waktu pencatatan |
| `deleted_at` | TIMESTAMP | Soft delete |
| `created_by` | UUID | Foreign Key → users.id |

**Relasi:**
- `created_by` → users (relation: `CashFlowCreatedBy`)

**Indeks:** `(date)`

---

### 11. `assets`
Tabel untuk aset bisnis kelompok.

| Field | Tipe | Keterangan |
|-------|------|------------|
| `id` | UUID | Primary Key |
| `name` | VARCHAR(255) | Nama aset |
| `category` | VARCHAR(100) | Kategori aset |
| `purchase_price` | DECIMAL(15,2) | Harga beli |
| `current_value` | DECIMAL(15,2) | Nilai saat ini |
| `purchase_date` | DATE | Tanggal pembelian |
| `depreciation_rate` | DECIMAL(5,2) | Rate depresiasi per tahun (%) |
| `status` | ENUM(`AssetStatus`) | `active`, `sold`, `disposed` |
| `created_at` | TIMESTAMP | Waktu pembuatan |
| `updated_at` | TIMESTAMP | Waktu update terakhir |
| `deleted_at` | TIMESTAMP | Soft delete |
| `created_by` | UUID | Foreign Key → users.id |
| `updated_by` | UUID | Foreign Key → users.id |

**Relasi:**
- `created_by` → users (relation: `AssetCreatedBy`)
- `updated_by` → users (relation: `AssetUpdatedBy`)

---

### 12. `audit_logs`
Tabel untuk mencatat semua perubahan pada data bisnis. Append-only, tidak ada fitur edit/hapus di aplikasi.

| Field | Tipe | Keterangan |
|-------|------|------------|
| `id` | UUID | Primary Key |
| `actor_id` | UUID | Foreign Key → users.id (pelaku aksi) |
| `action` | ENUM(`AuditAction`) | `create`, `update`, `delete` |
| `table_name` | VARCHAR(100) | Nama tabel yang diubah |
| `record_id` | UUID | ID record yang diubah |
| `old_data` | JSON | Data sebelum perubahan |
| `new_data` | JSON | Data setelah perubahan |
| `created_at` | TIMESTAMP | Waktu pencatatan |

**Relasi:**
- `actor_id` → users

**Indeks:** `(table_name, record_id)`, `(actor_id)`, `(created_at)`

**Catatan:** Hanya untuk data bisnis. Jangan catat isi `transactions` (data pribadi). Supaya super_admin tidak bisa membacanya lewat audit log.

---

## Ringkasan Tabel

| No | Nama Tabel | Tipe Data | Relasi Utama | Soft Delete |
|----|------------|-----------|-------------|-------------|
| 1 | `users` | Master/User | - | `is_active` |
| 2 | `transactions` | Pribadi | → users | - |
| 3 | `categories` | Master | - | - |
| 4 | `payment_methods` | Master | - | `is_active` |
| 5 | `rab_projects` | Bisnis | → users, → rab_items | ✅ |
| 6 | `rab_items` | Bisnis | → rab_projects, → users | ✅ |
| 7 | `products` | Bisnis | → users, → stock, → sales | ✅ |
| 8 | `stock` | Bisnis | → products, → users | ✅ |
| 9 | `sales_transactions` | Bisnis | → products, → users | ✅ |
| 10 | `cash_flow` | Bisnis | → users | ✅ |
| 11 | `assets` | Bisnis | → users | ✅ |
| 12 | `audit_logs` | Audit | → users | - |

---

## Skema Role Permissions (Matriks Izin)

| Role | keuangan | rab | aset | produk_stok | penjualan | users |
|------|----------|-----|------|-------------|-----------|-------|
| `super_admin` | CRUD | CRUD | CRUD | CRUD | CRUD | CRUD |
| `bendahara` | CRUD | CRUD | CRUD | Read | Read | - |
| `operasional` | Read | Read | CRUD | CRUD | Read | - |
| `pemasaran` | Read | Read | Read | Read | CRUD | - |

---

## Aturan Keamanan Data

1. **Data Pribadi (`transactions`)**: Milik satu user. Hanya pemilik yang boleh membaca/mengubah, **termasuk super_admin**. Setiap query wajib memakai filter `user_id` dari session.
2. **Data Bisnis**: Akses diatur oleh ROLE melalui `PERMISSIONS` matrix.
3. **Soft Delete**: Tabel bisnis memakai `deleted_at`. Setiap query harus menambahkan `deletedAt: null`.
4. **Audit Logs**: Hanya untuk data bisnis. Tidak boleh mencatat isi `transactions`. Append-only (REVOKE UPDATE/DELETE di database).
5. **Data Sensitif**: Harga modal (`cost`) produk hanya bisa dilihat oleh role selain `pemasaran`. Filter dilakukan di server, bukan hanya di UI.

---

## Daftar API Routes

| Endpoint | Fitur | Layanan Terkait |
|----------|-------|-----------------|
| `/api/keuangan` | Kelola transaksi keuangan pribadi | `keuanganService.ts` |
| `/api/rab` | Kelola RAB & item anggaran | `rabService.ts` |
| `/api/business-kelompok/produk` | Kelola produk & stok | `produkStokService.ts` |
| `/api/business-kelompok/transaksi` | Kelola transaksi penjualan | `transaksiPenjualanService.ts` |
| `/api/business-kelompok/stok` | Kelola keuangan & aset | `keuanganAsetService.ts` |
| `/api/business-kelompok/arus-kas` | Kelola laporan arus kas | `laporanArusKasService.ts` |

---

## Fitur Aplikasi

### Fitur Utama
1. **Kelola Uang Bulanan** - Pencatatan transaksi pemasukan/pengeluaran pribadi
2. **Sistem RAB** - Perencanaan anggaran dengan pos-pos pengeluaran dan progress tracking
3. **Kas Kelompok/Bendahara** - Manajemen keuangan kelompok mahasiswa
4. **Manajemen Produk & Stok** - Data produk, stok, dan perhitungan profit
5. **Transaksi Penjualan** - Pencatatan penjualan dengan referensi produk
6. **Laporan Arus Kas** - Laporan arus kas inflow/outflow bisnis
7. **Manajemen Aset** - Pencatatan aset bisnis dengan depresiasi
8. **User Management** - Administrasi pengguna dan role

### Dashboard Fitur
- Pagu Uang Saku Bulanan
- Pengeluaran Realisasi dengan persentase serapan
- Sisa Saldo & Dana Kunci (UKT, Kost)
- RAB Mahasiswa dengan status per pos
- Tabel transaksi terbaru

---

## Status Implementasi

| Tabel | Schema Prisma | Types TypeScript | API Route | Status |
|-------|--------------|-----------------|-----------|--------|
| `users` | ✅ | ✅ (`src/types/index.ts`) | - | ✅ Complete |
| `transactions` | ✅ | ✅ (`keuangan.types.ts`) | ✅ `/api/keuangan` | ✅ Complete |
| `categories` | ✅ | ⏳ Belum ada types | - | ⏳ Pending |
| `payment_methods` | ✅ | ⏳ Belum ada types | - | ⏳ Pending |
| `rab_projects` | ✅ | ✅ (`rab.types.ts`) | ✅ `/api/rab` | ✅ Complete |
| `rab_items` | ✅ | ✅ (`rab.types.ts`) | ✅ `/api/rab` | ✅ Complete |
| `products` | ✅ | ⏳ Belum ada types | ✅ `/api/business-kelompok/produk` | ⏳ Pending |
| `stock` | ✅ | ⏳ Belum ada types | ✅ `/api/business-kelompok/stok` | ⏳ Pending |
| `sales_transactions` | ✅ | ⏳ Belum ada types | ✅ `/api/business-kelompok/transaksi` | ⏳ Pending |
| `cash_flow` | ✅ | ⏳ Belum ada types | ✅ `/api/business-kelompok/arus-kas` | ⏳ Pending |
| `assets` | ✅ | ⏳ Belum ada types | ✅ `/api/business-kelompok/stok` | ⏳ Pending |
| `audit_logs` | ✅ | ⏳ Belum ada types | - | ⏳ Pending |

---

## Diagram Relasi

```
┌─────────┐
│ users   │
└────┬────┘
     │
     ├─────┬─────┬─────┬─────┬─────┬─────┬─────┐
     │     │     │     │     │     │     │     │
     ▼     ▼     ▼     ▼     ▼     ▼     ▼     ▼
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐ ┌──────────┐ ┌─────────┐ ┌──────────┐ ┌──────────┐
│transactions│ │rab_items │ │products  │ │sales_tx │ │cash_flow │ │assets   │ │audit_logs│ │categories│
└──────────┘ └──────────┘ └──────────┘ └─────────┘ └──────────┘ └─────────┘ └──────────┘ └──────────┘
                                    │
                                    ▼
                            ┌──────────┐ ┌──────────┐ ┌──────────┐
                            │stock     │ │payment_  │ │rab_proj  │
                            └──────────┘ └──────────┘ └──────────┘
```

---

## Catatan Penting

1. **Prisma Schema**: Sudah lengkap di `src/prisma/schema.prisma` dengan semua model, enum, dan relasi
2. **Database URL**: Menggunakan environment variable `DATABASE_URL` (PostgreSQL)
3. **UUID**: Semua tabel menggunakan UUID sebagai primary key
4. **Timestamps**: Semua tabel menggunakan `created_at` dan `updated_at`
5. **Soft Delete**: Tabel bisnis menggunakan `deleted_at` untuk soft delete
6. **Audit Trail**: `audit_logs` bersifat append-only untuk integritas data
7. **Data Pribadi vs Bisnis**: Sangat penting dipisahkan. Data pribadi (transactions) tidak bisa diakses bahkan oleh super_admin
8. **Permissions**: Semua izin diatur secara centralized di `src/lib/permissions.ts`
9. **Enums**: `RabPriority.on-track` dan `RabItemStatus.on-track` menggunakan `@map("on-track")` untuk menyesuaikan dengan database
