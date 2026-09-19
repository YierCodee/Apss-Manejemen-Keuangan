"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const allocationData = [
  {
    name: "KEBUTUHAN",
    value: 44,
    amount: "$58.2K",
    color: "oklch(0.55 0.15 170)",
  },
  {
    name: "LANGGANAN AI",
    value: 22,
    amount: "$87.5K",
    color: "oklch(0.75 0.15 250)",
  },
  {
    name: "PAJAK",
    value: 13,
    amount: "$22.4K",
    color: "oklch(0.70 0.15 150)",
  },
  {
    name: "Lainnya / Legal",
    value: 8,
    amount: "$5.0K",
    color: "oklch(0.60 0.10 80)",
  },
];

export function RabAllocationChart() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5">
      {/* Header */}
      <div className="flex flex-col gap-0.5">
        <h3 className="text-base font-bold text-[#0f172a]">
          Ringkasan Alokasi RAB
        </h3>
        <p className="text-xs text-gray-400">78.450.000</p>
      </div>

      {/* Donut Chart */}
      <div className="flex flex-col items-center">
        <div className="relative w-44 h-44">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={allocationData}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={78}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {allocationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-xs text-gray-400">Kebutuhan</p>
            <p className="text-lg font-bold text-[#0f172a]">44%</p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-2.5">
        {allocationData.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs font-medium text-gray-600">
                {item.name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">{item.value}%</span>
              <span className="text-xs text-gray-400">({item.amount})</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
