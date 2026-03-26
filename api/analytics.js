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
    const [dailyResult, vaultResult] = await Promise.all([
      db.query(`
        SELECT
          date::TEXT                       AS date,
          swap_count::INTEGER              AS "swapCount",
          ROUND(swap_volume_xer, 4)::FLOAT AS "swapVolumeXer",
          ROUND(xer_fees_collected, 4)::FLOAT AS "xerFeesCollected",
          active_vault_count::INTEGER      AS "activeVaultCount"
        FROM analytics_daily
        ORDER BY date DESC
        LIMIT 30
      `),
      db.query(`
        SELECT
          fraction_id                        AS "vaultId",
          COUNT(*)::INTEGER                  AS "tradeCount",
          ROUND(SUM(xer_amount), 4)::FLOAT   AS "xerInflow"
        FROM trades
        GROUP BY fraction_id
        ORDER BY "xerInflow" DESC
      `),
    ]);

    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=60");

    return res.status(200).json({
      configured: true,
      daily:    dailyResult.rows,
      vaultTvl: vaultResult.rows,
    });
  } catch (err) {
    console.error("[analytics] DB error:", err.message);
    return res.status(500).json({ error: "Database query failed", configured: true });
  }
}
