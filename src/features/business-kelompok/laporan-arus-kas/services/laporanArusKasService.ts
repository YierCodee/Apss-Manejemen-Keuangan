export async function getLaporanArusKas() {
  const res = await fetch("/api/business-kelompok/arus-kas");
  return res.json();
}
