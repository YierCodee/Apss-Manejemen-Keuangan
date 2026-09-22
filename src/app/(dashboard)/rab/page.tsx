"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { FileText, FileSpreadsheet } from "lucide-react";
import { useRab } from "@/features/rab/hooks/useRab";
import { RabSummaryCards } from "@/features/rab/components/RabSummaryCards";
import { RabDetailsTable } from "@/features/rab/components/RabDetailsTable";
import { RabAllocationChart } from "@/features/rab/components/RabAllocationChart";
import RabFormModal from "@/components/modals/RabFormModal";
import { exportToPDF, exportToExcel } from "@/features/rab/utils/exportRab";

export default function RabPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);
  const { projects, summary, isLoading, error, refetch } = useRab();

  // Flatten all items from all projects for display
  const allItems = projects.flatMap((p) =>
    p.items.map((item) => ({
      ...item,
      projectName: p.projectName,
      quarter: p.quarter,
      year: p.year,
    })),
  );

  // Compute category allocation for chart
  const categoryMap = new Map<string, number>();
  allItems.forEach((item) => {
    const cat = item.categoryName || "Lainnya";
    categoryMap.set(cat, (categoryMap.get(cat) || 0) + item.totalBudget);
  });

  const totalBudget = allItems.reduce((sum, item) => sum + item.totalBudget, 0);

  const allocationData = Array.from(categoryMap.entries()).map(
    ([name, value], index) => ({
      name: name.toUpperCase(),
      value: totalBudget > 0 ? Math.round((value / totalBudget) * 100) : 0,
      amount: value,
      color: CHART_COLORS[index % CHART_COLORS.length],
    }),
  );

  // Close export menu on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
        setShowExportMenu(false);
      }
    }
    if (showExportMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showExportMenu]);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[1280px] px-4 md:px-6 py-5">
        <div className="flex flex-col gap-5">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-col gap-0.5">
              <h1 className="text-xl font-bold leading-7 tracking-tight text-[#0f172a]">
                Rencana Anggaran Biaya (RAB)
              </h1>
              <p className="text-sm text-gray-500">
                Kelola alokasi pagu anggaran, monitoring realisasi belanja, asal
                anggaran, dan persetujuan pengeluaran per divisi/proyek.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative" ref={exportMenuRef}>
                <button
                  onClick={() => setShowExportMenu((prev) => !prev)}
                  className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 shadow-sm hover:bg-gray-50 transition-colors"
                >
                  <Image
                    src="/finance/download.svg"
                    alt="export"
                    width={14}
                    height={14}
                  />
                  Export RAB (PDF/XLS)
                </button>
                {showExportMenu && (
                  <div className="absolute right-0 top-full z-10 mt-1 w-44 rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
                    <button
                      onClick={() => {
                        exportToPDF(allItems, {
                          totalBudget: summary?.totalBudget ?? 0,
                          totalRealization: summary?.totalRealization ?? 0,
                        });
                        setShowExportMenu(false);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <FileText size={14} className="text-red-500" />
                      Unduh PDF
                    </button>
                    <button
                      onClick={() => {
                        exportToExcel(allItems, {
                          totalBudget: summary?.totalBudget ?? 0,
                          totalRealization: summary?.totalRealization ?? 0,
                        });
                        setShowExportMenu(false);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <FileSpreadsheet size={14} className="text-emerald-600" />
                      Unduh Excel
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-[#064e3b] px-4 py-2 text-sm font-medium text-white shadow-sm"
              >
                <Image
                  src="/finance/plus.svg"
                  alt="plus"
                  width={14}
                  height={14}
                />
                Buat Pos Anggaran Baru
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <RabSummaryCards summary={summary} isLoading={isLoading} />

          {/* Main Content: Table + Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <RabDetailsTable
                projects={projects}
                items={allItems}
                isLoading={isLoading}
                error={error}
              />
            </div>
            <div className="lg:col-span-1">
              <RabAllocationChart
                allocationData={allocationData}
                totalBudget={totalBudget}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Create Budget Item Modal */}
      <RabFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          refetch();
        }}
      />
    </div>
  );
}

// Chart color palette
const CHART_COLORS = [
  "oklch(0.55 0.15 170)",
  "oklch(0.75 0.15 250)",
  "oklch(0.70 0.15 150)",
  "oklch(0.60 0.10 80)",
  "oklch(0.65 0.18 300)",
  "oklch(0.55 0.12 40)",
  "oklch(0.70 0.10 200)",
  "oklch(0.60 0.15 100)",
];
