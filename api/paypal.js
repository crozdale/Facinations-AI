// api/paypal.js
// Consolidated PayPal handler — replaces paypal.js + paypal/capture.js
//
// POST /api/paypal                      → create a PayPal order
// POST /api/paypal?_action=capture      → capture an approved order
//
// (capture requests routed here via Vercel rewrite from /api/paypal/capture)
//
// Requires: PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_ENV ("sandbox" | "live")

import { query } from "./lib/db.js";
import { sendEmail, tplWelcome, tplReceipt } from "./lib/email.js";

const PLAN_PRICES = {
  starter: { amount: "29.00", label: "Starter Studio — 1 Month" },
  gallery: { amount: "99.00", label: "Gallery Studio — 1 Month" },
};

const TIER_PRICE = { starter: "29.00", gallery: "99.00" };

function baseUrl() {
  return process.env.PAYPAL_ENV === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

async function getAccessToken() {
  const base  = baseUrl();
  const creds = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64");
  const res = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: { Authorization: `Basic ${creds}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) throw new Error(`PayPal token error: ${res.status}`);
  const { access_token } = await res.json();
  return { token: access_token, base };
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
    return res.status(500).json({ error: "PayPal is not configured on this server" });
  }

  // ── Capture order ─────────────────────────────────────────────────────────
  if (req.query._action === "capture") {
    const { orderId, tier } = req.body ?? {};
    if (!orderId || !tier) return res.status(400).json({ error: "orderId and tier are required" });

    try {
      const { token, base } = await getAccessToken();

      const captureRes = await fetch(`${base}/v2/checkout/orders/${orderId}/capture`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      if (!captureRes.ok) {
        const body = await captureRes.text();
        console.error(`[paypal/capture] ${captureRes.status}: ${body}`);
        return res.status(502).json({ error: "PayPal capture failed" });
      }

      const order    = await captureRes.json();
      const completed  = order.status === "COMPLETED";
      const unitTier   = order.purchase_units?.[0]?.custom_id;
      const tiersMatch = unitTier === tier;
      const success    = completed && tiersMatch;

      if (success) {
        const email = order.payer?.email_address ?? null;

        if (process.env.DATABASE_URL && email) {
          query(
            `INSERT INTO subscriptions (email, tier, status, updated_at)
             VALUES ($1, $2, 'active', NOW())
             ON CONFLICT (email) DO UPDATE SET tier = EXCLUDED.tier, status = 'active', updated_at = NOW()`,
            [email, tier]
          ).catch((e) => console.warn("[paypal/capture] DB upsert failed:", e.message));
        }

        if (email) {
          const amount = TIER_PRICE[tier] ?? "—";
          const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1);
          Promise.all([
            sendEmail({ to: email, subject: `Welcome to ${tierLabel} Studio — Musée-Crosdale`, html: tplWelcome({ tier, periodEnd: null }) }),
            sendEmail({ to: email, subject: "Your Musée-Crosdale Studio receipt", html: tplReceipt({ tier, amount, periodEnd: null }) }),
          ]).catch(() => {});
        }
      }

      return res.status(200).json({ verified: success, tier: success ? tier : null });
    } catch (err) {
      console.error("[paypal/capture] error:", err.message);
      return res.status(500).json({ error: "PayPal capture error" });
    }
  }

  // ── Create order ──────────────────────────────────────────────────────────
  const { tier } = req.body ?? {};
  if (!tier || !PLAN_PRICES[tier]) return res.status(400).json({ error: "Invalid plan tier" });

  const origin = req.headers.origin || process.env.VITE_APP_BASE_URL || "http://localhost:5173";
  const plan   = PLAN_PRICES[tier];

  try {
    const { token, base } = await getAccessToken();

    const orderRes = await fetch(`${base}/v2/checkout/orders`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [{ description: plan.label, custom_id: tier, amount: { currency_code: "USD", value: plan.amount } }],
        application_context: {
          brand_name:  "Musée-Crosdale Studio",
          user_action: "PAY_NOW",
          return_url:  `${origin}/checkout/paypal-success?tier=${tier}`,
          cancel_url:  `${origin}/studio`,
        },
      }),
    });

    if (!orderRes.ok) {
      const body = await orderRes.text();
      console.error(`[paypal] order creation ${orderRes.status}: ${body}`);
      return res.status(502).json({ error: "Failed to create PayPal order" });
    }

    const order    = await orderRes.json();
    const approval = order.links?.find((l) => l.rel === "approve");
    if (!approval) {
      console.error("[paypal] no approve link in order:", JSON.stringify(order));
      return res.status(502).json({ error: "PayPal did not return an approval URL" });
    }

    return res.status(200).json({ url: approval.href, orderId: order.id });
  } catch (err) {
    console.error("[paypal] error:", err.message);
    return res.status(500).json({ error: "PayPal error" });
  }
}
