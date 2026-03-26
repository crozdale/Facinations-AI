// src/pages/Landing.tsx
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DealerIntelligencePanel from "../components/DealerIntelligencePanel";
import { useMeta } from "../hooks/useMeta";
import { tk } from "../styles/tokens";

export default function Landing() {
  const { t } = useTranslation();

  const ROLES = [
    {
      title: t("landing.role_vc"),
      body: t("landing.role_vc_desc"),
      links: [
        { to: "/about", label: t("landing.btn_about") },
        { to: "/whitepaper", label: t("landing.btn_whitepaper") },
      ],
    },
    {
      title: t("landing.role_collectors"),
      body: t("landing.role_collectors_desc"),
      links: [{ to: "/gallery", label: t("landing.btn_gallery") }],
    },
    {
      title: t("landing.role_artists"),
      body: t("landing.role_artists_desc"),
      links: [{ to: "/studio", label: t("landing.btn_studio") }],
    },
    {
      title: t("landing.role_partners"),
      body: t("landing.role_partners_desc"),
      links: [{ to: "/blogazine", label: t("landing.btn_blogazine") }],
    },
  ];

  useMeta({
    title: "Musée-Crosdale",
    description:
      "Own civilization. Exchange culture. A synthetic museum for vaulted fine art, powered by the Facinations protocol.",
    image: "/images/Alchemist-of-Light.jpg",
  });

  return (
    <main style={{ background: tk.bg, minHeight: "100vh", fontFamily: tk.fontBody, color: tk.fg }}>

      {/* Hero */}
      <header style={{
        textAlign: "center",
        padding: "6rem 2rem 4rem",
        position: "relative",
        borderBottom: `1px solid ${tk.borderFaint}`,
      }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 70% 60% at 50% 0%, ${tk.goldTint05} 0%, transparent 70%)`, pointerEvents: "none" }} />
        <p style={{ fontFamily: tk.fontDisplay, fontSize: "0.6rem", letterSpacing: "0.35em", textTransform: "uppercase", color: tk.gold, marginBottom: "1.25rem" }}>
          {t("landing.eyebrow")}
        </p>
        <h1 style={{ fontFamily: tk.fontDisplay, fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 400, color: tk.fg, letterSpacing: "0.1em", margin: "0 0 1.25rem" }}>
          {t("landing.heading").split("\n").map((line, i, arr) => (
            <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
          ))}
        </h1>
        <p style={{ fontSize: "1.1rem", color: tk.fgMuted, maxWidth: 520, margin: "0 auto", lineHeight: 1.8, fontStyle: "italic" }}>
          {t("landing.subtitle")}
        </p>
        <div style={{ width: 60, height: 1, background: `linear-gradient(to right, transparent, ${tk.gold}, transparent)`, margin: "2rem auto 0" }} />
      </header>

      {/* Role cards */}
      <section style={{ padding: "4rem 2rem", maxWidth: 960, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1px", background: tk.borderFaint, border: `1px solid ${tk.borderFaint}` }}>
          {ROLES.map((role) => (
            <div key={role.title} style={{ background: tk.bg, padding: "2.25rem 2rem", transition: `background 0.3s ${tk.ease}` }}
              onMouseEnter={(e) => (e.currentTarget.style.background = tk.goldTint03)}
              onMouseLeave={(e) => (e.currentTarget.style.background = tk.bg)}
            >
              <h2 style={{ fontFamily: tk.fontDisplay, fontSize: "0.85rem", fontWeight: 400, letterSpacing: "0.1em", color: tk.fg, margin: "0 0 0.75rem" }}>
                {role.title}
              </h2>
              <p style={{ fontSize: "0.9rem", color: tk.fgDim, lineHeight: 1.7, margin: "0 0 1.5rem", fontStyle: "italic" }}>
                {role.body}
              </p>
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                {role.links.map(({ to, label }) => (
                  <Link key={to} to={to} style={{
                    fontFamily: tk.fontDisplay,
                    fontSize: "0.6rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: tk.gold,
                    border: `1px solid ${tk.borderMid}`,
                    padding: "0.4rem 0.9rem",
                    textDecoration: "none",
                    transition: `border-color 0.2s ${tk.ease}`,
                  }}>
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dealer Intelligence */}
      <section style={{ padding: "0 2rem 6rem", maxWidth: 960, margin: "0 auto" }}>
        <DealerIntelligencePanel />
      </section>
    </main>
  );
}
