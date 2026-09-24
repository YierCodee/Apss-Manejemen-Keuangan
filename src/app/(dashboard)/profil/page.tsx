"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Briefcase,
  Shield,
  Clock,
  CheckCircle2,
  Loader2,
  KeyRound,
  AlertCircle,
} from "lucide-react";
import { DS, cardBase, btnPrimary } from "@/components/landing/theme";
import { fadeUp } from "@/components/landing/theme";
import {
  ROLES,
  RESOURCES,
  can,
  type Role,
  type Resource,
  type Action,
} from "@/lib/permissions";

/* ─── Role display config ─── */
const ROLE_CONFIG: Record<
  Role,
  { label: string; color: string; bg: string; desc: string }
> = {
  super_admin: {
    label: "Super Admin",
    color: DS.colors.primaryContainer,
    bg: DS.colors.surfaceContainer,
    desc: "Akses penuh ke semua fitur dan modul",
  },
  bendahara: {
    label: "Bendahara",
    color: DS.colors.positive,
    bg: DS.colors.positiveBg,
    desc: "Kelola keuangan, aset, dan laporan keuangan",
  },
  operasional: {
    label: "Operasional",
    color: DS.colors.secondary,
    bg: DS.colors.surfaceContainer,
    desc: "Kelola operasional, produk, stok, dan penjualan",
  },
  pemasaran: {
    label: "Pemasaran",
    color: DS.colors.onSurfaceVariant,
    bg: DS.colors.surfaceContainerLow,
    desc: "Akses read-only untuk keuangan, aset, dan produk",
  },
  member: {
    label: "Member",
    color: DS.colors.onSurfaceVariant,
    bg: DS.colors.surfaceContainerLow,
    desc: "Akses terbatas ke menu utama saja (Dashboard, Keuangan, RAB, Laporan)",
  },
};

/* ─── Resource display config ─── */
const RESOURCE_CONFIG: Record<
  Resource,
  { label: string; desc: string }
> = {
  keuangan: {
    label: "Keuangan (Kas Bisnis)",
    desc: "Kelola arus kas bisnis kelompok",
  },
  aset: {
    label: "Aset",
    desc: "Kelola aset dan penyusutan",
  },
  produk_stok: {
    label: "Produk & Stok",
    desc: "Kelola produk, stok, dan inventori",
  },
  penjualan: {
    label: "Penjualan",
    desc: "Kelola transaksi penjualan",
  },
  users: {
    label: "User Management",
    desc: "Kelola pengguna dan hak akses",
  },
};

/* ─── Permission helpers ─── */
const ACTION_LABELS: Record<Action, string> = {
  read: "Baca",
  create: "Tulis",
  update: "Ubah",
  delete: "Hapus",
};

type PermissionLevel = "full" | "read_only" | "none";

function getPermissionLevel(
  role: Role,
  resource: Resource,
): { level: PermissionLevel; actions: Action[]; label: string; color: string; bg: string } {
  const allowed = (["read", "create", "update", "delete"] as Action[]).filter(
    (a) => can(role, resource, a),
  );

  if (allowed.length === 4) {
    return {
      level: "full",
      actions: allowed,
      label: "Full Akses",
      color: DS.colors.positive,
      bg: DS.colors.positiveBg,
    };
  }
  if (allowed.length > 0) {
    return {
      level: "read_only",
      actions: allowed,
      label: "Read Only",
      color: DS.colors.secondary,
      bg: DS.colors.surfaceContainerLow,
    };
  }
  return {
    level: "none",
    actions: [],
    label: "Tidak Ada Akses",
    color: DS.colors.outline,
    bg: DS.colors.surfaceContainer,
  };
}

const ROLE_OPTIONS = ROLES.map((r) => ({
  value: r,
  label: ROLE_CONFIG[r].label,
}));

/* ─── Types ─── */
type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
};

