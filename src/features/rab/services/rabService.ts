export async function getRab() {
  const res = await fetch("/api/rab");
  return res.json();
}
