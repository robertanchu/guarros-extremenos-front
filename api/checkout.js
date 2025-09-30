// api/checkout.js
// Serverless (Vercel/Netlify) — Stripe Checkout (pago único).
// Requiere STRIPE_SECRET_KEY y dominio FRONTEND_URL en variables de entorno.

import Stripe from 'stripe';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2022-11-15' });

  try {
    const { items, currency = 'EUR' } = req.body || {};
    if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'No items' });

    // Construcción de line_items. Si traes priceId de Stripe, úsalo directamente.
    const line_items = items.map((it) => {
      if (it.priceId) {
        return { price: it.priceId, quantity: it.qty || 1 };
      }
      // fallback con price_data (no requiere price pre-creado en Stripe)
      return {
        quantity: it.qty || 1,
        price_data: {
          currency,
          unit_amount: Math.round((Number(it.price) || 0) * 100),
          product_data: {
            name: it.name || 'Producto',
            images: it.image ? [it.image] : undefined,
            metadata: {
              id: it.id || '',
              lineId: it.lineId || '',
              variant: it.variant || '',
            },
          },
        },
      };
    });

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      shipping_address_collection: { allowed_countries: ['ES', 'PT', 'FR'] },
      success_url: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout/cancelled`,
      metadata: { cart: JSON.stringify(items.map(i => ({ id:i.id, lineId:i.lineId, qty:i.qty, variant:i.variant }))) },
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('[api/checkout] error', err);
    return res.status(500).json({ error: 'Stripe error' });
  }
}
