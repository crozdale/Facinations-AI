const { Client } = require("pg");
const fetch = require("node-fetch");

const SUBGRAPH_URL =
  process.env.SUBGRAPH_URL ||
  process.env.FACINATIONS_SUBGRAPH_URL ||
  "https://api.thegraph.com/subgraphs/name/YOUR_SUBGRAPH";
const DB_URL =
  process.env.DATABASE_URL || "postgresql://localhost:5432/facinations";

// ─── Retry helper ────────────────────────────────────────────────────────────
async function withRetry(label, fn, maxAttempts = 4, baseDelayMs = 500) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const isLast = attempt === maxAttempts;
      const delay = baseDelayMs * Math.pow(2, attempt - 1);
      console.error(
        `[${ts()}] WARN  ${label} failed (attempt ${attempt}/${maxAttempts}): ${err.message}`
      );
      if (isLast) throw err;
      console.log(`[${ts()}] INFO  Retrying ${label} in ${delay}ms…`);
      await sleep(delay);
    }
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function ts() {
  return new Date().toISOString();
}

// ─── Subgraph query ───────────────────────────────────────────────────────────
async function query(q) {
  return withRetry("subgraph fetch", async () => {
    const res = await fetch(SUBGRAPH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: q }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.errors) throw new Error(json.errors[0].message);
    return json.data;
  });
}

// ─── Extract ─────────────────────────────────────────────────────────────────
async function extractVaults() {
  const data = await query(
    `{ vaults(first: 1000, orderBy: createdAt, orderDirection: desc) {
        id vaultId owner metadataURI active fractionalized createdAt
      }
    }`
  );
  return data.vaults || [];
}

async function extractTrades() {
  const data = await query(
    `{ trades(first: 1000, orderBy: timestamp, orderDirection: desc) {
        id user fractionId xerAmount fractionAmount timestamp
      }
    }`
  );
  return data.trades || [];
}

async function extractPositions() {
  const data = await query(
    `{ userPositions(first: 1000, orderBy: updatedAt, orderDirection: desc) {
        id user vaultId fractionBalance entryXerAmount updatedAt
      }
    }`
  );
  return data.userPositions || [];
}

// ─── Load ─────────────────────────────────────────────────────────────────────
async function dbQuery(client, sql, params) {
  return withRetry("db query", () => client.query(sql, params), 3, 300);
}

async function loadVaults(client, vaults) {
  let loaded = 0;
  for (const v of vaults) {
    await dbQuery(
      client,
      `INSERT INTO vaults (id, vault_id, owner, metadata_uri, active, fractionalized, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,to_timestamp($7))
       ON CONFLICT (id) DO UPDATE SET active=$5, fractionalized=$6`,
      [v.id, v.vaultId, v.owner, v.metadataURI, v.active, v.fractionalized, v.createdAt]
    );
    loaded++;
    if (loaded % 100 === 0)
      console.log(`[${ts()}] INFO  Vaults batch progress: ${loaded}/${vaults.length}`);
  }
  return loaded;
}

async function loadTrades(client, trades) {
  let loaded = 0;
  for (const t of trades) {
    await dbQuery(
      client,
      `INSERT INTO trades (id, "user", fraction_id, xer_amount, fraction_amount, timestamp)
       VALUES ($1,$2,$3,$4,$5,to_timestamp($6))
       ON CONFLICT (id) DO NOTHING`,
      [t.id, t.user, t.fractionId, t.xerAmount, t.fractionAmount, t.timestamp]
    );
    loaded++;
  }
  return loaded;
}

async function loadPositions(client, positions) {
  let loaded = 0;
  for (const p of positions) {
    await dbQuery(
      client,
      `INSERT INTO user_positions (id, "user", vault_id, fraction_balance, entry_xer_amount, updated_at)
       VALUES ($1,$2,$3,$4,$5,to_timestamp($6))
       ON CONFLICT (id) DO UPDATE SET fraction_balance=$4, entry_xer_amount=$5, updated_at=to_timestamp($6)`,
      [p.id, p.user, p.vaultId, p.fractionBalance, p.entryXerAmount, p.updatedAt]
    );
    loaded++;
  }
  return loaded;
}

