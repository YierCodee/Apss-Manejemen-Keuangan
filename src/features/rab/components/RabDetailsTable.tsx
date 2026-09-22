"use client";

import { useState, useMemo } from "react";
import type { RabProjectData, RabItemData } from "@/features/rab/hooks/useRab";

interface RabDetailsTableProps {
  projects: RabProjectData[];
  items: (RabItemData & { projectName: string; quarter: string; year: number })[];
  isLoading: boolean;
  error: string | null;
}

interface PriorityStyle {
  label: string;
  color: string;
  bg: string;
}

const PRIORITY_MAP: Record<string, PriorityStyle> = {
  "on-track": { label: "On Track", color: "text-emerald-700", bg: "bg-emerald-50" },
  high: { label: "High", color: "text-rose-700", bg: "bg-rose-50" },
  medium: { label: "Medium", color: "text-amber-700", bg: "bg-amber-50" },
  low: { label: "Low", color: "text-gray-600", bg: "bg-gray-100" },
};

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-20 rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-emerald-500"
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
      <span className="text-xs text-gray-500">{value}%</span>
    </div>
  );
}

function formatCurrency(value: number): string {
  return "Rp " + value.toLocaleString("id-ID");
}

function TableSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="h-3 w-28 animate-pulse rounded bg-gray-100" />
          <div className="h-3 w-20 animate-pulse rounded bg-gray-100" />
          <div className="h-3 w-16 animate-pulse rounded bg-gray-100" />
          <div className="h-3 w-20 animate-pulse rounded bg-gray-100" />
        </div>
      ))}
    </div>
  );
}

export function RabDetailsTable({
  projects,
  items,
  isLoading,
  error,
}: RabDetailsTableProps) {
  const [activeTab, setActiveTab] = useState("Semua Kategori");

  // Extract unique categories from items (use categoryName for display)
  const categories = useMemo(() => {
    const cats = new Set(items.map((item) => item.categoryName).filter(Boolean));
    return ["Semua Kategori", ...Array.from(cats)] as string[];
  }, [items]);

  // Filter items by selected category
  const filteredItems = useMemo(() => {
    if (activeTab === "Semua Kategori") return items;
    return items.filter((item) => item.categoryName === activeTab);
  }, [items, activeTab]);

  // Determine subtitle from active project(s)
  const subtitle = useMemo(() => {
    if (projects.length === 0) return "Belum ada data anggaran";
    const latest = projects[0];
    const itemTotal = items.length;
    return `${latest.quarter} ${latest.year} - ${itemTotal} Pos Anggaran`;
  }, [projects, items]);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5">
      {/* Header */}
      <div className="flex flex-col gap-0.5">
        <h3 className="text-base font-bold text-[#0f172a]">
          Rincian Anggaran & Realisasi (RAB)
        </h3>
        <p className="text-xs text-gray-400">{subtitle}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs ${
              activeTab === cat
                ? "bg-[#064e3b] font-semibold text-white"
                : "bg-gray-100 font-medium text-gray-500"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Table */}
      {isLoading ? (
        <TableSkeleton />
      ) : error ? (
        <div className="py-8 text-center text-sm text-red-500">{error}</div>
      ) : filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-sm font-medium text-gray-500">
            Belum ada pos anggaran
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Klik &quot;Buat Pos Anggaran Baru&quot; untuk menambahkan data
          </p>
        </div>
      ) : (
        <div className="overflow-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  NAMA BARANG
                </th>
                <th className="px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  KATEGORI
                </th>
                <th className="px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  PRIORITAS
                </th>
                <th className="px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  PROGRESS
                </th>
                <th className="px-3 py-2.5 text-center text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  JUMLAH
                </th>
                <th className="px-3 py-2.5 text-right text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  HARGA
                </th>
                <th className="px-3 py-2.5 text-right text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  TOTAL
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => {
                const pStyle = PRIORITY_MAP[item.priority] ?? PRIORITY_MAP["on-track"];
                return (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="px-4 py-3">
                      <span className="text-xs font-bold text-gray-800">
                        {item.name}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-left text-xs font-bold text-gray-600">
                      {item.categoryName || "-"}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${pStyle.bg} ${pStyle.color}`}
                      >
                        {pStyle.label}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <ProgressBar value={item.targetProgress} />
                    </td>
                    <td className="px-3 py-3 text-center text-xs text-gray-700">
                      {item.quantity}
                    </td>
                    <td className="px-3 py-3 text-right text-xs font-bold text-gray-600">
                      {formatCurrency(item.pricePerUnit)}
                    </td>
                    <td className="px-3 py-3 text-right text-xs font-bold text-gray-600">
                      {formatCurrency(item.totalBudget)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* View All */}
      {filteredItems.length > 0 && (
        <div className="flex justify-center border-t border-gray-100 pt-3">
          <span className="text-xs text-gray-400">
            Menampilkan {filteredItems.length} dari {items.length} pos anggaran
          </span>
        </div>
      )}
    </div>
  );
}
