"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Download,
  Users,
  Package,
  CreditCard,
  Shield,
  History,
  MoreVertical,
  CheckCircle,
  HelpCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/permissions";

// ─── Types ──────────────────────────────────────────────────────────────────

type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

// ─── Helpers ────────────────────────────────────────────────────────────────

const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super Admin",
  bendahara: "Bendahara",
  operasional: "Operasional",
  pemasaran: "Pemasaran",
  member: "Member",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getRoleColor(role: Role): string {
  const colors: Record<Role, string> = {
    super_admin: "bg-[#175643]",
    bendahara: "bg-blue-600",
    operasional: "bg-amber-600",
    pemasaran: "bg-purple-600",
    member: "bg-gray-500",
  };
  return colors[role];
}

// ─── Permission Matrix Data ─────────────────────────────────────────────────

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

// ─── Page ───────────────────────────────────────────────────────────────────

export default function UserManagementPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [roleFilter, setRoleFilter] = useState("Semua");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [permRole, setPermRole] = useState<Role>("operasional");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/admin/users");
        if (res.ok && !cancelled) {
          const data = await res.json();
          setUsers(data);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  async function handleRoleChange(userId: string, newRole: Role) {
    setUpdatingId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        await fetchUsers();
      } else {
        const data = await res.json();
        alert(data.error || "Gagal mengubah role");
      }
    } catch {
      alert("Terjadi kesalahan");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleToggleActive(userId: string, currentActive: boolean) {
    setUpdatingId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentActive }),
      });
      if (res.ok) {
        await fetchUsers();
      } else {
        const data = await res.json();
        alert(data.error || "Gagal mengubah status");
      }
    } catch {
      alert("Terjadi kesalahan");
    } finally {
      setUpdatingId(null);
    }
  }

  // Filter users
  const filteredUsers = users.filter((user) => {
    if (roleFilter !== "Semua" && user.role !== roleFilter) return false;
    if (statusFilter === "Aktif" && !user.isActive) return false;
    if (statusFilter === "Nonaktif" && user.isActive) return false;
    return true;
  });

  // Stats
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.isActive).length;
  const roleCounts = users.reduce(
    (acc, u) => {
      acc[u.role] = (acc[u.role] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const statCards = [
    {
      label: "Total Pengguna",
      value: totalUsers,
      unit: "Anggota",
      icon: Users,
      description: `${activeUsers} aktif dari ${totalUsers} total`,
    },
    {
      label: "Operasional",
      value: roleCounts["operasional"] || 0,
      unit: "Anggota",
      icon: Package,
      description: "Akses stok, transaksi logistik & kas harian",
    },
    {
      label: "Bendahara",
      value: roleCounts["bendahara"] || 0,
      unit: "Anggota",
      icon: CreditCard,
      description: "Approval transfer dana, RAB & saldo utama",
    },
  ];

  const tabs = [
    { label: `Daftar Pengguna (${totalUsers})`, icon: Shield },
    { label: "Pengaturan Hak Akses Peran", icon: Shield },
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
                Kelola akun anggota tim dan atur hak akses peran secara terpusat
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                <Download className="h-4 w-4" />
                Unduh Log Audit
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
              <div>
                <h2 className="text-lg font-bold text-[#0f172a]">
                  Daftar Anggota & Penugasan Peran
                </h2>
                <p className="text-sm text-gray-500">
                  Kelola wewenang akun dan status operasional
                </p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">Filter:</span>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#175643]/20 focus:border-[#175643]"
                >
                  <option value="Semua">Semua Peran</option>
                  <option value="super_admin">Super Admin</option>
                  <option value="bendahara">Bendahara</option>
                  <option value="operasional">Operasional</option>
                  <option value="pemasaran">Pemasaran</option>
                  <option value="member">Member</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#175643]/20 focus:border-[#175643]"
                >
                  <option value="Semua">Semua Status</option>
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                </select>
              </div>

              {/* User Table */}
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <div className="flex items-center gap-6 border-b border-gray-200 bg-gray-50/60 px-5 py-2.5">
                  <div className="w-10 shrink-0" />
                  <div className="w-[180px] text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Name
                  </div>
                  <div className="w-[220px] text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Email
                  </div>
                  <div className="w-[160px] text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Role
                  </div>
                  <div className="w-[110px] text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Status
                  </div>
                  <div className="ml-auto w-8" />
                </div>

                <div className="divide-y divide-gray-100">
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="flex items-center justify-center py-12 text-sm text-gray-500">
                      Tidak ada pengguna ditemukan
                    </div>
                  ) : (
                    filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center gap-6 px-5 py-3.5 transition-colors hover:bg-gray-50"
                      >
                        <div
                          className={cn(
                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white",
                            getRoleColor(user.role)
                          )}
                        >
                          {getInitials(user.name)}
                        </div>

                        <div className="w-[180px]">
                          <span className="truncate text-sm font-medium text-[#0f172a]">
                            {user.name}
                          </span>
                        </div>

                        <div className="w-[220px]">
                          <p className="truncate text-sm text-gray-600">
                            {user.email}
                          </p>
                        </div>

                        <div className="w-[160px]">
                          <select
                            value={user.role}
                            onChange={(e) =>
                              handleRoleChange(user.id, e.target.value as Role)
                            }
                            disabled={updatingId === user.id}
                            className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#175643]/20 focus:border-[#175643] disabled:opacity-50"
                          >
                            <option value="super_admin">Super Admin</option>
                            <option value="bendahara">Bendahara</option>
                            <option value="operasional">Operasional</option>
                            <option value="pemasaran">Pemasaran</option>
                            <option value="member">Member</option>
                          </select>
                        </div>

                        <div className="w-[110px]">
                          <button
                            onClick={() => handleToggleActive(user.id, user.isActive)}
                            disabled={updatingId === user.id}
                            className={cn(
                              "inline-flex items-center gap-1.5 text-sm font-medium transition-colors disabled:opacity-50",
                              user.isActive
                                ? "text-[#175643] hover:text-[#1B5E47]"
                                : "text-gray-400 hover:text-gray-600"
                            )}
                          >
                            <span
                              className={cn(
                                "h-1.5 w-1.5 rounded-full",
                                user.isActive ? "bg-[#175643]" : "bg-gray-300"
                              )}
                            />
                            {user.isActive ? "Aktif" : "Nonaktif"}
                          </button>
                        </div>

                        <button className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Pagination info */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Menampilkan {filteredUsers.length} dari {totalUsers} pengguna
                </p>
              </div>

              {/* Security Policy */}
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
                      Hanya super_admin yang dapat mengelola pengguna dan mengubah
                      hak akses
                    </p>
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
                <p className="mt-1 text-sm text-gray-500">
                  Matriks izin modul berdasarkan peran
                </p>
              </div>

              {/* Role Tabs */}
              <div className="flex gap-2">
                {(["operasional", "bendahara", "pemasaran"] as Role[]).map(
                  (role) => (
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
                      {ROLE_LABELS[role]}
                    </button>
                  )
                )}
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-[#175643]" />
                <span className="text-sm font-medium text-[#0f172a]">
                  Peran: {ROLE_LABELS[permRole]}
                </span>
                <span className="text-sm text-gray-500">
                  {roleCounts[permRole] || 0} Pengguna
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

              <div className="border border-gray-200 rounded-xl bg-[#F9FAFB] p-5">
                <div className="flex items-start gap-3">
                  <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" />
                  <div>
                    <h4 className="text-sm font-bold text-[#0f172a]">
                      Tentang Hak Akses
                    </h4>
                    <p className="mt-1 text-sm text-gray-500">
                      Hak akses ditentukan oleh role pengguna. Hubungi super_admin
                      untuk mengubah role Anda.
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
