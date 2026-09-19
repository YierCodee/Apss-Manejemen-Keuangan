"use client";

import { Search } from "lucide-react";

interface RincianItem {
  nama: string;
  deskripsi: string;
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

const data: RincianItem[] = [
  {
    nama: "Alat Praktikum",
    deskripsi: "Alat Laboratorium",
    kategori: "Praktikum",
    kategoriColor: "#064e3b",
    kategoriBg: "#d1fae5",
    prioritas: "OnTrack",
    prioritasColor: "#064e3b",
    prioritasBg: "#d1fae5",
    progress: 83,
    jumlah: 10,
    realisasi: "Rp 500.000",
  },
  {
    nama: "Skincare",
    deskripsi: "Pembersih Wajah",
    kategori: "Biaya Hidup",
    kategoriColor: "#92400e",
    kategoriBg: "#fef3c7",
    prioritas: "High",
    prioritasColor: "#dc2626",
    prioritasBg: "#fee2e2",
    progress: 83,
    jumlah: 10,
    realisasi: "Rp 500.000",
  },
  {
    nama: "Transportasi",
    deskripsi: "Bensin, Grab/Go",
    kategori: "Operasional",
    kategoriColor: "#1e40af",
    kategoriBg: "#dbeafe",
    prioritas: "Medium",
    prioritasColor: "#d97706",
    prioritasBg: "#fef3c7",
    progress: 83,
    jumlah: 10,
    realisasi: "Rp 500.000",
  },
  {
    nama: "Langganan AI Platform",
    deskripsi: "ChatGPT Plus, Claude Pro, Midjourney",
    kategori: "Langganan AI",
    kategoriColor: "#7c3aed",
    prioritas: "OnTrack",
    prioritasColor: "#064e3b",
    kategoriBg: "#ede9fe",
    prioritasBg: "#d1fae5",
    progress: 92,
    jumlah: 3,
    realisasi: "Rp 1.150.000",
  },
  {
    nama: "Buku & Modul Kuliah",
    deskripsi: "Buku Manajemen Bisnis & Referensi",
    kategori: "Kuliah",
    kategoriColor: "#0369a1",
    kategoriBg: "#e0f2fe",
    prioritas: "Hemat",
    prioritasColor: "#064e3b",
    prioritasBg: "#d1fae5",
    progress: 48,
    jumlah: 5,
    realisasi: "Rp 450.000",
  },
];

const tabs = [
  { label: "Semua Kategori", active: true },
  { label: "Kuliah", active: false },
  { label: "Biaya Hidup", active: false },
  { label: "Operasional", active: false },
];

export function RincianTable() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-base font-bold text-[#0f172a]">
            Rincian Evaluasi Pos Anggaran & Realisasi
          </h3>
          <p className="text-xs text-gray-400">
            Tahun Anggaran 2024 - Kuartal 4 (Status Terkini)
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-56">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama pos..."
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-8 pr-3 text-xs text-gray-700 placeholder-gray-400 focus:border-[#064e3b] focus:outline-none"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mt-4 flex gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-[10px] font-medium ${
              tab.active
                ? "bg-[#064e3b] text-white"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">
                NAMA BARANG / POS
              </th>
              <th className="px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">
                KATEGORI
              </th>
              <th className="px-3 py-2.5 text-center text-[10px] font-bold uppercase tracking-wider text-gray-400">
                PRIORITAS
              </th>
              <th className="px-3 py-2.5 text-center text-[10px] font-bold uppercase tracking-wider text-gray-400">
                PROGRESS REALISASI
              </th>
              <th className="px-3 py-2.5 text-center text-[10px] font-bold uppercase tracking-wider text-gray-400">
                JUMLAH
              </th>
              <th className="px-3 py-2.5 text-right text-[10px] font-bold uppercase tracking-wider text-gray-400">
                REALISASI DUKA
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={i} className="border-b border-gray-100">
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-800">
                      {item.nama}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {item.deskripsi}
                    </span>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                    style={{
                      backgroundColor: item.kategoriBg,
                      color: item.kategoriColor,
                    }}
                  >
                    {item.kategori}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <div className="flex justify-center">
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                      style={{
                        backgroundColor: item.prioritasBg,
                        color: item.prioritasColor,
                      }}
                    >
                      {item.prioritas}
                    </span>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <div className="flex flex-col items-center gap-1">
                    <div className="h-2 w-full max-w-[80px] rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-[#064e3b]"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-gray-500">
                      {item.progress}%
                    </span>
                  </div>
                </td>
                <td className="px-3 py-3 text-center text-xs text-gray-700">
                  {item.jumlah}
                </td>
                <td className="px-3 py-3 text-right text-xs font-bold text-gray-600">
                  {item.realisasi}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
        <span className="text-[11px] text-gray-400">
          Menampilkan 5 dari 18 Pos Anggaran Aktif
        </span>
        <button className="text-xs font-semibold text-[#064e3b] hover:underline">
          Lihat Semua 18 Pos Anggaran RAB Q4 →
        </button>
      </div>
    </div>
  );
}
