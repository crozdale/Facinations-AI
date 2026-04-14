// api/paypal.js
// Consolidated PayPal Subscriptions handler (recurring billing).
//
// POST /api/paypal                         → create a PayPal subscription
// POST /api/paypal?_action=capture         → verify an approved subscription
//
// Requires env vars:
//   PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET
//   PAYPAL_ENV ("sandbox" | "live")
//   PAYPAL_STARTER_PLAN_ID  — billing plan ID from PayPal dashboard for $29/mo
//   PAYPAL_GALLERY_PLAN_ID  — billing plan ID from PayPal dashboard for $99/mo

import { query } from "./lib/db.js";
import { sendEmail, tplWelcome, tplReceipt } from "./lib/email.js";

const PLAN_IDS = {
  starter: () => process.env.PAYPAL_STARTER_PLAN_ID,
  gallery: () => process.env.PAYPAL_GALLERY_PLAN_ID,
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

  // ── Verify approved subscription ──────────────────────────────────────────
  if (req.query._action === "capture") {
    const { subscriptionId, tier } = req.body ?? {};
    if (!subscriptionId || !tier) return res.status(400).json({ error: "subscriptionId and tier are required" });

    try {
      const { token, base } = await getAccessToken();

      const subRes = await fetch(`${base}/v1/billing/subscriptions/${encodeURIComponent(subscriptionId)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!subRes.ok) {
        const body = await subRes.text();
        console.error(`[paypal/capture] ${subRes.status}: ${body}`);
        return res.status(502).json({ error: "Could not retrieve PayPal subscription" });
      }

      const sub     = await subRes.json();
      const active  = sub.status === "ACTIVE";
      const planId  = sub.plan_id;
      const expPlan = PLAN_IDS[tier]?.();
      const match   = expPlan ? planId === expPlan : true; // if plan IDs not configured, trust tier param

      if (!active || !match) {
        return res.status(400).json({ error: "PayPal subscription is not active or plan mismatch", verified: false });
      }

      const email        = sub.subscriber?.email_address ?? null;
      const periodEnd    = sub.billing_info?.next_billing_time
        ? new Date(sub.billing_info.next_billing_time)
        : null;

      if (process.env.DATABASE_URL) {
        query(
          `INSERT INTO subscriptions
             (email, paypal_subscription_id, tier, status, current_period_end, updated_at)
           VALUES ($1, $2, $3, 'active', $4, NOW())
           ON CONFLICT (email) DO UPDATE SET
             paypal_subscription_id = EXCLUDED.paypal_subscription_id,
             tier                   = EXCLUDED.tier,
             status                 = 'active',
             current_period_end     = EXCLUDED.current_period_end,
             updated_at             = NOW()`,
          [email, subscriptionId, tier, periodEnd]
        ).catch((e) => console.warn("[paypal/capture] DB upsert failed:", e.message));
      }

      if (email) {
        const amount = TIER_PRICE[tier] ?? "—";
        const label  = tier.charAt(0).toUpperCase() + tier.slice(1);
        Promise.all([
          sendEmail({ to: email, subject: `Welcome to ${label} Studio — Musée-Crosdale`, html: tplWelcome({ tier, periodEnd }) }),
          sendEmail({ to: email, subject: "Your Musée-Crosdale Studio receipt", html: tplReceipt({ tier, amount, periodEnd }) }),
        ]).catch(() => {});
      }

      return res.status(200).json({ verified: true, tier });
    } catch (err) {
      console.error("[paypal/capture] error:", err.message);
      return res.status(500).json({ error: "PayPal subscription verification error" });
    }
  }

  // ── Create subscription ───────────────────────────────────────────────────
  const { tier } = req.body ?? {};
  const planId   = PLAN_IDS[tier]?.();

  if (!tier || !PLAN_IDS[tier]) return res.status(400).json({ error: "Invalid plan tier" });
  if (!planId) return res.status(500).json({ error: `PayPal plan ID for tier "${tier}" is not configured (set PAYPAL_${tier.toUpperCase()}_PLAN_ID)` });

  const origin = req.headers.origin || process.env.VITE_APP_BASE_URL || "http://localhost:5173";

  try {
    const { token, base } = await getAccessToken();

    const subRes = await fetch(`${base}/v1/billing/subscriptions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Prefer: "return=representation" },
      body: JSON.stringify({
        plan_id:     planId,
        application_context: {
          brand_name:  "Musée-Crosdale Studio",
          user_action: "SUBSCRIBE_NOW",
          return_url:  `${origin}/checkout/paypal-success?tier=${tier}`,
          cancel_url:  `${origin}/studio`,
        },
      }),
    });

    if (!subRes.ok) {
      const body = await subRes.text();
      console.error(`[paypal] subscription creation ${subRes.status}: ${body}`);
      return res.status(502).json({ error: "Failed to create PayPal subscription" });
    }

    const sub      = await subRes.json();
    const approval = sub.links?.find((l) => l.rel === "approve");
    if (!approval) {
      console.error("[paypal] no approve link in subscription:", JSON.stringify(sub));
      return res.status(502).json({ error: "PayPal did not return an approval URL" });
    }

    return res.status(200).json({ url: approval.href, subscriptionId: sub.id });
  } catch (err) {
    console.error("[paypal] error:", err.message);
    return res.status(500).json({ error: "PayPal error" });
  }
}
