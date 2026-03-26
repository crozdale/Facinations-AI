// src/pages/NotFound.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMeta } from "../hooks/useMeta";

export default function NotFound() {
  const { t } = useTranslation();
  useMeta({ title: t("notFound.heading"), description: "The page you requested could not be found.", noIndex: true });
  const { pathname } = useLocation();

  return (
    <main
      style={{ background: "#080808", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}
      aria-labelledby="not-found-heading"
    >
      <div style={{ textAlign: "center", maxWidth: 480 }}>
        <p style={{ fontFamily: "'Cinzel', serif", fontSize: "0.55rem", letterSpacing: "0.45em", textTransform: "uppercase", color: "rgba(212,175,55,0.35)", marginBottom: "1.5rem" }}>
          404
        </p>

        <h1
          id="not-found-heading"
          style={{ fontFamily: "'Cinzel', serif", fontSize: "clamp(1.8rem, 5vw, 3rem)", fontWeight: 400, color: "#f0e8d0", letterSpacing: "0.08em", margin: "0 0 1rem" }}
        >
          {t("notFound.heading")}
        </h1>

        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", color: "#6a6258", lineHeight: 1.8, fontStyle: "italic", margin: "0 0 0.5rem" }}>
          {t("notFound.body")}
        </p>

        {pathname !== "/" && (
          <p style={{ fontFamily: "monospace", fontSize: "0.72rem", color: "#2a2a2a", margin: "0 0 2.5rem" }}>
            {pathname}
          </p>
        )}

        <div style={{ width: 40, height: 1, background: "linear-gradient(to right, transparent, rgba(212,175,55,0.3), transparent)", margin: "0 auto 2.5rem" }} />

        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            to="/"
            style={{ padding: "0.6rem 1.75rem", background: "#d4af37", color: "#050505", fontFamily: "'Cinzel', serif", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none" }}
          >
            {t("notFound.btn_home")}
          </Link>
          <Link
            to="/gallery"
            style={{ padding: "0.6rem 1.75rem", background: "transparent", border: "1px solid rgba(212,175,55,0.2)", color: "#6a6258", fontFamily: "'Cinzel', serif", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none" }}
          >
            {t("notFound.btn_gallery")}
          </Link>
        </div>
      </div>
    </main>
  );
}
