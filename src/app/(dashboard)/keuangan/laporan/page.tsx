"use client";

import { DollarSign, CheckCircle2, RefreshCw, Plus, Download, Loader2 } from "lucide-react";
import { useLaporan } from "@/features/keuangan/hooks/useLaporan";
import { LaporanChart } from "@/features/keuangan/components/LaporanChart";
import { RincianTable } from "@/features/keuangan/components/RincianTable";
import { formatCurrency } from "@/features/keuangan/utils/formatCurrency";

export default function LaporanKeuanganPage() {
  const { data, isLoading, error } = useLaporan();

  const metrics = data
    ? [
        {
          label: "TOTAL PAGU ANGGARAN",
          value: formatCurrency(data.metrics.totalBudget),
          icon: <DollarSign className="h-3.5 w-3.5" />,
          iconBg: "bg-blue-50",
          iconColor: "text-blue-600",
          badges: [
            { text: `${data.metrics.activeProjectCount} Proyek Aktif`, bg: "bg-emerald-50", color: "text-emerald-700" },
            { text: `${data.metrics.activeItemCount} Pos Anggaran`, bg: "bg-gray-100", color: "text-gray-600" },
          ],
        },
        {
          label: "REALISASI ANGGARAN",
          value: formatCurrency(data.metrics.totalRealization),
          icon: <CheckCircle2 className="h-3.5 w-3.5" />,
          iconBg: "bg-emerald-50",
          iconColor: "text-emerald-600",
          badges: [
            {
              text: `${100 - Math.min(data.metrics.efficiency, 100)}% Tersisa`,
              bg: "bg-orange-50",
              color: "text-orange-600",
            },
            {
              text: data.metrics.efficiency <= 100 ? "Terkendali" : "Melebihi Pagu",
              bg: data.metrics.efficiency <= 100 ? "bg-emerald-50" : "bg-red-50",
              color: data.metrics.efficiency <= 100 ? "text-emerald-700" : "text-red-600",
            },
          ],
        },
        {
          label: "SISA PAGU & EFISIENSI",
          value: formatCurrency(data.metrics.remaining),
          icon: <RefreshCw className="h-3.5 w-3.5" />,
          iconBg: data.metrics.remaining >= 0 ? "bg-emerald-50" : "bg-red-50",
          iconColor: data.metrics.remaining >= 0 ? "text-emerald-600" : "text-red-600",
          badges: [
            {
              text: `${data.metrics.efficiency}% Efisiensi`,
              bg: "bg-orange-50",
              color: "text-orange-600",
            },
            {
              text: data.metrics.remaining >= 0
                ? `Hemat ${formatCurrency(data.metrics.remaining)}`
                : `Defisit ${formatCurrency(Math.abs(data.metrics.remaining))}`,
              bg: data.metrics.remaining >= 0 ? "bg-emerald-50" : "bg-red-50",
              color: data.metrics.remaining >= 0 ? "text-emerald-700" : "text-red-600",
            },
          ],
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[1280px] px-4 md:px-6 py-5">
        <div className="flex flex-col gap-5">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-col gap-0.5">
              <h1 className="text-xl font-bold leading-7 tracking-tight text-[#0f172a]">
                Laporan Keuangan
              </h1>
              <p className="text-sm text-gray-500">
                Laporan komprehensif evaluasi anggaran belanja (RAB), efisiensi biaya, dan tren pengeluaran diri.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-1.5 rounded-xl bg-[#064e3b] px-4 py-2 text-sm font-medium text-white shadow-sm">
                <Plus className="h-3.5 w-3.5" />
                Buat Pos Anggaran Baru
              </button>
              <button className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 shadow-sm">
                <Download className="h-3.5 w-3.5" />
                Export RAB (PDF/XLS)
              </button>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-[#064e3b]" />
            </div>
          ) : (
            <>
              {/* Metrics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {metrics.map((m) => (
                  <div
                    key={m.label}
                    className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                        {m.label}
                      </span>
                      <div
                        className={`flex size-7 items-center justify-center rounded-full ${m.iconBg}`}
                      >
                        <span className={m.iconColor}>{m.icon}</span>
                      </div>
                    </div>
                    <h2 className="text-xl font-extrabold tracking-tight text-[#0f172a]">
                      {m.value}
                    </h2>
                    <div className="flex items-center gap-2">
                      {m.badges.map((b) => (
                        <span
                          key={b.text}
                          className={`rounded px-1.5 py-0.5 text-[11px] font-semibold ${b.bg} ${b.color}`}
                        >
                          {b.text}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chart */}
              <LaporanChart data={data?.chartData ?? []} />

              {/* Table */}
              <RincianTable data={data?.items ?? []} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