/* ─── Permission Level Badge ─── */
function PermissionBadge({
  level,
  label,
  color,
  bg,
}: {
  level: PermissionLevel;
  label: string;
  color: string;
  bg: string;
}) {
  const dotColor =
    level === "full"
      ? DS.colors.positive
      : level === "read_only"
        ? DS.colors.secondary
        : DS.colors.outline;

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ backgroundColor: bg, color }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: dotColor }}
      />
      {label}
    </span>
  );
}

/* ─── Access Request Card (permission-based) ─── */
function AccessRequestCard({
  resource,
  role,
}: {
  resource: Resource;
  role: Role;
}) {
  const { label, desc } = RESOURCE_CONFIG[resource];
  const perm = getPermissionLevel(role, resource);

  return (
    <motion.div
      className="flex items-center gap-4 p-4 rounded-xl"
      style={{
        backgroundColor: DS.colors.surfaceContainerLowest,
        border: `1px solid ${DS.colors.border}`,
        boxShadow: DS.shadow.level1,
      }}
      whileHover={{ boxShadow: DS.shadow.level2, y: -1 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className="w-10 h-10 flex items-center justify-center rounded-lg shrink-0"
        style={{ backgroundColor: perm.bg }}
      >
        <KeyRound
          className="w-5 h-5"
          style={{ color: perm.color }}
        />
      </div>

      <div className="flex-1 min-w-0">
        <h4
          className="text-sm font-bold"
          style={{ color: DS.colors.onSurface }}
        >
          {label}
        </h4>
        <p className="text-xs" style={{ color: DS.colors.outline }}>
          {perm.actions.length > 0
            ? perm.actions.map((a) => ACTION_LABELS[a]).join(", ")
            : desc}
        </p>
      </div>

      <div className="shrink-0">
        <PermissionBadge
          level={perm.level}
          label={perm.label}
          color={perm.color}
          bg={perm.bg}
        />
      </div>
    </motion.div>
  );
}

/* ─── Role Change Form ─── */
function RoleChangeSection({ user }: { user: UserProfile }) {
  const [selectedRole, setSelectedRole] = useState<Role>(user.role);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsSubmitting(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label
          className="block text-xs font-semibold uppercase tracking-wider mb-2"
          style={{ color: DS.colors.onSurfaceVariant }}
        >
          Jabatan Saat Ini
        </label>
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{
            backgroundColor: DS.colors.surfaceContainerLowest,
            border: `1px solid ${DS.colors.border}`,
            boxShadow: DS.shadow.level1,
          }}
        >
          <div
            className="w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold"
            style={{
              backgroundColor: ROLE_CONFIG[user?.role || "bendahara"].bg,
              color: ROLE_CONFIG[user?.role || "bendahara"].color,
            }}
          >
            {user?.name
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2) || "?"}
          </div>
          <div>
            <p
              className="text-sm font-bold"
              style={{ color: DS.colors.onSurface }}
            >
              {user?.name || "Memuat..."}
            </p>
            <p className="text-xs" style={{ color: DS.colors.outline }}>
              {ROLE_CONFIG[user?.role || "bendahara"].label}
            </p>
          </div>
        </div>
      </div>

      <div>
        <label
          className="block text-xs font-semibold uppercase tracking-wider mb-2"
          style={{ color: DS.colors.onSurfaceVariant }}
        >
          Ajukan Perubahan Jabatan
        </label>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value as Role)}
          className="w-full px-4 py-3 rounded-xl border text-sm appearance-none cursor-pointer focus:ring-2 focus:ring-ring transition-all"
          style={{
            backgroundColor: DS.colors.surfaceContainerLowest,
            borderColor: DS.colors.border,
            color: DS.colors.onSurface,
            boxShadow: DS.shadow.level1,
          }}
        >
          {ROLE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="flex items-center justify-end mt-1">
          <p className="text-[11px]" style={{ color: DS.colors.outline }}>
            Pilih jabatan yang ingin diajukan
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || selectedRole === user?.role}
        className="w-full py-3 px-4 font-semibold text-sm rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        style={{
          ...btnPrimary,
          opacity: selectedRole === user?.role ? 0.5 : 1,
        }}
        onMouseEnter={(e) => {
          if (selectedRole === user?.role) return;
          e.currentTarget.style.backgroundColor = DS.colors.tertiaryContainer;
          e.currentTarget.style.boxShadow = DS.shadow.level2;
          e.currentTarget.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          if (selectedRole === user?.role) return;
          e.currentTarget.style.backgroundColor = DS.colors.primaryContainer;
          e.currentTarget.style.boxShadow = "0 4px 14px 0 rgba(6,78,59,0.25)";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Mengirim Permintaan...
          </>
        ) : (
          <>
            <Shield className="w-4 h-4" />
            Ajukan Perubahan Hak Akses
          </>
        )}
      </button>

      {submitted && (
        <motion.div
          className="flex items-center gap-2 px-4 py-3 rounded-xl"
          style={{
            backgroundColor: DS.colors.positiveBg,
            border: `1px solid ${DS.colors.positiveBorder}`,
          }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <CheckCircle2
            className="w-5 h-5 shrink-0"
            style={{ color: DS.colors.positive }}
          />
          <span
            className="text-sm font-medium"
            style={{ color: DS.colors.positive }}
          >
            Permintaan berhasil dikirim! Menunggu persetujuan admin.
          </span>
        </motion.div>
      )}
    </form>
  );
}

