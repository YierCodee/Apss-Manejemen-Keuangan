export interface SidebarNavItem {
  label: string;
  href: string;
  icon: string;
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
        label: "Produk & Stok",
        href: "/business-kelompok/produk-stok",
        icon: "Package",
      },
      {
        label: "Keuangan & Aset",
        href: "/business-kelompok/keuangan-aset",
        icon: "CircleDollarSign",
      },
      {
        label: "Transaksi & Penjualan",
        href: "/business-kelompok/transaksi-penjualan",
        icon: "ShoppingBag",
      },
      {
        label: "Laporan Arus Kas",
        href: "/business-kelompok/laporan-arus-kas",
        icon: "LineChart",
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
