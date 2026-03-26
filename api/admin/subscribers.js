// api/admin/subscribers.js
// GET /api/admin/subscribers — list subscribers and waitlist for admin dashboard.
// Requires X-Admin-Secret header.

import { query } from "../lib/db.js";

function isAuthorised(req) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  return req.headers["x-admin-secret"] === secret;
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!isAuthorised(req)) {
    return res.status(401).json({ error: "Unauthorised" });
  }

  if (!process.env.DATABASE_URL) {
    return res.status(200).json({ configured: false, subscribers: [], waitlist: [] });
  }

  try {
    const [subResult, waitResult] = await Promise.all([
      query(
        `SELECT email, tier, status, current_period_end, created_at
         FROM subscriptions
         ORDER BY created_at DESC
         LIMIT 200`
      ),
      query(
        `SELECT email, practice, goal, created_at
         FROM waitlist
         ORDER BY created_at DESC
         LIMIT 200`
      ),
    ]);

    return res.status(200).json({
      configured:  true,
      subscribers: subResult.rows,
      waitlist:    waitResult.rows,
    });
  } catch (err) {
    console.error("[admin/subscribers]", err.message);
    return res.status(500).json({ error: "Database error" });
  }
}
