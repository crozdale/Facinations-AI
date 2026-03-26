// api/lib/migrate.js
// GET /api/lib/migrate — idempotent schema migration.
// Call once after deploying (or on each cold start — it's safe to re-run).
// Requires DATABASE_URL.

import { query } from "./db.js";

export async function runMigrations() {
  await query(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id                     SERIAL PRIMARY KEY,
      email                  TEXT NOT NULL,
      stripe_customer_id     TEXT UNIQUE,
      stripe_subscription_id TEXT UNIQUE,
      tier                   TEXT NOT NULL DEFAULT 'none',
      status                 TEXT NOT NULL DEFAULT 'active',
      current_period_end     TIMESTAMPTZ,
      created_at             TIMESTAMPTZ DEFAULT NOW(),
      updated_at             TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await query(`
    CREATE INDEX IF NOT EXISTS idx_sub_email
      ON subscriptions (email);
  `);

  await query(`
    CREATE INDEX IF NOT EXISTS idx_sub_stripe_customer
      ON subscriptions (stripe_customer_id);
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS waitlist (
      id         SERIAL PRIMARY KEY,
      email      TEXT NOT NULL UNIQUE,
      practice   TEXT,
      goal       TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS analytics_daily (
      date                DATE    PRIMARY KEY,
      swap_count          INTEGER NOT NULL DEFAULT 0,
      swap_volume_xer     NUMERIC(18,4) NOT NULL DEFAULT 0,
      xer_fees_collected  NUMERIC(18,4) NOT NULL DEFAULT 0,
      active_vault_count  INTEGER NOT NULL DEFAULT 0
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS trades (
      id               TEXT PRIMARY KEY,
      fraction_id      TEXT NOT NULL,
      "user"           TEXT NOT NULL,
      xer_amount       NUMERIC(18,4) NOT NULL,
      fraction_amount  NUMERIC(18,4) NOT NULL,
      "timestamp"      TIMESTAMPTZ NOT NULL
    );
  `);

  await query(`
    CREATE INDEX IF NOT EXISTS idx_trades_user      ON trades ("user");
    `);
  await query(`
    CREATE INDEX IF NOT EXISTS idx_trades_timestamp ON trades ("timestamp");
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS artworks (
      id            TEXT PRIMARY KEY,
      title         TEXT NOT NULL,
      artist        TEXT NOT NULL,
      year          INT,
      medium        TEXT,
      dimensions    TEXT,
      description   TEXT,
      price_display TEXT DEFAULT 'POA',
      available     BOOLEAN DEFAULT true,
      image         TEXT,
      gallery       TEXT DEFAULT 'xdale',
      sort_order    INT DEFAULT 0,
      created_at    TIMESTAMPTZ DEFAULT NOW(),
      updated_at    TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await query(`
    CREATE INDEX IF NOT EXISTS idx_artworks_gallery ON artworks (gallery);
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS vault_enquiries (
      id             SERIAL PRIMARY KEY,
      vault_id       TEXT NOT NULL,
      token_id       INT NOT NULL DEFAULT 1,
      quantity       INT NOT NULL,
      wallet_address TEXT,
      name           TEXT,
      email          TEXT NOT NULL,
      message        TEXT,
      status         TEXT NOT NULL DEFAULT 'pending',
      created_at     TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  await query(`
    CREATE INDEX IF NOT EXISTS idx_vault_enquiries_vault ON vault_enquiries (vault_id);
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS vaults_meta (
      vault_id             TEXT PRIMARY KEY,
      name                 TEXT NOT NULL,
      description          TEXT,
      artist               TEXT,
      year                 INT,
      medium               TEXT,
      image                TEXT,
      legal_uri            TEXT,
      total_fractions      INT,
      available_fractions  INT,
      updated_at           TIMESTAMPTZ DEFAULT NOW()
    );
  `);
}

/** Serverless handler — lets you trigger migrations via HTTP in dev/staging. */
export default async function handler(req, res) {
  // Block in production unless a secret header is present
  const secret = process.env.MIGRATE_SECRET;
  if (secret && req.headers["x-migrate-secret"] !== secret) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    await runMigrations();
    return res.status(200).json({ ok: true, message: "Migrations applied." });
  } catch (err) {
    console.error("[migrate]", err.message);
    return res.status(500).json({ error: err.message });
  }
}
