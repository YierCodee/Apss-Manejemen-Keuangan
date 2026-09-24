# Dokumentasi Projek NevBank

## Ringkasan

**NevBank** adalah sistem manajemen keuangan yang dirancang khusus untuk mahasiswa. Aplikasi ini membantu mahasiswa mengelola uang saku bulanan, anggaran kuliah, dan pos pengeluaran dalam satu tempat. Selain fitur keuangan pribadi, NevBank juga menyediakan modul bisnis kelompok untuk mengelola produk, stok, penjualan, dan aset bersama.

---

## Tech Stack

| Teknologi | Versi | Keterangan |
|-----------|-------|------------|
| Next.js | 16.3.5 | App Router |
| React | 19.2.8 | Frontend library |
| TypeScript | 5.x | Strict mode |
| Tailwind CSS | v4 | Styling |
| Prisma | 7.10.0 | ORM |
| PostgreSQL | - | Database |
| Supabase | - | Database hosting & auth |
| jose | 6.x | JWT handling |
| recharts | 3.x | Chart/visualisasi |
| jspdf | 4.x | Export PDF |
| exceljs | 4.x | Export Excel |
| framer-motion | 13.x | Animasi |
| lucide-react | 1.x | Icon library |

---

## Struktur Projek

```
serkwu/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── page.tsx           # Landing page
│   │   ├── layout.tsx         # Root layout
│   │   ├── (dashboard)/       # Dashboard group route
│   │   │   ├── layout.tsx     # Dashboard layout (sidebar + navbar)
│   │   │   ├── dashboard/     # Dashboard utama
│   │   │   ├── keuangan/      # Manajemen keuangan pribadi
│   │   │   ├── rab/           # Rencana Anggaran Biaya
│   │   │   ├── business-kelompok/  # Modul bisnis kelompok
│   │   │   └── admin/         # Panel admin
│   │   └── api/               # API routes
│   ├── components/            # Komponen reusable
│   ├── features/              # Feature-specific components & hooks
│   ├── lib/                   # Utility functions & auth
│   ├── contexts/              # React contexts
│   └── middleware.ts          # Route protection
├── public/                    # Static assets
└── package.json
```

---

## Fitur Utama

### 1. Autentikasi & Keamanan

**Sistem Autentikasi:**
- Login dan registrasi dengan email + password
- Session menggunakan JWT (JSON Web Token) via httpOnly cookies
- opsi "Remember Me" untuk sesi lebih lama (24 jam atau 30 hari)
- Logout yang aman dengan penghapusan cookie

**Keamanan:**
- Password di-hash menggunakan bcryptjs
- JWT secret dari environment variable
- Middleware memverifikasi token di setiap request
- Routes terlindungi memerlukan autentikasi

**File terkait:**
- `src/lib/auth.ts` - Session management
- `src/middleware.ts` - Route protection
- `src/app/api/auth/` - Login, register, logout, me

---

### 2. Role-Based Access Control (RBAC)

NevBank menerapkan sistem hak akses berbasis peran dengan 4 role:

| Role | Keterangan |
|------|------------|
| `super_admin` | Akses penuh ke semua fitur dan pengelolaan pengguna |
| `bendahara` | Mengelola keuangan, aset, dan melihat produk/stok/penjualan |
| `operasional` | Mengelola produk, stok, aset, dan melihat keuangan/penjualan |
| `pemasaran` | Mengelola penjualan dan melihat data lainnya |

**Aturan Data:**
- **Data Pribadi** (Transaksi, RAB): Hanya pemilik data yang bisa mengakses (ownership-based)
- **Data Bisnis Kelompok**: Berdasarkan role (role-based permissions)

**File terkait:**
- `src/lib/permissions.ts` - Definisi role dan permission matrix

---

### 3. Dashboard

Halaman utama setelah login menampilkan ringkasan keuangan:

- **Welcome Banner** - Sapaan personal untuk pengguna
- **Account Card** - Informasi saldo dan rekening
- **Standing Orders Banner** - Pengaturan berulang
- **Recent Transactions** - Transaksi terakhir
- **Expense Summary** - Ringkasan pengeluaran

**File terkait:**
- `src/app/(dashboard)/dashboard/page.tsx`
- `src/components/dashboard/` - Komponen dashboard

---

### 4. Manajemen Keuangan Pribadi

Modul pencatatan keuangan pribadi mahasiswa:

**Fitur:**
- CRUD transaksi (pemasukan & pengeluaran)
- Kategori transaksi (makanan, transport, kuliah, dll)
- Filter berdasarkan tipe transaksi
- Pencarian transaksi
- Metrik bulanan (cash flow, pemasukan, pengeluaran)
- Export laporan ke PDF dan Excel

**Tipe Transaksi:**
- `pemasukan` - Uang masuk (uang saku, gaji, dll)
- `pengeluaran` - Uang keluar (makan, kost, transport, dll)

**File terkait:**
- `src/app/(dashboard)/keuangan/page.tsx`
- `src/features/keuangan/` - Components, hooks, utils
- `src/components/modals/RecordTransactionModal.tsx`

---

### 5. Rencana Anggaran Biaya (RAB)

Sistem perencanaan dan monitoring anggaran:

**Fitur:**
- Buat project anggaran per kuartal/tahun
- Tambah item anggaran dengan detail:
  - Nama item
  - Spesifikasi
  - Kategori
  - Prioritas (on-track, high, medium, low)
  - Kuantitas & harga per unit
  - Total budget & realisasi
- Status project (draft, active, completed)
- Status item (on-track, warning, over-budget)
- Summary cards (total budget, realisasi, sisa)
- Chart alokasi anggaran per kategori
- Export RAB ke PDF dan Excel

