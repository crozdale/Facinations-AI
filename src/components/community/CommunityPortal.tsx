// src/components/community/CommunityPortal.tsx
// Community Portal — Discord widget + Threema Gateway contact.
// Designed to live inside the Dashboard, gated at gallery tier+.

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import DiscordWidget from "./DiscordWidget";
import ThreemaPortal from "./ThreemaPortal";

type Tab = "discord" | "threema";

const S: Record<string, React.CSSProperties> = {
  root: {},
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexWrap: "wrap" as const,
    gap: "1rem",
    marginBottom: "1.5rem",
  },
  titleBlock: {},
  eyebrow: {
    fontFamily: "'Cinzel', serif",
    fontSize: "0.52rem",
    letterSpacing: "0.35em",
    textTransform: "uppercase" as const,
    color: "#d4af37",
    margin: "0 0 0.3rem",
  },
  title: {
    fontFamily: "'Cinzel', serif",
    fontSize: "1rem",
    fontWeight: 400,
    color: "#f8f2e4",
    letterSpacing: "0.08em",
    margin: 0,
  },
  tagline: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "0.82rem",
    color: "#8a8278",
    fontStyle: "italic",
    lineHeight: 1.6,
    margin: "0.4rem 0 0",
  },
  tabs: {
    display: "flex",
    gap: "0.5rem",
    borderBottom: "1px solid rgba(212,175,55,0.08)",
    marginBottom: "1.5rem",
  },
  tab: {
    fontFamily: "'Cinzel', serif",
    fontSize: "0.52rem",
    letterSpacing: "0.2em",
    textTransform: "uppercase" as const,
    padding: "0.55rem 1.1rem",
    background: "transparent",
    border: "none",
    borderBottom: "2px solid transparent",
    cursor: "pointer",
    color: "#6a6258",
    transition: "color 0.15s, border-color 0.15s",
  },
  tabActive: {
    color: "#d4af37",
    borderBottomColor: "#d4af37",
  },
  platformBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
    fontFamily: "'Cinzel', serif",
    fontSize: "0.48rem",
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    padding: "0.2rem 0.5rem",
    border: "1px solid",
    marginLeft: "0.5rem",
    verticalAlign: "middle",
  },
  discordBadge: { color: "#5865F2", borderColor: "rgba(88,101,242,0.3)" },
  threemaBadge: { color: "#3dbf8a", borderColor: "rgba(61,191,138,0.3)" },
};

export default function CommunityPortal() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>("discord");

  const TABS: { id: Tab; label: string; badge: string; badgeStyle: React.CSSProperties }[] = [
    { id: "discord", label: "Discord", badge: t("community.badge_live_chat"), badgeStyle: { ...S.platformBadge, ...S.discordBadge } },
    { id: "threema", label: "Threema", badge: t("community.badge_encrypted"), badgeStyle: { ...S.platformBadge, ...S.threemaBadge } },
  ];

  return (
    <div style={S.root}>
      <div style={S.header}>
        <div style={S.titleBlock}>
          <p style={S.eyebrow}>{t("communityPortal.eyebrow")}</p>
          <h2 style={S.title}>{t("communityPortal.title")}</h2>
          <p style={S.tagline}>{t("communityPortal.tagline")}</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={S.tabs}>
        {TABS.map(({ id, label, badge, badgeStyle }) => (
          <button
            key={id}
            style={{ ...S.tab, ...(tab === id ? S.tabActive : {}) }}
            onClick={() => setTab(id)}
          >
            {label}
            <span style={badgeStyle}>{badge}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === "discord" && <DiscordWidget />}
      {tab === "threema" && <ThreemaPortal />}
    </div>
  );
}
