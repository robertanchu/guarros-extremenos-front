const BASE = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/,'') || "";
export async function createCheckout(items, opts={}){
  if(!BASE) throw new Error("VITE_BACKEND_URL no configurado");
  const success_url = opts.success_url || `${window.location.origin}/success`;
  const cancel_url  = opts.cancel_url  || `${window.location.origin}/cancel`;
  const shipping_rate = opts.shipping_rate || "shr_1SBOWZRPLp0YiQTHa4ClyIOc";
  const payload = { items: items.map(i=>({ price:i.priceId, quantity:i.qty })), success_url, cancel_url, shipping_rate };
  const res = await fetch(`${BASE}/create-checkout-session`, { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(payload) });
  if(!res.ok){ let msg="Error al crear la sesión de pago"; try{ const j=await res.json(); msg=j.error||msg }catch{}; throw new Error(msg); }
  const data = await res.json(); if(data?.url){ window.location.href = data.url } else { throw new Error("Respuesta sin URL de checkout") }
}
