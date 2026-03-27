// api/marketing.js
// Consolidated marketing/CRM handler — replaces analytics.js, hubspot.js, mailchimp.js, waitlist.js
//
// Dispatches on ?action= query param (injected by Vercel rewrites):
//
//   GET  /api/marketing?action=analytics → analytics data from Postgres
//   POST /api/marketing?action=hubspot   → upsert HubSpot contact
//   POST /api/marketing?action=mailchimp → subscribe to Mailchimp audience
//   POST /api/marketing?action=waitlist  → record Studio waitlist signup

import crypto from "crypto";
import pg from "pg";
import { query } from "./lib/db.js";
import { sendEmail, tplWaitlist } from "./lib/email.js";

const { Pool } = pg;

// ── Analytics ───────────────────────────────────────────────────────────────
let _analyticsPool = null;

function getAnalyticsPool() {
  if (!_analyticsPool && process.env.DATABASE_URL) {
    _analyticsPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes("localhost") ? false : { rejectUnauthorized: false },
      max: 3,
      idleTimeoutMillis: 10_000,
    });
  }
  return _analyticsPool;
}

async function handleAnalytics(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const db = getAnalyticsPool();
  if (!db) return res.status(200).json({ configured: false, daily: [], vaultTvl: [] });

  try {
    const MRR_RATES = { starter: 29, gallery: 99, institutional: 0 };

    const [dailyResult, vaultResult, businessResult] = await Promise.all([
      db.query(`
        SELECT
          date::TEXT                          AS date,
          swap_count::INTEGER                 AS "swapCount",
          ROUND(swap_volume_xer, 4)::FLOAT    AS "swapVolumeXer",
          ROUND(xer_fees_collected, 4)::FLOAT AS "xerFeesCollected",
          active_vault_count::INTEGER         AS "activeVaultCount"
        FROM analytics_daily
        ORDER BY date DESC
        LIMIT 30
      `),
      db.query(`
        SELECT
          fraction_id                       AS "vaultId",
          COUNT(*)::INTEGER                 AS "tradeCount",
          ROUND(SUM(xer_amount), 4)::FLOAT  AS "xerInflow"
        FROM trades
        GROUP BY fraction_id
        ORDER BY "xerInflow" DESC
      `),
      db.query(`
        SELECT
          (SELECT COUNT(*) FROM subscriptions WHERE status = 'active')        AS "activeSubs",
          (SELECT COUNT(*) FROM subscriptions WHERE status = 'past_due')      AS "pastDue",
          (SELECT COUNT(*) FROM subscriptions WHERE status = 'cancelled')     AS "churned",
          (SELECT COUNT(*) FROM subscriptions
           WHERE status = 'active' AND created_at >= NOW() - INTERVAL '7 days') AS "newThisWeek",
          (SELECT COUNT(*) FROM waitlist)                                      AS "waitlistCount",
          (SELECT json_agg(sub_counts)
           FROM (
             SELECT tier, COUNT(*)::INTEGER AS count
             FROM subscriptions
             WHERE status = 'active'
             GROUP BY tier
           ) sub_counts)                                                       AS "tierBreakdown"
      `),
    ]);

    const tierBreakdown = businessResult.rows[0]?.tierBreakdown ?? [];
    const mrr = (tierBreakdown || []).reduce((sum, row) => sum + (MRR_RATES[row.tier] ?? 0) * row.count, 0);

    const business = {
      activeSubs:    parseInt(businessResult.rows[0]?.activeSubs  ?? 0),
      pastDue:       parseInt(businessResult.rows[0]?.pastDue     ?? 0),
      churned:       parseInt(businessResult.rows[0]?.churned     ?? 0),
      newThisWeek:   parseInt(businessResult.rows[0]?.newThisWeek ?? 0),
      waitlistCount: parseInt(businessResult.rows[0]?.waitlistCount ?? 0),
      mrr,
      tierBreakdown: tierBreakdown ?? [],
    };

    res.setHeader("Cache-Control", "s-maxage=120, stale-while-revalidate=60");
    return res.status(200).json({ configured: true, daily: dailyResult.rows, vaultTvl: vaultResult.rows, business });
  } catch (err) {
    console.error("[analytics] DB error:", err.message);
    return res.status(500).json({ error: "Database query failed", configured: true });
  }
}

// ── Mailchimp (shared helper, called by waitlist too) ──────────────────────
function md5(str) {
  return crypto.createHash("md5").update(str.toLowerCase()).digest("hex");
}

