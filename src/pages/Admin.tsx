// src/pages/Admin.tsx
// Internal admin panel — artwork CRUD, subscriber list, waitlist.
// Gated by ADMIN_SECRET prompt on first load (stored in sessionStorage).

import React, { useState, useEffect, useCallback } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Artwork {
  id: string;
  title: string;
  artist: string;
  year: number | null;
  medium: string | null;
  dimensions: string | null;
  description: string | null;
  price_display: string;
  available: boolean;
  image: string | null;
  gallery: string;
  sort_order: number;
}

interface Subscriber {
  email: string;
  tier: string;
  status: string;
  current_period_end: string | null;
  created_at: string;
}

interface WaitlistEntry {
  email: string;
  practice: string | null;
  goal: string | null;
  created_at: string;
}

// ── Styles ────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=Cinzel:wght@400;600&display=swap');
  .adm { background:#1c1c1c; min-height:100vh; color:#f2ece0; font-family:'Cormorant Garamond',Georgia,serif; }
  .adm-inner { max-width:1100px; margin:0 auto; padding:2rem 1.5rem 5rem; }
  .adm-eyebrow { font-family:'Cinzel',serif; font-size:0.52rem; letter-spacing:0.35em; text-transform:uppercase; color:#d4af37; margin:0 0 0.3rem; }
  .adm-title { font-family:'Cinzel',serif; font-size:1.5rem; font-weight:400; color:#f8f2e4; letter-spacing:0.08em; margin:0 0 2rem; }
  .adm-tabs { display:flex; border-bottom:1px solid rgba(212,175,55,0.15); margin-bottom:2rem; gap:0; }
  .adm-tab { padding:0.55rem 1.25rem; border:none; border-bottom:2px solid transparent; background:transparent;
             color:#6a6258; font-family:'Cinzel',serif; font-size:0.6rem; letter-spacing:0.15em;
             text-transform:uppercase; cursor:pointer; }
  .adm-tab.active { color:#d4af37; border-bottom-color:#d4af37; }
  .adm-section-title { font-family:'Cinzel',serif; font-size:0.6rem; letter-spacing:0.25em; text-transform:uppercase;
                       color:rgba(212,175,55,0.5); margin:0 0 1rem; }
  .adm-table { width:100%; border-collapse:collapse; }
  .adm-th { font-family:'Cinzel',serif; font-size:0.52rem; letter-spacing:0.12em; text-transform:uppercase;
            color:#6a6258; padding:0.5rem 0.75rem; text-align:left; border-bottom:1px solid rgba(212,175,55,0.1); }
  .adm-td { font-size:0.88rem; color:#ccc; padding:0.55rem 0.75rem; border-bottom:1px solid rgba(255,255,255,0.03);
            font-family:'Cormorant Garamond',serif; }
  .adm-td-gold { color:#d4af37; }
  .adm-td-green { color:#5cb85c; }
  .adm-td-red { color:#e05; }
  .adm-td-mono { font-family:monospace; font-size:0.75rem; color:#8a8278; }
  .adm-btn { padding:0.35rem 0.85rem; background:transparent; border:1px solid rgba(212,175,55,0.3);
             color:#b8b0a4; font-family:'Cinzel',serif; font-size:0.5rem; letter-spacing:0.15em;
             text-transform:uppercase; cursor:pointer; }
  .adm-btn:hover { border-color:#d4af37; color:#d4af37; }
  .adm-btn-gold { background:#d4af37; border-color:#d4af37; color:#141414; }
  .adm-btn-gold:hover { background:#c49d2a; }
  .adm-btn-red { border-color:rgba(220,0,80,0.3); color:#e05; }
  .adm-btn-red:hover { border-color:#e05; }
  .adm-btn-ghost { padding:0.35rem 0.85rem; background:transparent; border:1px solid rgba(255,255,255,0.08);
                   color:#6a6258; font-family:'Cinzel',serif; font-size:0.5rem; letter-spacing:0.15em;
                   text-transform:uppercase; cursor:pointer; }
  .adm-btn-ghost:hover { border-color:rgba(212,175,55,0.2); color:#b8b0a4; }
  .adm-btn-sm { padding:0.3rem 0.65rem; background:transparent; border:1px solid rgba(212,175,55,0.2);
                color:#b8b0a4; font-family:'Cinzel',serif; font-size:0.48rem; letter-spacing:0.12em;
                text-transform:uppercase; cursor:pointer; }
  .adm-btn-sm:hover { border-color:#d4af37; color:#d4af37; }
  .adm-btn-danger { border-color:rgba(220,0,80,0.25) !important; color:#cc0044 !important; }
  .adm-btn-danger:hover { border-color:#e05 !important; color:#e05 !important; }
  .adm-form { display:flex; flex-direction:column; gap:0.85rem; max-width:600px;
              border:1px solid rgba(212,175,55,0.12); padding:1.5rem; background:#202020; margin-bottom:2rem; }
  .adm-label { font-family:'Cinzel',serif; font-size:0.5rem; letter-spacing:0.2em; text-transform:uppercase;
               color:rgba(212,175,55,0.4); margin-bottom:0.2rem; display:block; }
  .adm-input { background:#1c1c1c; border:1px solid rgba(212,175,55,0.15); color:#f2ece0;
               padding:0.5rem 0.75rem; font-family:'Cormorant Garamond',serif; font-size:0.95rem;
               width:100%; box-sizing:border-box; }
  .adm-input:focus { outline:none; border-color:rgba(212,175,55,0.4); }
  .adm-row2 { display:grid; grid-template-columns:1fr 1fr; gap:0.85rem; }
  .adm-badge { display:inline-block; font-family:'Cinzel',serif; font-size:0.48rem; letter-spacing:0.12em;
               text-transform:uppercase; padding:0.15rem 0.5rem; border:1px solid; }
  .adm-gate { display:flex; align-items:center; justify-content:center; min-height:100vh; background:#1c1c1c; }
  .adm-gate-inner { text-align:center; max-width:380px; padding:2rem; }
  .adm-empty { font-style:italic; color:#484848; padding:2rem; text-align:center;
               border:1px solid rgba(212,175,55,0.06); font-size:0.88rem; }
`;

const BLANK_ARTWORK: Omit<Artwork, "sort_order"> = {
  id: "", title: "", artist: "", year: null, medium: null,
  dimensions: null, description: null, price_display: "POA",
  available: true, image: null, gallery: "xdale",
};

// ── Auth gate ─────────────────────────────────────────────────────────────────
function useAdminSecret() {
  const [secret, setSecret] = useState<string>(() => {
    try { return sessionStorage.getItem("adm_secret") ?? ""; } catch { return ""; }
  });

  function save(s: string) {
    try { sessionStorage.setItem("adm_secret", s); } catch {}
    setSecret(s);
  }

  return { secret, save };
}

function adminHeaders(secret: string) {
  return { "Content-Type": "application/json", "x-admin-secret": secret };
}

// ── Artworks tab ──────────────────────────────────────────────────────────────
function ArtworksTab({ secret }: { secret: string }) {
  const [artworks, setArtworks]       = useState<Artwork[]>([]);
  const [loading, setLoading]         = useState(true);
  const [showForm, setShowForm]       = useState(false);
  const [editing, setEditing]         = useState<Artwork | null>(null);
  const [form, setForm]               = useState<Omit<Artwork,"sort_order">>(BLANK_ARTWORK);
  const [saving, setSaving]           = useState(false);
  const [error, setError]             = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/admin/artworks", { headers: adminHeaders(secret) });
      const data = await res.json();
      if (res.ok) setArtworks(data.artworks);
      else setError(data.error);
    } catch { setError("Could not load artworks"); }
    setLoading(false);
  }, [secret]);

  useEffect(() => { load(); }, [load]);

  function startEdit(a: Artwork) {
    setEditing(a);
    setForm({ id: a.id, title: a.title, artist: a.artist, year: a.year,
              medium: a.medium, dimensions: a.dimensions, description: a.description,
              price_display: a.price_display, available: a.available,
              image: a.image, gallery: a.gallery });
    setShowForm(true);
  }

  function startNew() {
    setEditing(null);
    setForm({ ...BLANK_ARTWORK });
    setShowForm(true);
  }

  async function save() {
    if (!form.id || !form.title || !form.artist) {
      setError("ID, title, and artist are required"); return;
    }
    setSaving(true); setError(null);
    try {
      const method = editing ? "PUT" : "POST";
      const res    = await fetch("/api/admin/artworks", {
        method,
        headers: adminHeaders(secret),
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); setSaving(false); return; }
      await load();
      setShowForm(false);
    } catch { setError("Save failed"); }
    setSaving(false);
  }

  async function del(id: string) {
    if (!confirm(`Delete artwork "${id}"?`)) return;
    await fetch(`/api/admin/artworks?id=${encodeURIComponent(id)}`, {
      method: "DELETE", headers: adminHeaders(secret),
    });
    await load();
  }

  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [k]: e.target.value }));

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.25rem" }}>
        <p className="adm-section-title" style={{ margin:0 }}>Artworks ({artworks.length})</p>
        <button className="adm-btn adm-btn-gold" onClick={startNew}>+ Add Artwork</button>
      </div>

      {error && <p style={{ color:"#e05", fontStyle:"italic", fontSize:"0.85rem", marginBottom:"1rem" }}>{error}</p>}

      {showForm && (
        <div className="adm-form">
          <p style={{ fontFamily:"'Cinzel',serif", fontSize:"0.6rem", letterSpacing:"0.2em", color:"#d4af37", margin:0 }}>
            {editing ? `Editing: ${editing.id}` : "New Artwork"}
          </p>
          <div className="adm-row2">
            <div>
              <label className="adm-label">ID (slug) *</label>
              <input className="adm-input" value={form.id} onChange={f("id")} disabled={!!editing} placeholder="polar-interior-v" />
            </div>
            <div>
              <label className="adm-label">Gallery</label>
              <select className="adm-input" value={form.gallery ?? "xdale"} onChange={f("gallery")}>
                <option value="xdale">Xdale</option>
                <option value="main">Main</option>
              </select>
            </div>
          </div>
          <div className="adm-row2">
            <div>
              <label className="adm-label">Title *</label>
              <input className="adm-input" value={form.title} onChange={f("title")} placeholder="Polar Interior V" />
            </div>
            <div>
              <label className="adm-label">Artist *</label>
              <input className="adm-input" value={form.artist} onChange={f("artist")} placeholder="Crosdale" />
            </div>
          </div>
          <div className="adm-row2">
            <div>
              <label className="adm-label">Year</label>
              <input className="adm-input" type="number" value={form.year ?? ""} onChange={f("year")} placeholder="2024" />
            </div>
            <div>
              <label className="adm-label">Medium</label>
              <input className="adm-input" value={form.medium ?? ""} onChange={f("medium")} placeholder="Oil on canvas" />
            </div>
          </div>
          <div className="adm-row2">
            <div>
              <label className="adm-label">Dimensions</label>
              <input className="adm-input" value={form.dimensions ?? ""} onChange={f("dimensions")} placeholder="120 × 90 cm" />
            </div>
            <div>
              <label className="adm-label">Price Display</label>
              <input className="adm-input" value={form.price_display} onChange={f("price_display")} placeholder="POA · £12,500 · Sold" />
            </div>
          </div>
          <div>
            <label className="adm-label">Image path</label>
            <input className="adm-input" value={form.image ?? ""} onChange={f("image")} placeholder="/images/Rothko1.jpg" />
          </div>
          <div>
            <label className="adm-label">Description</label>
            <textarea className="adm-input" rows={3} value={form.description ?? ""} onChange={f("description")} style={{ resize:"vertical" }} />
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:"1rem" }}>
            <label style={{ display:"flex", alignItems:"center", gap:"0.4rem", fontFamily:"'Cinzel',serif", fontSize:"0.5rem", letterSpacing:"0.15em", color:"#8a8278", textTransform:"uppercase", cursor:"pointer" }}>
              <input type="checkbox" checked={form.available ?? true} onChange={(e) => setForm((p) => ({ ...p, available: e.target.checked }))} />
              Available
            </label>
          </div>
          <div style={{ display:"flex", gap:"0.75rem" }}>
            <button className="adm-btn adm-btn-gold" onClick={save} disabled={saving}>
              {saving ? "Saving…" : editing ? "Update" : "Create"}
            </button>
            <button className="adm-btn" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <p style={{ fontStyle:"italic", color:"#484848", fontSize:"0.85rem" }}>Loading…</p>
      ) : artworks.length === 0 ? (
        <div className="adm-empty">No artworks yet. Add one above.</div>
      ) : (
        <table className="adm-table">
          <thead>
            <tr>
              <th className="adm-th">ID</th>
              <th className="adm-th">Title</th>
              <th className="adm-th">Artist</th>
              <th className="adm-th">Gallery</th>
              <th className="adm-th">Price</th>
              <th className="adm-th">Status</th>
              <th className="adm-th"></th>
            </tr>
          </thead>
          <tbody>
            {artworks.map((a) => (
              <tr key={a.id}>
                <td className="adm-td adm-td-mono">{a.id}</td>
                <td className="adm-td">{a.title}</td>
                <td className="adm-td">{a.artist}</td>
                <td className="adm-td adm-td-mono">{a.gallery}</td>
                <td className="adm-td adm-td-gold">{a.price_display}</td>
                <td className="adm-td">
                  <span className={`adm-badge ${a.available ? "adm-td-green" : "adm-td-red"}`}
                    style={{ borderColor: a.available ? "rgba(92,184,92,0.3)" : "rgba(220,0,80,0.3)" }}>
                    {a.available ? "Available" : "Sold"}
                  </span>
                </td>
                <td className="adm-td" style={{ display:"flex", gap:"0.5rem" }}>
                  <button className="adm-btn" onClick={() => startEdit(a)}>Edit</button>
                  <button className="adm-btn adm-btn-red" onClick={() => del(a.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ── Subscribers tab ───────────────────────────────────────────────────────────
function SubscribersTab({ secret }: { secret: string }) {
  const [data, setData]     = useState<{ subscribers: Subscriber[]; waitlist: WaitlistEntry[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [subTab, setSubTab] = useState<"subs" | "waitlist">("subs");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/subscribers", { headers: adminHeaders(secret) });
        if (res.ok) setData(await res.json());
      } catch {}
      setLoading(false);
    })();
  }, [secret]);

  function fmtDate(s: string) {
    return new Date(s).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" });
  }

  if (loading) return <p style={{ fontStyle:"italic", color:"#484848", fontSize:"0.85rem" }}>Loading…</p>;
  if (!data?.configured) return <p style={{ fontStyle:"italic", color:"#6a6258", fontSize:"0.85rem" }}>DATABASE_URL not configured.</p>;

  return (
    <div>
      <div style={{ display:"flex", gap:"0", marginBottom:"1.5rem", borderBottom:"1px solid rgba(212,175,55,0.1)" }}>
        {(["subs","waitlist"] as const).map((t) => (
          <button key={t} onClick={() => setSubTab(t)}
            style={{ padding:"0.45rem 1rem", border:"none", borderBottom:`2px solid ${subTab===t?"#d4af37":"transparent"}`,
                     background:"transparent", color:subTab===t?"#d4af37":"#6a6258",
                     fontFamily:"'Cinzel',serif", fontSize:"0.55rem", letterSpacing:"0.12em",
                     textTransform:"uppercase", cursor:"pointer" }}>
            {t === "subs" ? `Subscribers (${data.subscribers.length})` : `Waitlist (${data.waitlist.length})`}
          </button>
        ))}
      </div>

      {subTab === "subs" && (
        data.subscribers.length === 0 ? <div className="adm-empty">No subscribers yet.</div> : (
          <table className="adm-table">
            <thead>
              <tr>
                <th className="adm-th">Email</th>
                <th className="adm-th">Tier</th>
                <th className="adm-th">Status</th>
                <th className="adm-th">Renews</th>
                <th className="adm-th">Joined</th>
              </tr>
            </thead>
            <tbody>
              {data.subscribers.map((s) => (
                <tr key={s.email}>
                  <td className="adm-td adm-td-mono">{s.email}</td>
                  <td className="adm-td adm-td-gold" style={{ textTransform:"capitalize" }}>{s.tier}</td>
                  <td className="adm-td">
                    <span className={`adm-badge ${s.status==="active"?"adm-td-green":s.status==="past_due"?"adm-td-gold":"adm-td-red"}`}
                      style={{ borderColor: s.status==="active"?"rgba(92,184,92,0.3)":s.status==="past_due"?"rgba(212,175,55,0.3)":"rgba(220,0,80,0.3)" }}>
                      {s.status}
                    </span>
                  </td>
                  <td className="adm-td adm-td-mono">{s.current_period_end ? fmtDate(s.current_period_end) : "—"}</td>
                  <td className="adm-td adm-td-mono">{fmtDate(s.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}

      {subTab === "waitlist" && (
        data.waitlist.length === 0 ? <div className="adm-empty">No waitlist entries yet.</div> : (
          <table className="adm-table">
            <thead>
              <tr>
                <th className="adm-th">Email</th>
                <th className="adm-th">Practice</th>
                <th className="adm-th">Goals</th>
                <th className="adm-th">Signed up</th>
              </tr>
            </thead>
            <tbody>
              {data.waitlist.map((w) => (
                <tr key={w.email}>
                  <td className="adm-td adm-td-mono">{w.email}</td>
                  <td className="adm-td">{w.practice ?? "—"}</td>
                  <td className="adm-td" style={{ maxWidth:280, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{w.goal ?? "—"}</td>
                  <td className="adm-td adm-td-mono">{fmtDate(w.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
    </div>
  );
}

// ── Galleries tab ─────────────────────────────────────────────────────────────
interface GalleryRow {
  slug: string;
  name: string;
  blurb: string | null;
  location: string | null;
  external_url: string | null;
  enquiry_email: string | null;
  logo_url: string | null;
  active: boolean;
}

const BLANK_GALLERY: GalleryRow = {
  slug: "", name: "", blurb: "", location: "", external_url: "", enquiry_email: "", logo_url: "", active: true,
};

function GalleriesTab({ secret }: { secret: string }) {
  const [galleries, setGalleries] = useState<GalleryRow[]>([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [editing, setEditing]     = useState<GalleryRow | null>(null);
  const [form, setForm]           = useState<GalleryRow>(BLANK_GALLERY);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const headers = { "Content-Type": "application/json", "X-Admin-Secret": secret };

  const load = useCallback(() => {
    setLoading(true);
    fetch("/api/admin/galleries", { headers: { "X-Admin-Secret": secret } })
      .then((r) => r.json())
      .then((d) => setGalleries(d.galleries ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [secret]);

  useEffect(() => { load(); }, [load]);

  function startEdit(g: GalleryRow) { setEditing(g); setForm(g); setShowForm(true); }
  function startNew()                { setEditing(null); setForm(BLANK_GALLERY); setShowForm(true); }

  async function handleSave() {
    if (!form.slug || !form.name) { setError("Slug and name are required"); return; }
    setSaving(true); setError(null);
    try {
      const method = editing ? "PUT" : "POST";
      const res = await fetch("/api/admin/galleries", { method, headers, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      setShowForm(false); load();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally { setSaving(false); }
  }

  async function handleDelete(slug: string) {
    if (!confirm(`Delete gallery "${slug}"? This does not delete its artworks.`)) return;
    await fetch(`/api/admin/galleries?slug=${encodeURIComponent(slug)}`, { method: "DELETE", headers: { "X-Admin-Secret": secret } });
    load();
  }

  const F: React.CSSProperties = { display:"flex", flexDirection:"column", gap:"0.4rem" };
  const inp: React.CSSProperties = { padding:"0.45rem 0.65rem", background:"#181818", border:"1px solid rgba(212,175,55,0.12)", color:"#f2ece0", fontFamily:"'Cormorant Garamond',serif", fontSize:"0.9rem", width:"100%", boxSizing:"border-box" };

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.25rem" }}>
        <p className="adm-section-title" style={{ margin:0 }}>Galleries ({galleries.length})</p>
        <button className="adm-btn" onClick={startNew}>+ New Gallery</button>
      </div>

      {showForm && (
        <div style={{ border:"1px solid rgba(212,175,55,0.12)", background:"#202020", padding:"1.5rem", marginBottom:"1.5rem" }}>
          <p className="adm-section-title">{editing ? `Edit: ${editing.name}` : "New Gallery"}</p>
          {error && <p style={{ color:"#e05", fontFamily:"'Cormorant Garamond',serif", fontSize:"0.85rem", margin:"0 0 0.75rem" }}>{error}</p>}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.75rem" }}>
            <div style={F}>
              <label className="adm-section-title" style={{ fontSize:"0.48rem" }}>Slug *</label>
              <input style={inp} value={form.slug} disabled={!!editing}
                onChange={(e) => setForm(f => ({ ...f, slug: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g,"") }))}
                placeholder="xdale" />
            </div>
            <div style={F}>
              <label className="adm-section-title" style={{ fontSize:"0.48rem" }}>Name *</label>
              <input style={inp} value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Gallery Name" />
            </div>
            <div style={F}>
              <label className="adm-section-title" style={{ fontSize:"0.48rem" }}>Location</label>
              <input style={inp} value={form.location ?? ""} onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))} placeholder="London · New York" />
            </div>
            <div style={F}>
              <label className="adm-section-title" style={{ fontSize:"0.48rem" }}>Website</label>
              <input style={inp} value={form.external_url ?? ""} onChange={(e) => setForm(f => ({ ...f, external_url: e.target.value }))} placeholder="https://example.com" />
            </div>
            <div style={F}>
              <label className="adm-section-title" style={{ fontSize:"0.48rem" }}>Enquiry Email</label>
              <input style={inp} value={form.enquiry_email ?? ""} onChange={(e) => setForm(f => ({ ...f, enquiry_email: e.target.value }))} placeholder="enquiries@gallery.com" />
            </div>
            <div style={F}>
              <label className="adm-section-title" style={{ fontSize:"0.48rem" }}>Logo URL</label>
              <input style={inp} value={form.logo_url ?? ""} onChange={(e) => setForm(f => ({ ...f, logo_url: e.target.value }))} placeholder="https://…/logo.png" />
            </div>
            <div style={{ ...F, gridColumn:"1 / -1" }}>
              <label className="adm-section-title" style={{ fontSize:"0.48rem" }}>Blurb</label>
              <textarea style={{ ...inp, resize:"vertical" }} rows={3} value={form.blurb ?? ""}
                onChange={(e) => setForm(f => ({ ...f, blurb: e.target.value }))} placeholder="One-paragraph gallery description…" />
            </div>
            {editing && (
              <div style={{ ...F, flexDirection:"row", alignItems:"center", gap:"0.5rem" }}>
                <input type="checkbox" id="gal-active" checked={form.active}
                  onChange={(e) => setForm(f => ({ ...f, active: e.target.checked }))} />
                <label htmlFor="gal-active" style={{ fontFamily:"'Cinzel',serif", fontSize:"0.52rem", letterSpacing:"0.1em", color:"rgba(212,175,55,0.5)" }}>Active</label>
              </div>
            )}
          </div>
          <div style={{ display:"flex", gap:"0.75rem", marginTop:"1rem" }}>
            <button className="adm-btn" onClick={handleSave} disabled={saving}>{saving ? "Saving…" : "Save"}</button>
            <button className="adm-btn-ghost" onClick={() => { setShowForm(false); setError(null); }}>Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <p style={{ color:"#6a6258", fontFamily:"'Cinzel',serif", fontSize:"0.6rem", letterSpacing:"0.2em" }}>Loading…</p>
      ) : (
        <table className="adm-table">
          <thead>
            <tr>
              {["Slug","Name","Location","Active","Actions"].map((h) => (
                <th key={h} className="adm-th">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {galleries.map((g) => (
              <tr key={g.slug}>
                <td className="adm-td adm-td-mono">{g.slug}</td>
                <td className="adm-td adm-td-gold">{g.name}</td>
                <td className="adm-td">{g.location ?? "—"}</td>
                <td className="adm-td">{g.active ? <span className="adm-td-green">✓</span> : <span className="adm-td-red">✗</span>}</td>
                <td className="adm-td">
                  <div style={{ display:"flex", gap:"0.5rem" }}>
                    <button className="adm-btn-sm" onClick={() => startEdit(g)}>Edit</button>
                    <a href={`/gallery/${g.slug}`} target="_blank" rel="noopener noreferrer"
                      style={{ fontFamily:"'Cinzel',serif", fontSize:"0.5rem", letterSpacing:"0.1em", color:"rgba(212,175,55,0.5)", textDecoration:"none", padding:"0.3rem 0.6rem", border:"1px solid rgba(212,175,55,0.1)" }}>View ↗</a>
                    <button className="adm-btn-sm adm-btn-danger" onClick={() => handleDelete(g.slug)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
type Tab = "artworks" | "galleries" | "subscribers";

export default function Admin() {
  const { secret, save } = useAdminSecret();
  const [input, setInput]   = useState("");
  const [tab, setTab]       = useState<Tab>("artworks");

  if (!secret) {
    return (
      <div className="adm-gate">
        <style>{css}</style>
        <div className="adm-gate-inner">
          <p style={{ fontFamily:"'Cinzel',serif", fontSize:"0.52rem", letterSpacing:"0.35em", color:"rgba(212,175,55,0.4)", textTransform:"uppercase", margin:"0 0 1rem" }}>
            Musée-Crosdale · Admin
          </p>
          <input
            type="password"
            placeholder="Admin secret"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && input && save(input)}
            style={{ background:"#202020", border:"1px solid rgba(212,175,55,0.2)", color:"#f2ece0",
                     padding:"0.65rem 1rem", fontFamily:"'Cormorant Garamond',serif", fontSize:"1rem",
                     width:"100%", boxSizing:"border-box", outline:"none", marginBottom:"0.75rem" }}
            autoFocus
          />
          <button
            onClick={() => input && save(input)}
            style={{ width:"100%", padding:"0.6rem", background:"#d4af37", border:"none",
                     color:"#141414", fontFamily:"'Cinzel',serif", fontSize:"0.6rem",
                     letterSpacing:"0.2em", textTransform:"uppercase", cursor:"pointer" }}>
            Enter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="adm">
      <style>{css}</style>
      <div className="adm-inner">
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"1.5rem" }}>
          <div>
            <p className="adm-eyebrow">Musée-Crosdale</p>
            <h1 className="adm-title">Administration</h1>
          </div>
          <button className="adm-btn" onClick={() => save("")} style={{ marginTop:"0.25rem" }}>Sign out</button>
        </div>

        <div className="adm-tabs">
          {(["artworks","galleries","subscribers"] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`adm-tab${tab===t?" active":""}`}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {tab === "artworks"    && <ArtworksTab    secret={secret} />}
        {tab === "galleries"   && <GalleriesTab   secret={secret} />}
        {tab === "subscribers" && <SubscribersTab secret={secret} />}
      </div>
    </div>
  );
}
