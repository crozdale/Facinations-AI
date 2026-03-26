// src/pages/Swapp.tsx
// Multi-asset barter builder for the Swapp protocol.
// Offer side + Want side, each supporting Fine Art / Vault Position / XER tokens.
// Stub submission — wire to on-chain barter contract when live.

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMeta } from "../hooks/useMeta";

// ── Asset catalogue data ───────────────────────────────────────────────────────
interface ArtAsset   { id: string; title: string; artist: string; image: string; ethValue: number; }
interface VaultAsset { id: string; name: string; apy: number | null; tvlUsd: number; ethValue: number; }

const ART_CATALOGUE: ArtAsset[] = [
  { id: "a1", title: "Polar Interior V",   artist: "Crosdale", image: "/images/Rothko1.jpg",    ethValue: 1.20 },
  { id: "a2", title: "Meridian Series #3", artist: "Crosdale", image: "/images/Dreamers.jpg",   ethValue: 0.60 },
  { id: "a3", title: "Figure Study XII",   artist: "Crosdale", image: "/images/Pale.jpg",        ethValue: 0.35 },
  { id: "a4", title: "Estuary",            artist: "Crosdale", image: "/images/ESTUARY-484093766_656745863980346_1712517066157130287_n.jpg", ethValue: 1.45 },
  { id: "a5", title: "Millennials",        artist: "Crosdale", image: "/images/MILLENNIALS-483507251_655514630770136_6062852906407374833_n.jpg", ethValue: 1.80 },
  { id: "a6", title: "Time Traveller",     artist: "Crosdale", image: "/images/TIME TRAVELLER-491867843_640873872174660_3169334184252443207_n.jpg", ethValue: 0.90 },
];

const VAULT_CATALOGUE: VaultAsset[] = [
  { id: "v1", name: "Albatrix I",     apy: 4.2,  tvlUsd: 128000, ethValue: 0.80 },
  { id: "v2", name: "Open Archive",   apy: null, tvlUsd: 0,      ethValue: 0.05 },
];

// ── Barter item types ─────────────────────────────────────────────────────────
type ItemType = "art" | "vault" | "xer";

interface BarterItem {
  uid: string;       // unique within this barter leg
  type: ItemType;
  label: string;
  sublabel: string;
  ethValue: number;
  image?: string;
}

let _uid = 0;
function uid() { return String(++_uid); }

