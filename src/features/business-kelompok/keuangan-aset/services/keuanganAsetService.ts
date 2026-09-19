export async function getKeuanganAset() {
  const res = await fetch("/api/business-kelompok/stok");
  return res.json();
}
