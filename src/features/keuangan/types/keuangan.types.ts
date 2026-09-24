// ============================================
// API / DB Types (match Prisma schema)
// ============================================

export interface TransactionRecord {
  id: string;
  userId: string;
  accountName: string | null;
  categoryId: string | null;
  rabItemId: string | null;
  rabItemName: string | null;
  rabSyncMode: "auto" | "manual" | "none";
  name: string;
  type: "pemasukan" | "pengeluaran";
  amount: number;
  quantity: number;
  pricePerUnit: number | null;
  paymentMethod: string;
  date: string;
  notes: string | null;
  receiptUrl: string | null;
  createdAt: string;
  updatedAt: string;
  category?: { id: string; name: string; icon: string | null; color: string | null; bgColor: string | null } | null;
}

export interface TransactionFormData {
  name: string;
  type: "PEMASUKAN" | "PENGELUARAN";
  amount: number;
  quantity: number;
  pricePerUnit?: number | null;
  accountName?: string | null;
  categoryId?: string | null;
  rabItemId?: string | null;
  rabSyncMode?: "auto" | "manual" | "none";
  paymentMethod: string;
  date: string;
  notes?: string | null;
}

export interface AccountInfo {
  id: string;
  name: string;
  type: string;
  bank: string | null;
  balance: number;
}

export interface CategoryInfo {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
  bgColor: string | null;
  type: string;
}

// ============================================
// UI Display Types
// ============================================

export interface Transaction {
  id: string;
  name: string;
  date: string;
  day: string;
  time: string;
  category: string;
  categoryColor: string;
  categoryBg: string;
  quantity: number;
  method: string;
  type: "Pemasukan" | "Pengeluaran";
  typeColor: string;
  typeBg: string;
  price: string;
  iconBg: string;
  iconColor: string;
}

export interface MetricCard {
  label: string;
  value: string;
  iconBg: string;
  iconColor: string;
  icon: string;
  badge?: string;
  badgeBg?: string;
  badgeColor?: string;
  description?: string;
  descriptionColor?: string;
}

// ============================================
// Laporan Types
// ============================================

export interface LaporanMetrics {
  totalBudget: number;
  totalRealization: number;
  remaining: number;
  efficiency: number;
  activeProjectCount: number;
  activeItemCount: number;
}

export interface LaporanChartData {
  name: string;
  paguAnggaran: number;
  realisasiTerpakai: number;
  efisiensi: string;
}

export interface LaporanRincianItem {
  id: string;
  name: string;
  description: string;
  kategori: string;
  kategoriColor: string;
  kategoriBg: string;
  prioritas: string;
  prioritasColor: string;
  prioritasBg: string;
  progress: number;
  jumlah: number;
  realisasi: string;
}

export interface LaporanData {
  metrics: LaporanMetrics;
  chartData: LaporanChartData[];
  items: LaporanRincianItem[];
}
