export async function checkoutViaServer({ backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4242', items = [], mode = 'payment', successUrl, cancelUrl, email, metadata } = {}) {
  const res = await fetch(`${backendUrl}/create-checkout-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mode,
      items,
      success_url: successUrl || `${window.location.origin}/success`,
      cancel_url: cancelUrl || `${window.location.origin}/cancel`,
      customer_email: email,
      metadata
    })
  });
  if (!res.ok) {
    const err = await res.json().catch(()=>({error:'Unknown error'}));
    throw new Error(err.error || 'Checkout error');
  }
  const { url } = await res.json();
  window.location.href = url;
}
