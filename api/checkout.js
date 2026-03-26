// api/checkout.js
// Vercel serverless function — creates a Stripe Checkout Session.
//
// Required env vars (set in Vercel dashboard + .env.local):
//   STRIPE_SECRET_KEY         — sk_live_... or sk_test_...
//   STRIPE_STARTER_PRICE_ID   — price_xxx for the Starter plan ($29/mo)
//   STRIPE_GALLERY_PRICE_ID   — price_xxx for the Gallery plan ($99/mo)
//
// POST /api/checkout
// Body: { tier: "starter" | "gallery" }
// Returns: { url: string }  — Stripe-hosted checkout URL to redirect to

import Stripe from "stripe";

const PRICE_IDS = {
  starter:     process.env.STRIPE_STARTER_PRICE_ID,
  gallery:     process.env.STRIPE_GALLERY_PRICE_ID,
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { tier } = req.body ?? {};

  if (!tier || !PRICE_IDS[tier]) {
    return res.status(400).json({ error: "Invalid or unsupported plan tier" });
  }

  const priceId = PRICE_IDS[tier];
  if (!priceId) {
    return res.status(500).json({ error: `Price ID for tier "${tier}" is not configured` });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: "Stripe is not configured on this server" });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-04-10" });

  const origin = req.headers.origin || process.env.VITE_APP_BASE_URL || "http://localhost:5173";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&tier=${tier}`,
      cancel_url:  `${origin}/studio`,
      // Optional: pre-fill email if passed
      ...(req.body.email ? { customer_email: req.body.email } : {}),
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("[checkout] Stripe error:", err.message);
    return res.status(500).json({ error: "Failed to create checkout session" });
  }
}
