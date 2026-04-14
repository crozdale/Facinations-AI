// api/usage.js
// POST /api/usage — record a usage event for a subscriber
// GET  /api/usage?customer_id=xxx — get usage summary for the current billing period
//
// Usage events tracked:
//   trade_placed    — a trade was matched on the platform
//   artwork_minted  — an artwork was minted to chain
//   vault_created   — a vault was fractionalised
//   artwork_viewed  — an artwork detail was viewed (lightweight, for analytics)
//
// Requires: DATABASE_URL

import { query } from "./lib/db.js";
import { runMigrations } from "./lib/migrate.js";
import { requireAuth } from "./lib/auth.js";

let _migrated = false;
async function ensureMigrated() {
  if (_migrated) return;
  try { await runMigrations(); _migrated = true; } catch {}
}

export default async function handler(req, res) {
  if (!await requireAuth(req, res)) return;

  if (!process.env.DATABASE_URL) {
    return res.status(200).json({ configured: false });
  }

  // ── GET → usage summary ───────────────────────────────────────────────────
  if (req.method === "GET") {
    const { customer_id, email } = req.query;
    if (!customer_id && !email) return res.status(400).json({ error: "customer_id or email is required" });

    try {
      // Resolve subscription row to get period start
      const subRows = customer_id
        ? await query(
            "SELECT email, current_period_end FROM subscriptions WHERE stripe_customer_id = $1 LIMIT 1",
            [customer_id]
          )
        : await query(
            "SELECT email, current_period_end FROM subscriptions WHERE email = $1 LIMIT 1",
            [email.toLowerCase()]
          );

      if (!subRows.rows.length) {
        return res.status(404).json({ error: "No subscription found" });
      }

      const { email: subEmail, current_period_end } = subRows.rows[0];
      // Period start: one month before period end
      const periodEnd   = current_period_end ? new Date(current_period_end) : new Date();
      const periodStart = new Date(periodEnd);
      periodStart.setMonth(periodStart.getMonth() - 1);

      const { rows } = await query(
        `SELECT event_type, COUNT(*) AS count, SUM(COALESCE((metadata->>'value')::numeric, 0)) AS total_value
         FROM usage_events
         WHERE subscriber_email = $1
           AND created_at >= $2
           AND created_at <= $3
         GROUP BY event_type`,
        [subEmail, periodStart, periodEnd]
      );

      const summary = { trade_count: 0, trade_volume: "0", mint_count: 0, vault_count: 0, view_count: 0 };
      for (const r of rows) {
        if (r.event_type === "trade_placed") { summary.trade_count = parseInt(r.count); summary.trade_volume = parseFloat(r.total_value || 0).toFixed(2); }
        if (r.event_type === "artwork_minted") summary.mint_count  = parseInt(r.count);
        if (r.event_type === "vault_created")  summary.vault_count = parseInt(r.count);
        if (r.event_type === "artwork_viewed") summary.view_count  = parseInt(r.count);
      }

      return res.status(200).json({
        configured: true,
        periodStart: periodStart.toISOString(),
        periodEnd:   periodEnd.toISOString(),
        ...summary,
      });
    } catch (err) {
      console.error("[usage] GET error:", err.message);
      return res.status(500).json({ error: "Database error" });
    }
  }

  // ── POST → record event ───────────────────────────────────────────────────
  if (req.method === "POST") {
    const { email, customer_id, event_type, metadata } = req.body ?? {};
    const VALID_EVENTS = new Set(["trade_placed", "artwork_minted", "vault_created", "artwork_viewed"]);

    if (!event_type || !VALID_EVENTS.has(event_type)) {
      return res.status(400).json({ error: "Invalid event_type" });
    }
    if (!email && !customer_id) {
      return res.status(400).json({ error: "email or customer_id is required" });
    }

    await ensureMigrated();

    try {
      // Resolve email from customer_id if needed
      let subscriberEmail = email?.toLowerCase() ?? null;
      if (!subscriberEmail && customer_id) {
        const { rows } = await query(
          "SELECT email FROM subscriptions WHERE stripe_customer_id = $1 LIMIT 1",
          [customer_id]
        );
        subscriberEmail = rows[0]?.email ?? null;
      }
      if (!subscriberEmail) return res.status(400).json({ error: "Could not resolve subscriber email" });

      await query(
        `INSERT INTO usage_events (subscriber_email, event_type, metadata, created_at)
         VALUES ($1, $2, $3, NOW())`,
        [subscriberEmail, event_type, metadata ? JSON.stringify(metadata) : null]
      );

      return res.status(201).json({ ok: true });
    } catch (err) {
      console.error("[usage] POST error:", err.message);
      return res.status(500).json({ error: "Database error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
