// api/subscription/status.js
// GET /api/subscription/status?customer_id=cus_xxx
//     /api/subscription/status?email=user@example.com
//
// Returns the server-authoritative subscription state for a user.
// Used by the frontend to sync localStorage on app load.
//
// Response: { tier, status, currentPeriodEnd }

import { query } from "../lib/db.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { customer_id, email } = req.query;

  if (!customer_id && !email) {
    return res.status(400).json({ error: "customer_id or email is required" });
  }

  if (!process.env.DATABASE_URL) {
    // DB not configured — return unconfigured so client falls back to localStorage
    return res.status(200).json({ configured: false });
  }

  try {
    const { rows } = customer_id
      ? await query(
          "SELECT tier, status, current_period_end FROM subscriptions WHERE stripe_customer_id = $1 LIMIT 1",
          [customer_id]
        )
      : await query(
          "SELECT tier, status, current_period_end FROM subscriptions WHERE email = $1 ORDER BY updated_at DESC LIMIT 1",
          [email.toLowerCase()]
        );

    if (!rows.length) {
      return res.status(200).json({ configured: true, tier: "none", status: null, currentPeriodEnd: null });
    }

    const row = rows[0];
    return res.status(200).json({
      configured:       true,
      tier:             row.status === "cancelled" ? "none" : row.tier,
      status:           row.status,
      currentPeriodEnd: row.current_period_end,
    });
  } catch (err) {
    console.error("[subscription/status]", err.message);
    return res.status(500).json({ error: "Database error" });
  }
}
