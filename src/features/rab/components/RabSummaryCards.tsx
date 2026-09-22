"use client";

import { ArrowDown, CheckLine, DollarSign } from "lucide-react";
import { type LucideIcon } from "lucide-react";
import type { RabSummaryData } from "@/features/rab/hooks/useRab";

interface RabSummaryCardsProps {
  summary: RabSummaryData | null;
  isLoading: boolean;
}

function formatCurrency(value: number): string {
  return "Rp " + value.toLocaleString("id-ID");
}

function formatPercentage(value: number, total: number): string {
  if (total === 0) return "0%";
  return ((value / total) * 100).toFixed(1) + "%";
}

interface RabSummaryCard {
  label: string;
  value: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  badge?: string;
  badgeBg?: string;
  badgeColor?: string;
  subtext?: string;
}

function buildCards(summary: RabSummaryData | null): RabSummaryCard[] {
  const totalBudget = summary?.totalBudget ?? 0;
  const totalRealization = summary?.totalRealization ?? 0;
  const sisa = totalBudget - totalRealization;
  const realisasiPercent = formatPercentage(totalRealization, totalBudget);
  const sisaPercent = formatPercentage(sisa, totalBudget);

  return [
    {
      label: "TOTAL PAGU ANGGARAN",
      value: formatCurrency(totalBudget),
      icon: DollarSign,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      badge: `${summary?.totalItems ?? 0} Pos Anggaran`,
      subtext: `${summary?.totalProjects ?? 0} Proyek`,
    },
    {
      label: "REALISASI ANGGARAN",
      value: formatCurrency(totalRealization),
      icon: CheckLine,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      badge: `${realisasiPercent} Terealisasi`,
      badgeBg: "bg-blue-50",
      badgeColor: "text-blue-700",
      subtext: "Terealisasi",
    },
    {
      label: "Sisa Anggaran",
      value: formatCurrency(sisa),
      icon: ArrowDown,
      iconBg: "bg-red-50",
      iconColor: "text-red-600",
      badge: `${sisaPercent} Tersisa`,
      badgeBg: "bg-red-50",
      badgeColor: "text-red-700",
    },
  ];
}

function SkeletonCard() {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4">
      <div className="h-3 w-24 animate-pulse rounded bg-gray-100" />
      <div className="h-6 w-32 animate-pulse rounded bg-gray-100" />
      <div className="h-4 w-20 animate-pulse rounded bg-gray-100" />
    </div>
  );
}

export function RabSummaryCards({ summary, isLoading }: RabSummaryCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  const cards = buildCards(summary);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              {card.label}
            </span>
            <div
              className={`flex size-7 items-center justify-center rounded-full ${card.iconBg}`}
            >
              <card.icon className={`h-4 w-4 ${card.iconColor}`} />
            </div>
          </div>
          <h2 className="text-xl font-extrabold tracking-tight text-[#0f172a]">
            {card.value}
          </h2>
          <div className="flex items-center gap-2">
            {card.badge && (
              <span
                className={`rounded px-1.5 py-0.5 text-[11px] font-semibold ${card.badgeBg ?? "bg-gray-100"} ${card.badgeColor ?? "text-gray-600"}`}
              >
                {card.badge}
              </span>
            )}
            {card.subtext && (
              <span className="text-xs text-gray-400">{card.subtext}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
