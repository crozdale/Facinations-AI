// api/checkout.js
// Consolidated Stripe checkout handler — replaces checkout.js + checkout/verify.js
//
// POST /api/checkout              → create a Stripe Checkout Session
// GET  /api/checkout?session_id=xxx&tier=xxx → verify a completed session
//
// (GET requests are also routed here via Vercel rewrite from /api/checkout/verify)

import Stripe from "stripe";
import { query } from "./lib/db.js";
import { sendEmail, tplWelcome, tplReceipt } from "./lib/email.js";

const PRICE_IDS = {
  starter: process.env.STRIPE_STARTER_PRICE_ID,
  gallery: process.env.STRIPE_GALLERY_PRICE_ID,
};

const VALID_TIERS = new Set(["starter", "gallery"]);

export default async function handler(req, res) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: "Stripe is not configured on this server" });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-04-10" });

  // ── GET → verify session ──────────────────────────────────────────────────
  if (req.method === "GET") {
    const { session_id, tier } = req.query ?? {};

    if (!session_id) return res.status(400).json({ error: "Missing session_id" });
    if (!tier || !VALID_TIERS.has(tier)) return res.status(400).json({ error: "Invalid tier" });

    try {
      const session = await stripe.checkout.sessions.retrieve(session_id, { expand: ["subscription"] });

      const verified =
        session.status === "complete" &&
        (session.payment_status === "paid" || session.mode === "subscription");

      if (verified && process.env.DATABASE_URL) {
        const sub       = session.subscription;
        const periodEnd = sub?.current_period_end ? new Date(sub.current_period_end * 1000) : null;
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
          [session.customer_details?.email ?? null, session.customer, sub?.id ?? null, tier, periodEnd]
        ).catch((e) => console.warn("[checkout/verify] DB upsert failed:", e.message));

        const customerEmail = session.customer_details?.email;
        if (customerEmail) {
          const amount = { starter: "29.00", gallery: "99.00" }[tier] ?? "—";
          Promise.all([
            sendEmail({ to: customerEmail, subject: `Welcome to ${tier.charAt(0).toUpperCase() + tier.slice(1)} Studio — Musée-Crosdale`, html: tplWelcome({ tier, periodEnd }) }),
            sendEmail({ to: customerEmail, subject: "Your Musée-Crosdale Studio receipt", html: tplReceipt({ tier, amount, periodEnd }) }),
          ]).catch(() => {});
        }
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

  // ── POST → create session ─────────────────────────────────────────────────
  if (req.method === "POST") {
    const { tier } = req.body ?? {};

    if (!tier || !PRICE_IDS[tier]) return res.status(400).json({ error: "Invalid or unsupported plan tier" });

    const priceId = PRICE_IDS[tier];
    if (!priceId) return res.status(500).json({ error: `Price ID for tier "${tier}" is not configured` });

    const origin = req.headers.origin || process.env.VITE_APP_BASE_URL || "http://localhost:5173";

    try {
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&tier=${tier}`,
        cancel_url:  `${origin}/studio`,
        ...(req.body.email ? { customer_email: req.body.email } : {}),
      });
      return res.status(200).json({ url: session.url });
    } catch (err) {
      console.error("[checkout] Stripe error:", err.message);
      return res.status(500).json({ error: "Failed to create checkout session" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
