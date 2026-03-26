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
