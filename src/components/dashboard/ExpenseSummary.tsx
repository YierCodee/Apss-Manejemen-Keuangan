"use client";

import { MoreHorizontal } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const expenseData = [
  { name: "Makanan", value: 500000, color: "oklch(0.65 0.15 30)" },
  { name: "Transportasi", value: 350000, color: "oklch(0.65 0.15 250)" },
  { name: "Tagihan", value: 200000, color: "oklch(0.65 0.15 0)" },
  { name: "Kesehatan", value: 150000, color: "oklch(0.65 0.15 150)" },
  { name: "Lainnya", value: 300000, color: "oklch(0.55 0 0)" },
];

export function ExpenseSummary() {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Semua Pengeluaran</h3>
        <button className="rounded-lg p-1.5 hover:bg-accent transition-colors">
          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Metrics Row */}
      <div className="flex gap-4 sm:gap-6 mb-5">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Hari ini</p>
          <p className="text-lg font-bold">70K</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Minggu</p>
          <p className="text-lg font-bold">250K</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Bulan</p>
          <p className="text-lg font-bold">900K</p>
        </div>
      </div>

      {/* Period Filter */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto">
        <button className="rounded-lg bg-muted px-3 py-1.5 text-xs font-medium text-foreground whitespace-nowrap">
          Bulan ini
        </button>
        <button className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
          Minggu ini
        </button>
        <button className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
          Hari ini
        </button>
      </div>

      {/* Donut Chart + Legend */}
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expenseData}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={78}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {expenseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-sm font-bold">Rp 1.500.000</p>
          </div>
        </div>

        <div className="space-y-2.5">
          {expenseData.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-5 italic">
        * Data diperbarui otomatis setiap ada transaksi.
      </p>
    </div>
  );
}
