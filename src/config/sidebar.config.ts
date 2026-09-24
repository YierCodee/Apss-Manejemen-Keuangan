import type { Role } from "@/lib/permissions";

export interface SidebarNavItem {
  label: string;
  href: string;
  icon: string;
  /** Roles that can see this item. Empty/undefined = all roles. */
  roles?: Role[];
}

export interface SidebarSection {
  label: string;
  items: SidebarNavItem[];
}

export const sidebarConfig: SidebarSection[] = [
  {
    label: "MENU UTAMA",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: "LayoutDashboard",
      },
      {
        label: "Keuangan",
        href: "/keuangan",
        icon: "CreditCard",
      },
      {
        label: "RAB",
        href: "/rab",
        icon: "FileText",
      },
      {
        label: "Laporan Keuangan",
        href: "/keuangan/laporan",
        icon: "BarChart",
      },
    ],
  },
  {
    label: "BUSINESS KELOMPOK",
    items: [
       {
        label: "Dashboard Penjualan",
        href: "/business-kelompok/dashboard-penjualan",
        icon: "LayoutDashboard",
        roles: ["super_admin", "bendahara", "operasional", "pemasaran"],
      },
      {
        label: "Produk & Stok",
        href: "/business-kelompok/produk-stok",
        icon: "Package",
        roles: ["super_admin", "bendahara", "operasional", "pemasaran"],
      },
      {
        label: "Keuangan & Aset",
        href: "/business-kelompok/keuangan-aset",
        icon: "CircleDollarSign",
        roles: ["super_admin", "bendahara", "operasional", "pemasaran"],
      },
      {
        label: "Transaksi & Penjualan",
        href: "/business-kelompok/transaksi-penjualan",
        icon: "ShoppingBag",
        roles: ["super_admin", "bendahara", "operasional", "pemasaran"],
      },
      {
        label: "Laporan Arus Kas",
        href: "/business-kelompok/laporan-arus-kas",
        icon: "LineChart",
        roles: ["super_admin", "bendahara", "operasional", "pemasaran"],
      },
    ],
  },
  {
    label: "ADMINISTRASI",
    items: [
      {
        label: "User Management",
        href: "/admin/user-management",
        icon: "Users",
        roles: ["super_admin"],
      },
    ],
  },
];

export const userProfile = {
  name: "Dorothy Watkins",
  email: "dorothy@nevbank.cc",
  avatar: "DW",
};

export const logoutItem = {
  label: "Log out",
  href: "/logout",
  icon: "LogOut",
};
