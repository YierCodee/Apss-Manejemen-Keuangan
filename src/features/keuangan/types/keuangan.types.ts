export interface Keuangan {
  id: string;
  name: string;
  amount: number;
  date: string;
  category: string;
}

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
