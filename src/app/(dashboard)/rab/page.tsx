"use client";

import { useState } from "react";
import Image from "next/image";
import { RabSummaryCards } from "@/features/rab/components/RabSummaryCards";
import { RabDetailsTable } from "@/features/rab/components/RabDetailsTable";
import { RabAllocationChart } from "@/features/rab/components/RabAllocationChart";
import RabFormModal from "@/components/modals/RabFormModal";

export default function RabPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
              <button className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 shadow-sm">
                <Image
                  src="/finance/download.svg"
                  alt="export"
                  width={14}
                  height={14}
                />
                Export RAB (PDF/XLS)
              </button>
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
          <RabSummaryCards />

          {/* Main Content: Table + Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <RabDetailsTable />
            </div>
            <div className="lg:col-span-1">
              <RabAllocationChart />
            </div>
          </div>
        </div>
      </div>

      {/* Create Budget Item Modal */}
      <RabFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
