interface RabSummaryCard {
  label: string;
  value: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  badge?: string;
  badgeBg?: string;
  badgeColor?: string;
  subtext?: string;
}

const cards: RabSummaryCard[] = [
  {
    label: "TOTAL PAGU ANGGARAN",
    value: "$ 125.000,00",
    icon: "$",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    badge: "Alokasi Q4 2026",
    badgeBg: "bg-emerald-50",
    badgeColor: "text-emerald-700",
    subtext: "Target 100%",
  },
  {
    label: "REALISASI ANGGARAN",
    value: "$ 78.450,00",
    icon: "↗",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    badge: "42.7% Terealisasi",
    badgeBg: "bg-blue-50",
    badgeColor: "text-blue-700",
    subtext: "Terealisasi",
  },
  {
    label: "REALISASI ANGGARAN",
    value: "$ 78.450,00",
    icon: "↗",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    badge: "42.7% Terealisasi",
    badgeBg: "bg-blue-50",
    badgeColor: "text-blue-700",
    subtext: "Terealisasi",
  },
];

export function RabSummaryCards() {
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
              <span className={`text-xs font-bold ${card.iconColor}`}>
                {card.icon}
              </span>
            </div>
          </div>
          <h2 className="text-xl font-extrabold tracking-tight text-[#0f172a]">
            {card.value}
          </h2>
          <div className="flex items-center gap-2">
            {card.badge && (
              <span
                className={`rounded px-1.5 py-0.5 text-[11px] font-semibold ${card.badgeBg} ${card.badgeColor}`}
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
