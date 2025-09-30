// api/checkout-subscription.js
// Serverless (Vercel/Netlify) — Stripe Checkout (suscripción mensual).
// Para producción, lo ideal es usar priceId de Stripe. Dejamos fallback con price_data (monthly).

import Stripe from 'stripe';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2022-11-15' });

  try {
    const { items, currency = 'EUR' } = req.body || {};
    const subs = Array.isArray(items) ? items.filter(i => i.kind === 'subscription' || i.isSubscription) : [];
    if (subs.length === 0) return res.status(400).json({ error: 'No subscription item' });

    const line_items = subs.map((it) => {
      if (it.priceId) {
        return { price: it.priceId, quantity: 1 }; // qty fija para suscripción
      }
      return {
        quantity: 1,
        price_data: {
          currency,
          recurring: { interval: 'month' },
          unit_amount: Math.round((Number(it.price) || 0) * 100),
          product_data: {
            name: it.name || 'Suscripción',
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
      mode: 'subscription',
      line_items,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      success_url: `${process.env.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout/cancelled`,
      metadata: { cart: JSON.stringify(subs.map(i => ({ id:i.id, lineId:i.lineId, qty:i.qty, variant:i.variant }))) },
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('[api/checkout-subscription] error', err);
    return res.status(500).json({ error: 'Stripe error' });
  }
}
