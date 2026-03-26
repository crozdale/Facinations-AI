// src/pages/XdaleGallery.tsx
// Dealer gallery page for Xdale. Features:
//   - Inventory grid with detail modal + enquiry flow
//   - Inventory manager (add / remove works) — admin panel, localStorage-backed
//   - Dealer onboarding application form

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMeta } from "../hooks/useMeta";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Artwork {
  id: string;
  title: string;
  artist: string;
  year: number;
  medium: string;
  dimensions: string;
  description: string;
  priceDisplay: string; // "POA" | "£12,500" | "Sold" etc.
  available: boolean;
  image: string;
}

// ── Seed data ─────────────────────────────────────────────────────────────────
const SEED_ARTWORKS: Artwork[] = [
  {
    id: "1", title: "Polar Interior V", artist: "Crosdale", year: 2023,
    medium: "Oil on linen", dimensions: "120 × 90 cm",
    description: "A meditation on interior states and Arctic light. The fifth in the Polar Interior series, this work layers translucent fields of near-white with deep prussian accents.",
    priceDisplay: "POA", available: true, image: "/images/Rothko1.jpg",
  },
  {
    id: "2", title: "Meridian Series #3", artist: "Crosdale", year: 2024,
    medium: "Acrylic and pigment on canvas", dimensions: "100 × 140 cm",
    description: "Part of the ongoing Meridian Series exploring celestial navigation and the body as cartographic subject.",
    priceDisplay: "£18,500", available: true, image: "/images/Dreamers.jpg",
  },
  {
    id: "3", title: "Antarctic Abstract", artist: "Crosdale", year: 2023,
    medium: "Mixed media on board", dimensions: "80 × 80 cm",
    description: "Cold registers of white and mineral grey collapse into a singular chromatic field. Sold to a private collection.",
    priceDisplay: "Sold", available: false, image: "/images/Aurora.jpg",
  },
  {
    id: "4", title: "Figure Study XII", artist: "Crosdale", year: 2022,
    medium: "Charcoal and oil on paper", dimensions: "60 × 90 cm",
    description: "A late study from the extended figure series. Direct observation, economical mark-making.",
    priceDisplay: "£6,200", available: true, image: "/images/Pale.jpg",
  },
  {
    id: "5", title: "Estuary", artist: "Crosdale", year: 2024,
    medium: "Oil on canvas", dimensions: "150 × 110 cm",
    description: "Tidal rhythms and industrial decay at the mouth of the Thames. Painted en plein air and resolved in studio.",
    priceDisplay: "£22,000", available: true, image: "/images/ESTUARY-484093766_656745863980346_1712517066157130287_n.jpg",
  },
  {
    id: "6", title: "Vortex", artist: "Crosdale", year: 2024,
    medium: "Acrylic on aluminium", dimensions: "90 × 90 cm",
    description: "Rotational energy rendered as concentrated pigment spiral. Sold at auction.",
    priceDisplay: "Sold", available: false, image: "/images/VORTEX-482128186_655514544103478_2106773635_n.jpg",
  },
  {
    id: "7", title: "Millennials", artist: "Crosdale", year: 2023,
    medium: "Oil and collage on canvas", dimensions: "120 × 160 cm",
    description: "Generational identity fractured across surface and substrate. Exhibited at Frieze Focus 2023.",
    priceDisplay: "£28,000", available: true, image: "/images/MILLENNIALS-483507251_655514630770136_6062852906407374833_n.jpg",
  },
  {
    id: "8", title: "Time Traveller", artist: "Crosdale", year: 2024,
    medium: "Oil on linen", dimensions: "100 × 120 cm",
    description: "Temporal displacement as compositional device. The figure is caught mid-transition across chromatic planes.",
    priceDisplay: "POA", available: true, image: "/images/TIME TRAVELLER-491867843_640873872174660_3169334184252443207_n.jpg",
  },
];

const LS_KEY = "xdale_inventory";

function loadInventory(): Artwork[] {
  try {
    const v = localStorage.getItem(LS_KEY);
    if (v) return JSON.parse(v) as Artwork[];
  } catch {}
  return SEED_ARTWORKS;
}

function saveInventory(inv: Artwork[]) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(inv)); } catch {}
}

const DEALER = {
  name: "Xdale",
  logoUrl: null as string | null,
  blurb: "Xdale represents a curated roster of contemporary and emerging artists whose work engages with the intersection of materiality, concept, and the archive. The gallery operates at the frontier of traditional dealing and on-chain provenance.",
  location: "London · New York · On-Chain",
  externalUrl: "https://xdale.io",
  enquiryEmail: "enquiries@xdale.io",
};

