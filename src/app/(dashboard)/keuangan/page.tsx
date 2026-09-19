"use client";

import { useState } from "react";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { CalendarClock, Car, FileDown, GraduationCap, NotebookPen, Palmtree, Utensils, Wrench } from "lucide-react";
import type { Transaction } from "@/features/keuangan/types/keuangan.types";
import RecordTransactionModal from "@/components/modals/RecordTransactionModal";

const transactions: Transaction[] = [
  {
    id: "1",
    name: "Bensin",
    date: "19-10-2026",
    day: "Kamis",
    time: "09:12",
    category: "Transportasi",
    categoryColor: "#293681",
    categoryBg: "#d0e7e6",
    quantity: 15,
    method: "Gopay",
    type: "Pengeluaran",
    typeColor: "#f62440",
    typeBg: "#fff2db",
    price: "Rp 15.000",
    iconBg: "#e8f4f8",
    iconColor: "#0891b2",
  },
  {
    id: "2",
    name: "Ayaam Geprek",
    date: "19-10-2026",
    day: "Kamis",
    time: "09:12",
    category: "Makanan",
    categoryColor: "#063b00",
    categoryBg: "#e1e100",
    quantity: 15,
    method: "Gopay",
    type: "Pengeluaran",
    typeColor: "#f62440",
    typeBg: "#fff2db",
    price: "Rp 15.000",
    iconBg: "#e1e100",
    iconColor: "#063b00",
  },
  {
    id: "3",
    name: "Langganan Gemini Pro",
    date: "19-10-2026",
    day: "Kamis",
    time: "09:12",
    category: "Layanan",
    categoryColor: "#3b4953",
    categoryBg: "#ebf4dd",
    quantity: 15,
    method: "Gopay",
    type: "Pengeluaran",
    typeColor: "#f62440",
    typeBg: "#fff2db",
    price: "Rp 15.000",
    iconBg: "#ebf4dd",
    iconColor: "#3b4953",
  },
  {
    id: "4",
    name: "Liburan",
    date: "19-10-2026",
    day: "Kamis",
    time: "09:12",
    category: "Liburan",
    categoryColor: "#0d47a1",
    categoryBg: "#e3f2fd",
    quantity: 15,
    method: "Gopay",
    type: "Pengeluaran",
    typeColor: "#f62440",
    typeBg: "#fff2db",
    price: "Rp 15.000",
    iconBg: "#e3f2fd",
    iconColor: "#0d47a1",
  },
  {
    id: "5",
    name: "Pembayaran Praktikum",
    date: "19-10-2026",
    day: "Kamis",
    time: "09:12",
    category: "Kuliah",
    categoryColor: "#4a148c",
    categoryBg: "#f3e5f5",
    quantity: 15,
    method: "Gopay",
    type: "Pengeluaran",
    typeColor: "#f62440",
    typeBg: "#fff2db",
    price: "Rp 15.000",
    iconBg: "#f3e5f5",
    iconColor: "#4a148c",
  },
];

const categoryIcons: Record<string, LucideIcon> = {
  Transportasi: Car,
  Makanan: Utensils,
  Layanan: Wrench,
  Liburan: Palmtree,
  Kuliah: GraduationCap,
};

const tabs = [
  { label: "Semua Transaksi", active: true },
  { label: "Transfer Masuk", active: false },
  { label: "Pembayaran Keluar", active: false },
  { label: "Jadwal Rutin", active: false },
];

