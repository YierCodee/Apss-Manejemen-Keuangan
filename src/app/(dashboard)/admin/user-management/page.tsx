"use client";

import { useState } from "react";
import {
  Download,
  UserPlus,
  Users,
  Package,
  CreditCard,
  Shield,
  History,
  Search,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  HelpCircle,
  Save,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Mock Data ───────────────────────────────────────────────────────────────

const users = [
  {
    initials: "DW",
    name: "Dorothy Watkins",
    badge: "Super Admin",
    email: "dorothy@nevbank.cc",
    position: "Operations Lead",
    role: "Operations",
    status: "Aktif",
    color: "bg-[#175643]",
  },
  {
    initials: "RH",
    name: "Rian Hidayat",
    badge: "Bendahara Utama",
    email: "rian.h@nevbank.cc",
    position: "Bendahara Utama",
    role: "Treasurer (Bendahara)",
    status: "Aktif",
    color: "bg-[#175643]",
  },
  {
    initials: "SA",
    name: "Sarah Amalia",
    badge: "Manajer Gudang",
    email: "sarah.a@nevbank.cc",
    position: "Manajer Gudang",
    role: "Operations",
    status: "Aktif",
    color: "bg-[#175643]",
  },
  {
    initials: "BW",
    name: "Budi Wicaksono",
    badge: null,
    email: "budi.w@nevbank.cc",
    position: "Lead Campaign & Ads",
    role: "Marketing",
    status: "Aktif",
    color: "bg-[#175643]",
  },
  {
    initials: "CP",
    name: "Clarissa Putri",
    badge: null,
    email: "clarissa.p@nevbank.cc",
    position: "Staff Anggaran RAB",
    role: "Treasurer",
    status: "Aktif",
    color: "bg-[#175643]",
  },
  {
    initials: "DP",
    name: "Dimas Pratama",
    badge: null,
    email: "dimas.p@nevbank.cc",
    position: "Ekspedisi & Armada",
    role: "Operations",
    status: "Verifikasi",
    color: "bg-[#175643]",
  },
];

const statCards = [
  {
    label: "Total Pengguna",
    value: "38",
    unit: "Anggota",
    icon: Users,
    description: "Tersebar di 3 departemen utama",
  },
  {
    label: "Operations",
    labelSub: "Operasional",
    value: "14",
    unit: "Anggota",
    icon: Package,
    description: "Akses stok, transaksi logistik & kas harian",
  },
  {
    label: "Treasurer",
    labelSub: "Bendahara",
    value: "8",
    unit: "Anggota",
    icon: CreditCard,
    description: "Approval transfer dana, RAB & saldo utama",
  },
];

const permissionModules = [
  {
    section: "Modul Keuangan & Rekening",
    items: [
      {
        name: "Lihat Saldo & Mutasi Rekening",
        description: "Akses baca data transaksi harian, mutasi masuk/keluar",
      },
      {
        name: "Persetujuan Transfer Dana",
        description: "Otoritas verifikasi pin token & eksekusi pengeluaran",
      },
      {
        name: "Pencairan & Revisi RAB",
        description: "Pengajuan revisi item anggaran belanja kelompok",
      },
    ],
  },
  {
    section: "Modul Bisnis Kelompok",
    items: [
      {
        name: "Produk & Stok (Inventaris)",
        description: "Update kuantitas, harga modal, dan katalog barang",
      },
      {
        name: "Transaksi & Catat Penjualan",
        description: "Input invoice penjualan dan cetak bukti transaksi",
      },
      {
        name: "Ekspor Laporan Arus Kas",
        description: "Akses file PDF/Spreadsheet audit laporan keuangan",
      },
    ],
  },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function UserManagementPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [roleFilter, setRoleFilter] = useState("Semua Peran");
  const [statusFilter, setStatusFilter] = useState("Semua Status");
  const [permRole, setPermRole] = useState("Operations");

  const tabs = [
    { label: "Daftar Pengguna (38)", icon: Shield },
    { label: "Pengaturan Hak Akses Peran (Permission Matrix)", icon: Shield },
    { label: "Riwayat Aktivitas & Audit", icon: History },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[1280px] px-6 py-5">
        <div className="flex flex-col gap-5">
          {/* ── Header ─────────────────────────────────────────────── */}
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-0.5">
              <h1 className="text-2xl font-bold tracking-tight text-[#0f172a]">
                User Management
              </h1>
              <p className="text-sm text-gray-500">
                Kelola akun anggota tim dan atur hak akses peran (Operations,
                Treasurer, Marketing) secara terpusat
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                <Download className="h-4 w-4" />
                Unduh Log Audit
              </button>
              <button className="flex items-center gap-2 rounded-lg bg-[#175643] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1B5E47]">
                <UserPlus className="h-4 w-4" />
                Tambah Pengguna Baru
              </button>
            </div>
          </div>

          {/* ── Stat Cards ─────────────────────────────────────────── */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.label}
                  className="border border-gray-200 rounded-xl bg-white p-5"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                        {card.label}
                      </p>
                      {card.labelSub && (
                        <p className="text-xs text-gray-400">{card.labelSub}</p>
                      )}
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F0FCF7]">
                      <Icon className="h-5 w-5 text-[#175643]" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold text-[#0f172a]">
                      {card.value}
                    </span>
                    <span className="text-sm text-gray-500">{card.unit}</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-400">
                    {card.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* ── Tabs ───────────────────────────────────────────────── */}
          <div className="border-b border-gray-200">
            <div className="flex gap-0">
              {tabs.map((tab, i) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.label}
                    onClick={() => setActiveTab(i)}
                    className={cn(
                      "flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                      activeTab === i
                        ? "border-[#175643] text-[#175643]"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Tab 0: Daftar Pengguna ─────────────────────────────── */}
          {activeTab === 0 && (
            <div className="flex flex-col gap-5">
              {/* Section Header */}
              <div>
                <h2 className="text-lg font-bold text-[#0f172a]">
                  Daftar Anggota & Penugasan Peran
                </h2>
                <p className="text-sm text-gray-500">
                  Kelola wewenang akun, autentikasi 2FA, dan status operasional
                </p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">Tampilan:</span>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#175643]/20 focus:border-[#175643]"
                >
                  <option>Semua Peran</option>
                  <option>Operations</option>
                  <option>Treasurer (Bendahara)</option>
                  <option>Marketing</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#175643]/20 focus:border-[#175643]"
                >
                  <option>Semua Status</option>
                  <option>Aktif</option>
                  <option>Menunggu Verifikasi</option>
                  <option>Ditangguhkan</option>
                </select>
              </div>

              {/* User Table */}
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                {/* Table Header */}
                <div className="flex items-center gap-6 border-b border-gray-200 bg-gray-50/60 px-5 py-2.5">
                  <div className="w-10 shrink-0" />
                  <div className="w-[180px] text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Name
                  </div>
                  <div className="w-[220px] text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Email
                  </div>
                  <div className="w-[160px] text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Access rights
                  </div>
                  <div className="w-[110px] text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Status
                  </div>
                  <div className="ml-auto w-8" />
                </div>

                {/* Table Body */}
                <div className="divide-y divide-gray-100">
                  {users.map((user) => (
                    <div
                      key={user.initials + user.name}
                      className="flex items-center gap-6 px-5 py-3.5 transition-colors hover:bg-gray-50"
                    >
                      {/* Avatar */}
                      <div
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white",
                          user.color
                        )}
                      >
                        {user.initials}
                      </div>

                      {/* Name + Badge */}
                      <div className="w-[180px]">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-sm font-medium text-[#0f172a]">
                            {user.name}
                          </span>
                          {user.badge && (
                            <span className="shrink-0 inline-flex items-center rounded-full bg-[#F0FCF7] px-2 py-0.5 text-[10px] font-semibold text-[#175643]">
                              {user.badge}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Email + Position */}
                      <div className="w-[220px]">
                        <p className="truncate text-sm text-gray-600">
                          {user.email}
                        </p>
                        <p className="truncate text-xs text-gray-400">
                          {user.position}
                        </p>
                      </div>

                      {/* Role */}
                      <div className="w-[160px]">
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                          {user.role}
                        </span>
                      </div>

                      {/* Status */}
                      <div className="w-[110px]">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 text-sm font-medium",
                            user.status === "Aktif"
                              ? "text-[#175643]"
                              : "text-amber-600"
                          )}
                        >
                          <span
                            className={cn(
                              "h-1.5 w-1.5 rounded-full",
                              user.status === "Aktif"
                                ? "bg-[#175643]"
                                : "bg-amber-500"
                            )}
                          />
                          {user.status}
                        </span>
                      </div>

                      {/* Actions */}
                      <button className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Menampilkan 6 dari 38 pengguna
                </p>
                <div className="flex items-center gap-1">
                  <button className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  {[1, 2, 3].map((page) => (
                    <button
                      key={page}
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors",
                        page === 1
                          ? "bg-[#175643] text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      )}
                    >
                      {page}
                    </button>
                  ))}
                  <button className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* ── Security Policy ──────────────────────────────── */}
              <div className="border border-gray-200 rounded-xl bg-white p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#F0FCF7]">
                    <Shield className="h-5 w-5 text-[#175643]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-[#0f172a]">
                      Penegakan Kebijakan Keamanan Akun
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Wajibkan otentikasi dua langkah (2FA) untuk seluruh
                      anggota dengan hak akses persetujuan saldo dan kas
                    </p>
                    <button className="mt-3 text-sm font-semibold text-[#175643] hover:underline">
                      Kelola Kebijakan →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Tab 1: Permission Matrix ──────────────────────────── */}
          {activeTab === 1 && (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="text-lg font-bold text-[#0f172a]">
                  Konfigurasi Hak Akses
                </h2>
                <div className="mt-2 flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#0f172a]">
                    Matriks Izin Modul
                  </h3>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Pilih peran di bawah ini untuk melihat batasan fitur dan
                  menyesuaikan wewenang secara real-time.
                </p>
              </div>

              {/* Role Tabs */}
              <div className="flex gap-2">
                {["Operations", "Treasurer", "Marketing"].map((role) => (
                  <button
                    key={role}
                    onClick={() => setPermRole(role)}
                    className={cn(
                      "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                      permRole === role
                        ? "bg-[#175643] text-white"
                        : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                    )}
                  >
                    {role}
                  </button>
                ))}
              </div>

              {/* Active Role Info */}
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-[#175643]" />
                <span className="text-sm font-medium text-[#0f172a]">
                  Peran: {permRole} (
                  {permRole === "Operations"
                    ? "Operasional"
                    : permRole === "Treasurer"
                      ? "Bendahara"
                      : "Pemasaran"}
                  )
                </span>
                <span className="text-sm text-gray-500">
                  •{" "}
                  {permRole === "Operations"
                    ? "14"
                    : permRole === "Treasurer"
                      ? "8"
                      : "16"}{" "}
                  Pengguna
                </span>
              </div>

              {/* Permission Modules */}
              <div className="flex flex-col gap-4">
                {permissionModules.map((mod) => (
                  <div
                    key={mod.section}
                    className="border border-gray-200 rounded-xl bg-white"
                  >
                    <div className="border-b border-gray-100 px-5 py-3">
                      <h4 className="text-sm font-bold text-[#0f172a]">
                        {mod.section}
                      </h4>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {mod.items.map((item) => (
                        <div
                          key={item.name}
                          className="flex items-start gap-3 px-5 py-3"
                        >
                          <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#175643]" />
                          <div>
                            <p className="text-sm font-medium text-[#0f172a]">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 rounded-lg bg-[#175643] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1B5E47]">
                  <Save className="h-4 w-4" />
                  Simpan Perubahan Hak Akses
                </button>
                <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                  <RotateCcw className="h-4 w-4" />
                  Reset ke Konfigurasi Default
                </button>
              </div>

              {/* Help Box */}
              <div className="border border-gray-200 rounded-xl bg-[#F9FAFB] p-5">
                <div className="flex items-start gap-3">
                  <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" />
                  <div>
                    <h4 className="text-sm font-bold text-[#0f172a]">
                      Butuh Hak Akses Kustom?
                    </h4>
                    <p className="mt-1 text-sm text-gray-500">
                      Anda dapat memberikan izin ad-hoc per anggota tanpa
                      mengubah aturan peran global melalui tombol aksi tabel.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Tab 2: Riwayat Aktivitas ──────────────────────────── */}
          {activeTab === 2 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <History className="h-12 w-12 text-gray-300" />
              <p className="mt-4 text-sm font-medium text-gray-500">
                Riwayat aktivitas & audit log akan segera hadir.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
