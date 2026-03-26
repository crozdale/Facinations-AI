// api/etl/sync.js
// POST /api/etl/sync — pull recent trades from The Graph subgraph and write to Postgres.
//
// Upserts into:
//   trades          — individual swap records
//   analytics_daily — aggregated daily stats (swap count, volume, fees, active vaults)
//
// Designed to be called by a Vercel cron job or manually (with SYNC_SECRET header).
// Safe to re-run — all writes are upserts.
//
// Requires: DATABASE_URL, SYNC_SECRET (optional — gates the endpoint in production)

import { query } from "../lib/db.js";
import { runMigrations } from "../lib/migrate.js";

const SUBGRAPH_URL = "https://api.studio.thegraph.com/query/1722298/facinations/v0.1.5";
const TRADES_QUERY = `
  query RecentTrades($since: Int!, $skip: Int!) {
    trades(
      where: { timestamp_gte: $since }
      orderBy: timestamp
      orderDirection: asc
      first: 1000
      skip: $skip
    ) {
      id
      fractionId
      user
      xerAmount
      fractionAmount
      timestamp
    }
  }
`;

async function fetchTrades(since) {
  const allTrades = [];
  let skip = 0;

  while (true) {
    const res = await fetch(SUBGRAPH_URL, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ query: TRADES_QUERY, variables: { since, skip } }),
    });

    if (!res.ok) throw new Error(`Subgraph error: ${res.status}`);
    const { data, errors } = await res.json();
    if (errors?.length) throw new Error(errors[0].message);

    const batch = data?.trades ?? [];
    allTrades.push(...batch);
    if (batch.length < 1000) break;
    skip += 1000;
  }

  return allTrades;
}

export default async function handler(req, res) {
  // Vercel crons send GET; manual triggers can use POST with a secret header
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secret = process.env.SYNC_SECRET;
  // Cron requests from Vercel carry a special Authorization header automatically;
  // for manual POST calls we check x-sync-secret
  const cronAuth = req.headers["authorization"] === `Bearer ${process.env.CRON_SECRET}`;
  const manualAuth = req.headers["x-sync-secret"] === secret;
  if (secret && !cronAuth && !manualAuth) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!process.env.DATABASE_URL) {
    return res.status(500).json({ error: "DATABASE_URL is not set" });
  }

  try {
    await runMigrations();

    // Sync last 30 days by default; pass ?days=N to override
    const days  = Math.min(parseInt(req.query?.days ?? "30", 10) || 30, 90);
    const since = Math.floor(Date.now() / 1000) - days * 86400;

    // ── 1. Fetch from subgraph ─────────────────────────────────────────────
    const trades = await fetchTrades(since);

    if (!trades.length) {
      return res.status(200).json({ ok: true, synced: 0, days });
    }

    // ── 2. Upsert individual trades ────────────────────────────────────────
    for (const t of trades) {
      await query(
        `INSERT INTO trades (id, fraction_id, "user", xer_amount, fraction_amount, "timestamp")
         VALUES ($1, $2, $3, $4, $5, to_timestamp($6))
         ON CONFLICT (id) DO NOTHING`,
        [t.id, t.fractionId, t.user, parseFloat(t.xerAmount), parseFloat(t.fractionAmount), parseInt(t.timestamp)]
      );
    }

    // ── 3. Aggregate into analytics_daily ─────────────────────────────────
    // Group by UTC date, compute swap count, volume, fees (0.3%), and distinct vault count
    const byDay = new Map();
    for (const t of trades) {
      const date = new Date(parseInt(t.timestamp) * 1000).toISOString().slice(0, 10);
      if (!byDay.has(date)) byDay.set(date, { swapCount: 0, volume: 0, fees: 0, vaults: new Set() });
      const d = byDay.get(date);
      d.swapCount  += 1;
      d.volume     += parseFloat(t.xerAmount);
      d.fees       += parseFloat(t.xerAmount) * 0.003;
      d.vaults.add(t.fractionId);
    }

    for (const [date, d] of byDay) {
      await query(
        `INSERT INTO analytics_daily (date, swap_count, swap_volume_xer, xer_fees_collected, active_vault_count)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (date) DO UPDATE SET
           swap_count          = EXCLUDED.swap_count,
           swap_volume_xer     = EXCLUDED.swap_volume_xer,
           xer_fees_collected  = EXCLUDED.xer_fees_collected,
           active_vault_count  = EXCLUDED.active_vault_count`,
        [date, d.swapCount, d.volume, d.fees, d.vaults.size]
      );
    }

    return res.status(200).json({ ok: true, synced: trades.length, days, daysAggregated: byDay.size });
  } catch (err) {
    console.error("[etl/sync]", err.message);
    return res.status(500).json({ error: err.message });
  }
}
