"use client";

import { useKeuangan } from "@/features/keuangan/hooks/useKeuangan";
import { formatCurrency } from "@/features/keuangan/utils/formatCurrency";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

const paymentMethodLabels: Record<string, string> = {
  GOPAY: "Gopay",
  OVO: "Ovo",
  SHOPEEPAY: "ShopeePay",
  DANA: "Dana",
  QRIS: "QRIS",
  BANK_TRANSFER: "Transfer",
  CASH: "Tunai",
  NEVBANK_PRIMARY: "NevBank",
};

export function RecentTransactions() {
  const { transactions, isLoading } = useKeuangan();

  // Sort by date descending, take top 7
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 7);

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
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">TANGGAL</th>
                <th className="px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">NAMA</th>
                <th className="px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">KATEGORI</th>
                <th className="px-3 py-2.5 text-center text-[10px] font-bold uppercase tracking-wider text-gray-400">METODE</th>
                <th className="px-3 py-2.5 text-right text-[10px] font-bold uppercase tracking-wider text-gray-400">JUMLAH</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-100 animate-pulse">
                    <td className="px-3 py-3"><div className="h-3 w-16 rounded bg-gray-100" /></td>
                    <td className="px-3 py-3"><div className="h-3 w-32 rounded bg-gray-100" /></td>
                    <td className="px-3 py-3"><div className="h-5 w-20 rounded-full bg-gray-100" /></td>
                    <td className="px-3 py-3"><div className="mx-auto h-4 w-16 rounded bg-gray-100" /></td>
                    <td className="px-3 py-3"><div className="ml-auto h-3 w-24 rounded bg-gray-100" /></td>
                  </tr>
                ))
              ) : recentTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8">
                    <p className="text-sm text-muted-foreground">Belum ada transaksi</p>
                  </td>
                </tr>
              ) : (
                recentTransactions.map((tx) => {
                  const isPengeluaran = tx.type === "pengeluaran";
                  const categoryColor =
                    tx.category?.bgColor && tx.category?.color
                      ? { backgroundColor: tx.category.bgColor, color: tx.category.color }
                      : isPengeluaran
                        ? { backgroundColor: "#fff2db", color: "#f62440" }
                        : { backgroundColor: "#ecfdf5", color: "#047857" };
                  const prefix = isPengeluaran ? "-" : "+";
                  const formattedDate = new Date(tx.date).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  });
                  const methodLabel = paymentMethodLabels[tx.paymentMethod] || tx.paymentMethod;

                  return (
                    <tr key={tx.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                      <td className="px-3 py-3 text-xs text-gray-500">{formattedDate}</td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="flex size-7 items-center justify-center rounded-lg shrink-0"
                            style={{ backgroundColor: tx.category?.bgColor || "#e8f4f8" }}
                          >
                            {isPengeluaran ? (
                              <ArrowUpRight size={14} className="text-rose-600" />
                            ) : (
                              <ArrowDownLeft size={14} className="text-emerald-600" />
                            )}
                          </div>
                          <span className="text-xs font-bold text-gray-800 truncate">{tx.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                          style={categoryColor}
                        >
                          {tx.category?.name ?? "Umum"}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center text-xs font-medium text-gray-600">{methodLabel}</td>
                      <td className="px-3 py-3 text-right text-xs font-bold text-gray-600">
                        {prefix} {formatCurrency(tx.amount)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
