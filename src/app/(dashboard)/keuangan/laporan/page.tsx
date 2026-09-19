import { LaporanChart } from "@/features/keuangan/components/LaporanChart";
import { RincianTable } from "@/features/keuangan/components/RincianTable";
import { DollarSign, CheckCircle2, RefreshCw, Plus, Download } from "lucide-react";

const metrics = [
  {
    label: "TOTAL PAGU ANGGARAN",
    value: "$125.000,00",
    icon: <DollarSign className="h-3.5 w-3.5" />,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    badges: [
      { text: "Alokasi Q4 2024", bg: "bg-emerald-50", color: "text-emerald-700" },
      { text: "Target 85%", bg: "bg-gray-100", color: "text-gray-600" },
    ],
  },
  {
    label: "REALISASI ANGGARAN",
    value: "$78.450,00",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    badges: [
      { text: "42.7% Tersisa", bg: "bg-orange-50", color: "text-orange-600" },
      { text: "Terkendali", bg: "bg-emerald-50", color: "text-emerald-700" },
    ],
  },
  {
    label: "SISA PAGU & EFISIENSI",
    value: "$46.550,00",
    icon: <RefreshCw className="h-3.5 w-3.5" />,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    badges: [
      { text: "37.2% Tersisa", bg: "bg-orange-50", color: "text-orange-600" },
      { text: "Hemat $12.400,00", bg: "bg-emerald-50", color: "text-emerald-700" },
    ],
  },
];

export default function LaporanKeuanganPage() {
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
          <LaporanChart />

          {/* Table */}
          <RincianTable />
        </div>
      </div>
    </div>
  );
}
