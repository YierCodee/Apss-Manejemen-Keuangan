// src/lib/permissions.ts
//
// SATU sumber aturan "siapa boleh apa". Dipakai di dua tempat:
//   - UI     : can(role, "keuangan", "create")  -> tampil/sembunyikan tombol
//   - Server : assertCan(session, "keuangan", "create") -> tolak bila tidak boleh
// Jangan menyalin aturan ini ke tempat lain. Ubah di sini saja.
//
// PENTING: menyembunyikan tombol hanya untuk kenyamanan. Yang menjaga
// keamanan adalah pemeriksaan di server. `session` harus berasal dari
// server (cookie/token yang diverifikasi), BUKAN dari data yang dikirim browser.

// ---------------------------------------------------------------------
// DUA TIPE DATA
// ---------------------------------------------------------------------
//
// 1. DATA PRIBADI (MENU UTAMA)
//    - Dashboard, Keuangan (transactions), RAB (rab_projects/rab_items),
//      Laporan Keuangan
//    - Pola: ownOnly(session) → { userId: session.userId }
//    - Tidak ada role-checking. Yang ada hanya ownership check.
//    - Berlaku untuk SEMUA role, termasuk super_admin.
//
// 2. DATA BISNIS KELOMPOK (BUSINESS KELOMPOK)
//    - Produk & Stok, Penjualan, Kas Bisnis (cash_flow), Aset
//    - Pola: assertCan(session, resource, action) → role-based permission
//    - Hanya role tertentu yang boleh akses/ubah.
//    - Route admin (/admin) → super_admin only.

// ---------------------------------------------------------------------
// Role, modul, dan aksi
// ---------------------------------------------------------------------

export const ROLES = ["super_admin", "bendahara", "operasional", "pemasaran"] as const;
export type Role = (typeof ROLES)[number];

// Resource hanya untuk DATA BISNIS KELOMPOK.
// Data pribadi (transactions, rab) TIDAK ada di sini — gunakan ownOnly().
export const RESOURCES = ["keuangan", "aset", "produk_stok", "penjualan", "users"] as const;
export type Resource = (typeof RESOURCES)[number];

export const ACTIONS = ["read", "create", "update", "delete"] as const;
export type Action = (typeof ACTIONS)[number];

const ALL: readonly Action[] = ACTIONS;
const READ: readonly Action[] = ["read"];
const NONE: readonly Action[] = [];

// ---------------------------------------------------------------------
// Matriks izin untuk DATA BISNIS KELOMPOK (berdasarkan role)
// "keuangan" = kas bisnis (cash_flow). Keuangan pribadi TIDAK ada di sini.
// "aset" = aset bisnis kelompok. RAB pribadi TIDAK ada di sini.
// ---------------------------------------------------------------------

export const PERMISSIONS: Record<Role, Record<Resource, readonly Action[]>> = {
  super_admin: {
    keuangan: ALL,
    aset: ALL,
    produk_stok: ALL,
    penjualan: ALL,
    users: ALL,
  },
  bendahara: {
    keuangan: ALL,
    aset: ALL,
    produk_stok: READ,
    penjualan: READ,
    users: NONE,
  },
  operasional: {
    keuangan: READ,
    aset: ALL,
    produk_stok: ALL,
    penjualan: READ,
    users: NONE,
  },
  pemasaran: {
    keuangan: READ,
    aset: READ,
    produk_stok: READ,
    penjualan: ALL,
    users: NONE,
  },
};

export function can(role: Role, resource: Resource, action: Action): boolean {
  return PERMISSIONS[role][resource].includes(action);
}

// ---------------------------------------------------------------------
// Session & error
// ---------------------------------------------------------------------

export type SessionUser = {
  userId: string;
  role: Role;
};

export class AccessError extends Error {
  status: 401 | 403;

  constructor(message: string, status: 401 | 403) {
    super(message);
    this.name = "AccessError";
    this.status = status;
  }
}

// ---------------------------------------------------------------------
// Pemeriksaan di server (data bisnis kelompok)
// ---------------------------------------------------------------------

export function assertCan(
  session: SessionUser | null | undefined,
  resource: Resource,
  action: Action,
): asserts session is SessionUser {
  if (!session) {
    throw new AccessError("Belum login", 401);
  }
  if (!can(session.role, resource, action)) {
    throw new AccessError("Anda tidak punya izin untuk aksi ini", 403);
  }
}

// ---------------------------------------------------------------------
// Pemeriksaan admin (hanya super_admin)
// ---------------------------------------------------------------------

export function assertAdmin(session: SessionUser | null | undefined): asserts session is SessionUser {
  if (!session) {
    throw new AccessError("Belum login", 401);
  }
  if (session.role !== "super_admin") {
    throw new AccessError("Hanya super_admin yang dapat mengakses halaman ini", 403);
  }
}

// ---------------------------------------------------------------------
// Data pribadi (transactions, rab): aturan berdasarkan PEMILIK, bukan role.
// Berlaku untuk semua role, termasuk super_admin (tanpa pengecualian).
// ---------------------------------------------------------------------

// Pakai pada SETIAP query data pribadi supaya hanya data milik sendiri yang terbaca:
//   prisma.transaction.findMany({ where: { ...ownOnly(session), date: { gte } } })
//   prisma.rabProject.findMany({ where: { ...ownOnly(session) } })
export function ownOnly(session: SessionUser): { userId: string } {
  return { userId: session.userId };
}

// Untuk update/hapus satu data yang sudah diambil dari database.
export function assertOwner(session: SessionUser, ownerId: string): void {
  if (session.userId !== ownerId) {
    throw new AccessError("Data ini bukan milik Anda", 403);
  }
}

// ---------------------------------------------------------------------
// Aturan per-field (data yang tidak boleh dikirim sama sekali ke role tertentu)
// ---------------------------------------------------------------------

// Harga modal produk. Sesuaikan role yang boleh melihat.
// Di server: buang field `cost` dari respons bila hasilnya false.
export function canSeeProductCost(role: Role): boolean {
  return role !== "pemasaran";
}

// ---------------------------------------------------------------------
// Contoh pemakaian
//
// DATA PRIBADI (transactions, rab):
//   const rows = await prisma.transaction.findMany({ where: ownOnly(session) });
//   assertOwner(session, data.userId); // sebelum update/delete
//
// DATA BISNIS (kas bisnis, aset, produk, penjualan):
//   assertCan(session, "keuangan", "create"); // lempar 401/403 bila tidak boleh
//   {can(user.role, "keuangan", "create") && <Button>Tambah kas</Button>}
//
// ADMIN:
//   assertAdmin(session); // lempar 401/403 bila bukan super_admin
// ---------------------------------------------------------------------