// ─── Schema ───────────────────────────────────────────────────────────────────
async function setupTables(client) {
  await dbQuery(
    client,
    `CREATE TABLE IF NOT EXISTS vaults (
      id TEXT PRIMARY KEY,
      vault_id TEXT,
      owner TEXT,
      metadata_uri TEXT,
      active BOOLEAN,
      fractionalized BOOLEAN,
      created_at TIMESTAMPTZ
    );
    CREATE TABLE IF NOT EXISTS trades (
      id TEXT PRIMARY KEY,
      "user" TEXT,
      fraction_id TEXT,
      xer_amount NUMERIC,
      fraction_amount NUMERIC,
      timestamp TIMESTAMPTZ
    );
    CREATE TABLE IF NOT EXISTS user_positions (
      id TEXT PRIMARY KEY,
      "user" TEXT,
      vault_id TEXT,
      fraction_balance NUMERIC,
      entry_xer_amount NUMERIC,
      updated_at TIMESTAMPTZ
    );
    CREATE TABLE IF NOT EXISTS analytics_daily (
      date DATE PRIMARY KEY,
      swap_volume_xer NUMERIC DEFAULT 0,
      swap_count INTEGER DEFAULT 0,
      xer_fees_collected NUMERIC DEFAULT 0,
      active_vault_count INTEGER DEFAULT 0,
      new_positions INTEGER DEFAULT 0,
      computed_at TIMESTAMPTZ DEFAULT NOW()
    );`,
    []
  );
}

// ─── Analytics rollup ─────────────────────────────────────────────────────────
async function computeDailyAnalytics(client) {
  await dbQuery(
    client,
    `INSERT INTO analytics_daily (date, swap_volume_xer, swap_count, xer_fees_collected, active_vault_count, new_positions, computed_at)
     SELECT
       date_trunc('day', timestamp)::DATE        AS date,
       COALESCE(SUM(xer_amount), 0)              AS swap_volume_xer,
       COUNT(*)                                  AS swap_count,
       COALESCE(SUM(xer_amount * 0.003), 0)      AS xer_fees_collected,
       (SELECT COUNT(*) FROM vaults WHERE active = true) AS active_vault_count,
       0                                         AS new_positions,
       NOW()                                     AS computed_at
     FROM trades
     GROUP BY date_trunc('day', timestamp)::DATE
     ON CONFLICT (date) DO UPDATE
       SET swap_volume_xer    = EXCLUDED.swap_volume_xer,
           swap_count         = EXCLUDED.swap_count,
           xer_fees_collected = EXCLUDED.xer_fees_collected,
           active_vault_count = EXCLUDED.active_vault_count,
           computed_at        = NOW()`,
    []
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function run() {
  const startTime = Date.now();
  const env = process.env.APP_ENV || "development";
  console.log(`[${ts()}] INFO  ETL starting — env=${env}`);
  console.log(`[${ts()}] INFO  Subgraph: ${SUBGRAPH_URL}`);

  const client = new Client({ connectionString: DB_URL });

  await withRetry("db connect", () => client.connect(), 3, 500);
  console.log(`[${ts()}] INFO  DB connected`);

  await setupTables(client);
  console.log(`[${ts()}] INFO  Tables ready`);

  // Vaults
  console.log(`[${ts()}] INFO  Extracting vaults…`);
  const vaults = await extractVaults();
  console.log(`[${ts()}] INFO  Extracted ${vaults.length} vaults from subgraph`);
  const vaultsLoaded = await loadVaults(client, vaults);
  console.log(`[${ts()}] INFO  Loaded ${vaultsLoaded} vaults into DB`);

  // Trades
  console.log(`[${ts()}] INFO  Extracting trades…`);
  const trades = await extractTrades();
  console.log(`[${ts()}] INFO  Extracted ${trades.length} trades from subgraph`);
  const tradesLoaded = await loadTrades(client, trades);
  console.log(`[${ts()}] INFO  Loaded ${tradesLoaded} trades into DB`);

  // Positions
  console.log(`[${ts()}] INFO  Extracting user positions…`);
  const positions = await extractPositions();
  console.log(`[${ts()}] INFO  Extracted ${positions.length} positions from subgraph`);
  const positionsLoaded = await loadPositions(client, positions);
  console.log(`[${ts()}] INFO  Loaded ${positionsLoaded} positions into DB`);

  // Analytics rollup
  console.log(`[${ts()}] INFO  Computing daily analytics rollup…`);
  await computeDailyAnalytics(client);
  console.log(`[${ts()}] INFO  Analytics rollup complete`);

  await client.end();

  const elapsedSec = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(
    `[${ts()}] INFO  ETL complete — vaults=${vaultsLoaded} trades=${tradesLoaded} positions=${positionsLoaded} elapsed=${elapsedSec}s`
  );
  process.exit(0);
}

run().catch((err) => {
  console.error(`[${new Date().toISOString()}] ERROR ETL failed: ${err.message}`);
  console.error(err.stack);
  process.exit(1);
});