export default function KeuanganPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[1280px] px-4 md:px-6 py-5">
        <div className="flex flex-col gap-5">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-col gap-0.5">
              <h1 className="text-xl font-bold leading-7 tracking-tight text-[#0f172a]">
                Manajemen Keuangan
              </h1>
              <p className="text-sm text-gray-500">
                Kelola keuangan kamu agar sesuai dengan RAB
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 shadow-sm">
                Bulan Ini
                <CalendarClock size={14} />
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-[#064e3b] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#044a38] transition-colors"
              >
                <NotebookPen size={14} />
                Catat Transaksi
              </button>
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Total Saldo */}
            <div className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  TOTAL SALDO
                </span>
                <div className="flex size-7 items-center justify-center rounded-full bg-blue-50">
                  <span className="text-xs font-bold text-blue-600">$</span>
                </div>
              </div>
              <h2 className="text-xl font-extrabold tracking-tight text-[#0f172a]">
                RP 5.000.000
              </h2>
              <div className="flex items-center gap-2">
                <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[11px] font-semibold text-blue-700">
                  NevBank Primary
                </span>
                <span className="text-xs text-gray-400">
                  Siap dialokasikan
                </span>
              </div>
            </div>

            {/* Pemasukan Bulan Ini */}
            <div className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  PEMASUKAN BULAN INI
                </span>
                <div className="flex size-7 items-center justify-center rounded-full bg-emerald-50">
                  <span className="text-xs font-bold text-emerald-600">↙</span>
                </div>
              </div>
              <h2 className="text-xl font-extrabold tracking-tight text-[#0f172a]">
                RP 700.000
              </h2>
              <div className="flex items-center gap-2">
                <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                  18 Transaksi
                </span>
                <span className="text-xs text-gray-400">Inflow stabil</span>
              </div>
            </div>

            {/* Pengeluaran Bulan Ini */}
            <div className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  PENGELUARAN BULAN INI
                </span>
                <div className="flex size-7 items-center justify-center rounded-full bg-rose-50">
                  <span className="text-xs font-bold text-rose-600">↗</span>
                </div>
              </div>
              <h2 className="text-xl font-extrabold tracking-tight text-[#0f172a]">
                RP 500.000
              </h2>
              <div className="flex items-center gap-2">
                <span className="rounded bg-rose-50 px-1.5 py-0.5 text-[11px] font-semibold text-rose-700">
                  66% Target
                </span>
                <span className="text-xs text-gray-400">Sesuai pagu RAB</span>
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 md:p-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 gap-3">
              <div className="flex flex-col gap-0.5">
                <h3 className="text-base font-bold text-[#0f172a]">
                  Riwayat Transaksi
                </h3>
                <p className="text-xs text-gray-400">
                  Semua aktiviast transaksi ada disini
                </p>
              </div>
              <button className="flex items-center gap-1.5 rounded-xl bg-[#064e3b] px-3.5 py-1.5 text-xs font-medium text-white shadow-sm self-start">
                <FileDown size={12} />
                Unduh PDF/EXCEL
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.label}
                  className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs ${
                    tab.active
                      ? "bg-[#064e3b] font-semibold text-white"
                      : "bg-gray-100 font-medium text-gray-500"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      NAMA
                    </th>
                    <th className="px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      KATEGORI
                    </th>
                    <th className="px-3 py-2.5 text-center text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      JUMLAH
                    </th>
                    <th className="px-3 py-2.5 text-center text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      METODE
                    </th>
                    <th className="px-3 py-2.5 text-center text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      JENIS
                    </th>
                    <th className="px-3 py-2.5 text-right text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      HARGA
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-gray-100">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="flex size-8 items-center justify-center rounded-lg"
                            style={{ backgroundColor: tx.iconBg }}
                          >
                            {(() => {
                              const IconComponent = categoryIcons[tx.category];
                              return IconComponent ? (
                                <IconComponent size={16} color={tx.iconColor} />
                              ) : (
                                <Image
                                  src="/finance/fast-food.svg"
                                  alt={tx.name}
                                  width={16}
                                  height={16}
                                />
                              );
                            })()}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-gray-800">
                              {tx.name}
                            </span>
                            <span className="text-[11px] text-gray-400">
                              {tx.day}, {tx.time}
                              <br />
                              {tx.date}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                          style={{
                            backgroundColor: tx.categoryBg,
                            color: tx.categoryColor,
                          }}
                        >
                          {tx.category}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center text-xs text-gray-700">
                        {tx.quantity}
                      </td>
                      <td className="px-3 py-3 text-center text-xs font-bold text-gray-600">
                        {tx.method}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex justify-center">
                          <span
                            className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                            style={{
                              backgroundColor: tx.typeBg,
                              color: tx.typeColor,
                            }}
                          >
                            {tx.type}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-right text-xs font-bold text-gray-600">
                        {tx.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* View All Link */}
            <div className="flex justify-center border-t border-gray-100 pt-3">
              <button className="text-xs font-semibold text-[#064e3b] hover:underline">
                Lihat Seluruh Riwayat Mutasi (148 Transaksi) →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Record Transaction Modal */}
      <RecordTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
