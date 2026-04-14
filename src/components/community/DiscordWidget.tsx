// src/components/community/DiscordWidget.tsx
// Discord server widget embed.
// Set VITE_DISCORD_SERVER_ID in your .env to activate the live widget.
// Set VITE_DISCORD_INVITE_URL for the "Join Server" button.

import React from "react";
import { useTranslation } from "react-i18next";

const SERVER_ID = import.meta.env.VITE_DISCORD_SERVER_ID as string | undefined;
const INVITE_URL = import.meta.env.VITE_DISCORD_INVITE_URL as string | undefined;

const S: Record<string, React.CSSProperties> = {
  root: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  label: {
    fontFamily: "'Cinzel', serif",
    fontSize: "0.52rem",
    letterSpacing: "0.25em",
    textTransform: "uppercase" as const,
    color: "#8a8278",
    margin: 0,
  },
  widgetWrap: {
    border: "1px solid rgba(212,175,55,0.12)",
    background: "#1a1a1a",
    overflow: "hidden",
    position: "relative" as const,
  },
  iframe: {
    display: "block",
    border: "none",
    width: "100%",
    height: 420,
  },
  placeholder: {
    padding: "2.5rem 2rem",
    textAlign: "center" as const,
    border: "1px solid rgba(212,175,55,0.08)",
    background: "#1a1a1a",
  },
  placeholderIcon: {
    fontSize: "2rem",
    color: "rgba(212,175,55,0.2)",
    marginBottom: "1rem",
    display: "block",
  },
  placeholderHeading: {
    fontFamily: "'Cinzel', serif",
    fontSize: "0.8rem",
    fontWeight: 400,
    color: "#f8f2e4",
    letterSpacing: "0.08em",
    margin: "0 0 0.5rem",
  },
  placeholderBody: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "0.85rem",
    color: "#8a8278",
    lineHeight: 1.7,
    fontStyle: "italic",
    margin: 0,
    maxWidth: 360,
    marginInline: "auto",
  },
  setupSteps: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "0.78rem",
    color: "#6a6258",
    lineHeight: 1.9,
    margin: "1rem auto 0",
    maxWidth: 360,
    textAlign: "left" as const,
  },
  joinBtn: {
    display: "inline-block",
    marginTop: "1rem",
    padding: "0.5rem 1.5rem",
    fontFamily: "'Cinzel', serif",
    fontSize: "0.55rem",
    letterSpacing: "0.18em",
    textTransform: "uppercase" as const,
    background: "#5865F2",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    textDecoration: "none",
  },
};

export default function DiscordWidget() {
  const { t } = useTranslation();

  if (!SERVER_ID) {
    return (
      <div style={S.placeholder}>
        <span style={S.placeholderIcon}>◈</span>
        <h3 style={S.placeholderHeading}>{t("discord.setup_heading")}</h3>
        <p style={S.placeholderBody}>{t("discord.setup_body")}</p>
        <ol style={S.setupSteps}>
          <li>{t("discord.setup_step_1")}</li>
          <li>{t("discord.setup_step_2")}</li>
          <li>{t("discord.setup_step_3")}</li>
          <li>{t("discord.setup_step_4")}</li>
        </ol>
      </div>
    );
  }

  const widgetSrc = `https://discord.com/widget?id=${SERVER_ID}&theme=dark`;

  return (
    <div style={S.root}>
      <p style={S.label}>{t("discord.label")}</p>
      <div style={S.widgetWrap}>
        <iframe
          src={widgetSrc}
          style={S.iframe}
          title={t("discord.iframe_title")}
          sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
          allowTransparency={true}
        />
      </div>
      {INVITE_URL && (
        <a href={INVITE_URL} target="_blank" rel="noopener noreferrer" style={S.joinBtn}>
          {t("discord.join")}
        </a>
      )}
    </div>
  );
}
