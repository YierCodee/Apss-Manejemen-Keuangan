export async function getKeuangan() {
  const res = await fetch("/api/keuangan");
  return res.json();
}
