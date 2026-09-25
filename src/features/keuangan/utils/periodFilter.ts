export type Period = "today" | "week" | "month";

export const DEFAULT_PERIOD: Period = "month";

export const periodLabels: Record<Period, string> = {
  today: "Hari Ini",
  week: "Minggu Ini",
  month: "Bulan Ini",
};

export const periodOptions: Period[] = ["today", "week", "month"];

export function parsePeriod(value: string | null | undefined): Period {
  return periodOptions.includes(value as Period) ? (value as Period) : DEFAULT_PERIOD;
}

export function startOfDay(d: Date): Date {
  const r = new Date(d);
  r.setHours(0, 0, 0, 0);
  return r;
}

export function startOfWeek(d: Date): Date {
  const r = new Date(d);
  const day = r.getDay();
  const diff = day === 0 ? 6 : day - 1; // Monday start
  r.setDate(r.getDate() - diff);
  r.setHours(0, 0, 0, 0);
  return r;
}

export function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function endOfDay(d: Date): Date {
  const r = new Date(d);
  r.setHours(23, 59, 59, 999);
  return r;
}

export function endOfWeek(d: Date): Date {
  const start = startOfWeek(d);
  const r = new Date(start);
  r.setDate(r.getDate() + 6);
  return endOfDay(r);
}

export function endOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
}

export function isInPeriod(dateStr: string, period: Period): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  switch (period) {
    case "today":
      return startOfDay(d).getTime() === startOfDay(now).getTime();
    case "week":
      return d >= startOfWeek(now) && d <= endOfWeek(now);
    case "month":
      return d >= startOfMonth(now) && d <= endOfMonth(now);
  }
}
