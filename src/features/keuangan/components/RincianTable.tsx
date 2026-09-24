"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import type { LaporanRincianItem } from "../types/keuangan.types";

interface RincianTableProps {
  data: LaporanRincianItem[];
}

const kategoriTabs = ["Semua Kategori", "Kuliah", "Biaya Hidup", "Operasional"];

export function RincianTable({ data }: RincianTableProps) {
  const [activeKategori, setActiveKategori] = useState("Semua Kategori");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesKategori =
        activeKategori === "Semua Kategori" || item.kategori === activeKategori;
      const matchesSearch =
        searchQuery === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesKategori && matchesSearch;
    });
  }, [data, activeKategori, searchQuery]);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-base font-bold text-[#0f172a]">
            Rincian Evaluasi Pos Anggaran & Realisasi
          </h3>
          <p className="text-xs text-gray-400">
            {data.length > 0
              ? `Total ${filteredData.length} Pos Anggaran Aktif`
              : "Belum ada data anggaran"}
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-56">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama pos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-8 pr-3 text-xs text-gray-700 placeholder-gray-400 focus:border-[#064e3b] focus:outline-none"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mt-4 flex gap-1">
        {kategoriTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveKategori(tab)}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-[10px] font-medium transition-colors ${
              activeKategori === tab
                ? "bg-[#064e3b] text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="mt-4 overflow-x-auto">
        {filteredData.length > 0 ? (
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
                  REALISASI
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="border-b border-gray-100">
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-800">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-gray-400">
                        {item.description}
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
                          style={{ width: `${Math.min(item.progress, 100)}%` }}
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
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-sm font-medium text-gray-500">rincian belum tersedia</p>
            <p className="mt-1 text-xs text-gray-400">Tidak ada data yang cocok dengan filter</p>
          </div>
        )}
      </div>

      {/* Footer */}
      {filteredData.length > 0 && (
        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
          <span className="text-[11px] text-gray-400">
            Menampilkan {filteredData.length} Pos Anggaran Aktif
          </span>
        </div>
      )}
    </div>
  );
}
