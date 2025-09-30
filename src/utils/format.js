export const formatEUR = (n) =>
  Number(n ?? 0).toLocaleString("es-ES", { style: "currency", currency: "EUR" });