// ── CSS ───────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Cinzel:wght@400;600;700&display=swap');
  .xdale-root { background: #080808; min-height: 100vh; font-family: 'Cormorant Garamond', Georgia, serif; color: #e8e0d0; }
  .xdale-header { border-bottom: 1px solid rgba(212,175,55,0.1); background: rgba(212,175,55,0.02); padding: 3rem 2rem; }
  .xdale-header-inner { max-width: 1200px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem; }
  @media (min-width: 640px) { .xdale-header-inner { flex-direction: row; align-items: center; } }
  .xdale-dealer-logo-placeholder { width: 64px; height: 64px; border: 1px solid rgba(212,175,55,0.2); background: #0c0c0c; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-family: 'Cinzel', serif; font-size: 1.4rem; color: rgba(212,175,55,0.4); }
  .xdale-eyebrow { font-family: 'Cinzel', serif; font-size: 0.55rem; letter-spacing: 0.4em; text-transform: uppercase; color: #d4af37; margin-bottom: 0.5rem; }
  .xdale-dealer-name { font-family: 'Cinzel', serif; font-size: clamp(1.6rem, 3vw, 2.4rem); font-weight: 400; color: #f0e8d0; letter-spacing: 0.06em; margin: 0 0 0.5rem; }
  .xdale-dealer-blurb { font-size: 0.92rem; color: #9a9288; line-height: 1.8; max-width: 560px; font-style: italic; }
  .xdale-dealer-location { font-size: 0.75rem; color: rgba(212,175,55,0.3); margin-top: 0.4rem; letter-spacing: 0.08em; }
  .xdale-attribution { font-family: 'Cinzel', serif; font-size: 0.55rem; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(212,175,55,0.3); }
  .xdale-tabs { max-width: 1200px; margin: 0 auto; display: flex; border-bottom: 1px solid rgba(212,175,55,0.1); padding: 0 2rem; }
  .xdale-tab { padding: 0.75rem 1.25rem; font-family: 'Cinzel', serif; font-size: 0.6rem; letter-spacing: 0.15em; text-transform: uppercase; background: none; border: none; border-bottom: 2px solid transparent; color: #4a4238; cursor: pointer; transition: color 0.2s; }
  .xdale-tab:hover { color: #9a9288; }
  .xdale-tab.active { color: #d4af37; border-bottom-color: #d4af37; }
  .xdale-grid { max-width: 1200px; margin: 0 auto; padding: 3.5rem 2rem 6rem; }
  .xdale-grid-header { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 2.5rem; }
  .xdale-works-label { font-family: 'Cinzel', serif; font-size: 0.55rem; letter-spacing: 0.4em; text-transform: uppercase; color: #d4af37; }
  .xdale-works-count { font-size: 0.8rem; color: rgba(212,175,55,0.35); font-style: italic; }
  .xdale-artwork-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
  @media (min-width: 640px) { .xdale-artwork-grid { grid-template-columns: repeat(3, 1fr); } }
  @media (min-width: 960px) { .xdale-artwork-grid { grid-template-columns: repeat(4, 1fr); } }
  .xdale-card { cursor: pointer; }
  .xdale-card-img-wrap { aspect-ratio: 3/4; overflow: hidden; background: #0c0c0c; margin-bottom: 0.75rem; position: relative; border: 1px solid rgba(212,175,55,0.08); }
  .xdale-card-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
  .xdale-card:hover .xdale-card-img { transform: scale(1.05); }
  .xdale-card-available { position: absolute; bottom: 0.5rem; left: 0.5rem; font-family: 'Cinzel', serif; font-size: 0.5rem; letter-spacing: 0.2em; text-transform: uppercase; color: #d4af37; background: rgba(8,8,8,0.85); border: 1px solid rgba(212,175,55,0.3); padding: 0.2rem 0.5rem; }
  .xdale-card-sold { position: absolute; bottom: 0.5rem; left: 0.5rem; font-family: 'Cinzel', serif; font-size: 0.5rem; letter-spacing: 0.2em; text-transform: uppercase; color: #666; background: rgba(8,8,8,0.85); border: 1px solid #333; padding: 0.2rem 0.5rem; }
  .xdale-card-title { font-family: 'Cinzel', serif; font-size: 0.85rem; color: #f0e8d0; letter-spacing: 0.04em; margin: 0 0 0.2rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; transition: color 0.2s; }
  .xdale-card:hover .xdale-card-title { color: #d4af37; }
  .xdale-card-meta { font-size: 0.78rem; color: #6a6258; }
  .xdale-footer { border-top: 1px solid rgba(212,175,55,0.08); padding: 1.5rem 2rem; text-align: center; }
  .xdale-footer-text { font-family: 'Cinzel', serif; font-size: 0.52rem; letter-spacing: 0.35em; text-transform: uppercase; color: rgba(212,175,55,0.25); }
  .xdale-footer-link { color: rgba(212,175,55,0.4); text-decoration: none; transition: color 0.2s; }
  .xdale-footer-link:hover { color: #d4af37; }
  .xdale-empty { border: 1px solid rgba(212,175,55,0.08); padding: 6rem 2rem; text-align: center; }
  .xdale-empty-text { font-family: 'Cinzel', serif; font-size: 1.4rem; color: rgba(212,175,55,0.12); }
  /* Modal */
  .xdale-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 1rem; }
  .xdale-modal { background: #0a0a0a; border: 1px solid rgba(212,175,55,0.15); max-width: 860px; width: 100%; max-height: 90vh; overflow-y: auto; display: grid; grid-template-columns: 1fr 1fr; }
  @media (max-width: 640px) { .xdale-modal { grid-template-columns: 1fr; } }
  .xdale-modal-img { width: 100%; height: 100%; object-fit: cover; min-height: 300px; display: block; }
  .xdale-modal-img-fallback { min-height: 300px; background: #080808; display: flex; align-items: center; justify-content: center; font-family: 'Cinzel', serif; font-size: 3rem; color: rgba(212,175,55,0.08); }
  .xdale-modal-body { padding: 2rem; display: flex; flex-direction: column; gap: 0.75rem; overflow-y: auto; }
  .xdale-modal-close { position: absolute; top: 1rem; right: 1rem; background: none; border: none; color: #6a6258; font-size: 1.5rem; cursor: pointer; line-height: 1; }
  .xdale-modal-close:hover { color: #d4af37; }
  .xm-input { width: 100%; box-sizing: border-box; padding: 0.55rem 0.75rem; background: #060606; border: 1px solid rgba(212,175,55,0.15); color: #e8e0d0; font-family: 'Cormorant Garamond', serif; font-size: 0.9rem; }
  .xm-input:focus { outline: none; border-color: rgba(212,175,55,0.4); }
  .xm-input::placeholder { color: #2a2a2a; }
  .xm-label { font-family: 'Cinzel', serif; font-size: 0.52rem; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(212,175,55,0.4); display: block; margin-bottom: 0.25rem; }
  .xm-btn { padding: 0.6rem 1.5rem; background: #d4af37; border: none; color: #050505; font-family: 'Cinzel', serif; font-size: 0.58rem; letter-spacing: 0.2em; text-transform: uppercase; cursor: pointer; }
  .xm-btn:hover { background: #c09f27; }
  .xm-btn-ghost { padding: 0.6rem 1.5rem; background: transparent; border: 1px solid rgba(212,175,55,0.2); color: #6a6258; font-family: 'Cinzel', serif; font-size: 0.58rem; letter-spacing: 0.2em; text-transform: uppercase; cursor: pointer; }
  /* Inventory manager */
  .inv-section { max-width: 1200px; margin: 0 auto; padding: 3rem 2rem 6rem; }
  .inv-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; margin-bottom: 3rem; }
  .inv-card { border: 1px solid rgba(212,175,55,0.12); background: #0a0a0a; padding: 1rem; display: flex; gap: 1rem; align-items: flex-start; }
  .inv-thumb { width: 64px; height: 80px; object-fit: cover; flex-shrink: 0; border: 1px solid rgba(212,175,55,0.08); }
  .inv-thumb-fallback { width: 64px; height: 80px; background: #0c0c0c; border: 1px solid rgba(212,175,55,0.08); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-family: 'Cinzel', serif; font-size: 1.2rem; color: rgba(212,175,55,0.1); }
  .inv-remove { background: none; border: none; color: #333; cursor: pointer; font-size: 1.1rem; margin-left: auto; flex-shrink: 0; padding: 0; line-height: 1; }
  .inv-remove:hover { color: #e05; }
  /* Onboard section */
  .ob-section { max-width: 700px; margin: 0 auto; padding: 3rem 2rem 6rem; }
`;

// ── Artwork Card ──────────────────────────────────────────────────────────────
function ArtworkCard({ artwork, onClick }: { artwork: Artwork; onClick: () => void }) {
  const { t } = useTranslation();
  const [imgError, setImgError] = useState(false);
  return (
    <div className="xdale-card" onClick={onClick}>
      <div className="xdale-card-img-wrap">
        {!imgError ? (
          <img src={artwork.image} alt={artwork.title} className="xdale-card-img" onError={() => setImgError(true)} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "'Cinzel',serif", fontSize: "2rem", color: "rgba(212,175,55,0.1)" }}>{artwork.title[0]}</span>
          </div>
        )}
        {artwork.available
          ? <span className="xdale-card-available">{t("xdale.status_available")}</span>
          : <span className="xdale-card-sold">{t("xdale.status_sold")}</span>
        }
      </div>
      <p className="xdale-card-title">{artwork.title}</p>
      <p className="xdale-card-meta">{artwork.artist} · {artwork.year} · {artwork.priceDisplay}</p>
    </div>
  );
}

// ── Detail Modal ──────────────────────────────────────────────────────────────
function ArtworkModal({ artwork, onClose }: { artwork: Artwork; onClose: () => void }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [imgError, setImgError] = useState(false);

  async function handleEnquire() {
    if (!form.name || !form.email) return;
    setSending(true);
    const [firstName, ...rest] = form.name.trim().split(" ");
    const lastName = rest.join(" ") || undefined;
    await Promise.all([
      fetch("/api/hubspot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formType: "artwork_enquiry", email: form.email, firstName, lastName, message: form.message, artworkTitle: artwork.title }),
      }),
      fetch("/api/mailchimp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, firstName, lastName, tags: ["artwork-enquiry"] }),
      }),
    ]).catch(() => {});
    setSending(false);
    setSent(true);
  }

  return (
    <div className="xdale-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="xdale-modal" style={{ position: "relative" }}>
        <button className="xdale-modal-close" onClick={onClose} style={{ position: "absolute", top: "0.75rem", right: "0.75rem", zIndex: 1 }}>×</button>

        {/* Left — image */}
        <div>
          {!imgError
            ? <img src={artwork.image} alt={artwork.title} className="xdale-modal-img" onError={() => setImgError(true)} />
            : <div className="xdale-modal-img-fallback">{artwork.title[0]}</div>
          }
        </div>

        {/* Right — details + enquiry */}
        <div className="xdale-modal-body">
          <div>
            <p style={{ fontFamily: "'Cinzel',serif", fontSize: "0.55rem", letterSpacing: "0.3em", color: "#d4af37", margin: "0 0 0.4rem", textTransform: "uppercase" }}>
              {artwork.available ? t("xdale.status_available") : t("xdale.status_sold")}
            </p>
            <h2 style={{ fontFamily: "'Cinzel',serif", fontSize: "1.1rem", fontWeight: 400, color: "#f0e8d0", letterSpacing: "0.06em", margin: "0 0 0.2rem" }}>{artwork.title}</h2>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "0.9rem", color: "#6a6258", margin: 0 }}>{artwork.artist} · {artwork.year}</p>
          </div>

          <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
            {[[t("xdale.label_medium"), artwork.medium], [t("xdale.label_dimensions"), artwork.dimensions], [t("xdale.label_price"), artwork.priceDisplay]].map(([k, v]) => (
              <div key={k}>
                <p style={{ fontFamily: "'Cinzel',serif", fontSize: "0.52rem", letterSpacing: "0.15em", color: "#4a4238", textTransform: "uppercase", margin: "0 0 0.15rem" }}>{k}</p>
                <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "0.88rem", color: "#ccc", margin: 0 }}>{v}</p>
              </div>
            ))}
          </div>

          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "0.88rem", color: "#8a8278", lineHeight: 1.75, fontStyle: "italic", margin: 0, borderTop: "1px solid rgba(212,175,55,0.08)", paddingTop: "0.75rem" }}>
            {artwork.description}
          </p>

          {/* Enquiry form */}
          <div style={{ borderTop: "1px solid rgba(212,175,55,0.08)", paddingTop: "1rem" }}>
            <p style={{ fontFamily: "'Cinzel',serif", fontSize: "0.6rem", letterSpacing: "0.2em", color: "#d4af37", textTransform: "uppercase", margin: "0 0 1rem" }}>
              {t("xdale.enquire_heading")}
            </p>

            {sent ? (
              <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
                <p style={{ fontFamily: "'Cinzel',serif", fontSize: "0.85rem", color: "#5cb85c", margin: "0 0 0.4rem" }}>{t("xdale.enquiry_sent")}</p>
                <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "0.85rem", color: "#6a6258", fontStyle: "italic", margin: 0 }}>
                  {t("xdale.enquiry_followup")}
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <div>
                    <label className="xm-label">{t("xdale.label_name")} *</label>
                    <input className="xm-input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder={t("xdale.placeholder_name")} />
                  </div>
                  <div>
                    <label className="xm-label">{t("xdale.label_email")} *</label>
                    <input className="xm-input" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder={t("xdale.placeholder_email")} />
                  </div>
                </div>
                <div>
                  <label className="xm-label">{t("xdale.label_message")}</label>
                  <textarea className="xm-input" rows={3} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} placeholder={t("xdale.placeholder_message")} style={{ resize: "vertical" }} />
                </div>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button className="xm-btn" onClick={handleEnquire} disabled={!form.name || !form.email || sending}
                    style={{ opacity: form.name && form.email && !sending ? 1 : 0.4, cursor: form.name && form.email && !sending ? "pointer" : "not-allowed" }}>
                    {sending ? "…" : t("xdale.btn_enquire")}
                  </button>
                  <button className="xm-btn-ghost" onClick={onClose}>{t("xdale.btn_close")}</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Inventory Manager ─────────────────────────────────────────────────────────
const EMPTY_ARTWORK: Omit<Artwork, "id"> = {
  title: "", artist: "Crosdale", year: new Date().getFullYear(),
  medium: "", dimensions: "", description: "", priceDisplay: "POA",
  available: true, image: "",
};

function InventoryManager({ inventory, setInventory }: {
  inventory: Artwork[];
  setInventory: (inv: Artwork[]) => void;
}) {
  const { t } = useTranslation();
  const [form, setForm] = useState<Omit<Artwork, "id">>(EMPTY_ARTWORK);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    if (!form.title.trim()) return;
    const newWork: Artwork = { ...form, id: Date.now().toString() };
    const updated = [...inventory, newWork];
    setInventory(updated);
    saveInventory(updated);
    setForm(EMPTY_ARTWORK);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  function handleRemove(id: string) {
    const updated = inventory.filter((a) => a.id !== id);
    setInventory(updated);
    saveInventory(updated);
  }

  const F: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "0.5rem" };
  const inputStyle: React.CSSProperties = {
    padding: "0.5rem 0.7rem", background: "#060606",
    border: "1px solid rgba(212,175,55,0.15)", color: "#e8e0d0",
    fontFamily: "'Cormorant Garamond',serif", fontSize: "0.9rem", width: "100%", boxSizing: "border-box",
  };
  const lbl: React.CSSProperties = {
    fontFamily: "'Cinzel',serif", fontSize: "0.52rem", letterSpacing: "0.15em",
    textTransform: "uppercase", color: "rgba(212,175,55,0.4)", display: "block", marginBottom: "0.2rem",
  };

  return (
    <div className="inv-section">
      {/* Existing works */}
      <p style={{ fontFamily: "'Cinzel',serif", fontSize: "0.55rem", letterSpacing: "0.35em", color: "#d4af37", textTransform: "uppercase", marginBottom: "1.25rem" }}>
        {t("xdale.inv_title", { count: inventory.length })}
      </p>
      <div className="inv-grid">
        {inventory.map((a) => (
          <div className="inv-card" key={a.id}>
            {a.image
              ? <img src={a.image} alt={a.title} className="inv-thumb" onError={(e) => (e.currentTarget.style.display = "none")} />
              : <div className="inv-thumb-fallback">{a.title[0] ?? "?"}</div>
            }
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontFamily: "'Cinzel',serif", fontSize: "0.75rem", color: "#f0e8d0", margin: "0 0 0.15rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.title}</p>
              <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "0.78rem", color: "#6a6258", margin: "0 0 0.1rem" }}>{a.artist} · {a.year}</p>
              <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "0.78rem", color: a.available ? "#d4af37" : "#444", margin: 0 }}>{a.available ? a.priceDisplay : t("xdale.status_sold")}</p>
            </div>
            <button className="inv-remove" title="Remove" onClick={() => handleRemove(a.id)}>×</button>
          </div>
        ))}
      </div>

      {/* Add new work form */}
      <div style={{ border: "1px solid rgba(212,175,55,0.12)", padding: "1.75rem", background: "#090909" }}>
        <p style={{ fontFamily: "'Cinzel',serif", fontSize: "0.55rem", letterSpacing: "0.3em", color: "#d4af37", textTransform: "uppercase", margin: "0 0 1.25rem" }}>{t("xdale.inv_add_heading")}</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div style={F}><label style={lbl}>{t("xdale.label_title")} *</label><input style={inputStyle} value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder={t("xdale.placeholder_title")} /></div>
          <div style={F}><label style={lbl}>{t("xdale.label_artist")}</label><input style={inputStyle} value={form.artist} onChange={(e) => setForm((f) => ({ ...f, artist: e.target.value }))} /></div>
          <div style={F}><label style={lbl}>{t("xdale.label_year")}</label><input style={inputStyle} type="number" value={form.year} onChange={(e) => setForm((f) => ({ ...f, year: +e.target.value }))} /></div>
          <div style={F}><label style={lbl}>{t("xdale.label_medium")}</label><input style={inputStyle} value={form.medium} onChange={(e) => setForm((f) => ({ ...f, medium: e.target.value }))} placeholder={t("xdale.placeholder_medium")} /></div>
          <div style={F}><label style={lbl}>{t("xdale.label_dimensions")}</label><input style={inputStyle} value={form.dimensions} onChange={(e) => setForm((f) => ({ ...f, dimensions: e.target.value }))} placeholder={t("xdale.placeholder_dimensions")} /></div>
          <div style={F}><label style={lbl}>{t("xdale.label_price")}</label><input style={inputStyle} value={form.priceDisplay} onChange={(e) => setForm((f) => ({ ...f, priceDisplay: e.target.value }))} placeholder={t("xdale.placeholder_price")} /></div>
          <div style={{ ...F, gridColumn: "1 / -1" }}><label style={lbl}>{t("xdale.label_image_url")}</label><input style={inputStyle} value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} placeholder={t("xdale.placeholder_image")} /></div>
          <div style={{ ...F, gridColumn: "1 / -1" }}><label style={lbl}>{t("xdale.label_description")}</label><textarea style={{ ...inputStyle, resize: "vertical" }} rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder={t("xdale.placeholder_desc")} /></div>
          <div style={{ ...F, flexDirection: "row", alignItems: "center", gap: "0.75rem" }}>
            <label style={lbl}>{t("xdale.label_available")}</label>
            <input type="checkbox" checked={form.available} onChange={(e) => setForm((f) => ({ ...f, available: e.target.checked }))} style={{ accentColor: "#d4af37", width: 16, height: 16 }} />
          </div>
        </div>
        <div style={{ marginTop: "1.25rem", display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <button
            onClick={handleAdd}
            disabled={!form.title.trim()}
            style={{ padding: "0.6rem 1.75rem", background: form.title.trim() ? "#d4af37" : "#222", border: "none", color: form.title.trim() ? "#050505" : "#444", fontFamily: "'Cinzel',serif", fontSize: "0.58rem", letterSpacing: "0.2em", textTransform: "uppercase", cursor: form.title.trim() ? "pointer" : "not-allowed" }}>
            {t("xdale.btn_add_inventory")}
          </button>
          {added && <span style={{ fontFamily: "'Cinzel',serif", fontSize: "0.58rem", color: "#5cb85c", letterSpacing: "0.1em" }}>{t("xdale.added_confirm")}</span>}
        </div>
      </div>
    </div>
  );
}

// ── Dealer Onboarding ─────────────────────────────────────────────────────────
function DealerOnboarding() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ galleryName: "", contactName: "", email: "", website: "", location: "", description: "", artworkCount: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!form.galleryName || !form.email) return;
    setSubmitting(true);
    const [firstName, ...rest] = (form.contactName || form.galleryName).trim().split(" ");
    const lastName = rest.join(" ") || undefined;
    await Promise.all([
      fetch("/api/hubspot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formType: "dealer_onboarding", email: form.email, firstName, lastName, company: form.galleryName, website: form.website, location: form.location, description: form.description }),
      }),
      fetch("/api/mailchimp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, firstName, lastName, tags: ["dealer-lead"] }),
      }),
    ]).catch(() => {});
    setSubmitting(false);
    setSubmitted(true);
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", boxSizing: "border-box", padding: "0.6rem 0.85rem",
    background: "#0c0c0c", border: "1px solid rgba(212,175,55,0.15)",
    color: "#e8e0d0", fontFamily: "'Cormorant Garamond',serif", fontSize: "0.95rem",
  };
  const lbl: React.CSSProperties = {
    display: "block", marginBottom: "0.3rem", fontFamily: "'Cinzel',serif",
    fontSize: "0.52rem", letterSpacing: "0.18em", textTransform: "uppercase",
    color: "rgba(212,175,55,0.45)",
  };

  return (
    <div className="ob-section">
      <p style={{ fontFamily: "'Cinzel',serif", fontSize: "0.55rem", letterSpacing: "0.35em", color: "#d4af37", textTransform: "uppercase", marginBottom: "0.5rem" }}>{t("xdale.ob_eyebrow")}</p>
      <h2 style={{ fontFamily: "'Cinzel',serif", fontSize: "1.3rem", fontWeight: 400, color: "#f0e8d0", letterSpacing: "0.08em", margin: "0 0 0.75rem" }}>{t("xdale.ob_heading")}</h2>
      <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "0.95rem", color: "#6a6258", lineHeight: 1.8, fontStyle: "italic", marginBottom: "2.5rem" }}>
        {t("xdale.ob_body")}
      </p>

      {submitted ? (
        <div style={{ border: "1px solid rgba(92,184,92,0.2)", background: "rgba(92,184,92,0.03)", padding: "3rem 2rem", textAlign: "center" }}>
          <p style={{ fontFamily: "'Cinzel',serif", fontSize: "1rem", color: "#5cb85c", margin: "0 0 0.5rem", letterSpacing: "0.08em" }}>{t("xdale.ob_received")}</p>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "0.9rem", color: "#6a6258", fontStyle: "italic", margin: 0 }}>
            {t("xdale.ob_received_body", { galleryName: form.galleryName, email: form.email })}
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div><label style={lbl}>{t("xdale.ob_label_gallery")} *</label><input style={inputStyle} value={form.galleryName} onChange={(e) => setForm((f) => ({ ...f, galleryName: e.target.value }))} placeholder={t("xdale.ob_placeholder_gallery")} /></div>
            <div><label style={lbl}>{t("xdale.ob_label_contact")}</label><input style={inputStyle} value={form.contactName} onChange={(e) => setForm((f) => ({ ...f, contactName: e.target.value }))} placeholder={t("xdale.ob_placeholder_contact")} /></div>
            <div><label style={lbl}>{t("xdale.ob_label_email")} *</label><input style={inputStyle} type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder={t("xdale.ob_placeholder_email")} /></div>
            <div><label style={lbl}>{t("xdale.ob_label_website")}</label><input style={inputStyle} value={form.website} onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))} placeholder={t("xdale.ob_placeholder_website")} /></div>
            <div><label style={lbl}>{t("xdale.ob_label_location")}</label><input style={inputStyle} value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} placeholder={t("xdale.ob_placeholder_location")} /></div>
            <div><label style={lbl}>{t("xdale.ob_label_inventory")}</label><input style={inputStyle} value={form.artworkCount} onChange={(e) => setForm((f) => ({ ...f, artworkCount: e.target.value }))} placeholder={t("xdale.ob_placeholder_inventory")} /></div>
          </div>
          <div>
            <label style={lbl}>{t("xdale.ob_label_about")}</label>
            <textarea style={{ ...inputStyle, resize: "vertical" }} rows={4} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder={t("xdale.ob_placeholder_about")} />
          </div>

          {/* What you get */}
          <div style={{ border: "1px solid rgba(212,175,55,0.1)", padding: "1.25rem", background: "#0a0a0a" }}>
            <p style={{ fontFamily: "'Cinzel',serif", fontSize: "0.55rem", letterSpacing: "0.2em", color: "#d4af37", textTransform: "uppercase", margin: "0 0 0.75rem" }}>{t("xdale.ob_included_heading")}</p>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {[t("xdale.ob_include_1"), t("xdale.ob_include_2"), t("xdale.ob_include_3"), t("xdale.ob_include_4"), t("xdale.ob_include_5")].map((item) => (
                <li key={item} style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "0.85rem", color: "#7a7268", paddingLeft: "1rem", position: "relative" }}>
                  <span style={{ position: "absolute", left: 0, color: "rgba(212,175,55,0.3)", fontSize: "0.5rem", top: "0.4em" }}>◆</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!form.galleryName || !form.email || submitting}
            style={{ alignSelf: "flex-start", padding: "0.7rem 2rem", background: form.galleryName && form.email && !submitting ? "#d4af37" : "#222", border: "none", color: form.galleryName && form.email && !submitting ? "#050505" : "#444", fontFamily: "'Cinzel',serif", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", cursor: form.galleryName && form.email && !submitting ? "pointer" : "not-allowed" }}>
            {submitting ? "…" : t("xdale.btn_submit_application")}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
type Tab = "gallery" | "manage" | "onboard";

export default function XdaleGallery() {
  const { t } = useTranslation();
  useMeta({
    title: t("xdale.title"),
    description: "Xdale — a curated roster of contemporary and emerging artists. Browse available works, enquire, and discover on-chain provenance via Facinations.",
    image: "/images/MILLENNIALS-483507251_655514630770136_6062852906407374833_n.jpg",
  });
  const [inventory, setInventory] = useState<Artwork[]>(loadInventory);
  const [selected, setSelected] = useState<Artwork | null>(null);
  const [tab, setTab] = useState<Tab>("gallery");

  // Fetch from DB on mount; fall back to localStorage/seed if unavailable
  useEffect(() => {
    fetch("/api/admin/artworks?gallery=xdale")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (!data?.artworks?.length) return;
        setInventory(data.artworks.map((a: Record<string, unknown>) => ({
          id:           a.id as string,
          title:        a.title as string,
          artist:       a.artist as string,
          year:         a.year as number,
          medium:       a.medium as string,
          dimensions:   a.dimensions as string,
          description:  a.description as string,
          priceDisplay: a.price_display as string,
          available:    a.available as boolean,
          image:        a.image as string,
        })));
      })
      .catch(() => {});
  }, []);

  const available = inventory.filter((a) => a.available).length;

  return (
    <div className="xdale-root">
      <style>{css}</style>

      {/* Dealer Header */}
      <div className="xdale-header">
        <div className="xdale-header-inner">
          <div className="xdale-dealer-logo-placeholder">X</div>
          <div style={{ flex: 1 }}>
            <div className="xdale-eyebrow">{t("xdale.dealer_eyebrow")}</div>
            <h1 className="xdale-dealer-name">{DEALER.name}</h1>
            <p className="xdale-dealer-blurb">{t("xdale.dealer_blurb")}</p>
            <p className="xdale-dealer-location">{t("xdale.dealer_location")}</p>
          </div>
          <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem" }}>
            <a href={DEALER.externalUrl} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: "0.78rem", color: "rgba(212,175,55,0.4)", textDecoration: "none" }}>
              xdale.io ↗
            </a>
            <span className="xdale-attribution">{t("xdale.footer_powered")} Facinations</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="xdale-tabs">
        {([["gallery", t("xdale.tab_gallery")], ["manage", t("xdale.tab_inventory")], ["onboard", t("xdale.tab_become_dealer")]] as [Tab, string][]).map(([id, label]) => (
          <button key={id} className={`xdale-tab${tab === id ? " active" : ""}`} onClick={() => setTab(id)}>{label}</button>
        ))}
      </div>

      {/* Gallery view */}
      {tab === "gallery" && (
        <div className="xdale-grid">
          <div className="xdale-grid-header">
            <span className="xdale-works-label">{t("xdale.inv_label")}</span>
            <span className="xdale-works-count">{t("xdale.inv_count", { available, total: inventory.length })}</span>
          </div>
          {inventory.length === 0 ? (
            <div className="xdale-empty"><p className="xdale-empty-text">{t("xdale.inv_empty")}</p></div>
          ) : (
            <div className="xdale-artwork-grid">
              {inventory.map((a) => (
                <ArtworkCard key={a.id} artwork={a} onClick={() => setSelected(a)} />
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "manage" && <InventoryManager inventory={inventory} setInventory={setInventory} />}
      {tab === "onboard" && <DealerOnboarding />}

      {/* Artwork detail modal */}
      {selected && <ArtworkModal artwork={selected} onClose={() => setSelected(null)} />}

      {/* Footer */}
      <div className="xdale-footer">
        <p className="xdale-footer-text">
          {DEALER.name} · {t("xdale.footer_powered")}{" "}
          <Link to="/" className="xdale-footer-link">{t("xdale.footer_protocol")}</Link>
          {" "}·{" "}
          <Link to="/legal" className="xdale-footer-link">{t("xdale.footer_legal")}</Link>
          {" "}·{" "}
          <Link to="/legal" className="xdale-footer-link">{t("xdale.footer_risk")}</Link>
        </p>
      </div>
    </div>
  );
}