/* ─── Loading Skeleton ─── */
function ProfileSkeleton() {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: DS.colors.surface }}
    >
      <main className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl animate-pulse"
              style={{ backgroundColor: DS.colors.surfaceContainer }}
            />
            <div>
              <div
                className="h-7 w-48 rounded-lg animate-pulse"
                style={{ backgroundColor: DS.colors.surfaceContainer }}
              />
              <div
                className="h-4 w-64 rounded-lg mt-1 animate-pulse"
                style={{ backgroundColor: DS.colors.surfaceContainerLow }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div
              className="p-6 rounded-3xl"
              style={{
                backgroundColor: DS.colors.surfaceContainerLowest,
                border: `1px solid ${DS.colors.border}`,
              }}
            >
              <div className="flex flex-col items-center mb-6">
                <div
                  className="w-20 h-20 rounded-full animate-pulse mb-3"
                  style={{ backgroundColor: DS.colors.surfaceContainer }}
                />
                <div
                  className="h-5 w-32 rounded-lg animate-pulse"
                  style={{ backgroundColor: DS.colors.surfaceContainer }}
                />
                <div
                  className="h-3 w-40 rounded-lg mt-2 animate-pulse"
                  style={{ backgroundColor: DS.colors.surfaceContainerLow }}
                />
              </div>
              <div className="flex flex-col gap-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl"
                  >
                    <div
                      className="w-9 h-9 rounded-lg animate-pulse shrink-0"
                      style={{ backgroundColor: DS.colors.surfaceContainer }}
                    />
                    <div className="flex-1">
                      <div
                        className="h-3 w-16 rounded animate-pulse"
                        style={{
                          backgroundColor: DS.colors.surfaceContainerLow,
                        }}
                      />
                      <div
                        className="h-4 w-32 rounded mt-1.5 animate-pulse"
                        style={{
                          backgroundColor: DS.colors.surfaceContainer,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div
              className="p-6 rounded-3xl"
              style={{
                backgroundColor: DS.colors.surfaceContainerLowest,
                border: `1px solid ${DS.colors.border}`,
              }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-10 h-10 rounded-xl animate-pulse"
                  style={{ backgroundColor: DS.colors.surfaceContainer }}
                />
                <div>
                  <div
                    className="h-5 w-40 rounded-lg animate-pulse"
                    style={{ backgroundColor: DS.colors.surfaceContainer }}
                  />
                  <div
                    className="h-3 w-56 rounded-lg mt-1 animate-pulse"
                    style={{ backgroundColor: DS.colors.surfaceContainerLow }}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 rounded-xl"
                    style={{ border: `1px solid ${DS.colors.border}` }}
                  >
                    <div
                      className="w-10 h-10 rounded-lg animate-pulse shrink-0"
                      style={{ backgroundColor: DS.colors.surfaceContainer }}
                    />
                    <div className="flex-1">
                      <div
                        className="h-4 w-40 rounded animate-pulse"
                        style={{
                          backgroundColor: DS.colors.surfaceContainer,
                        }}
                      />
                      <div
                        className="h-3 w-28 rounded mt-1.5 animate-pulse"
                        style={{
                          backgroundColor: DS.colors.surfaceContainerLow,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ─── Main Profile Page ─── */
export default function ProfilPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [fetchKey, setFetchKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();

        if (cancelled) return;

        if (!res.ok) {
          setError(data.error || "Gagal memuat data profil");
          return;
        }

        setUser(data.user);
      } catch {
        if (!cancelled) {
          setError("Terjadi kesalahan saat memuat data profil");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [fetchKey]);

  if (loading) return <ProfileSkeleton />;

  if (error || !user) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: DS.colors.surface }}
      >
        <div
          className="flex flex-col items-center gap-4 p-8 rounded-3xl"
          style={{
            backgroundColor: DS.colors.surfaceContainerLowest,
            border: `1px solid ${DS.colors.border}`,
            boxShadow: DS.shadow.level1,
          }}
        >
          <div
            className="w-14 h-14 flex items-center justify-center rounded-full"
            style={{ backgroundColor: DS.colors.errorContainer }}
          >
            <AlertCircle
              className="w-7 h-7"
              style={{ color: DS.colors.error }}
            />
          </div>
          <div className="text-center">
            <h2
              className="text-lg font-bold mb-1"
              style={{ color: DS.colors.onSurface }}
            >
              Gagal Memuat Profil
            </h2>
            <p className="text-sm" style={{ color: DS.colors.outline }}>
              {error || "Terjadi kesalahan"}
            </p>
          </div>
          <button
            onClick={() => {
              setLoading(true);
              setError(null);
              setUser(null);
              setFetchKey((k) => k + 1);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
            style={{
              backgroundColor: DS.colors.primaryContainer,
              color: DS.colors.onPrimary,
            }}
          >
            <Loader2 className="w-4 h-4" />
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  const joinedDate = new Date(user.createdAt).toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: DS.colors.surface }}
    >
      <main className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 flex items-center justify-center rounded-xl"
              style={{ backgroundColor: DS.colors.primaryContainer }}
            >
              <User
                className="w-5 h-5"
                style={{ color: DS.colors.onPrimary }}
              />
            </div>
            <div>
              <h1
                className="text-2xl md:text-3xl font-extrabold tracking-tight"
                style={{ color: DS.colors.onSurface, letterSpacing: "-0.02em" }}
              >
                Profil Saya
              </h1>
              <p
                className="text-sm"
                style={{ color: DS.colors.onSurfaceVariant }}
              >
                Kelola data pribadi dan ajukan hak akses Anda
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Profile Info + Role */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Profile Card */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={1}
              className="p-6"
              style={{
                ...cardBase,
                borderRadius: "1.5rem",
              }}
            >
              {/* Avatar */}
              <div className="flex flex-col items-center mb-6">
                <div
                  className="w-20 h-20 flex items-center justify-center rounded-full text-xl font-extrabold shadow-lg mb-3"
                  style={{
                    backgroundColor: DS.colors.primaryContainer,
                    color: DS.colors.onPrimary,
                    boxShadow: `0 4px 14px 0 rgba(6,78,59,0.25)`,
                  }}
                >
                  {initials}
                </div>
                <h2
                  className="text-lg font-extrabold"
                  style={{ color: DS.colors.onSurface }}
                >
                  {user.name}
                </h2>
                <p className="text-xs" style={{ color: DS.colors.outline }}>
                  Anggota sejak {joinedDate}
                </p>
              </div>

              {/* Info Fields */}
              <div className="flex flex-col gap-3">
                {/* Nama */}
                <div className="flex items-center gap-3 p-3 rounded-xl">
                  <div
                    className="w-9 h-9 flex items-center justify-center rounded-lg shrink-0"
                    style={{ backgroundColor: DS.colors.surfaceContainer }}
                  >
                    <User
                      className="w-4 h-4"
                      style={{ color: DS.colors.primaryContainer }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[11px] font-semibold uppercase tracking-wider"
                      style={{ color: DS.colors.outline }}
                    >
                      Nama
                    </p>
                    <p
                      className="text-sm font-medium"
                      style={{ color: DS.colors.onSurface }}
                    >
                      {user.name}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-3 p-3 rounded-xl">
                  <div
                    className="w-9 h-9 flex items-center justify-center rounded-lg shrink-0"
                    style={{ backgroundColor: DS.colors.surfaceContainer }}
                  >
                    <Mail
                      className="w-4 h-4"
                      style={{ color: DS.colors.primaryContainer }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[11px] font-semibold uppercase tracking-wider"
                      style={{ color: DS.colors.outline }}
                    >
                      Email
                    </p>
                    <p
                      className="text-sm font-medium truncate"
                      style={{ color: DS.colors.onSurface }}
                    >
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Jabatan */}
                <div className="flex items-center gap-3 p-3 rounded-xl">
                  <div
                    className="w-9 h-9 flex items-center justify-center rounded-lg shrink-0"
                    style={{ backgroundColor: ROLE_CONFIG[user.role].bg }}
                  >
                    <Briefcase
                      className="w-4 h-4"
                      style={{ color: ROLE_CONFIG[user.role].color }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[11px] font-semibold uppercase tracking-wider"
                      style={{ color: DS.colors.outline }}
                    >
                      Jabatan
                    </p>
                    <p
                      className="text-sm font-bold"
                      style={{ color: ROLE_CONFIG[user.role].color }}
                    >
                      {ROLE_CONFIG[user.role].label}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 gap-6">
              <div className="lg:col-span-4">
                <motion.div
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  custom={2}
                  className="p-6"
                  style={{
                    ...cardBase,
                    borderRadius: "1.5rem",
                  }}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className="w-10 h-10 flex items-center justify-center rounded-xl"
                      style={{ backgroundColor: DS.colors.surfaceContainer }}
                    >
                      <Shield
                        className="w-5 h-5"
                        style={{ color: DS.colors.primaryContainer }}
                      />
                    </div>
                    <div>
                      <h3
                        className="text-lg font-extrabold"
                        style={{ color: DS.colors.onSurface }}
                      >
                        Pengajuan Hak Akses
                      </h3>
                      <p
                        className="text-xs"
                        style={{ color: DS.colors.onSurfaceVariant }}
                      >
                        Ubah jabatan atau ajukan akses
                      </p>
                    </div>
                  </div>

                  <RoleChangeSection user={user} />
                </motion.div>
              </div>
            </div>
          </div>

          {/* Right Column: Access Rights */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Hak Akses Saya */}
            <div className="grid grid-cols-1 gap-6">
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={3}
                className="lg:col-span-8"
              >
                <div
                  className="p-6"
                  style={{
                    ...cardBase,
                    borderRadius: "1.5rem",
                  }}
                >
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 flex items-center justify-center rounded-xl"
                        style={{ backgroundColor: DS.colors.surfaceContainer }}
                      >
                        <KeyRound
                          className="w-5 h-5"
                          style={{ color: DS.colors.primaryContainer }}
                        />
                      </div>
                      <div>
                        <h3
                          className="text-lg font-extrabold"
                          style={{ color: DS.colors.onSurface }}
                        >
                          Hak Akses Saya
                        </h3>
                        <p
                          className="text-xs"
                          style={{ color: DS.colors.onSurfaceVariant }}
                        >
                          Status izin akses untuk setiap modul
                        </p>
                      </div>
                    </div>

                    {user && (
                      <div className="flex items-center gap-2">
                        {(() => {
                          const fullCount = RESOURCES.filter(
                            (r) => getPermissionLevel(user.role, r).level === "full",
                          ).length;
                          const readOnlyCount = RESOURCES.filter(
                            (r) => getPermissionLevel(user.role, r).level === "read_only",
                          ).length;
                          const noneCount = RESOURCES.filter(
                            (r) => getPermissionLevel(user.role, r).level === "none",
                          ).length;

                          return (
                            <>
                              {fullCount > 0 && (
                                <span
                                  className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                                  style={{
                                    backgroundColor: DS.colors.positiveBg,
                                    color: DS.colors.positive,
                                  }}
                                >
                                  {fullCount} Full Akses
                                </span>
                              )}
                              {readOnlyCount > 0 && (
                                <span
                                  className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                                  style={{
                                    backgroundColor: DS.colors.surfaceContainerLow,
                                    color: DS.colors.secondary,
                                  }}
                                >
                                  {readOnlyCount} Read Only
                                </span>
                              )}
                              {noneCount > 0 && (
                                <span
                                  className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                                  style={{
                                    backgroundColor: DS.colors.surfaceContainer,
                                    color: DS.colors.outline,
                                  }}
                                >
                                  {noneCount} Tidak Ada
                                </span>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-3">
                    {user &&
                      RESOURCES.map((resource) => (
                        <AccessRequestCard
                          key={resource}
                          resource={resource}
                          role={user.role}
                        />
                      ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Riwayat Aktivitas */}
            <div className="lg:col-span-4">
              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={4}
                className="p-6"
                style={{
                  ...cardBase,
                  borderRadius: "1.5rem",
                }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-10 h-10 flex items-center justify-center rounded-xl"
                    style={{ backgroundColor: DS.colors.surfaceContainer }}
                  >
                    <Clock
                      className="w-5 h-5"
                      style={{ color: DS.colors.primaryContainer }}
                    />
                  </div>
                  <div>
                    <h3
                      className="text-lg font-extrabold"
                      style={{ color: DS.colors.onSurface }}
                    >
                      Riwayat Aktivitas
                    </h3>
                    <p
                      className="text-xs"
                      style={{ color: DS.colors.onSurfaceVariant }}
                    >
                      Catatan perubahan hak akses
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {[
                    {
                      date: "20 Jun 2025",
                      action: "Akses Keuangan disetujui",
                      type: "approved",
                    },
                    {
                      date: "18 Jun 2025",
                      action: "Akses Aset disetujui",
                      type: "approved",
                    },
                    {
                      date: "15 Jun 2025",
                      action: "Akses Produk & Stok disetujui",
                      type: "approved",
                    },
                    {
                      date: "12 Jun 2025",
                      action: "Akses Penjualan diajukan",
                      type: "pending",
                    },
                    {
                      date: "10 Jun 2025",
                      action: "Akses User Management diajukan",
                      type: "pending",
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div
                          className="w-2.5 h-2.5 rounded-full mt-1.5"
                          style={{
                            backgroundColor:
                              item.type === "approved"
                                ? DS.colors.positive
                                : "#fbbf24",
                          }}
                        />
                        {i < 4 && (
                          <div
                            className="w-px flex-1 mt-1"
                            style={{
                              backgroundColor: DS.colors.border,
                              minHeight: "24px",
                            }}
                          />
                        )}
                      </div>
                      <div className="flex-1 pb-3">
                        <div className="flex items-center justify-between">
                          <span
                            className="text-sm font-medium"
                            style={{ color: DS.colors.onSurface }}
                          >
                            {item.action}
                          </span>
                          <span
                            className="text-[11px] shrink-0 ml-2"
                            style={{ color: DS.colors.outline }}
                          >
                            {item.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
