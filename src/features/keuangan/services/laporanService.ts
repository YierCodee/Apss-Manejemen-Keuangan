import type { LaporanData } from "../types/keuangan.types";

export async function getLaporanData(): Promise<LaporanData> {
  const res = await fetch("/api/keuangan/laporan");
  if (!res.ok) throw new Error("Failed to fetch laporan data");
  return res.json();
}
