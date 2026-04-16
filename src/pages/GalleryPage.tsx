// src/pages/GalleryPage.tsx
// Generic dealer gallery page — driven by /api/gallery?slug=:slug.
// Handles any gallery registered in the galleries table.

import React, { useState, useEffect } from "react";
import GalleryPanel from "../components/GalleryPanel";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMeta } from "../hooks/useMeta";

interface Gallery {
  slug: string;
  name: string;
  blurb: string | null;
  location: string | null;
  external_url: string | null;
  enquiry_email: string | null;
  logo_url: string | null;
}

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
}

// ── CSS ────────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Cinzel:wght@400;600;700&display=swap');
  .gp-root { background:#1c1c1c; min-height:100vh; font-family:'Cormorant Garamond',Georgia,serif; color:#f2ece0; }
  .gp-header { border-bottom:1px solid rgba(212,175,55,0.1); background:rgba(212,175,55,0.02); padding:3rem 2rem; }
  .gp-header-inner { max-width:1200px; margin:0 auto; display:flex; flex-direction:column; gap:1.5rem; }
  @media(min-width:640px){ .gp-header-inner { flex-direction:row; align-items:center; } }
  .gp-logo { width:64px; height:64px; border:1px solid rgba(212,175,55,0.2); background:#242424; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-family:'Cinzel',serif; font-size:1.4rem; color:rgba(212,175,55,0.4); }
  .gp-eyebrow { font-family:'Cinzel',serif; font-size:0.55rem; letter-spacing:0.4em; text-transform:uppercase; color:#d4af37; margin:0 0 0.5rem; }
  .gp-name { font-family:'Cinzel',serif; font-size:clamp(1.6rem,3vw,2.4rem); font-weight:400; color:#f8f2e4; letter-spacing:0.06em; margin:0 0 0.5rem; }
  .gp-blurb { font-size:0.92rem; color:#b8b0a4; line-height:1.8; max-width:560px; font-style:italic; }
  .gp-location { font-size:0.75rem; color:rgba(212,175,55,0.3); margin-top:0.4rem; letter-spacing:0.08em; }
  .gp-grid { max-width:1200px; margin:0 auto; padding:3.5rem 2rem 6rem; }
  .gp-grid-header { display:flex; align-items:baseline; justify-content:space-between; margin-bottom:2.5rem; }
  .gp-works-label { font-family:'Cinzel',serif; font-size:0.55rem; letter-spacing:0.4em; text-transform:uppercase; color:#d4af37; }
  .gp-works-count { font-size:0.8rem; color:rgba(212,175,55,0.35); font-style:italic; }
  .gp-artwork-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:1.5rem; }
  @media(min-width:640px){ .gp-artwork-grid { grid-template-columns:repeat(3,1fr); } }
  @media(min-width:960px){ .gp-artwork-grid { grid-template-columns:repeat(4,1fr); } }
  .gp-card { cursor:pointer; }
  .gp-card-img-wrap { aspect-ratio:3/4; overflow:hidden; background:#242424; margin-bottom:0.75rem; position:relative; border:1px solid rgba(212,175,55,0.08); }
  .gp-card-img { width:100%; height:100%; object-fit:cover; transition:transform 0.5s ease; }
  .gp-card:hover .gp-card-img { transform:scale(1.05); }
  .gp-badge-avail { position:absolute; bottom:0.5rem; left:0.5rem; font-family:'Cinzel',serif; font-size:0.5rem; letter-spacing:0.2em; text-transform:uppercase; color:#d4af37; background:rgba(8,8,8,0.85); border:1px solid rgba(212,175,55,0.3); padding:0.2rem 0.5rem; }
  .gp-badge-sold { position:absolute; bottom:0.5rem; left:0.5rem; font-family:'Cinzel',serif; font-size:0.5rem; letter-spacing:0.2em; text-transform:uppercase; color:#666; background:rgba(8,8,8,0.85); border:1px solid #333; padding:0.2rem 0.5rem; }
  .gp-card-title { font-family:'Cinzel',serif; font-size:0.85rem; color:#f8f2e4; letter-spacing:0.04em; margin:0 0 0.2rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; transition:color .2s; }
  .gp-card:hover .gp-card-title { color:#d4af37; }
  .gp-card-meta { font-size:0.78rem; color:#8a8278; }
  /* Modal */
  .gp-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.85); z-index:100; display:flex; align-items:center; justify-content:center; padding:1rem; }
  .gp-modal { background:#202020; border:1px solid rgba(212,175,55,0.15); max-width:860px; width:100%; max-height:90vh; overflow-y:auto; display:grid; grid-template-columns:1fr 1fr; position:relative; }
  @media(max-width:640px){ .gp-modal { grid-template-columns:1fr; } }
  .gp-modal-img { width:100%; height:100%; object-fit:cover; min-height:300px; display:block; }
  .gp-modal-body { padding:2rem; display:flex; flex-direction:column; gap:0.75rem; }
  .gp-modal-close { position:absolute; top:0.75rem; right:0.75rem; background:none; border:none; color:#8a8278; font-size:1.5rem; cursor:pointer; z-index:1; line-height:1; }
  .gp-modal-close:hover { color:#d4af37; }
  .gp-input { width:100%; box-sizing:border-box; padding:0.5rem 0.7rem; background:#181818; border:1px solid rgba(212,175,55,0.15); color:#f2ece0; font-family:'Cormorant Garamond',serif; font-size:0.9rem; }
  .gp-input:focus { outline:none; border-color:rgba(212,175,55,0.4); }
  .gp-input::placeholder { color:#484848; }
  .gp-label { font-family:'Cinzel',serif; font-size:0.52rem; letter-spacing:0.18em; text-transform:uppercase; color:rgba(212,175,55,0.4); display:block; margin-bottom:0.25rem; }
  .gp-btn { padding:0.6rem 1.5rem; background:#d4af37; border:none; color:#141414; font-family:'Cinzel',serif; font-size:0.58rem; letter-spacing:0.2em; text-transform:uppercase; cursor:pointer; }
  .gp-btn:hover { background:#c09f27; }
  .gp-btn:disabled { background:#222; color:#444; cursor:not-allowed; }
  .gp-empty { border:1px solid rgba(212,175,55,0.08); padding:6rem 2rem; text-align:center; }
  .gp-empty-text { font-family:'Cinzel',serif; font-size:1.4rem; color:rgba(212,175,55,0.12); }
  .gp-footer { border-top:1px solid rgba(212,175,55,0.08); padding:1.5rem 2rem; text-align:center; }
  .gp-footer-text { font-family:'Cinzel',serif; font-size:0.52rem; letter-spacing:0.35em; text-transform:uppercase; color:rgba(212,175,55,0.25); }
`;

// ── Artwork Card ───────────────────────────────────────────────────────────────
function ArtworkCard({ artwork, onClick }: { artwork: Artwork; onClick: () => void }) {
  const { t } = useTranslation();
  const [imgError, setImgError] = useState(false);
  return (
    <div className="gp-card" onClick={onClick}>
      <div className="gp-card-img-wrap">
        {artwork.image && !imgError
          ? <img src={artwork.image} alt={artwork.title} className="gp-card-img" onError={() => setImgError(true)} />
          : <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ fontFamily:"'Cinzel',serif", fontSize:"2rem", color:"rgba(212,175,55,0.1)" }}>{artwork.title[0]}</span>
            </div>
        }
        {artwork.available
          ? <span className="gp-badge-avail">{t("gallery_page.badge_available", "Available")}</span>
          : <span className="gp-badge-sold">{t("gallery_page.badge_sold", "Sold")}</span>
        }
      </div>
      <p className="gp-card-title">{artwork.title}</p>
      <p className="gp-card-meta">{artwork.artist}{artwork.year ? ` · ${artwork.year}` : ""} · {artwork.price_display}</p>
    </div>
  );
}

// ── Detail Modal ───────────────────────────────────────────────────────────────
function ArtworkModal({ artwork, gallery, onClose }: { artwork: Artwork; gallery: Gallery; onClose: () => void }) {
  const { t } = useTranslation();
  const [form, setForm]       = useState({ name: "", email: "", message: "" });
  const [sent, setSent]       = useState(false);
  const [sending, setSending] = useState(false);
  const [imgError, setImgError] = useState(false);

  async function handleEnquire() {
    if (!form.name || !form.email) return;
    setSending(true);
    const [firstName, ...rest] = form.name.trim().split(" ");
    await Promise.all([
      fetch("/api/hubspot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formType: "artwork_enquiry", email: form.email, firstName, lastName: rest.join(" ") || undefined, message: form.message, artworkTitle: artwork.title }),
      }),
      fetch("/api/mailchimp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, firstName, lastName: rest.join(" ") || undefined, tags: ["artwork-enquiry"] }),
      }),
    ]).catch(() => {});
    setSending(false);
    setSent(true);
  }

  return (
    <div className="gp-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="gp-modal">
        <button className="gp-modal-close" onClick={onClose}>×</button>
        <div>
          {artwork.image && !imgError
            ? <img src={artwork.image} alt={artwork.title} className="gp-modal-img" onError={() => setImgError(true)} />
            : <div style={{ minHeight:300, background:"#1c1c1c", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"3rem", color:"rgba(212,175,55,0.08)", fontFamily:"'Cinzel',serif" }}>{artwork.title[0]}</div>
          }
        </div>
        <div className="gp-modal-body">
          <div>
            <p style={{ fontFamily:"'Cinzel',serif", fontSize:"0.55rem", letterSpacing:"0.3em", color:"#d4af37", margin:"0 0 0.4rem", textTransform:"uppercase" }}>
              {artwork.available ? t("gallery_page.badge_available", "Available") : t("gallery_page.badge_sold", "Sold")}
            </p>
            <h2 style={{ fontFamily:"'Cinzel',serif", fontSize:"1.1rem", fontWeight:400, color:"#f8f2e4", letterSpacing:"0.06em", margin:"0 0 0.2rem" }}>{artwork.title}</h2>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"0.9rem", color:"#8a8278", margin:0 }}>
              {artwork.artist}{artwork.year ? ` · ${artwork.year}` : ""}
            </p>
          </div>

          <div style={{ display:"flex", gap:"1.5rem", flexWrap:"wrap" }}>
            {([[t("gallery_page.label_medium","Medium"), artwork.medium], [t("gallery_page.label_dimensions","Dimensions"), artwork.dimensions], [t("gallery_page.label_price","Price"), artwork.price_display]] as [string, string|null][])
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k}>
                  <p style={{ fontFamily:"'Cinzel',serif", fontSize:"0.52rem", letterSpacing:"0.15em", color:"#6a6258", textTransform:"uppercase", margin:"0 0 0.15rem" }}>{k}</p>
                  <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"0.88rem", color:"#ccc", margin:0 }}>{v}</p>
                </div>
              ))
            }
          </div>

          {artwork.description && (
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"0.88rem", color:"#8a8278", lineHeight:1.75, fontStyle:"italic", margin:0, borderTop:"1px solid rgba(212,175,55,0.08)", paddingTop:"0.75rem" }}>
              {artwork.description}
            </p>
          )}

          <div style={{ borderTop:"1px solid rgba(212,175,55,0.08)", paddingTop:"1rem" }}>
            <p style={{ fontFamily:"'Cinzel',serif", fontSize:"0.6rem", letterSpacing:"0.2em", color:"#d4af37", textTransform:"uppercase", margin:"0 0 1rem" }}>{t("gallery_page.section_enquire", "Enquire")}</p>
            {sent ? (
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"0.9rem", color:"#5cb85c", fontStyle:"italic" }}>
                {t("gallery_page.enquiry_sent", "Enquiry sent. We'll be in touch shortly.")}
              </p>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:"0.65rem" }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.65rem" }}>
                  <div>
                    <label className="gp-label">{t("gallery_page.label_name", "Name *")}</label>
                    <input className="gp-input" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} placeholder={t("gallery_page.placeholder_name", "Your name")} />
                  </div>
                  <div>
                    <label className="gp-label">{t("gallery_page.label_email", "Email *")}</label>
                    <input className="gp-input" type="email" value={form.email} onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))} placeholder={t("gallery_page.placeholder_email", "you@example.com")} />
                  </div>
                </div>
                <div>
                  <label className="gp-label">{t("gallery_page.label_message", "Message")}</label>
                  <input className="gp-input" value={form.message} onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))} placeholder={t("gallery_page.placeholder_message", "Any questions…")} />
                </div>
                <button className="gp-btn" onClick={handleEnquire} disabled={!form.name || !form.email || sending}>
                  {sending ? "…" : t("gallery_page.btn_send_enquiry", "Send Enquiry")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function GalleryPage() {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const [gallery, setGallery]   = useState<Gallery | null>(null);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading]   = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selected, setSelected] = useState<Artwork | null>(null);

  useMeta({
    title: gallery ? `${gallery.name} — Musée-Crosdale` : "Gallery",
    description: gallery?.blurb ?? "Curated contemporary art gallery on Facinations.",
  });

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/gallery?slug=${encodeURIComponent(slug)}`)
      .then((r) => {
        if (r.status === 404) { setNotFound(true); return null; }
        return r.json();
      })
      .then((data) => {
        if (!data) return;
        setGallery(data.gallery);
        setArtworks(data.artworks ?? []);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div style={{ background:"#1c1c1c", minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <span style={{ fontFamily:"'Cinzel',serif", fontSize:"0.6rem", letterSpacing:"0.35em", color:"rgba(212,175,55,0.3)", textTransform:"uppercase" }}>{t("common.loading", "Loading…")}</span>
      </div>
    );
  }

  if (notFound || !gallery) {
    return (
      <div style={{ background:"#1c1c1c", minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"1rem" }}>
        <p style={{ fontFamily:"'Cinzel',serif", fontSize:"0.9rem", color:"rgba(212,175,55,0.3)", letterSpacing:"0.1em" }}>{t("gallery_page.not_found", "Gallery not found")}</p>
        <Link to="/galleries" style={{ fontFamily:"'Cinzel',serif", fontSize:"0.6rem", letterSpacing:"0.2em", color:"#d4af37", textDecoration:"none", textTransform:"uppercase" }}>
          {t("gallery_page.all_galleries", "← All Galleries")}
        </Link>
      </div>
    );
  }

  const initial = gallery.name.charAt(0).toUpperCase();

  return (
    <div className="gp-root">
      <style>{css}</style>

      {selected && (
        <ArtworkModal artwork={selected} gallery={gallery} onClose={() => setSelected(null)} />
      )}

      {/* Header */}
      <div className="gp-header">
        <div className="gp-header-inner">
          {gallery.logo_url
            ? <img src={gallery.logo_url} alt={gallery.name} style={{ width:64, height:64, objectFit:"cover", border:"1px solid rgba(212,175,55,0.2)" }} />
            : <div className="gp-logo">{initial}</div>
          }
          <div style={{ flex:1 }}>
            <div className="gp-eyebrow">{t("gallery_page.eyebrow", "Gallery · Musée-Crosdale")}</div>
            <h1 className="gp-name">{gallery.name}</h1>
            {gallery.blurb && <p className="gp-blurb">{gallery.blurb}</p>}
            {gallery.location && <p className="gp-location">{gallery.location}</p>}
          </div>
          {gallery.external_url && (
            <div style={{ flexShrink:0 }}>
              <a href={gallery.external_url} target="_blank" rel="noopener noreferrer"
                style={{ fontSize:"0.78rem", color:"rgba(212,175,55,0.4)", textDecoration:"none" }}>
                {gallery.external_url.replace(/^https?:\/\//, "")} ↗
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="gp-grid">
        <div className="gp-grid-header">
          <span className="gp-works-label">{t("gallery_page.works_label", "Works")}</span>
          <span className="gp-works-count">{t("gallery_page.works_count", "{{count}} work · {{available}} available", { count: artworks.length, available: artworks.filter(a => a.available).length })}{artworks.length !== 1 ? t("gallery_page.works_plural_suffix", "s") : ""}</span>
        </div>

        {artworks.length === 0 ? (
          <div className="gp-empty">
            <p className="gp-empty-text">{t("gallery_page.no_works", "No works currently listed")}</p>
          </div>
        ) : (
          <div className="gp-artwork-grid">
            {artworks.map((a) => (
              <ArtworkCard key={a.id} artwork={a} onClick={() => setSelected(a)} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ maxWidth:"1200px", margin:"0 auto", padding:"0 2rem 3rem" }}><GalleryPanel /></div>`r`n      <div className="gp-footer">
        <p className="gp-footer-text">
          <Link to="/galleries" style={{ color:"rgba(212,175,55,0.4)", textDecoration:"none" }}>{t("gallery_page.all_galleries", "← All Galleries")}</Link>
          &nbsp;·&nbsp; {t("gallery_page.powered_by", "Powered by Facinations")}
        </p>
      </div>
    </div>
  );
}