**File terkait:**
- `src/app/(dashboard)/rab/page.tsx`
- `src/features/rab/` - Components, hooks, utils
- `src/components/modals/RabFormModal.tsx`

---

### 6. Bisnis Kelompok

Modul untuk mengelola bisnis bersama kelompok:

#### 6.1 Produk & Stok
- Manajemen produk (nama, deskripsi, kategori, harga, harga modal, SKU)
- Manajemen stok (kuantitas, min/max stock, last restock)
- Tracking produk dan inventaris

#### 6.2 Transaksi Penjualan
- Pencatatan transaksi penjualan
- Data produk, kuantitas, harga satuan, total
- Metode pembayaran
- Nama pelanggan
- Catatan transaksi

#### 6.3 Laporan Arus Kas
- Tracking arus kas masuk (inflow) dan keluar (outflow)
- Kategori arus kas
- Reference ke transaksi terkait

#### 6.4 Keuangan Aset
- Manajemen aset (nama, kategori, harga beli, nilai saat ini)
- Tanggal pembelian
- Rate depresiasi
- Status aset (active, sold, disposed)

**File terkait:**
- `src/app/(dashboard)/business-kelompok/`
- `src/features/business-kelompok/`

---

### 7. Panel Admin (Super Admin Only)

Hanya dapat diakses oleh role `super_admin`:

**Fitur:**
- **User Management**: Lihat, edit role, aktifkan/nonaktifkan pengguna
- **Permission Matrix**: Visualisasi hak akses per role
- **Riwayat Aktivitas**: Audit log (coming soon)

**Statistik:**
- Total pengguna
- Jumlah per role (operasional, bendahara, pemasaran)
- Status aktif/nonaktif

**File terkait:**
- `src/app/(dashboard)/admin/user-management/page.tsx`
- `src/app/api/admin/users/`

---

### 8. API Routes

| Endpoint | Method | Keterangan |
|----------|--------|------------|
| `/api/auth/login` | POST | Login pengguna |
| `/api/auth/register` | POST | Registrasi pengguna baru |
| `/api/auth/logout` | POST | Logout |
| `/api/auth/me` | GET | Dapatkan data session |
| `/api/keuangan` | GET/POST | Transaksi keuangan |
| `/api/keuangan/[id]` | GET/PATCH/DELETE | Update/hapus transaksi |
| `/api/keuangan/categories` | GET | Kategori transaksi |
| `/api/keuangan/accounts` | GET | Rekening pengguna |
| `/api/keuangan/laporan` | GET | Laporan keuangan |
| `/api/rab` | GET/POST | Project RAB |
| `/api/rab/sync` | POST | Sinkronisasi RAB |
| `/api/business-kelompok/produk` | GET/POST | Produk |
| `/api/business-kelompok/stok` | GET/POST | Stok |
| `/api/business-kelompok/transaksi` | GET/POST | Transaksi penjualan |
| `/api/business-kelompok/arus-kas` | GET/POST | Arus kas |
| `/api/admin/users` | GET | Daftar pengguna |
| `/api/admin/users/[id]` | PATCH | Update pengguna |

---

### 9. Database Schema

**Tabel Utama:**

| Tabel | Keterangan |
|-------|------------|
| `users` | Data pengguna |
| `accounts` | Rekening bank/e-wallet |
| `categories` | Kategori transaksi |
| `payment_methods` | Metode pembayaran |
| `transactions` | Transaksi keuangan pribadi |
| `rab_projects` | Project anggaran |
| `rab_items` | Item anggaran |
| `products` | Produk bisnis |
| `stock` | Stok produk |
| `sales_transactions` | Transaksi penjualan |
| `cash_flow` | Arus kas bisnis |
| `assets` | Aset bisnis |
| `audit_logs` | Log aktivitas |

---

### 10. Middleware & Proteksi Route

Middleware berjalan di Edge Runtime untuk melindungi routes:

**Protected Routes:**
- `/dashboard/*`
- `/keuangan/*`
- `/rab/*`
- `/business-kelompok/*`
- `/admin/*` (hanya super_admin)

**Auth Routes:**
- `/login` - Redirect ke dashboard jika sudah login
- `/register` - Redirect ke dashboard jika sudah login

---

## Design System

Projek ini mengikuti design system yang konsisten:

- **Container**: `max-w-[1280px] mx-auto`
- **Background**: `bg-white` untuk seluruh halaman
- **Card**: `border border-gray-200 rounded-xl bg-white`
- **Padding Card**: `p-5`, gap antar card: `gap-4`
- **Label Kecil**: `text-xs text-gray-400 uppercase`
- **Angka Besar**: `text-2xl font-bold`
- **Row Tabel**: `py-3 border-b border-gray-100`
- **Primary Color**: Emerald (`#064e3b`)

---

## Perintah Development

```bash
# Install dependencies
npm install

# Jalankan development server
npm run dev

# Build untuk production
npm run build

# Jalankan production server
npm run start

# Linting
npm run lint
```

---

## Environment Variables

Buat file `.env.local` di root project:

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret-key"
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="xxx"
```

---

## Status Pengembangan

| Modul | Status |
|-------|--------|
| Autentikasi | ✅ Selesai |
| Dashboard | ✅ Selesai |
| Keuangan Pribadi | ✅ Selesai |
| RAB | ✅ Selesai |
| Admin User Management | ✅ Selesai |
| Produk & Stok | 🚧 Dalam Pengembangan |
| Transaksi Penjualan | 🚧 Dalam Pengembangan |
| Laporan Arus Kas | 🚧 Dalam Pengembangan |
| Keuangan Aset | 🚧 Dalam Pengembangan |
| Audit Log | 📋 Coming Soon |
