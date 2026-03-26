// src/pages/About.tsx
import { useTranslation } from "react-i18next";
import { useMeta } from "../hooks/useMeta";
import { tk } from "../styles/tokens";

export default function About() {
  const { t } = useTranslation();

  useMeta({
    title: t("about.title"),
    description:
      "Learn about Musée-Crosdale and the Facinations protocol — the on-chain infrastructure for fine-art provenance, fractionalization, and collector access.",
  });

  return (
    <main style={{ background: tk.bg, minHeight: "100vh", fontFamily: tk.fontBody, color: tk.fg }}>

      {/* Hero */}
      <header style={{
        textAlign: "center",
        padding: "5rem 2rem 3rem",
        position: "relative",
        borderBottom: `1px solid ${tk.borderFaint}`,
      }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 70% 60% at 50% 0%, ${tk.goldTint05} 0%, transparent 70%)`, pointerEvents: "none" }} />
        <p style={{ fontFamily: tk.fontDisplay, fontSize: "0.6rem", letterSpacing: "0.35em", textTransform: "uppercase", color: tk.gold, marginBottom: "1rem" }}>
          {t("about.eyebrow")}
        </p>
        <h1 style={{ fontFamily: tk.fontDisplay, fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)", fontWeight: 400, color: tk.fg, letterSpacing: "0.1em", margin: 0 }}>
          {t("about.title")}
        </h1>
        <div style={{ width: 60, height: 1, background: `linear-gradient(to right, transparent, ${tk.gold}, transparent)`, margin: "1.5rem auto 0" }} />
      </header>

      {/* Body */}
      <article style={{ maxWidth: 720, margin: "0 auto", padding: "4rem 2rem 6rem" }}>

        <p style={{ fontSize: "1.05rem", color: tk.fgMuted, lineHeight: 1.9, fontStyle: "italic", marginBottom: "3rem", borderLeft: `2px solid ${tk.border}`, paddingLeft: "1.25rem" }}>
          {t("about.lead")}
        </p>

        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontFamily: tk.fontDisplay, fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: tk.gold, marginBottom: "0.75rem" }}>
            {t("about.section_why")}
          </h2>
          <p style={{ fontSize: "0.98rem", color: tk.fgMuted, lineHeight: 1.9 }}>
            {t("about.why_body")}
          </p>
        </section>

        <section style={{ marginBottom: "2.5rem" }}>
          <h2 style={{ fontFamily: tk.fontDisplay, fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: tk.gold, marginBottom: "0.75rem" }}>
            {t("about.section_how")}
          </h2>
          <ul style={{ padding: 0, margin: 0, listStyle: "none" }}>
            {[
              t("about.how_gallery"),
              t("about.how_exchange"),
              t("about.how_vaults"),
            ].map((item) => (
              <li key={item} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", marginBottom: "0.75rem", fontSize: "0.98rem", color: tk.fgMuted, lineHeight: 1.8 }}>
                <span style={{ color: tk.goldTint10, flexShrink: 0, marginTop: "0.3rem" }}>—</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section style={{ marginBottom: "3rem" }}>
          <h2 style={{ fontFamily: tk.fontDisplay, fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: tk.gold, marginBottom: "0.75rem" }}>
            {t("about.section_team")}
          </h2>
          <p style={{ fontSize: "0.98rem", color: tk.fgMuted, lineHeight: 1.9 }}>
            {t("about.team_body")}
          </p>
        </section>

        <div style={{ borderTop: `1px solid ${tk.borderFaint}`, paddingTop: "2.5rem" }}>
          <button
            style={{
              fontFamily: tk.fontDisplay,
              fontSize: "0.6rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: tk.gold,
              border: `1px solid ${tk.borderMid}`,
              background: "transparent",
              padding: "0.65rem 1.5rem",
              cursor: "pointer",
              transition: `border-color 0.2s ${tk.ease}`,
            }}
            onClick={() => {
              window.location.href =
                "mailto:founder@facinations.app?subject=Investor%20Inquiry";
            }}
          >
            {t("about.btn_investor")}
          </button>
        </div>
      </article>
    </main>
  );
}
