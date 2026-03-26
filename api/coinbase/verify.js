// api/coinbase/verify.js
// GET /api/coinbase/verify?charge_id=xxx&tier=starter|gallery
// Returns: { verified: boolean, tier: string | null }
//
// Polls Coinbase Commerce for the charge status.
// A charge is considered verified when its timeline contains COMPLETED or CONFIRMED.

import { query }                          from "../lib/db.js";
import { sendEmail, tplWelcome, tplReceipt } from "../lib/email.js";

const TIER_PRICE = { starter: "29.00", gallery: "99.00" };

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { charge_id, tier } = req.query;

  if (!charge_id || !tier) {
    return res.status(400).json({ error: "charge_id and tier are required" });
  }

  const apiKey = process.env.COINBASE_COMMERCE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Coinbase Commerce is not configured" });
  }

  try {
    const ccRes = await fetch(`https://api.commerce.coinbase.com/charges/${charge_id}`, {
      headers: {
        "X-CC-Api-Key": apiKey,
        "X-CC-Version": "2018-03-22",
      },
    });

    if (!ccRes.ok) {
      const body = await ccRes.text();
      console.error(`[coinbase/verify] ${ccRes.status}: ${body}`);
      return res.status(502).json({ error: "Could not fetch charge from Coinbase" });
    }

    const { data } = await ccRes.json();

    // Charge is settled when COMPLETED or CONFIRMED appears in the timeline
    const SETTLED = new Set(["COMPLETED", "CONFIRMED"]);
    const verified = Array.isArray(data.timeline) &&
      data.timeline.some((e) => SETTLED.has(e.status));

    // Also check metadata tier matches to prevent spoofing
    const chargeTier = data.metadata?.tier;
    const tiersMatch = chargeTier === tier;

    const success = verified && tiersMatch;

    if (success) {
      const email = data.metadata?.email ?? data.customer_email ?? null;

      // Persist to subscriptions table (best-effort)
      if (process.env.DATABASE_URL && email) {
        query(
          `INSERT INTO subscriptions (email, tier, status, updated_at)
           VALUES ($1, $2, 'active', NOW())
           ON CONFLICT (email) DO UPDATE SET
             tier       = EXCLUDED.tier,
             status     = 'active',
             updated_at = NOW()`,
          [email, tier]
        ).catch((e) => console.warn("[coinbase/verify] DB upsert failed:", e.message));
      }

      // Send welcome + receipt emails (best-effort)
      if (email) {
        const amount = TIER_PRICE[tier] ?? "—";
        const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1);
        Promise.all([
          sendEmail({
            to: email,
            subject: `Welcome to ${tierLabel} Studio — Musée-Crosdale`,
            html: tplWelcome({ tier, periodEnd: null }),
          }),
          sendEmail({
            to: email,
            subject: "Your Musée-Crosdale Studio receipt",
            html: tplReceipt({ tier, amount, periodEnd: null }),
          }),
        ]).catch(() => {});
      }
    }

    return res.status(200).json({
      verified: success,
      tier: success ? tier : null,
    });
  } catch (err) {
    console.error("[coinbase/verify] error:", err.message);
    return res.status(500).json({ error: "Coinbase verification error" });
  }
}