async function subscribeMailchimp({ email, firstName, lastName, tags = [] }) {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const listId = process.env.MAILCHIMP_LIST_ID;

  if (!apiKey || !listId) {
    console.log(`[mailchimp] not configured — would subscribe: ${email} tags=${tags.join(",")}`);
    return { ok: true, configured: false };
  }

  const dc   = apiKey.split("-").pop();
  const base = `https://${dc}.api.mailchimp.com/3.0`;
  const auth = Buffer.from(`anystring:${apiKey}`).toString("base64");
  const hash = md5(email);

  const memberRes = await fetch(`${base}/lists/${listId}/members/${hash}`, {
    method: "PUT",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      email_address: email,
      status_if_new: "subscribed",
      status: "subscribed",
      merge_fields: {
        ...(firstName && { FNAME: firstName }),
        ...(lastName  && { LNAME: lastName  }),
      },
    }),
  });

  if (!memberRes.ok) {
    const body = await memberRes.text();
    console.error(`[mailchimp] member upsert ${memberRes.status}: ${body}`);
    throw new Error("Mailchimp subscription failed");
  }

  if (tags.length > 0) {
    await fetch(`${base}/lists/${listId}/members/${hash}/tags`, {
      method: "POST",
      headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
      body: JSON.stringify({ tags: tags.map((name) => ({ name, status: "active" })) }),
    }).catch((e) => console.warn("[mailchimp] tag apply failed:", e.message));
  }

  return { ok: true, configured: true };
}

async function handleMailchimp(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email, firstName, lastName, tags = [] } = req.body ?? {};
  if (!email) return res.status(400).json({ error: "email is required" });

  try {
    const result = await subscribeMailchimp({ email, firstName, lastName, tags });
    return res.status(200).json(result);
  } catch (err) {
    console.error("[mailchimp] error:", err.message);
    return res.status(500).json({ error: "Mailchimp error" });
  }
}

// ── HubSpot ─────────────────────────────────────────────────────────────────
async function handleHubspot(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email, firstName, lastName, formType, ...extra } = req.body ?? {};
  if (!email) return res.status(400).json({ error: "email is required" });

  if (!process.env.HUBSPOT_API_KEY) {
    console.log(`[hubspot] not configured — would upsert: ${email} (${formType ?? "unknown"})`);
    return res.status(200).json({ ok: true, configured: false });
  }

  const properties = {
    email,
    ...(firstName && { firstname: firstName }),
    ...(lastName  && { lastname:  lastName  }),
    hs_lead_source: "Musée-Crosdale Website",
  };

  if (formType === "artwork_enquiry") {
    if (extra.message)      properties.message = extra.message;
    if (extra.artworkTitle) properties.subject  = `Enquiry: ${extra.artworkTitle}`;
  }

  if (formType === "dealer_onboarding") {
    if (extra.company)     properties.company = extra.company;
    if (extra.website)     properties.website = extra.website;
    if (extra.location)    properties.city    = extra.location;
    if (extra.description) properties.message = extra.description;
  }

  try {
    const hsRes = await fetch("https://api.hubapi.com/crm/v3/objects/contacts/batch/upsert", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: [{ id: email, idProperty: "email", properties }] }),
    });

    if (!hsRes.ok) {
      const body = await hsRes.text();
      console.error(`[hubspot] ${hsRes.status}: ${body}`);
      return res.status(502).json({ error: "CRM submission failed" });
    }

    const data = await hsRes.json();
    return res.status(200).json({ ok: true, configured: true, id: data.results?.[0]?.id ?? null });
  } catch (err) {
    console.error("[hubspot] error:", err.message);
    return res.status(500).json({ error: "CRM error" });
  }
}

// ── Waitlist ─────────────────────────────────────────────────────────────────
async function handleWaitlist(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email, practice, goal } = req.body ?? {};
  if (!email) return res.status(400).json({ error: "email is required" });

  if (process.env.DATABASE_URL) {
    await query(
      `INSERT INTO waitlist (email, practice, goal) VALUES ($1, $2, $3) ON CONFLICT (email) DO NOTHING`,
      [email.toLowerCase(), practice ?? null, goal ?? null]
    ).catch((e) => console.warn("[waitlist] DB insert failed:", e.message));
  } else {
    console.log(`[waitlist] not persisted (no DATABASE_URL) — ${email}`);
  }

  // Mailchimp tag (best-effort)
  subscribeMailchimp({ email, tags: ["waitlist"] }).catch(() => {});

  // Confirmation email (best-effort)
  sendEmail({
    to: email,
    subject: "You're on the Musée-Crosdale Studio waitlist",
    html: tplWaitlist(),
  }).catch((e) => console.warn("[waitlist] email failed:", e.message));

  return res.status(200).json({ ok: true });
}

// ── Main handler ─────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  const { action } = req.query;

  if (action === "analytics") return handleAnalytics(req, res);
  if (action === "hubspot")   return handleHubspot(req, res);
  if (action === "mailchimp") return handleMailchimp(req, res);
  if (action === "waitlist")  return handleWaitlist(req, res);

  return res.status(400).json({ error: "Missing or unknown action parameter" });
}
