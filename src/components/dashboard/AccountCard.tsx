"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, TrendingUp, TrendingDown } from "lucide-react";
import { useKeuanganSummary } from "@/features/keuangan/hooks/useKeuanganSummary";
import { formatCurrency } from "@/features/keuangan/utils/formatCurrency";

export function AccountCard() {
  const { summary, isLoading } = useKeuanganSummary();
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

  const totalSaldo = summary?.totalSaldo ?? 0;
  const percentageChange = summary?.percentageChange;
  const currentPemasukan = summary?.currentMonth.pemasukan ?? 0;
  const currentPengeluaran = summary?.currentMonth.pengeluaran ?? 0;

  const hasChange = percentageChange !== undefined && percentageChange !== null;
  const isPositiveChange = hasChange && percentageChange >= 0;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
          Total Saldo
        </p>
        <button
          onClick={() => setIsBalanceVisible(!isBalanceVisible)}
          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          aria-label={isBalanceVisible ? "Sembunyikan saldo" : "Tampilkan saldo"}
        >
          {isBalanceVisible ? (
            <Eye className="h-4 w-4" />
          ) : (
            <EyeOff className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Balance + Percentage */}
      <div className="mb-5 flex items-baseline gap-3">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          {isLoading
            ? "Memuat..."
            : isBalanceVisible
              ? formatCurrency(totalSaldo)
              : "••••••••"}
        </h2>
        {hasChange && !isLoading && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
              isPositiveChange
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-600"
            }`}
          >
            {isPositiveChange ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {isPositiveChange ? "+" : ""}
            {percentageChange}%
          </span>
        )}
        {hasChange && !isLoading && (
          <span className="text-xs text-gray-400">dari bulan lalu</span>
        )}
      </div>

      {/* Stat Cards */}
      <div className="mb-5 grid grid-cols-2 gap-3">
        {/* Pemasukan */}
        <div className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-3">
          <div className="mb-1 flex items-center gap-1.5">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100">
              <TrendingUp className="h-3 w-3 text-emerald-600" />
            </div>
            <span className="text-[10px] font-medium uppercase tracking-wider text-emerald-600">
              Pemasukan
            </span>
          </div>
          <p className="text-sm font-bold text-emerald-700">
            {isLoading ? "—" : formatCurrency(currentPemasukan)}
          </p>
        </div>

        {/* Pengeluaran */}
        <div className="rounded-lg border border-red-100 bg-red-50/50 p-3">
          <div className="mb-1 flex items-center gap-1.5">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100">
              <TrendingDown className="h-3 w-3 text-red-500" />
            </div>
            <span className="text-[10px] font-medium uppercase tracking-wider text-red-500">
              Pengeluaran
            </span>
          </div>
          <p className="text-sm font-bold text-red-600">
            {isLoading ? "—" : formatCurrency(currentPengeluaran)}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="mb-5 h-px bg-gray-100" />

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Link
          href="/keuangan"
          className="flex-1 rounded-lg bg-[#064e3b] px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-[#054231]"
        >
          Catat Transaksi
        </Link>
        <Link
          href="/rab"
          className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Cek RAB
        </Link>
      </div>
    </div>
  );
}
