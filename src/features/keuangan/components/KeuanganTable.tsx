"use client";

import { useState } from "react";
import { Pencil, Trash2, ArrowDownLeft, ArrowUpRight, Loader2 } from "lucide-react";
import type { TransactionRecord } from "../types/keuangan.types";
import { formatCurrency } from "../utils/formatCurrency";

interface KeuanganTableProps {
  transactions: TransactionRecord[];
  isLoading: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

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

export function KeuanganTable({ transactions, isLoading, onEdit, onDelete }: KeuanganTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">NAMA</th>
              <th className="px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">KATEGORI</th>
              <th className="px-3 py-2.5 text-center text-[10px] font-bold uppercase tracking-wider text-gray-400">JUMLAH</th>
              <th className="px-3 py-2.5 text-center text-[10px] font-bold uppercase tracking-wider text-gray-400">METODE</th>
              <th className="px-3 py-2.5 text-center text-[10px] font-bold uppercase tracking-wider text-gray-400">JENIS</th>
              <th className="px-3 py-2.5 text-right text-[10px] font-bold uppercase tracking-wider text-gray-400">HARGA</th>
              <th className="px-3 py-2.5 text-center text-[10px] font-bold uppercase tracking-wider text-gray-400">AKSI</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-gray-100 animate-pulse">
                <td className="px-4 py-3"><div className="h-4 w-32 rounded bg-gray-100" /></td>
                <td className="px-3 py-3"><div className="h-5 w-20 rounded-full bg-gray-100" /></td>
                <td className="px-3 py-3"><div className="mx-auto h-4 w-8 rounded bg-gray-100" /></td>
                <td className="px-3 py-3"><div className="mx-auto h-4 w-16 rounded bg-gray-100" /></td>
                <td className="px-3 py-3"><div className="mx-auto h-5 w-20 rounded-full bg-gray-100" /></td>
                <td className="px-3 py-3"><div className="ml-auto h-4 w-24 rounded bg-gray-100" /></td>
                <td className="px-3 py-3"><div className="mx-auto h-4 w-16 rounded bg-gray-100" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <ArrowDownLeft className="h-7 w-7 text-gray-300" />
        </div>
        <p className="mt-4 text-sm font-medium text-gray-500">Belum ada transaksi</p>
        <p className="mt-1 text-xs text-gray-400">Mulai catat transaksi keuangan pertama kamu</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[700px]">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">NAMA</th>
            <th className="px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">KATEGORI</th>
            <th className="px-3 py-2.5 text-center text-[10px] font-bold uppercase tracking-wider text-gray-400">JUMLAH</th>
            <th className="px-3 py-2.5 text-center text-[10px] font-bold uppercase tracking-wider text-gray-400">METODE</th>
            <th className="px-3 py-2.5 text-center text-[10px] font-bold uppercase tracking-wider text-gray-400">JENIS</th>
            <th className="px-3 py-2.5 text-right text-[10px] font-bold uppercase tracking-wider text-gray-400">HARGA</th>
            <th className="px-3 py-2.5 text-center text-[10px] font-bold uppercase tracking-wider text-gray-400">AKSI</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => {
            const isIncome = tx.type === "pemasukan";
            const dateObj = new Date(tx.date);
            const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
            const day = dayNames[dateObj.getDay()];
            const time = dateObj.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false });
            const dateStr = dateObj.toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" });

            return (
              <tr key={tx.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="flex size-8 items-center justify-center rounded-lg"
                      style={{ backgroundColor: tx.category?.bgColor || "#e8f4f8" }}
                    >
                      {isIncome ? (
                        <ArrowDownLeft size={16} className="text-emerald-600" />
                      ) : (
                        <ArrowUpRight size={16} className="text-rose-600" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-800">{tx.name}</span>
                      <span className="text-[11px] text-gray-400">
                        {day}, {time}
                        <br />
                        {dateStr}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3">
                  {tx.category ? (
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                      style={{
                        backgroundColor: tx.category.bgColor || "#f3f4f6",
                        color: tx.category.color || "#374151",
                      }}
                    >
                      {tx.category.name}
                    </span>
                  ) : (
                    <span className="text-[10px] text-gray-400">—</span>
                  )}
                </td>
                <td className="px-3 py-3 text-center text-xs text-gray-700">{tx.quantity}</td>
                <td className="px-3 py-3 text-center text-xs font-bold text-gray-600">
                  {paymentMethodLabels[tx.paymentMethod] || tx.paymentMethod}
                </td>
                <td className="px-3 py-3">
                  <div className="flex justify-center">
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                      style={{
                        backgroundColor: isIncome ? "#ecfdf5" : "#fff2db",
                        color: isIncome ? "#047857" : "#f62440",
                      }}
                    >
                      {isIncome ? "Pemasukan" : "Pengeluaran"}
                    </span>
                  </div>
                </td>
                <td className="px-3 py-3 text-right text-xs font-bold text-gray-600">
                  {formatCurrency(tx.amount)}
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => onEdit(tx.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                      title="Edit"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(tx.id)}
                      disabled={deletingId === tx.id}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                      title="Hapus"
                    >
                      {deletingId === tx.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
