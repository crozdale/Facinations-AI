// api/admin/artworks.js
// CRUD for gallery artworks stored in Postgres.
// All methods require the X-Admin-Secret header matching ADMIN_SECRET env var.
//
// GET    /api/admin/artworks?gallery=xdale   — list artworks (optional gallery filter)
// POST   /api/admin/artworks                 — create artwork
// PUT    /api/admin/artworks                 — update artwork (id in body)
// DELETE /api/admin/artworks?id=xxx          — delete artwork

import { query } from "../lib/db.js";
import { runMigrations } from "../lib/migrate.js";

function isAuthorised(req) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false; // block if not configured
  return req.headers["x-admin-secret"] === secret;
}

let _migrated = false;
async function ensureMigrated() {
  if (!_migrated) { await runMigrations(); _migrated = true; }
}

export default async function handler(req, res) {
  if (!isAuthorised(req)) {
    return res.status(401).json({ error: "Unauthorised" });
  }

  await ensureMigrated();

  // ── GET ────────────────────────────────────────────────────────────────────
  if (req.method === "GET") {
    const { gallery } = req.query;
    const { rows } = gallery
      ? await query(
          `SELECT * FROM artworks WHERE gallery = $1 ORDER BY sort_order, created_at`,
          [gallery]
        )
      : await query(`SELECT * FROM artworks ORDER BY gallery, sort_order, created_at`);

    return res.status(200).json({ artworks: rows });
  }

  // ── POST ───────────────────────────────────────────────────────────────────
  if (req.method === "POST") {
    const { id, title, artist, year, medium, dimensions, description,
            price_display, available, image, gallery, sort_order } = req.body ?? {};

    if (!id || !title || !artist) {
      return res.status(400).json({ error: "id, title, and artist are required" });
    }

    const { rows } = await query(
      `INSERT INTO artworks
         (id, title, artist, year, medium, dimensions, description,
          price_display, available, image, gallery, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       RETURNING *`,
      [id, title, artist, year ?? null, medium ?? null, dimensions ?? null,
       description ?? null, price_display ?? "POA", available ?? true,
       image ?? null, gallery ?? "xdale", sort_order ?? 0]
    );

    return res.status(201).json({ artwork: rows[0] });
  }

  // ── PUT ────────────────────────────────────────────────────────────────────
  if (req.method === "PUT") {
    const { id, ...fields } = req.body ?? {};
    if (!id) return res.status(400).json({ error: "id is required" });

    const allowed = ["title","artist","year","medium","dimensions","description",
                     "price_display","available","image","gallery","sort_order"];
    const updates = Object.entries(fields).filter(([k]) => allowed.includes(k));
    if (!updates.length) return res.status(400).json({ error: "No valid fields to update" });

    const setClauses = updates.map(([k], i) => `"${k}" = $${i + 2}`).join(", ");
    const values     = [id, ...updates.map(([, v]) => v)];

    const { rows } = await query(
      `UPDATE artworks SET ${setClauses}, updated_at = NOW()
       WHERE id = $1 RETURNING *`,
      values
    );

    if (!rows.length) return res.status(404).json({ error: "Artwork not found" });
    return res.status(200).json({ artwork: rows[0] });
  }

  // ── DELETE ─────────────────────────────────────────────────────────────────
  if (req.method === "DELETE") {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "id is required" });

    const { rowCount } = await query(`DELETE FROM artworks WHERE id = $1`, [id]);
    if (!rowCount) return res.status(404).json({ error: "Artwork not found" });
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
