"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LabelList } from "recharts";

interface ChartData {
  name: string;
  paguAnggaran: number;
  realisasiTerpakai: number;
  efisiensi: string;
}

const data: ChartData[] = [
  { name: "Kuliah & Pend.", paguAnggaran: 35000, realisasiTerpakai: 22000, efisiensi: "62%" },
  { name: "Biaya Hidup", paguAnggaran: 45000, realisasiTerpakai: 30000, efisiensi: "66%" },
  { name: "Operasional", paguAnggaran: 25000, realisasiTerpakai: 24000, efisiensi: "95%" },
  { name: "Praktikum & Lab", paguAnggaran: 30000, realisasiTerpakai: 12000, efisiensi: "39%" },
  { name: "Tools & AI", paguAnggaran: 15000, realisasiTerpakai: 14000, efisiensi: "91%" },
  { name: "Transportasi", paguAnggaran: 10000, realisasiTerpakai: 5000, efisiensi: "46%" },
];

export function LaporanChart() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-base font-bold text-[#0f172a]">
            Komparasi Pagu Anggaran vs Realisasi Belanja
          </h3>
          <p className="text-xs text-gray-400">
            Evaluasi komparatif pos anggaran/belanja untuk kuartal berjalan
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-sm bg-[#064e3b]" />
            <span className="text-[10px] text-gray-500">Pagu Anggaran ($)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-sm bg-[#1e293b]" />
            <span className="text-[10px] text-gray-500">Realisasi Terpakai ($)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-[#064e3b]" />
            <span className="text-[10px] text-gray-500">Efisiensi tertinggi: Praktikum & Lab (145%)</span>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="mt-4 flex gap-1 self-start">
        <button className="rounded-lg border border-gray-200 bg-[#f0fdf4] px-3 py-1.5 text-[10px] font-medium text-[#064e3b]">
          Chart Batang
        </button>
        <button className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[10px] font-medium text-gray-500">
          Tabel
        </button>
      </div>

      {/* Chart */}
      <div className="mt-4 h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#94a3b8" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
            />
            <Bar
              dataKey="paguAnggaran"
              fill="#064e3b"
              radius={[4, 4, 0, 0]}
              barSize={24}
            >
              <LabelList
                dataKey="efisiensi"
                position="top"
                style={{ fontSize: 9, fill: "#064e3b", fontWeight: 600 }}
              />
            </Bar>
            <Bar
              dataKey="realisasiTerpakai"
              fill="#1e293b"
              radius={[4, 4, 0, 0]}
              barSize={24}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
