// src/pages/CollectionExchange.jsx
import React from "react";

export default function CollectionExchange() {
  return (
    <main
      style={{
        background: "#080808",
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
            Collection exchange
          </div>
          <h1
            style={{
              fontSize: "2.1rem",
              fontWeight: 400,
              letterSpacing: "0.08em",
              marginBottom: "0.7rem",
            }}
          >
            Fine art liquidity engine
          </h1>
          <p
            style={{
              fontSize: "0.9rem",
              color: "#9a9288",
              maxWidth: "32rem",
              lineHeight: 1.7,
            }}
          >
            Offers arrive as proposals from other collectors, not as order
            books. Each exchange contributes to provenance, exhibition
            visibility, and cultural gravity.
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
                "radial-gradient(circle at top, rgba(212,175,55,0.15), #050505)",
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
              Exchange proposal
            </div>
            <h2
              style={{
                fontSize: "1.1rem",
                fontWeight: 600,
                marginBottom: "0.4rem",
              }}
            >
              Collector in Geneva proposes exchange
            </h2>
            <p
              style={{
                fontSize: "0.82rem",
                color: "#1b150e",
                marginBottom: "0.7rem",
              }}
            >
              Trade your “Narrative Abstraction #3” for “Early Period Study in
              Blue”, routed through a curated exchange and institutional vault.
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "0.78rem",
                color: "#1b150e",
              }}
            >
              <span>Provenance aligned</span>
              <button
                style={{
                  padding: "0.45rem 0.9rem",
                  borderRadius: "999px",
                  border: "1px solid rgba(8,8,8,0.75)",
                  background: "rgba(8,8,8,0.04)",
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.6rem",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Review proposal
              </button>
            </div>
          </article>

          {/* Map real offers here */}
        </section>
      </div>
    </main>
  );
}
