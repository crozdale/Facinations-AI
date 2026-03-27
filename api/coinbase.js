// api/coinbase.js
// Consolidated Coinbase Commerce handler — replaces coinbase.js + coinbase/verify.js
//
// POST /api/coinbase                            → create a Coinbase Commerce charge
// GET  /api/coinbase?charge_id=xxx&tier=xxx     → verify a charge
//
// (GET requests also routed here via Vercel rewrite from /api/coinbase/verify)
//
// Requires: COINBASE_COMMERCE_API_KEY

import { query } from "./lib/db.js";
import { sendEmail, tplWelcome, tplReceipt } from "./lib/email.js";

const PLAN_PRICES = {
  starter: { amount: "29.00", label: "Starter Studio — 1 Month" },
  gallery: { amount: "99.00", label: "Gallery Studio — 1 Month" },
};

const TIER_PRICE = { starter: "29.00", gallery: "99.00" };

export default async function handler(req, res) {
  const apiKey = process.env.COINBASE_COMMERCE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Coinbase Commerce is not configured on this server" });
  }

  // ── GET → verify charge ───────────────────────────────────────────────────
  if (req.method === "GET") {
    const { charge_id, tier } = req.query;
    if (!charge_id || !tier) return res.status(400).json({ error: "charge_id and tier are required" });

    try {
      const ccRes = await fetch(`https://api.commerce.coinbase.com/charges/${charge_id}`, {
        headers: { "X-CC-Api-Key": apiKey, "X-CC-Version": "2018-03-22" },
      });

      if (!ccRes.ok) {
        const body = await ccRes.text();
        console.error(`[coinbase/verify] ${ccRes.status}: ${body}`);
        return res.status(502).json({ error: "Could not fetch charge from Coinbase" });
      }

      const { data } = await ccRes.json();
      const SETTLED = new Set(["COMPLETED", "CONFIRMED"]);
      const verified = Array.isArray(data.timeline) && data.timeline.some((e) => SETTLED.has(e.status));
      const chargeTier = data.metadata?.tier;
      const success    = verified && chargeTier === tier;

      if (success) {
        const email = data.metadata?.email ?? data.customer_email ?? null;

        if (process.env.DATABASE_URL && email) {
          query(
            `INSERT INTO subscriptions (email, tier, status, updated_at)
             VALUES ($1, $2, 'active', NOW())
             ON CONFLICT (email) DO UPDATE SET tier = EXCLUDED.tier, status = 'active', updated_at = NOW()`,
            [email, tier]
          ).catch((e) => console.warn("[coinbase/verify] DB upsert failed:", e.message));
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
      console.error("[coinbase/verify] error:", err.message);
      return res.status(500).json({ error: "Coinbase verification error" });
    }
  }

  // ── POST → create charge ──────────────────────────────────────────────────
  if (req.method === "POST") {
    const { tier, email } = req.body ?? {};
    if (!tier || !PLAN_PRICES[tier]) return res.status(400).json({ error: "Invalid plan tier" });

    const origin = req.headers.origin || process.env.VITE_APP_BASE_URL || "http://localhost:5173";
    const plan   = PLAN_PRICES[tier];

    try {
      const ccRes = await fetch("https://api.commerce.coinbase.com/charges", {
        method: "POST",
        headers: { "X-CC-Api-Key": apiKey, "X-CC-Version": "2018-03-22", "Content-Type": "application/json" },
        body: JSON.stringify({
          name:         plan.label,
          description:  `One month of access to Facinations ${tier.charAt(0).toUpperCase() + tier.slice(1)} Studio.`,
          pricing_type: "fixed_price",
          local_price:  { amount: plan.amount, currency: "USD" },
          redirect_url: `${origin}/checkout/crypto-success?tier=${tier}`,
          cancel_url:   `${origin}/studio`,
          metadata:     { tier, ...(email ? { email } : {}) },
        }),
      });

      if (!ccRes.ok) {
        const body = await ccRes.text();
        console.error(`[coinbase] charge creation ${ccRes.status}: ${body}`);
        return res.status(502).json({ error: "Failed to create Coinbase charge" });
      }

      const { data } = await ccRes.json();
      return res.status(200).json({ url: data.hosted_url, chargeId: data.code });
    } catch (err) {
      console.error("[coinbase] error:", err.message);
      return res.status(500).json({ error: "Coinbase Commerce error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
