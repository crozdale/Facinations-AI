// api/checkout/verify.js
// Vercel serverless function — verifies a completed Stripe Checkout Session.
//
// GET /api/checkout/verify?session_id=cs_xxx&tier=starter|gallery
// Returns: { verified, tier, customerEmail, customerId }

import Stripe from "stripe";
import { query } from "../lib/db.js";

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
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["subscription"],
    });

    const verified =
      session.status === "complete" &&
      (session.payment_status === "paid" || session.mode === "subscription");

    if (verified && process.env.DATABASE_URL) {
      // Persist subscription so it survives browser/device changes
      const sub       = session.subscription;
      const periodEnd = sub?.current_period_end
        ? new Date(sub.current_period_end * 1000)
        : null;
      await query(
        `INSERT INTO subscriptions
           (email, stripe_customer_id, stripe_subscription_id, tier, status, current_period_end, updated_at)
         VALUES ($1, $2, $3, $4, 'active', $5, NOW())
         ON CONFLICT (stripe_customer_id) DO UPDATE SET
           stripe_subscription_id = EXCLUDED.stripe_subscription_id,
           tier                   = EXCLUDED.tier,
           status                 = 'active',
           current_period_end     = EXCLUDED.current_period_end,
           email                  = COALESCE(EXCLUDED.email, subscriptions.email),
           updated_at             = NOW()`,
        [
          session.customer_details?.email ?? null,
          session.customer,
          sub?.id ?? null,
          tier,
          periodEnd,
        ]
      ).catch((e) => console.warn("[checkout/verify] DB upsert failed:", e.message));
    }

    return res.status(200).json({
      verified,
      tier:          verified ? tier : null,
      customerEmail: session.customer_details?.email ?? null,
      customerId:    verified ? session.customer : null,
    });
  } catch (err) {
    console.error("[checkout/verify] Stripe error:", err.message);
    return res.status(500).json({ error: "Failed to verify session" });
  }
}
