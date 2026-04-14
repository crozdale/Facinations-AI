// src/pages/Community.tsx
// Community hub — Discord widget + Threema Gateway portal.
// Gallery tier+ required to access messaging integrations.

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMeta } from "../hooks/useMeta";
import DiscordWidget from "../components/community/DiscordWidget";
import ThreemaPortal from "../components/community/ThreemaPortal";

type Tab = "discord" | "threema";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Cinzel:wght@400;600;700&display=swap');
  .comm-root { background:#1c1c1c; min-height:100vh; color:#f2ece0; font-family:'Cormorant Garamond',serif; }
  .comm-hero { text-align:center; padding:4.5rem 2rem 3rem; position:relative; border-bottom:1px solid rgba(212,175,55,0.08); }
  .comm-hero-bg { position:absolute; inset:0; background:radial-gradient(ellipse 70% 60% at 50% 0%, rgba(212,175,55,0.05) 0%, transparent 70%); pointer-events:none; }
  .comm-eyebrow { font-family:'Cinzel',serif; font-size:0.55rem; letter-spacing:0.4em; text-transform:uppercase; color:#d4af37; margin:0 0 0.75rem; position:relative; }
  .comm-title { font-family:'Cinzel',serif; font-size:clamp(2rem,5vw,3.2rem); font-weight:400; color:#f8f2e4; letter-spacing:0.06em; margin:0 0 1rem; position:relative; }
  .comm-tagline { font-family:'Cormorant Garamond',serif; font-size:1rem; color:#8a8278; font-style:italic; line-height:1.8; max-width:520px; margin:0 auto; position:relative; }
  .comm-divider { width:60px; height:1px; background:linear-gradient(to right,transparent,#d4af37,transparent); margin:2rem auto 0; position:relative; }
  .comm-inner { max-width:980px; margin:0 auto; padding:3rem 1.5rem 6rem; }
  .comm-tabs { display:flex; gap:0; border-bottom:1px solid rgba(212,175,55,0.1); margin-bottom:2.5rem; }
  .comm-tab { font-family:'Cinzel',serif; font-size:0.55rem; letter-spacing:0.22em; text-transform:uppercase; padding:0.7rem 1.6rem; background:transparent; border:none; border-bottom:2px solid transparent; cursor:pointer; color:#6a6258; transition:color 0.15s, border-color 0.15s; display:flex; align-items:center; gap:0.5rem; }
  .comm-tab:hover { color:#ccc; }
  .comm-tab-active { color:#d4af37; border-bottom-color:#d4af37; }
  .comm-badge { font-family:'Cinzel',serif; font-size:0.44rem; letter-spacing:0.12em; text-transform:uppercase; padding:0.15rem 0.45rem; border:1px solid; }
  .comm-badge-discord { color:#5865F2; border-color:rgba(88,101,242,0.3); }
  .comm-badge-threema { color:#3dbf8a; border-color:rgba(61,191,138,0.3); }
`;

export default function Community() {
  const { t } = useTranslation();
  useMeta({
    title: "Community · Musée-Crosdale",
    description: "Join the Façinations community — connect on Discord or send a private Threema message to the team.",
  });

  const [tab, setTab] = useState<Tab>("discord");

  const TABS: { id: Tab; label: string; badgeLabel: string; badgeCls: string }[] = [
    { id: "discord", label: t("community.tab_discord"), badgeLabel: t("community.badge_live_chat"), badgeCls: "comm-badge-discord" },
    { id: "threema", label: t("community.tab_threema"), badgeLabel: t("community.badge_encrypted"),  badgeCls: "comm-badge-threema" },
  ];

  return (
    <div className="comm-root">
      <style>{css}</style>

      {/* Hero */}
      <div className="comm-hero">
        <div className="comm-hero-bg" />
        <p className="comm-eyebrow">{t("community.eyebrow")}</p>
        <h1 className="comm-title">{t("community.title")}</h1>
        <p className="comm-tagline">{t("community.tagline")}</p>
        <div className="comm-divider" />
      </div>

      {/* Content */}
      <div className="comm-inner">
          {/* Tabs */}
          <div className="comm-tabs">
            {TABS.map(({ id, label, badgeLabel, badgeCls }) => (
              <button
                key={id}
                className={`comm-tab${tab === id ? " comm-tab-active" : ""}`}
                onClick={() => setTab(id)}
              >
                {label}
                <span className={`comm-badge ${badgeCls}`}>{badgeLabel}</span>
              </button>
            ))}
          </div>

          {/* Panel */}
          {tab === "discord" && <DiscordWidget />}
          {tab === "threema" && <ThreemaPortal />}
      </div>
    </div>
  );
}
