// api/coinbase.js
// POST /api/coinbase — create a Coinbase Commerce charge for a Studio plan.
//
// Body: { tier: "starter" | "gallery" }
// Returns: { url: string, chargeId: string }
//
// Requires:
//   COINBASE_COMMERCE_API_KEY — from Coinbase Commerce dashboard → Settings → API keys
//
// Note: Coinbase Commerce is one-time payment; each charge = 1 month of access.
// Recurring billing must be re-initiated each cycle (or handled via webhook).

const PLAN_PRICES = {
  starter: { amount: "29.00", label: "Starter Studio — 1 Month" },
  gallery: { amount: "99.00", label: "Gallery Studio — 1 Month" },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { tier, email } = req.body ?? {};

  if (!tier || !PLAN_PRICES[tier]) {
    return res.status(400).json({ error: "Invalid plan tier" });
  }

  const apiKey = process.env.COINBASE_COMMERCE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Coinbase Commerce is not configured on this server" });
  }

  const origin = req.headers.origin || process.env.VITE_APP_BASE_URL || "http://localhost:5173";
  const plan   = PLAN_PRICES[tier];

  try {
    const ccRes = await fetch("https://api.commerce.coinbase.com/charges", {
      method: "POST",
      headers: {
        "X-CC-Api-Key":  apiKey,
        "X-CC-Version":  "2018-03-22",
        "Content-Type":  "application/json",
      },
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
