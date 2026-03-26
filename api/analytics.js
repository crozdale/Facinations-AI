// api/analytics.js
// Vercel serverless function — serves analytics data from the ETL Postgres DB.
//
// Required env var:
//   DATABASE_URL — postgresql://user:pass@host:5432/facinations
//
// GET /api/analytics
// Returns: { configured: boolean, daily: DailyRow[], vaultTvl: VaultRow[] }
//
// When DATABASE_URL is absent the endpoint returns { configured: false }
// and Analytics.tsx falls back to its placeholder data.

import pg from "pg";

const { Pool } = pg;

let pool = null;

function getPool() {
  if (!pool && process.env.DATABASE_URL) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes("localhost")
        ? false
        : { rejectUnauthorized: false },
      max: 3,
      idleTimeoutMillis: 10_000,
    });
  }
  return pool;
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const db = getPool();
  if (!db) {
    return res.status(200).json({ configured: false, daily: [], vaultTvl: [] });
  }

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

    // Compute MRR from tier breakdown
    const tierBreakdown = businessResult.rows[0]?.tierBreakdown ?? [];
    const mrr = (tierBreakdown || []).reduce((sum, row) => {
      return sum + (MRR_RATES[row.tier] ?? 0) * row.count;
    }, 0);

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

    return res.status(200).json({
      configured: true,
      daily:    dailyResult.rows,
      vaultTvl: vaultResult.rows,
      business,
    });
  } catch (err) {
    console.error("[analytics] DB error:", err.message);
    return res.status(500).json({ error: "Database query failed", configured: true });
  }
}
