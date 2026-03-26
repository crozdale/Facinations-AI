// api/checkout/verify.js
// Vercel serverless function — verifies a completed Stripe Checkout Session.
//
// GET /api/checkout/verify?session_id=cs_xxx
// Returns: { verified: boolean, tier: string | null }

import Stripe from "stripe";

const VALID_TIERS = new Set(["starter", "gallery"]);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { session_id, tier } = req.query ?? {};

  if (!session_id) {
    return res.status(400).json({ error: "Missing session_id" });
  }

  if (!tier || !VALID_TIERS.has(tier)) {
    return res.status(400).json({ error: "Invalid tier" });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: "Stripe is not configured on this server" });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-04-10" });

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    const verified =
      session.status === "complete" &&
      (session.payment_status === "paid" || session.mode === "subscription");

    return res.status(200).json({ verified, tier: verified ? tier : null });
  } catch (err) {
    console.error("[checkout/verify] Stripe error:", err.message);
    return res.status(500).json({ error: "Failed to verify session" });
  }
}
