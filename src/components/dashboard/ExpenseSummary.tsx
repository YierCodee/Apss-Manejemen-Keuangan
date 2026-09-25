"use client";

import { useMemo, useState } from "react";
import { MoreHorizontal, Wallet } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useKeuangan } from "@/features/keuangan/hooks/useKeuangan";
import { formatCurrency } from "@/features/keuangan/utils/formatCurrency";
import {
  isInPeriod,
  periodLabels,
  type Period,
} from "@/features/keuangan/utils/periodFilter";

const CATEGORY_COLORS: Record<string, string> = {};

function getCategoryColor(categoryName: string, index: number): string {
  if (CATEGORY_COLORS[categoryName]) return CATEGORY_COLORS[categoryName];
  const palette = [
    "oklch(0.65 0.15 30)",
    "oklch(0.65 0.15 250)",
    "oklch(0.65 0.15 150)",
    "oklch(0.65 0.15 40)",
    "oklch(0.65 0.15 300)",
    "oklch(0.65 0.15 80)",
    "oklch(0.65 0.15 200)",
    "oklch(0.65 0.15 340)",
  ];
  const color = palette[index % palette.length];
  CATEGORY_COLORS[categoryName] = color;
  return color;
}

export function ExpenseSummary() {
  const { transactions, isLoading } = useKeuangan();
  const [activePeriod, setActivePeriod] = useState<Period>("month");

  const pengeluaran = useMemo(
    () => transactions.filter((t) => t.type === "pengeluaran"),
    [transactions],
  );

  // Metrics: total by time range
  const metrics = useMemo(() => {
    let todayTotal = 0;
    let weekTotal = 0;
    let monthTotal = 0;

    for (const tx of pengeluaran) {
      if (isInPeriod(tx.date, "today")) todayTotal += tx.amount;
      if (isInPeriod(tx.date, "week")) weekTotal += tx.amount;
      if (isInPeriod(tx.date, "month")) monthTotal += tx.amount;
    }

    return { todayTotal, weekTotal, monthTotal };
  }, [pengeluaran]);

  // Filtered pengeluaran for chart
  const filteredPengeluaran = useMemo(
    () => pengeluaran.filter((tx) => isInPeriod(tx.date, activePeriod)),
    [pengeluaran, activePeriod],
  );

  // Group by category for donut chart
  const { chartData, total } = useMemo(() => {
    const catMap = new Map<
      string,
      { name: string; value: number; color: string; bgColor: string | null }
    >();

    for (const tx of filteredPengeluaran) {
      const catName = tx.category?.name || "Lainnya";
      const catColor = tx.category?.color || null;
      const catBg = tx.category?.bgColor || null;

      if (!catMap.has(catName)) {
        catMap.set(catName, { name: catName, value: 0, color: catColor || getCategoryColor(catName, catMap.size), bgColor: catBg });
      }
      catMap.get(catName)!.value += tx.amount;
    }

    const data = Array.from(catMap.values())
      .sort((a, b) => b.value - a.value)
      .map((item, i) => ({ ...item, color: getCategoryColor(item.name, i) }));

    const t = data.reduce((sum, d) => sum + d.value, 0);
    return { chartData: data, total: t };
  }, [filteredPengeluaran]);

  const formatCompact = (val: number) => {
    if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}jt`;
    if (val >= 1_000) return `${Math.round(val / 1_000)}K`;
    return val.toLocaleString("id-ID");
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Semua Pengeluaran</h3>
        <button className="rounded-lg p-1.5 hover:bg-gray-100 transition-colors">
          <MoreHorizontal className="h-4 w-4 text-gray-400" />
        </button>
      </div>

      {/* Metrics Row */}
      <div className="flex gap-4 sm:gap-6 mb-5">
        <div>
          <p className="text-xs text-gray-400 mb-1">Hari ini</p>
          <p className="text-lg font-bold">
            {isLoading ? (
              <span className="inline-block h-5 w-16 animate-pulse rounded bg-gray-100" />
            ) : (
              `Rp ${formatCompact(metrics.todayTotal)}`
            )}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">Minggu</p>
          <p className="text-lg font-bold">
            {isLoading ? (
              <span className="inline-block h-5 w-16 animate-pulse rounded bg-gray-100" />
            ) : (
              `Rp ${formatCompact(metrics.weekTotal)}`
            )}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400 mb-1">Bulan</p>
          <p className="text-lg font-bold">
            {isLoading ? (
              <span className="inline-block h-5 w-16 animate-pulse rounded bg-gray-100" />
            ) : (
              `Rp ${formatCompact(metrics.monthTotal)}`
            )}
          </p>
        </div>
      </div>

      {/* Period Filter */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto">
        {(["month", "week", "today"] as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setActivePeriod(p)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
              activePeriod === p
                ? "bg-gray-100 text-gray-900"
                : "text-gray-400 hover:text-gray-700"
            }`}
          >
            {periodLabels[p]}
          </button>
        ))}
      </div>

      {/* Donut Chart + Legend */}
      {isLoading ? (
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 shrink-0">
            <div className="flex items-center justify-center w-full h-full">
              <div className="h-28 w-28 animate-pulse rounded-full bg-gray-100" />
            </div>
          </div>
          <div className="space-y-2.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-gray-100" />
                <div className="h-3 w-20 rounded bg-gray-100" />
              </div>
            ))}
          </div>
        </div>
      ) : chartData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
            <Wallet className="h-8 w-8 text-gray-300" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-500">Belum ada pengeluaran</p>
            <p className="text-xs text-gray-400 mt-1">Mulai catat transaksi untuk melihat ringkasan</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={78}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-xs text-gray-400">Total</p>
              <p className="text-sm font-bold">{formatCurrency(total)}</p>
            </div>
          </div>
          <div className="space-y-2.5">
            {chartData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-gray-400 mt-5 italic">
        * Data diperbarui otomatis setiap ada transaksi.
      </p>
    </div>
  );
}
