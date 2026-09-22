# Database Schema - Sistem Keuangan & RAB

## Overview

Aplikasi ini menggunakan **PostgreSQL** dengan **Prisma ORM** untuk mengelola data keuangan pribadi dan bisnis kelompok.

---

## Tabel-tabel Database

### 1. `users`

Tabel untuk menyimpan data pengguna sistem.

| Field | Tipe | Keterangan |
|-------|------|------------|
| `id` | UUID | Primary Key |
| `name` | VARCHAR(255) | Nama lengkap pengguna |
| `email` | VARCHAR(255) | Email unik pengguna |
| `role` | ENUM | Role pengguna: `admin` atau `user` |
| `created_at` | TIMESTAMP | Waktu pembuatan akun |
| `updated_at` | TIMESTAMP | Waktu update terakhir |

---

### 2. `transactions`

Tabel untuk menyimpan semua transaksi keuangan (pemasukan & pengeluaran).

| Field | Tipe | Keterangan |
|-------|------|------------|
| `id` | UUID | Primary Key |
| `user_id` | UUID | Foreign Key → users.id |
| `name` | VARCHAR(255) | Nama transaksi (contoh: "Ayam Geprek") |
| `type` | ENUM | Jenis transaksi: `pemasukan` atau `pengeluaran` |
| `category` | VARCHAR(100) | Kategori transaksi (Transportasi, Makanan, dll) |
| `quantity` | INTEGER | Jumlah item |
| `price` | DECIMAL(12,2) | Harga per unit dalam Rupiah |
| `total_amount` | DECIMAL(12,2) | Total nominal transaksi |
| `payment_method` | VARCHAR(50) | Metode pembayaran (Gopay, NevBank, Transfer) |
| `date` | DATE | Tanggal transaksi |
| `time` | TIME | Waktu transaksi |
| `notes` | TEXT | Catatan tambahan (opsional) |
| `created_at` | TIMESTAMP | Waktu pencatatan |
| `updated_at` | TIMESTAMP | Waktu update terakhir |

---

### 3. `categories`

Tabel master untuk kategori transaksi.

| Field | Tipe | Keterangan |
|-------|------|------------|
| `id` | UUID | Primary Key |
| `name` | VARCHAR(100) | Nama kategori |
| `emoji` | VARCHAR(10) | Emoji untuk representasi visual |
| `color` | VARCHAR(20) | Warna kategori untuk UI |
| `created_at` | TIMESTAMP | Waktu pembuatan |

**Contoh data:**
- Transportasi 🚗
- Makanan 🍽️
- Layanan 📱
- Liburan ✈️
- Kuliah 📚
- Kesehatan 💊
- Tagihan 💰

---

### 4. `payment_methods`

Tabel master untuk metode pembayaran.

| Field | Tipe | Keterangan |
|-------|------|------------|
| `id` | UUID | Primary Key |
| `name` | VARCHAR(100) | Nama metode pembayaran |
| `type` | VARCHAR(50) | Tipe (e-wallet, bank, cash) |
| `is_active` | BOOLEAN | Status aktif/tidak |
| `created_at` | TIMESTAMP | Waktu pembuatan |

**Contoh data:**
- Gopay (E-wallet)
- NevBank (Bank Digital)
- Transfer Bank

---

### 5. `rab_projects`

Tabel untuk proyek Rencana Anggaran Biaya (RAB).

| Field | Tipe | Keterangan |
|-------|------|------------|
| `id` | UUID | Primary Key |
| `user_id` | UUID | Foreign Key → users.id |
| `project_name` | VARCHAR(255) | Nama proyek/kegiatan |
| `quarter` | VARCHAR(20) | Kuartal (Q1, Q2, Q3, Q4) |
| `year` | INTEGER | Tahun anggaran |
| `total_budget` | DECIMAL(15,2) | Total pagu anggaran |
| `total_realization` | DECIMAL(15,2) | Total realisasi |
| `status` | ENUM | Status: `draft`, `active`, `completed` |
| `created_at` | TIMESTAMP | Waktu pembuatan |
| `updated_at` | TIMESTAMP | Waktu update terakhir |

---

### 6. `rab_items`

Tabel untuk detail pos anggaran dalam RAB.

| Field | Tipe | Keterangan |
|-------|------|------------|
| `id` | UUID | Primary Key |
| `rab_project_id` | UUID | Foreign Key → rab_projects.id |
| `name` | VARCHAR(255) | Nama barang/pos anggaran |
| `category` | VARCHAR(100) | Kategori anggaran |
| `specs` | TEXT | Rincian spesifikasi/sub-item |
| `priority` | ENUM | Prioritas: `on-track`, `high`, `medium`, `low` |
| `quantity` | INTEGER | Jumlah unit |
| `price_per_unit` | DECIMAL(12,2) | Estimasi biaya per unit |
| `total_budget` | DECIMAL(12,2) | Total pagu (quantity × price_per_unit) |
| `realization` | DECIMAL(12,2) | Realisasi pengeluaran |
| `target_progress` | INTEGER | Target progress (0-100%) |
| `current_progress` | INTEGER | Progress aktual (0-100%) |
| `status` | ENUM | Status: `on-track`, `warning`, `over-budget` |
| `notes` | TEXT | Catatan tambahan |
| `created_at` | TIMESTAMP | Waktu pembuatan |
| `updated_at` | TIMESTAMP | Waktu update terakhir |

---

### 7. `products`

Tabel untuk data produk bisnis kelompok.

