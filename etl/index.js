const { Client } = require("pg");
const fetch = require("node-fetch");

const SUBGRAPH_URL = process.env.SUBGRAPH_URL || "https://api.thegraph.com/subgraphs/name/YOUR_SUBGRAPH";
const DB_URL = process.env.DATABASE_URL || "postgresql://localhost:5432/facinations";

const client = new Client({ connectionString: DB_URL });

async function query(q) {
  const res = await fetch(SUBGRAPH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: q }),
  });
  const json = await res.json();
  return json.data;
}

async function extractVaults() {
  const data = await query(`{ vaults(first: 1000, orderBy: createdAt, orderDirection: desc) { id vaultId owner metadataURI active fractionalized createdAt } }`);
  return data.vaults;
}

async function extractTrades() {
  const data = await query(`{ trades(first: 1000, orderBy: timestamp, orderDirection: desc) { id user fractionId xerAmount fractionAmount timestamp } }`);
  return data.trades;
}

async function loadVaults(vaults) {
  for (const v of vaults) {
    await client.query(`
      INSERT INTO vaults (id, vault_id, owner, metadata_uri, active, fractionalized, created_at)
      VALUES ($1,$2,$3,$4,$5,$6,to_timestamp($7))
      ON CONFLICT (id) DO UPDATE SET active=$5, fractionalized=$6
    `, [v.id, v.vaultId, v.owner, v.metadataURI, v.active, v.fractionalized, v.createdAt]);
  }
}

async function loadTrades(trades) {
  for (const t of trades) {
    await client.query(`
      INSERT INTO trades (id, "user", fraction_id, xer_amount, fraction_amount, timestamp)
      VALUES ($1,$2,$3,$4,$5,to_timestamp($6))
      ON CONFLICT (id) DO NOTHING
    `, [t.id, t.user, t.fractionId, t.xerAmount, t.fractionAmount, t.timestamp]);
  }
}

async function setupTables() {
  await client.query(`
    CREATE TABLE IF NOT EXISTS vaults (
      id TEXT PRIMARY KEY, vault_id TEXT, owner TEXT,
      metadata_uri TEXT, active BOOLEAN, fractionalized BOOLEAN, created_at TIMESTAMPTZ
    );
    CREATE TABLE IF NOT EXISTS trades (
      id TEXT PRIMARY KEY, "user" TEXT, fraction_id TEXT,
      xer_amount NUMERIC, fraction_amount NUMERIC, timestamp TIMESTAMPTZ
    );
  `);
}

async function run() {
  await client.connect();
  await setupTables();
  console.log("ETL started");
  const vaults = await extractVaults();
  await loadVaults(vaults);
  console.log(`Loaded ${vaults.length} vaults`);
  const trades = await extractTrades();
  await loadTrades(trades);
  console.log(`Loaded ${trades.length} trades`);
  await client.end();
  console.log("ETL complete");
}

run().catch(console.error);