// ── CSS ───────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Cinzel:wght@400;600;700&display=swap');
  .swapp-root { background: #080808; min-height: 100vh; font-family: 'Cormorant Garamond', Georgia, serif; color: #e8e0d0; }
  .swapp-beta-banner { background: rgba(212,175,55,0.06); border-bottom: 1px solid rgba(212,175,55,0.15); padding: 0.6rem 2rem; text-align: center; }
  .swapp-beta-text { font-family: 'Cinzel', serif; font-size: 0.55rem; letter-spacing: 0.3em; text-transform: uppercase; color: #d4af37; margin: 0; }
  .swapp-hero { max-width: 860px; margin: 0 auto; padding: 4rem 2rem 3rem; text-align: center; }
  .swapp-eyebrow { font-family: 'Cinzel', serif; font-size: 0.55rem; letter-spacing: 0.45em; text-transform: uppercase; color: #d4af37; margin-bottom: 1rem; }
  .swapp-title { font-family: 'Cinzel', serif; font-size: clamp(2.5rem, 8vw, 5.5rem); font-weight: 400; color: #f0e8d0; letter-spacing: 0.1em; margin: 0 0 1rem; }
  .swapp-subtitle { font-size: 1.05rem; color: #9a9288; line-height: 1.8; font-style: italic; max-width: 520px; margin: 0 auto; }

  /* Builder */
  .swapp-builder { max-width: 1040px; margin: 0 auto; padding: 0 1.5rem 5rem; }
  .swapp-builder-label { font-family: 'Cinzel', serif; font-size: 0.55rem; letter-spacing: 0.4em; text-transform: uppercase; color: #d4af37; text-align: center; margin-bottom: 2rem; }
  .swapp-legs { display: grid; grid-template-columns: 1fr auto 1fr; gap: 1rem; align-items: start; }
  @media (max-width: 640px) { .swapp-legs { grid-template-columns: 1fr; } }
  .swapp-leg { border: 1px solid rgba(212,175,55,0.15); background: #0a0a0a; min-height: 280px; display: flex; flex-direction: column; }
  .swapp-leg-header { padding: 1rem 1.25rem; border-bottom: 1px solid rgba(212,175,55,0.08); display: flex; align-items: center; justify-content: space-between; }
  .swapp-leg-title { font-family: 'Cinzel', serif; font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; color: #6a6258; }
  .swapp-leg-total { font-family: 'Cormorant Garamond', serif; font-size: 1rem; color: #d4af37; }
  .swapp-leg-items { flex: 1; padding: 0.75rem; display: flex; flex-direction: column; gap: 0.5rem; }
  .swapp-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 0.75rem; border: 1px solid rgba(212,175,55,0.1); background: #080808; }
  .swapp-item-img { width: 36px; height: 44px; object-fit: cover; flex-shrink: 0; border: 1px solid rgba(212,175,55,0.08); }
  .swapp-item-img-fallback { width: 36px; height: 44px; background: #0c0c0c; border: 1px solid rgba(212,175,55,0.08); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 1rem; color: rgba(212,175,55,0.15); }
  .swapp-item-info { flex: 1; min-width: 0; }
  .swapp-item-label { font-family: 'Cinzel', serif; font-size: 0.72rem; color: #f0e8d0; letter-spacing: 0.04em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin: 0 0 0.1rem; }
  .swapp-item-sub { font-size: 0.72rem; color: #6a6258; margin: 0; }
  .swapp-item-eth { font-family: 'Cormorant Garamond', serif; font-size: 0.85rem; color: #d4af37; flex-shrink: 0; }
  .swapp-item-remove { background: none; border: none; color: #333; cursor: pointer; font-size: 1rem; line-height: 1; padding: 0; flex-shrink: 0; }
  .swapp-item-remove:hover { color: #e05; }
  .swapp-add-btn { margin: 0.75rem; padding: 0.55rem; border: 1px dashed rgba(212,175,55,0.2); background: transparent; color: #4a4238; font-family: 'Cinzel', serif; font-size: 0.58rem; letter-spacing: 0.15em; text-transform: uppercase; cursor: pointer; transition: all 0.2s; }
  .swapp-add-btn:hover { border-color: rgba(212,175,55,0.5); color: #d4af37; }
  .swapp-divider { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.5rem; }
  .swapp-arrow { font-size: 1.8rem; color: rgba(212,175,55,0.25); }
  .swapp-balance { font-family: 'Cinzel', serif; font-size: 0.55rem; letter-spacing: 0.1em; text-align: center; }
  .swapp-propose { margin-top: 2rem; display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; }
  .swapp-propose-btn { padding: 0.75rem 2.5rem; background: #d4af37; border: none; color: #050505; font-family: 'Cinzel', serif; font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; cursor: pointer; transition: background 0.2s; }
  .swapp-propose-btn:hover { background: #c09f27; }
  .swapp-propose-btn:disabled { background: #222; color: #444; cursor: not-allowed; }
  .swapp-propose-ghost { padding: 0.75rem 2rem; background: transparent; border: 1px solid rgba(212,175,55,0.2); color: #6a6258; font-family: 'Cinzel', serif; font-size: 0.65rem; letter-spacing: 0.2em; text-transform: uppercase; cursor: pointer; }
  .swapp-submitted { border: 1px solid rgba(92,184,92,0.2); background: rgba(92,184,92,0.03); padding: 2rem; text-align: center; margin-top: 2rem; }

  /* Picker overlay */
  .swapp-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.88); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 1rem; }
  .swapp-picker { background: #0a0a0a; border: 1px solid rgba(212,175,55,0.2); width: 100%; max-width: 580px; max-height: 80vh; display: flex; flex-direction: column; }
  .swapp-picker-header { padding: 1rem 1.25rem; border-bottom: 1px solid rgba(212,175,55,0.1); display: flex; align-items: center; justify-content: space-between; }
  .swapp-picker-title { font-family: 'Cinzel', serif; font-size: 0.7rem; letter-spacing: 0.2em; color: #f0e8d0; text-transform: uppercase; }
  .swapp-picker-close { background: none; border: none; color: #6a6258; font-size: 1.4rem; cursor: pointer; line-height: 1; }
  .swapp-picker-close:hover { color: #d4af37; }
  .swapp-picker-tabs { display: flex; border-bottom: 1px solid rgba(212,175,55,0.08); }
  .swapp-picker-tab { flex: 1; padding: 0.65rem; background: none; border: none; border-bottom: 2px solid transparent; font-family: 'Cinzel', serif; font-size: 0.58rem; letter-spacing: 0.12em; text-transform: uppercase; color: #4a4238; cursor: pointer; transition: color 0.2s; }
  .swapp-picker-tab:hover { color: #9a9288; }
  .swapp-picker-tab.active { color: #d4af37; border-bottom-color: #d4af37; }
  .swapp-picker-body { flex: 1; overflow-y: auto; padding: 1rem; }
  .swapp-art-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; }
  @media (min-width: 420px) { .swapp-art-grid { grid-template-columns: repeat(4, 1fr); } }
  .swapp-art-cell { cursor: pointer; border: 1px solid transparent; transition: border-color 0.15s; }
  .swapp-art-cell:hover { border-color: rgba(212,175,55,0.4); }
  .swapp-art-cell img { width: 100%; aspect-ratio: 3/4; object-fit: cover; display: block; }
  .swapp-art-cell-title { font-family: 'Cinzel', serif; font-size: 0.5rem; letter-spacing: 0.06em; color: #9a9288; padding: 0.3rem 0.2rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .swapp-vault-row { display: flex; align-items: center; gap: 1rem; padding: 0.85rem 0.75rem; border: 1px solid rgba(212,175,55,0.1); background: #080808; cursor: pointer; margin-bottom: 0.5rem; transition: border-color 0.15s; }
  .swapp-vault-row:hover { border-color: rgba(212,175,55,0.4); }
  .swapp-vault-name { font-family: 'Cinzel', serif; font-size: 0.78rem; color: #f0e8d0; letter-spacing: 0.05em; margin: 0 0 0.15rem; }
  .swapp-vault-meta { font-size: 0.75rem; color: #6a6258; margin: 0; }
  .swapp-vault-eth { font-family: 'Cormorant Garamond', serif; font-size: 0.9rem; color: #d4af37; margin-left: auto; flex-shrink: 0; }
  .swapp-xer-form { padding: 1.5rem 0.5rem; display: flex; flex-direction: column; gap: 1rem; }
  .swapp-xer-input { padding: 0.6rem 0.85rem; background: #060606; border: 1px solid rgba(212,175,55,0.2); color: #e8e0d0; font-family: 'Cormorant Garamond', serif; font-size: 1rem; width: 100%; box-sizing: border-box; }
  .swapp-xer-input:focus { outline: none; border-color: rgba(212,175,55,0.5); }
  .swapp-xer-est { font-family: 'Cormorant Garamond', serif; font-size: 0.85rem; color: #6a6258; font-style: italic; }
  .swapp-xer-add { padding: 0.6rem 1.75rem; background: #d4af37; border: none; color: #050505; font-family: 'Cinzel', serif; font-size: 0.6rem; letter-spacing: 0.18em; text-transform: uppercase; cursor: pointer; }
  .swapp-xer-add:disabled { background: #222; color: #444; cursor: not-allowed; }

  /* Info sections */
  .swapp-types-section { border-top: 1px solid rgba(212,175,55,0.08); border-bottom: 1px solid rgba(212,175,55,0.08); padding: 4rem 2rem; }
  .swapp-types-label { font-family: 'Cinzel', serif; font-size: 0.55rem; letter-spacing: 0.4em; text-transform: uppercase; color: #d4af37; text-align: center; margin-bottom: 2.5rem; }
  .swapp-types-grid { display: grid; grid-template-columns: repeat(2, 1fr); max-width: 860px; margin: 0 auto; border: 1px solid rgba(212,175,55,0.08); }
  @media (min-width: 640px) { .swapp-types-grid { grid-template-columns: repeat(4, 1fr); } }
  .swapp-type-cell { padding: 2.5rem 1.5rem; border-right: 1px solid rgba(212,175,55,0.08); border-bottom: 1px solid rgba(212,175,55,0.08); }
  .swapp-type-cell:nth-child(2n) { border-right: none; }
  @media (min-width: 640px) { .swapp-type-cell:nth-child(2n) { border-right: 1px solid rgba(212,175,55,0.08); } .swapp-type-cell:last-child { border-right: none; } }
  .swapp-type-icon { font-size: 1.1rem; color: rgba(212,175,55,0.3); margin-bottom: 0.75rem; }
  .swapp-type-label { font-family: 'Cinzel', serif; font-size: 0.85rem; color: #f0e8d0; letter-spacing: 0.05em; margin-bottom: 0.5rem; }
  .swapp-type-desc { font-size: 0.8rem; color: #6a6258; line-height: 1.7; }
  .swapp-risk-notice { max-width: 860px; margin: 0 auto; padding: 3rem 2rem 2rem; }
  .swapp-risk-box { display: flex; align-items: flex-start; gap: 0.75rem; border: 1px solid rgba(212,175,55,0.15); background: rgba(212,175,55,0.03); padding: 1.25rem 1.5rem; }
  .swapp-risk-text { font-size: 0.8rem; color: rgba(212,175,55,0.65); line-height: 1.7; margin: 0; }
`;

// ASSET_TYPES are resolved inside the component using t()

const XER_ETH_RATE = 0.0012; // stub rate: 1 XER = 0.0012 ETH

// ── Sub-components ────────────────────────────────────────────────────────────

function ItemRow({ item, onRemove }: { item: BarterItem; onRemove: () => void }) {
  const [imgErr, setImgErr] = useState(false);
  return (
    <div className="swapp-item">
      {item.image && !imgErr
        ? <img src={item.image} alt={item.label} className="swapp-item-img" onError={() => setImgErr(true)} />
        : <div className="swapp-item-img-fallback">
            {item.type === "art" ? "🎨" : item.type === "vault" ? "◈" : "◆"}
          </div>
      }
      <div className="swapp-item-info">
        <p className="swapp-item-label">{item.label}</p>
        <p className="swapp-item-sub">{item.sublabel}</p>
      </div>
      <span className="swapp-item-eth">{item.ethValue.toFixed(3)} ETH</span>
      <button className="swapp-item-remove" onClick={onRemove} aria-label={`Remove ${item.label}`}>×</button>
    </div>
  );
}

type PickerSide = "offer" | "want";

interface PickerProps {
  side: PickerSide;
  existing: BarterItem[];
  onAdd: (item: BarterItem) => void;
  onClose: () => void;
}

function AssetPicker({ side, existing, onAdd, onClose }: PickerProps) {
  const { t } = useTranslation();
  const [tab, setTab] = useState<ItemType>("art");
  const [xerAmount, setXerAmount] = useState("");

  const existingArtIds   = existing.filter((i) => i.type === "art").map((i) => i.uid.split(":")[1]);
  const existingVaultIds = existing.filter((i) => i.type === "vault").map((i) => i.uid.split(":")[1]);

  function addArt(a: ArtAsset) {
    onAdd({ uid: `art:${a.id}:${uid()}`, type: "art", label: a.title, sublabel: a.artist, ethValue: a.ethValue, image: a.image });
    onClose();
  }

  function addVault(v: VaultAsset) {
    onAdd({ uid: `vault:${v.id}:${uid()}`, type: "vault", label: v.name, sublabel: v.apy ? `APY ${v.apy}%` : "Archive", ethValue: v.ethValue });
    onClose();
  }

  function addXer() {
    const amt = parseFloat(xerAmount);
    if (!amt || amt <= 0) return;
    onAdd({ uid: `xer:${uid()}`, type: "xer", label: `${amt.toLocaleString()} XER`, sublabel: "XER Token Bundle", ethValue: +(amt * XER_ETH_RATE).toFixed(4) });
    setXerAmount("");
    onClose();
  }

  return (
    <div className="swapp-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="swapp-picker">
        <div className="swapp-picker-header">
          <span className="swapp-picker-title">{t("swapp.add_to", { side: side === "offer" ? t("swapp.side_offer") : t("swapp.side_want") })}</span>
          <button className="swapp-picker-close" onClick={onClose} aria-label={t("swapp.btn_close_picker")}>×</button>
        </div>

        <div className="swapp-picker-tabs">
          {(["art", "vault", "xer"] as ItemType[]).map((type) => (
            <button key={type} className={`swapp-picker-tab${tab === type ? " active" : ""}`} onClick={() => setTab(type)}>
              {type === "art" ? t("swapp.tab_art") : type === "vault" ? t("swapp.tab_vault") : t("swapp.tab_xer")}
            </button>
          ))}
        </div>

        <div className="swapp-picker-body">
          {tab === "art" && (
            <div className="swapp-art-grid">
              {ART_CATALOGUE.map((a) => (
                <div key={a.id} className="swapp-art-cell" onClick={() => addArt(a)} role="button" aria-label={`Add ${a.title}`}>
                  <img src={a.image} alt={a.title} onError={(e) => (e.currentTarget.style.opacity = "0.3")} />
                  <p className="swapp-art-cell-title">{a.title}</p>
                  <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "0.65rem", color: "#d4af37", padding: "0 0.2rem 0.4rem", margin: 0 }}>{a.ethValue} ETH</p>
                </div>
              ))}
            </div>
          )}

          {tab === "vault" && (
            <div>
              {VAULT_CATALOGUE.map((v) => (
                <div key={v.id} className="swapp-vault-row" onClick={() => addVault(v)} role="button" aria-label={`Add ${v.name}`}>
                  <div style={{ fontSize: "1.1rem", color: "rgba(212,175,55,0.3)", flexShrink: 0 }}>◈</div>
                  <div>
                    <p className="swapp-vault-name">{v.name}</p>
                    <p className="swapp-vault-meta">{v.apy ? `APY ${v.apy}%` : "Archive · No yield"} · TVL ${v.tvlUsd.toLocaleString()}</p>
                  </div>
                  <span className="swapp-vault-eth">{v.ethValue} ETH / fraction</span>
                </div>
              ))}
            </div>
          )}

          {tab === "xer" && (
            <div className="swapp-xer-form">
              <div>
                <label style={{ fontFamily: "'Cinzel',serif", fontSize: "0.55rem", letterSpacing: "0.15em", color: "rgba(212,175,55,0.45)", textTransform: "uppercase", display: "block", marginBottom: "0.35rem" }}>
                  {t("swapp.label_xer_amount")}
                </label>
                <input
                  type="number"
                  min="1"
                  className="swapp-xer-input"
                  value={xerAmount}
                  onChange={(e) => setXerAmount(e.target.value)}
                  placeholder={t("swapp.placeholder_xer")}
                  onKeyDown={(e) => e.key === "Enter" && addXer()}
                />
              </div>
              {xerAmount && parseFloat(xerAmount) > 0 && (
                <p className="swapp-xer-est">
                  ≈ {(parseFloat(xerAmount) * XER_ETH_RATE).toFixed(4)} ETH at current stub rate (1 XER = {XER_ETH_RATE} ETH)
                </p>
              )}
              <button className="swapp-xer-add" onClick={addXer} disabled={!xerAmount || parseFloat(xerAmount) <= 0}>
                {t("swapp.btn_add_xer")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Balance indicator ─────────────────────────────────────────────────────────
function BalanceIndicator({ offerTotal, wantTotal }: { offerTotal: number; wantTotal: number }) {
  const { t } = useTranslation();
  if (offerTotal === 0 && wantTotal === 0) return null;
  const ratio = wantTotal > 0 ? offerTotal / wantTotal : 0;
  const pct = Math.min(Math.max(ratio, 0), 2); // clamp 0–2x for display
  const balanced = ratio >= 0.9 && ratio <= 1.1;
  const color = balanced ? "#5cb85c" : ratio < 0.9 ? "#e09020" : "#e05";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem" }}>
      <div style={{ width: 80, height: 6, background: "#111", borderRadius: 3, overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", left: "50%", top: 0, width: 1, height: "100%", background: "rgba(212,175,55,0.2)" }} />
        <div style={{ width: `${Math.min(pct * 50, 100)}%`, height: "100%", background: color, transition: "width 0.3s, background 0.3s" }} />
      </div>
      <span style={{ fontFamily: "'Cinzel',serif", fontSize: "0.5rem", letterSpacing: "0.1em", color, textTransform: "uppercase" }}>
        {balanced ? t("swapp.balance_equal") : ratio < 0.9 ? t("swapp.balance_less") : t("swapp.balance_more")}
      </span>
    </div>
  );
}

// ── Leg panel ─────────────────────────────────────────────────────────────────
function LegPanel({ title, items, onAdd, onRemove }: {
  title: string;
  items: BarterItem[];
  onAdd: () => void;
  onRemove: (uid: string) => void;
}) {
  const { t } = useTranslation();
  const total = items.reduce((s, i) => s + i.ethValue, 0);
  return (
    <div className="swapp-leg">
      <div className="swapp-leg-header">
        <span className="swapp-leg-title">{title}</span>
        {total > 0 && <span className="swapp-leg-total">{total.toFixed(3)} ETH</span>}
      </div>
      <div className="swapp-leg-items">
        {items.length === 0 && (
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "0.85rem", color: "#2a2a2a", fontStyle: "italic", textAlign: "center", margin: "auto 0", padding: "2rem 1rem" }}>
            {t("vaults.empty")}
          </p>
        )}
        {items.map((item) => (
          <ItemRow key={item.uid} item={item} onRemove={() => onRemove(item.uid)} />
        ))}
      </div>
      <button className="swapp-add-btn" onClick={onAdd}>+ {t("swapp.add_to", { side: title })}</button>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
type PickerState = { open: true; side: PickerSide } | { open: false };

export default function Swapp() {
  const { t } = useTranslation();
  const ASSET_TYPES = [
    { icon: "🎨", label: t("swapp.type_art"),    desc: t("swapp.type_art_desc") },
    { icon: "◈",  label: t("swapp.type_vault"),  desc: t("swapp.type_vault_desc") },
    { icon: "◆",  label: t("swapp.type_xer"),    desc: t("swapp.type_xer_desc") },
    { icon: "⇄",  label: t("swapp.type_barter"), desc: t("swapp.type_barter_desc") },
  ];
  useMeta({
    title: t("swapp.title"),
    description: "Barter fine art, vault positions, and XER tokens peer-to-peer — no cash, no intermediaries. Multi-asset exchange powered by Facinations.",
    image: "/images/ESTUARY-484093766_656745863980346_1712517066157130287_n.jpg",
  });
  const [offerItems, setOfferItems] = useState<BarterItem[]>([]);
  const [wantItems,  setWantItems]  = useState<BarterItem[]>([]);
  const [picker, setPicker] = useState<PickerState>({ open: false });
  const [submitted, setSubmitted] = useState(false);

  const offerTotal = offerItems.reduce((s, i) => s + i.ethValue, 0);
  const wantTotal  = wantItems.reduce((s, i) => s + i.ethValue, 0);
  const canPropose = offerItems.length > 0 && wantItems.length > 0;

  function addItem(side: PickerSide, item: BarterItem) {
    if (side === "offer") setOfferItems((p) => [...p, item]);
    else setWantItems((p) => [...p, item]);
  }

  function removeItem(side: PickerSide, uid: string) {
    if (side === "offer") setOfferItems((p) => p.filter((i) => i.uid !== uid));
    else setWantItems((p) => p.filter((i) => i.uid !== uid));
  }

  function handlePropose() {
    // Stub — in production submit to on-chain barter contract
    setSubmitted(true);
  }

  function handleReset() {
    setOfferItems([]);
    setWantItems([]);
    setSubmitted(false);
  }

  return (
    <div className="swapp-root">
      <style>{css}</style>

      {/* Beta banner */}
      <div className="swapp-beta-banner">
        <p className="swapp-beta-text">{t("swapp.title")} v1 Demo · {t("swapp.beta")} · Not available in all regions</p>
      </div>

      {/* Hero */}
      <section className="swapp-hero">
        <p className="swapp-eyebrow">{t("swapp.subtitle")}</p>
        <h1 className="swapp-title">{t("swapp.title")}</h1>
        <p className="swapp-subtitle">
          {t("swapp.subtitle")}
        </p>
      </section>

      {/* Barter Builder */}
      <section className="swapp-builder" aria-label="Barter builder">
        <p className="swapp-builder-label">{t("swapp.title")}</p>

        {submitted ? (
          <div className="swapp-submitted">
            <p style={{ fontFamily: "'Cinzel',serif", fontSize: "1rem", color: "#5cb85c", margin: "0 0 0.5rem", letterSpacing: "0.08em" }}>Barter Proposed ✓</p>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "0.9rem", color: "#6a6258", fontStyle: "italic", margin: "0 0 1.5rem" }}>
              Your barter proposal has been submitted. The counterparty will be notified once the contract layer is live.
            </p>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "0.85rem", color: "#4a4238", marginBottom: "1.5rem" }}>
              <p style={{ margin: "0 0 0.25rem" }}>Offering: {offerItems.map((i) => i.label).join(", ")} — {offerTotal.toFixed(3)} ETH</p>
              <p style={{ margin: 0 }}>Wanting: {wantItems.map((i) => i.label).join(", ")} — {wantTotal.toFixed(3)} ETH</p>
            </div>
            <button onClick={handleReset} style={{ padding: "0.6rem 1.75rem", background: "transparent", border: "1px solid rgba(212,175,55,0.2)", color: "#6a6258", fontFamily: "'Cinzel',serif", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}>
              New Barter
            </button>
          </div>
        ) : (
          <>
            <div className="swapp-legs">
              <LegPanel
                title={t("swapp.side_offer")}
                items={offerItems}
                onAdd={() => setPicker({ open: true, side: "offer" })}
                onRemove={(uid) => removeItem("offer", uid)}
              />

              <div className="swapp-divider">
                <span className="swapp-arrow">⇄</span>
                <BalanceIndicator offerTotal={offerTotal} wantTotal={wantTotal} />
              </div>

              <LegPanel
                title={t("swapp.side_want")}
                items={wantItems}
                onAdd={() => setPicker({ open: true, side: "want" })}
                onRemove={(uid) => removeItem("want", uid)}
              />
            </div>

            <div className="swapp-propose">
              <button className="swapp-propose-btn" onClick={handlePropose} disabled={!canPropose}
                aria-disabled={!canPropose}>
                {t("swapp.btn_propose")}
              </button>
              {(offerItems.length > 0 || wantItems.length > 0) && (
                <button className="swapp-propose-ghost" onClick={handleReset}>{t("swapp.btn_clear")}</button>
              )}
            </div>

            {!canPropose && (offerItems.length > 0 || wantItems.length > 0) && (
              <p style={{ textAlign: "center", marginTop: "0.75rem", fontFamily: "'Cormorant Garamond',serif", fontSize: "0.82rem", color: "#4a4238", fontStyle: "italic" }}>
                {t("swapp.propose_hint")}
              </p>
            )}
          </>
        )}
      </section>

      {/* Asset type info */}
      <section className="swapp-types-section">
        <p className="swapp-types-label">{t("swapp.subtitle")}</p>
        <div className="swapp-types-grid">
          {ASSET_TYPES.map(({ icon, label, desc }) => (
            <div key={label} className="swapp-type-cell">
              <div className="swapp-type-icon">{icon}</div>
              <p className="swapp-type-label">{label}</p>
              <p className="swapp-type-desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Risk notice */}
      <div className="swapp-risk-notice">
        <div className="swapp-risk-box">
          <span style={{ color: "#d4af37", fontSize: "0.9rem", flexShrink: 0, marginTop: "0.1rem" }}>⚠</span>
          <p className="swapp-risk-text">
            {t("swapp.risk_notice")}{" "}
            <Link to="/legal" style={{ color: "#d4af37", textDecoration: "underline" }}>{t("common.risk_disclosures")}</Link>.
          </p>
        </div>
      </div>

      <div style={{ paddingBottom: "4rem" }} />

      {/* Asset picker modal */}
      {picker.open && (
        <AssetPicker
          side={picker.side}
          existing={picker.side === "offer" ? offerItems : wantItems}
          onAdd={(item) => addItem(picker.side, item)}
          onClose={() => setPicker({ open: false })}
        />
      )}
    </div>
  );
}
