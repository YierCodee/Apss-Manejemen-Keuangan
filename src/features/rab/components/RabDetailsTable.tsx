"use client";

import { useState } from "react";

interface RabItem {
  id: string;
  name: string;
  category: string;
  priority: string;
  priorityColor: string;
  priorityBg: string;
  progress: number;
  quantity: number;
  price: string;
}

const items: RabItem[] = [
  {
    id: "1",
    name: "Alat Tulis",
    category: "Kebutuhan",
    priority: "On Track",
    priorityColor: "text-emerald-700",
    priorityBg: "bg-emerald-50",
    progress: 82,
    quantity: 10,
    price: "Rp 500.000",
  },
  {
    id: "2",
    name: "Skincare",
    category: "Biaya Hidup",
    priority: "High",
    priorityColor: "text-rose-700",
    priorityBg: "bg-rose-50",
    progress: 66,
    quantity: 10,
    price: "Rp 500.000",
  },
  {
    id: "3",
    name: "Transportasi",
    category: "Kebutuhan",
    priority: "Prioritas",
    priorityColor: "text-amber-700",
    priorityBg: "bg-amber-50",
    progress: 88,
    quantity: 10,
    price: "Rp 500.000",
  },
];

const tabs = ["Semua Kategori", "Kebutuhan", "Biaya Hidup"];

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-20 rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-emerald-500"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs text-gray-500">{value}%</span>
    </div>
  );
}

export function RabDetailsTable() {
  const [activeTab, setActiveTab] = useState("Semua Kategori");

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5">
      {/* Header */}
      <div className="flex flex-col gap-0.5">
        <h3 className="text-base font-bold text-[#0f172a]">
          Rincian Anggaran & Realisasi (RAB)
        </h3>
        <p className="text-xs text-gray-400">
          Q4 2026 - Q4 2026 - Rincian 4 (Status Tertunda)
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs ${
              activeTab === tab
                ? "bg-[#064e3b] font-semibold text-white"
                : "bg-gray-100 font-medium text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-auto">
          <table className="w-full min-w-[500px]">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-4 py-2.5 text-left text-[10px] font-bold uppercase tracking-wider text-gray-400">
                NAMA BARANG
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
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-gray-100">
                <td className="px-4 py-3">
                  <span className="text-xs font-bold text-gray-800">
                    {item.name}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${item.priorityBg} ${item.priorityColor}`}
                  >
                    {item.priority}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <ProgressBar value={item.progress} />
                </td>
                <td className="px-3 py-3 text-center text-xs text-gray-700">
                  {item.quantity}
                </td>
                <td className="px-3 py-3 text-right text-xs font-bold text-gray-600">
                  {item.price}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View All */}
      <div className="flex justify-center border-t border-gray-100 pt-3">
        <button className="text-xs font-semibold text-[#064e3b] hover:underline">
          Lihat Semua 18 Pos Anggaran Rab Q4 →
        </button>
      </div>
    </div>
  );
}
