// src/pages/CollectionExchange.jsx
import React from "react";
import { useTranslation } from "react-i18next";

export default function CollectionExchange() {
  const { t } = useTranslation();
  return (
    <main
      style={{
        background: "#1c1c1c",
        minHeight: "100vh",
        color: "#e6dfd4",
        fontFamily: "'Cormorant Garamond', Georgia, serif",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "3rem 2rem 4rem",
        }}
      >
        {/* Escrow policy notice */}
        <div
          style={{
            border: "1px solid rgba(212,175,55,0.45)",
            borderRadius: "12px",
            background: "rgba(212,175,55,0.07)",
            padding: "0.9rem 1.2rem",
            marginBottom: "2rem",
            display: "flex",
            gap: "0.75rem",
            alignItems: "flex-start",
          }}
        >
          <span style={{ fontSize: "1rem", marginTop: "1px" }}>⚠️</span>
          <p style={{ fontSize: "0.82rem", color: "#d4af7a", lineHeight: 1.65, margin: 0 }}>
            <strong>{t("collectionExchange.escrow_notice_title")}</strong>{" "}
            {t("collectionExchange.escrow_notice_body")}
          </p>
        </div>

        <header style={{ marginBottom: "2.4rem", textAlign: "left" }}>
          <div
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "0.55rem",
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "rgba(212,175,55,0.55)",
              marginBottom: "0.7rem",
            }}
          >
            {t("collectionExchange.eyebrow")}
          </div>
          <h1
            style={{
              fontSize: "2.1rem",
              fontWeight: 400,
              letterSpacing: "0.08em",
              marginBottom: "0.7rem",
            }}
          >
            {t("collectionExchange.title")}
          </h1>
          <p
            style={{
              fontSize: "0.9rem",
              color: "#b8b0a4",
              maxWidth: "32rem",
              lineHeight: 1.7,
            }}
          >
            {t("collectionExchange.description")}
          </p>
        </header>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.6rem",
          }}
        >
          <article
            style={{
              background:
                "radial-gradient(circle at top, rgba(212,175,55,0.15), #141414)",
              border: "1px solid rgba(212,175,55,0.28)",
              borderRadius: "18px",
              padding: "1.1rem 1.2rem",
              boxShadow: "0 28px 80px rgba(0,0,0,0.95)",
            }}
          >
            <div
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "0.55rem",
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "rgba(8,8,8,0.8)",
                marginBottom: "0.35rem",
              }}
            >
              {t(“collectionExchange.proposal_eyebrow”)}
            </div>
            <h2
              style={{
                fontSize: “1.1rem”,
                fontWeight: 600,
                marginBottom: “0.4rem”,
              }}
            >
              {t(“collectionExchange.proposal_title”)}
            </h2>
            <p
              style={{
                fontSize: “0.82rem”,
                color: “#1b150e”,
                marginBottom: “0.7rem”,
              }}
            >
              {t(“collectionExchange.proposal_body”)}
            </p>
            <div
              style={{
                display: “flex”,
                justifyContent: “space-between”,
                alignItems: “center”,
                fontSize: “0.78rem”,
                color: “#1b150e”,
              }}
            >
              <span>{t(“collectionExchange.provenance_aligned”)}</span>
              <button
                style={{
                  padding: “0.45rem 0.9rem”,
                  borderRadius: “999px”,
                  border: “1px solid rgba(8,8,8,0.75)”,
                  background: “rgba(8,8,8,0.04)”,
                  fontFamily: “'Cinzel', serif”,
                  fontSize: “0.6rem”,
                  letterSpacing: “0.16em”,
                  textTransform: “uppercase”,
                  cursor: “pointer”,
                }}
              >
                {t(“collectionExchange.review_proposal”)}
              </button>
            </div>
          </article>

          {/* Map real offers here */}
        </section>
      </div>
    </main>
  );
}
