"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface AllocationEntry {
  name: string;
  value: number;
  amount: number;
  color: string;
}

interface RabAllocationChartProps {
  allocationData: AllocationEntry[];
  totalBudget: number;
  isLoading: boolean;
}

function formatCurrency(value: number): string {
  if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(1).replace(".0", "") + " jt";
  }
  if (value >= 1_000) {
    return (value / 1_000).toFixed(1).replace(".0", "") + " rb";
  }
  return value.toLocaleString("id-ID");
}

function ChartSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex flex-col gap-0.5">
        <div className="h-4 w-32 animate-pulse rounded bg-gray-100" />
        <div className="h-3 w-20 animate-pulse rounded bg-gray-100" />
      </div>
      <div className="mx-auto h-44 w-44 animate-pulse rounded-full bg-gray-100" />
      <div className="flex flex-col gap-2.5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="h-3 w-24 animate-pulse rounded bg-gray-100" />
            <div className="h-3 w-16 animate-pulse rounded bg-gray-100" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function RabAllocationChart({
  allocationData,
  totalBudget,
  isLoading,
}: RabAllocationChartProps) {
  if (isLoading) {
    return <ChartSkeleton />;
  }

  // Find the top category for the center label
  const topCategory =
    allocationData.length > 0
      ? allocationData.reduce((a, b) => (a.amount > b.amount ? a : b))
      : null;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5">
      {/* Header */}
      <div className="flex flex-col gap-0.5">
        <h3 className="text-base font-bold text-[#0f172a]">
          Ringkasan Alokasi RAB
        </h3>
        <p className="text-xs text-gray-400">
          {formatCurrency(totalBudget)}
        </p>
      </div>

      {allocationData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8">
          <p className="text-sm text-gray-400">Belum ada data alokasi</p>
        </div>
      ) : (
        <>
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
                <p className="text-xs text-gray-400">
                  {topCategory?.name ?? "-"}
                </p>
                <p className="text-lg font-bold text-[#0f172a]">
                  {topCategory?.value ?? 0}%
                </p>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-col gap-2.5">
            {allocationData.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between"
              >
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
                  <span className="text-xs text-gray-400">
                    ({formatCurrency(item.amount)})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
