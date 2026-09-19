export async function getProdukStok() {
  const res = await fetch("/api/business-kelompok/produk");
  return res.json();
}
