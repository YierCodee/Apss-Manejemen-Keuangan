export async function getTransaksiPenjualan() {
  const res = await fetch("/api/business-kelompok/transaksi");
  return res.json();
}