| Field | Tipe | Keterangan |
|-------|------|------------|
| `id` | UUID | Primary Key |
| `user_id` | UUID | Foreign Key → users.id |
| `name` | VARCHAR(255) | Nama produk |
| `description` | TEXT | Deskripsi produk |
| `category` | VARCHAR(100) | Kategori produk |
| `price` | DECIMAL(12,2) | Harga jual |
| `cost` | DECIMAL(12,2) | Harga beli/modal |
| `sku` | VARCHAR(50) | Kode produk unik |
| `created_at` | TIMESTAMP | Waktu pembuatan |
| `updated_at` | TIMESTAMP | Waktu update terakhir |

---

### 8. `stock`

Tabel untuk mengelola stok produk.

| Field | Tipe | Keterangan |
|-------|------|------------|
| `id` | UUID | Primary Key |
| `product_id` | UUID | Foreign Key → products.id |
| `quantity` | INTEGER | Jumlah stok saat ini |
| `min_stock` | INTEGER | Stok minimum (untuk alert) |
| `max_stock` | INTEGER | Stok maksimum |
| `last_restock` | TIMESTAMP | Waktu restock terakhir |
| `created_at` | TIMESTAMP | Waktu pembuatan |
| `updated_at` | TIMESTAMP | Waktu update terakhir |

---

### 9. `sales_transactions`

Tabel untuk transaksi penjualan bisnis kelompok.

| Field | Tipe | Keterangan |
|-------|------|------------|
| `id` | UUID | Primary Key |
| `user_id` | UUID | Foreign Key → users.id |
| `product_id` | UUID | Foreign Key → products.id |
| `quantity` | INTEGER | Jumlah terjual |
| `unit_price` | DECIMAL(12,2) | Harga satuan |
| `total_amount` | DECIMAL(12,2) | Total penjualan |
| `payment_method` | VARCHAR(50) | Metode pembayaran |
| `customer_name` | VARCHAR(255) | Nama pelanggan (opsional) |
| `date` | DATE | Tanggal transaksi |
| `notes` | TEXT | Catatan |
| `created_at` | TIMESTAMP | Waktu pencatatan |

---

### 10. `cash_flow`

Tabel untuk laporan arus kas bisnis kelompok.

| Field | Tipe | Keterangan |
|-------|------|------------|
| `id` | UUID | Primary Key |
| `user_id` | UUID | Foreign Key → users.id |
| `type` | ENUM | Jenis: `inflow` (masuk) atau `outflow` (keluar) |
| `category` | VARCHAR(100) | Kategori arus kas |
| `amount` | DECIMAL(12,2) | Nominal |
| `description` | TEXT | Keterangan |
| `reference_id` | UUID | Foreign Key ke tabel terkait (opsional) |
| `reference_type` | VARCHAR(50) | Tipe referensi (transaction/sales) |
| `date` | DATE | Tanggal arus kas |
| `created_at` | TIMESTAMP | Waktu pencatatan |

---

### 11. `assets`

Tabel untuk aset bisnis kelompok.

| Field | Tipe | Keterangan |
|-------|------|------------|
| `id` | UUID | Primary Key |
| `user_id` | UUID | Foreign Key → users.id |
| `name` | VARCHAR(255) | Nama aset |
| `category` | VARCHAR(100) | Kategori aset |
| `purchase_price` | DECIMAL(15,2) | Harga beli |
| `current_value` | DECIMAL(15,2) | Nilai saat ini |
| `purchase_date` | DATE | Tanggal pembelian |
| `depreciation_rate` | DECIMAL(5,2) | Rate depresiasi per tahun (%) |
| `status` | ENUM | Status: `active`, `sold`, `disposed` |
| `created_at` | TIMESTAMP | Waktu pembuatan |
| `updated_at` | TIMESTAMP | Waktu update terakhir |

---

## Relasi Antar Tabel

```
users (1) ──── (many) transactions
users (1) ──── (many) rab_projects
users (1) ──── (many) products
users (1) ──── (many) sales_transactions
users (1) ──── (many) cash_flow
users (1) ──── (many) assets

rab_projects (1) ──── (many) rab_items

products (1) ──── (many) stock
products (1) ──── (many) sales_transactions
```

---

## Catatan Implementasi

1. **Prisma Schema**: Saat ini masih placeholder di `src/prisma/schema.prisma`
2. **Database URL**: Menggunakan environment variable `DATABASE_URL`
3. **Timestamps**: Semua tabel menggunakan `created_at` dan `updated_at`
4. **UUID**: Menggunakan UUID sebagai primary key untuk semua tabel
5. **Soft Delete**: Belum diimplementasikan, bisa ditambahkan jika diperlukan

---

## Status Implementasi

| Tabel | Status | Lokasi Kode |
|-------|--------|-------------|
| users | ✅ Types defined | `src/types/index.ts` |
| transactions | ✅ Types defined | `src/features/keuangan/types/keuangan.types.ts` |
| categories | ⏳ Belum ada types | - |
| payment_methods | ⏳ Belum ada types | - |
| rab_projects | ✅ Types defined | `src/features/rab/types/rab.types.ts` |
| rab_items | ✅ Types defined | `src/features/rab/types/rab.types.ts` |
| products | ⏳ Belum ada types | - |
| stock | ⏳ Belum ada types | - |
| sales_transactions | ⏳ Belum ada types | - |
| cash_flow | ⏳ Belum ada types | - |
| assets | ⏳ Belum ada types | - |
