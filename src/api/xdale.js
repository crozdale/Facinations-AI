const BASE = import.meta.env.VITE_XDALE_API_BASE;

export async function xdaleGet(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error("xDALE API error");
  return res.json();
}
