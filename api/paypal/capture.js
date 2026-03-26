// api/paypal/capture.js
// POST /api/paypal/capture — capture a PayPal order after buyer approval.
//
// Body: { orderId: string, tier: "starter" | "gallery" }
// Returns: { verified: boolean, tier: string | null }
//
// Called by CryptoSuccess-equivalent page after PayPal redirects back with ?token=

async function getAccessToken() {
  const base  = process.env.PAYPAL_ENV === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
  const creds = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${creds}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) throw new Error(`PayPal token error: ${res.status}`);
  const { access_token } = await res.json();
  return { token: access_token, base };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { orderId, tier } = req.body ?? {};

  if (!orderId || !tier) {
    return res.status(400).json({ error: "orderId and tier are required" });
  }

  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
    return res.status(500).json({ error: "PayPal is not configured" });
  }

  try {
    const { token, base } = await getAccessToken();

    const captureRes = await fetch(`${base}/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!captureRes.ok) {
      const body = await captureRes.text();
      console.error(`[paypal/capture] ${captureRes.status}: ${body}`);
      return res.status(502).json({ error: "PayPal capture failed" });
    }

    const order = await captureRes.json();

    // Verify capture completed and tier matches
    const completed  = order.status === "COMPLETED";
    const unitTier   = order.purchase_units?.[0]?.custom_id;
    const tiersMatch = unitTier === tier;

    return res.status(200).json({
      verified: completed && tiersMatch,
      tier:     completed && tiersMatch ? tier : null,
    });
  } catch (err) {
    console.error("[paypal/capture] error:", err.message);
    return res.status(500).json({ error: "PayPal capture error" });
  }
}
