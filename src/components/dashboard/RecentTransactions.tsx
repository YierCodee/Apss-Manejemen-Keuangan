import { ChevronRight } from "lucide-react";

interface Transaction {
  date: string;
  item: string;
  category: string;
  categoryColor: string;
  amount: string;
}

const transactions: Transaction[] = [
  {
    date: "Hari ini",
    item: "Nama barang",
    category: "Transportasi",
    categoryColor: "bg-blue-100 text-blue-700",
    amount: "Rp 15.000",
  },
  {
    date: "Hari ini",
    item: "Ayaam Geprek",
    category: "Makanan",
    categoryColor: "bg-orange-100 text-orange-700",
    amount: "Rp 25.000",
  },
  {
    date: "Kemarin",
    item: "Pulsa Listrik",
    category: "Tagihan",
    categoryColor: "bg-red-100 text-red-700",
    amount: "Rp 100.000",
  },
  {
    date: "Kemarin",
    item: "Obat flu",
    category: "Kesehatan",
    categoryColor: "bg-green-100 text-green-700",
    amount: "Rp 15.000",
  },
  {
    date: "2 hari lalu",
    item: "Ayam goreng",
    category: "Makanan",
    categoryColor: "bg-orange-100 text-orange-700",
    amount: "Rp 30.000",
  },
  {
    date: "2 hari lalu",
    item: "bensin motor",
    category: "Transportasi",
    categoryColor: "bg-blue-100 text-blue-700",
    amount: "Rp 15.000",
  },
  {
    date: "3 hari lalu",
    item: "Beli sayur",
    category: "Makanan",
    categoryColor: "bg-orange-100 text-orange-700",
    amount: "Rp 25.000",
  },
];

export function RecentTransactions() {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between p-4 md:p-6 pb-0">
        <div>
          <h3 className="text-lg font-bold">Transaksi Terbaru</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Semua aktivitas transaksi ada disini
          </p>
        </div>
        <button className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent transition-colors">
          Lihat Semua
        </button>
      </div>
      <div className="p-4 md:p-6">
        <div className="space-y-1">
          {transactions.map((tx, i) => (
            <div
              key={i}
              className="flex items-center gap-2 md:gap-4 rounded-lg px-2 md:px-3 py-2.5 md:py-3 hover:bg-accent/50 transition-colors"
            >
              <span className="hidden sm:inline w-20 md:w-24 text-xs text-muted-foreground shrink-0">
                {tx.date}
              </span>
              <span className="flex-1 text-sm font-medium truncate">
                {tx.item}
              </span>
              <span
                className={`hidden md:inline rounded-full px-2.5 py-0.5 text-xs font-medium ${tx.categoryColor}`}
              >
                {tx.category}
              </span>
              <span className="w-20 md:w-24 text-right text-xs md:text-sm font-medium shrink-0">
                {tx.amount}
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
