// api/gallery.js
// Consolidated gallery handler — replaces gallery.js + galleries.js
//
// GET /api/gallery?slug=xxx    → single gallery + artworks
// GET /api/gallery?_list=true  → list all active galleries (public)
//
// (list requests also routed here via Vercel rewrite from /api/galleries)

import { query } from "./lib/db.js";

const REGISTRY = {
  xdale: {
    slug: "xdale",
    name: "Xdale",
    blurb: "Xdale represents a curated roster of contemporary and emerging artists whose work engages with the intersection of materiality, concept, and the archive.",
    location: "London · New York · On-Chain",
    external_url: "https://xdale.io",
    enquiry_email: "enquiries@xdale.io",
    logo_url: null,
    active: true,
  },
};

const FALLBACK_LIST = [
  {
    slug: "xdale",
    name: "Xdale",
    blurb: "Contemporary and emerging artists at the intersection of materiality and the archive.",
    location: "London · New York · On-Chain",
    logo_url: null,
  },
];

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  // ── List all galleries ────────────────────────────────────────────────────
  if (req.query._list === "true") {
    if (!process.env.DATABASE_URL) {
      return res.status(200).json({ galleries: FALLBACK_LIST, configured: false });
    }
    try {
      const { rows } = await query(`SELECT slug, name, blurb, location, logo_url FROM galleries WHERE active = true ORDER BY name`);
      return res.status(200).json({ galleries: rows.length ? rows : FALLBACK_LIST, configured: true });
    } catch (err) {
      console.error("[galleries]", err.message);
      return res.status(500).json({ error: "Database error" });
    }
  }

  // ── Single gallery ────────────────────────────────────────────────────────
  const { slug } = req.query;
  if (!slug) return res.status(400).json({ error: "slug is required" });
  if (!/^[a-z0-9_-]{1,64}$/.test(slug)) return res.status(400).json({ error: "Invalid slug" });

  if (!process.env.DATABASE_URL) {
    const gallery = REGISTRY[slug];
    if (!gallery) return res.status(404).json({ error: "Gallery not found" });
    return res.status(200).json({ gallery, artworks: [], configured: false });
  }

  try {
    const [galleryRes, artworksRes] = await Promise.all([
      query(`SELECT * FROM galleries WHERE slug = $1 AND active = true`, [slug]),
      query(`SELECT * FROM artworks WHERE gallery = $1 ORDER BY sort_order, created_at`, [slug]),
    ]);

    if (!galleryRes.rows.length) {
      const fallback = REGISTRY[slug];
      if (!fallback) return res.status(404).json({ error: "Gallery not found" });
      return res.status(200).json({ gallery: fallback, artworks: artworksRes.rows, configured: true });
    }

    return res.status(200).json({ gallery: galleryRes.rows[0], artworks: artworksRes.rows, configured: true });
  } catch (err) {
    console.error("[gallery]", err.message);
    return res.status(500).json({ error: "Database error" });
  }
}
