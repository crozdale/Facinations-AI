// api/lib/db.js
// Shared pg pool — reused across serverless invocations via module cache.
// Requires DATABASE_URL in env (Postgres connection string).

import pg from "pg";
const { Pool } = pg;

let _pool = null;

export function getPool() {
  if (!_pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not set");
    }
    _pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes("localhost")
        ? false
        : { rejectUnauthorized: false },
      max: 5,
    });
  }
  return _pool;
}

/** Run a query with automatic connection management. */
export async function query(sql, params = []) {
  return getPool().query(sql, params);
}
