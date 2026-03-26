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
  .adm { background:#080808; min-height:100vh; color:#e8e0d0; font-family:'Cormorant Garamond',Georgia,serif; }
  .adm-inner { max-width:1100px; margin:0 auto; padding:2rem 1.5rem 5rem; }
  .adm-eyebrow { font-family:'Cinzel',serif; font-size:0.52rem; letter-spacing:0.35em; text-transform:uppercase; color:#d4af37; margin:0 0 0.3rem; }
  .adm-title { font-family:'Cinzel',serif; font-size:1.5rem; font-weight:400; color:#f0e8d0; letter-spacing:0.08em; margin:0 0 2rem; }
  .adm-tabs { display:flex; border-bottom:1px solid rgba(212,175,55,0.15); margin-bottom:2rem; gap:0; }
  .adm-tab { padding:0.55rem 1.25rem; border:none; border-bottom:2px solid transparent; background:transparent;
             color:#4a4238; font-family:'Cinzel',serif; font-size:0.6rem; letter-spacing:0.15em;
             text-transform:uppercase; cursor:pointer; }
  .adm-tab.active { color:#d4af37; border-bottom-color:#d4af37; }
  .adm-section-title { font-family:'Cinzel',serif; font-size:0.6rem; letter-spacing:0.25em; text-transform:uppercase;
                       color:rgba(212,175,55,0.5); margin:0 0 1rem; }
  .adm-table { width:100%; border-collapse:collapse; }
  .adm-th { font-family:'Cinzel',serif; font-size:0.52rem; letter-spacing:0.12em; text-transform:uppercase;
            color:#4a4238; padding:0.5rem 0.75rem; text-align:left; border-bottom:1px solid rgba(212,175,55,0.1); }
  .adm-td { font-size:0.88rem; color:#ccc; padding:0.55rem 0.75rem; border-bottom:1px solid rgba(255,255,255,0.03);
            font-family:'Cormorant Garamond',serif; }
  .adm-td-gold { color:#d4af37; }
  .adm-td-green { color:#5cb85c; }
  .adm-td-red { color:#e05; }
  .adm-td-mono { font-family:monospace; font-size:0.75rem; color:#6a6258; }
  .adm-btn { padding:0.35rem 0.85rem; background:transparent; border:1px solid rgba(212,175,55,0.3);
             color:#9a9288; font-family:'Cinzel',serif; font-size:0.5rem; letter-spacing:0.15em;
             text-transform:uppercase; cursor:pointer; }
  .adm-btn:hover { border-color:#d4af37; color:#d4af37; }
  .adm-btn-gold { background:#d4af37; border-color:#d4af37; color:#050505; }
  .adm-btn-gold:hover { background:#c49d2a; }
  .adm-btn-red { border-color:rgba(220,0,80,0.3); color:#e05; }
  .adm-btn-red:hover { border-color:#e05; }
  .adm-form { display:flex; flex-direction:column; gap:0.85rem; max-width:600px;
              border:1px solid rgba(212,175,55,0.12); padding:1.5rem; background:#0a0a0a; margin-bottom:2rem; }
  .adm-label { font-family:'Cinzel',serif; font-size:0.5rem; letter-spacing:0.2em; text-transform:uppercase;
               color:rgba(212,175,55,0.4); margin-bottom:0.2rem; display:block; }
  .adm-input { background:#080808; border:1px solid rgba(212,175,55,0.15); color:#e8e0d0;
               padding:0.5rem 0.75rem; font-family:'Cormorant Garamond',serif; font-size:0.95rem;
               width:100%; box-sizing:border-box; }
  .adm-input:focus { outline:none; border-color:rgba(212,175,55,0.4); }
  .adm-row2 { display:grid; grid-template-columns:1fr 1fr; gap:0.85rem; }
  .adm-badge { display:inline-block; font-family:'Cinzel',serif; font-size:0.48rem; letter-spacing:0.12em;
               text-transform:uppercase; padding:0.15rem 0.5rem; border:1px solid; }
  .adm-gate { display:flex; align-items:center; justify-content:center; min-height:100vh; background:#080808; }
  .adm-gate-inner { text-align:center; max-width:380px; padding:2rem; }
  .adm-empty { font-style:italic; color:#2a2a2a; padding:2rem; text-align:center;
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
            <label style={{ display:"flex", alignItems:"center", gap:"0.4rem", fontFamily:"'Cinzel',serif", fontSize:"0.5rem", letterSpacing:"0.15em", color:"#6a6258", textTransform:"uppercase", cursor:"pointer" }}>
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
        <p style={{ fontStyle:"italic", color:"#2a2a2a", fontSize:"0.85rem" }}>Loading…</p>
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

  if (loading) return <p style={{ fontStyle:"italic", color:"#2a2a2a", fontSize:"0.85rem" }}>Loading…</p>;
  if (!data?.configured) return <p style={{ fontStyle:"italic", color:"#4a4238", fontSize:"0.85rem" }}>DATABASE_URL not configured.</p>;

  return (
    <div>
      <div style={{ display:"flex", gap:"0", marginBottom:"1.5rem", borderBottom:"1px solid rgba(212,175,55,0.1)" }}>
        {(["subs","waitlist"] as const).map((t) => (
          <button key={t} onClick={() => setSubTab(t)}
            style={{ padding:"0.45rem 1rem", border:"none", borderBottom:`2px solid ${subTab===t?"#d4af37":"transparent"}`,
                     background:"transparent", color:subTab===t?"#d4af37":"#4a4238",
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

// ── Main ──────────────────────────────────────────────────────────────────────
type Tab = "artworks" | "subscribers";

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
            style={{ background:"#0a0a0a", border:"1px solid rgba(212,175,55,0.2)", color:"#e8e0d0",
                     padding:"0.65rem 1rem", fontFamily:"'Cormorant Garamond',serif", fontSize:"1rem",
                     width:"100%", boxSizing:"border-box", outline:"none", marginBottom:"0.75rem" }}
            autoFocus
          />
          <button
            onClick={() => input && save(input)}
            style={{ width:"100%", padding:"0.6rem", background:"#d4af37", border:"none",
                     color:"#050505", fontFamily:"'Cinzel',serif", fontSize:"0.6rem",
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
          {(["artworks","subscribers"] as Tab[]).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`adm-tab${tab===t?" active":""}`}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {tab === "artworks"    && <ArtworksTab    secret={secret} />}
        {tab === "subscribers" && <SubscribersTab secret={secret} />}
      </div>
    </div>
  );
}
