// api/paypal.js
// POST /api/paypal — create a PayPal order for a Studio plan.
//
// Body: { tier: "starter" | "gallery" }
// Returns: { url: string, orderId: string }
//
// Requires:
//   PAYPAL_CLIENT_ID     — from PayPal developer dashboard
//   PAYPAL_CLIENT_SECRET — from PayPal developer dashboard
//   PAYPAL_ENV           — "sandbox" (default) or "live"

const PLAN_PRICES = {
  starter: { amount: "29.00", label: "Starter Studio — 1 Month" },
  gallery: { amount: "99.00", label: "Gallery Studio — 1 Month" },
};

function baseUrl() {
  return process.env.PAYPAL_ENV === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

async function getAccessToken() {
  const creds = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch(`${baseUrl()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${creds}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    throw new Error(`PayPal token error: ${res.status}`);
  }
  const { access_token } = await res.json();
  return access_token;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { tier } = req.body ?? {};

  if (!tier || !PLAN_PRICES[tier]) {
    return res.status(400).json({ error: "Invalid plan tier" });
  }

  if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
    return res.status(500).json({ error: "PayPal is not configured on this server" });
  }

  const origin = req.headers.origin || process.env.VITE_APP_BASE_URL || "http://localhost:5173";
  const plan   = PLAN_PRICES[tier];

  try {
    const token = await getAccessToken();

    const orderRes = await fetch(`${baseUrl()}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            description: plan.label,
            custom_id:   tier,
            amount: { currency_code: "USD", value: plan.amount },
          },
        ],
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
