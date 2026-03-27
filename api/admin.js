// api/admin.js
// Consolidated admin handler — replaces admin/artworks.js, admin/galleries.js, admin/subscribers.js
//
// All routes require X-Admin-Secret header matching ADMIN_SECRET env var.
// Dispatches on ?resource= query param (injected by Vercel rewrites):
//
//   /api/admin?resource=artworks    → artworks CRUD (GET/POST/PUT/DELETE)
//   /api/admin?resource=galleries   → galleries CRUD (GET/POST/PUT/DELETE)
//   /api/admin?resource=subscribers → subscribers list (GET only)

import { query } from "./lib/db.js";
import { runMigrations } from "./lib/migrate.js";

function isAuthorised(req) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  return req.headers["x-admin-secret"] === secret;
}

let _migrated = false;
async function ensureMigrated() {
  if (!_migrated) { await runMigrations(); _migrated = true; }
}

// ── Artworks ────────────────────────────────────────────────────────────────
async function handleArtworks(req, res) {
  await ensureMigrated();

  if (req.method === "GET") {
    const { gallery } = req.query;
    const { rows } = gallery
      ? await query(`SELECT * FROM artworks WHERE gallery = $1 ORDER BY sort_order, created_at`, [gallery])
      : await query(`SELECT * FROM artworks ORDER BY gallery, sort_order, created_at`);
    return res.status(200).json({ artworks: rows });
  }

  if (req.method === "POST") {
    const { id, title, artist, year, medium, dimensions, description,
            price_display, available, image, gallery, sort_order } = req.body ?? {};
    if (!id || !title || !artist) return res.status(400).json({ error: "id, title, and artist are required" });
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

  if (req.method === "PUT") {
    const { id, ...fields } = req.body ?? {};
    if (!id) return res.status(400).json({ error: "id is required" });
    const allowed = ["title","artist","year","medium","dimensions","description",
                     "price_display","available","image","gallery","sort_order"];
    const updates = Object.entries(fields).filter(([k]) => allowed.includes(k));
    if (!updates.length) return res.status(400).json({ error: "No valid fields to update" });
    const setClauses = updates.map(([k], i) => `"${k}" = $${i + 2}`).join(", ");
    const values = [id, ...updates.map(([, v]) => v)];
    const { rows } = await query(`UPDATE artworks SET ${setClauses}, updated_at = NOW() WHERE id = $1 RETURNING *`, values);
    if (!rows.length) return res.status(404).json({ error: "Artwork not found" });
    return res.status(200).json({ artwork: rows[0] });
  }

  if (req.method === "DELETE") {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: "id is required" });
    const { rowCount } = await query(`DELETE FROM artworks WHERE id = $1`, [id]);
    if (!rowCount) return res.status(404).json({ error: "Artwork not found" });
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}

// ── Galleries ───────────────────────────────────────────────────────────────
async function handleGalleries(req, res) {
  await ensureMigrated();

  if (req.method === "GET") {
    const { rows } = await query(`SELECT * FROM galleries ORDER BY name`);
    return res.status(200).json({ galleries: rows });
  }

  if (req.method === "POST") {
    const { slug, name, blurb, location, external_url, enquiry_email, logo_url } = req.body ?? {};
    if (!slug || !name) return res.status(400).json({ error: "slug and name are required" });
    if (!/^[a-z0-9_-]{1,64}$/.test(slug)) return res.status(400).json({ error: "slug must be lowercase alphanumeric, hyphens or underscores" });
    const { rows } = await query(
      `INSERT INTO galleries (slug, name, blurb, location, external_url, enquiry_email, logo_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [slug, name, blurb ?? null, location ?? null, external_url ?? null, enquiry_email ?? null, logo_url ?? null]
    );
    return res.status(201).json({ gallery: rows[0] });
  }

  if (req.method === "PUT") {
    const { slug, ...fields } = req.body ?? {};
    if (!slug) return res.status(400).json({ error: "slug is required" });
    const allowed = ["name","blurb","location","external_url","enquiry_email","logo_url","active"];
    const updates = Object.entries(fields).filter(([k]) => allowed.includes(k));
    if (!updates.length) return res.status(400).json({ error: "No valid fields to update" });
    const setClauses = updates.map(([k], i) => `"${k}" = $${i + 2}`).join(", ");
    const values = [slug, ...updates.map(([, v]) => v)];
    const { rows } = await query(`UPDATE galleries SET ${setClauses}, updated_at = NOW() WHERE slug = $1 RETURNING *`, values);
    if (!rows.length) return res.status(404).json({ error: "Gallery not found" });
    return res.status(200).json({ gallery: rows[0] });
  }

  if (req.method === "DELETE") {
    const { slug } = req.query;
    if (!slug) return res.status(400).json({ error: "slug is required" });
    const { rowCount } = await query(`DELETE FROM galleries WHERE slug = $1`, [slug]);
    if (!rowCount) return res.status(404).json({ error: "Gallery not found" });
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}

// ── Subscribers ─────────────────────────────────────────────────────────────
async function handleSubscribers(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  if (!process.env.DATABASE_URL) {
    return res.status(200).json({ configured: false, subscribers: [], waitlist: [] });
  }

  try {
    const [subResult, waitResult] = await Promise.all([
      query(`SELECT email, tier, status, current_period_end, created_at FROM subscriptions ORDER BY created_at DESC LIMIT 200`),
      query(`SELECT email, practice, goal, created_at FROM waitlist ORDER BY created_at DESC LIMIT 200`),
    ]);
    return res.status(200).json({ configured: true, subscribers: subResult.rows, waitlist: waitResult.rows });
  } catch (err) {
    console.error("[admin/subscribers]", err.message);
    return res.status(500).json({ error: "Database error" });
  }
}

// ── Main handler ─────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  if (!isAuthorised(req)) return res.status(401).json({ error: "Unauthorised" });

  const { resource } = req.query;

  if (resource === "artworks")    return handleArtworks(req, res);
  if (resource === "galleries")   return handleGalleries(req, res);
  if (resource === "subscribers") return handleSubscribers(req, res);

  return res.status(400).json({ error: "Missing or unknown resource parameter" });
}
