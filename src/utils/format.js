export const formatEUR = (n) => Number(n ?? 0).toLocaleString("es-ES", { style: "currency", currency: "EUR" });
export const getFormat = (p) => {
  if (p?.format) return String(p.format).toLowerCase();
  const name = String(p?.name || "").toLowerCase();
  const slug = String(p?.slug || "").toLowerCase();
  if (name.includes("lonche") || slug.includes("lonche")) return "loncheado";
  return "entero";
};
