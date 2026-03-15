// src/pages/Whitepaper.jsx
import React from "react";

export default function Whitepaper() {
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
          maxWidth: "900px",
          margin: "0 auto",
          padding: "3rem 2rem 4rem",
        }}
      >
        <header style={{ marginBottom: "2.2rem" }}>
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
            Protocol
          </div>
          <h1
            style={{
              fontSize: "2.1rem",
              fontWeight: 600,
              marginBottom: "0.7rem",
            }}
          >
            Facinations Fine-Art Protocol
          </h1>
          <p
            style={{
              fontSize: "0.9rem",
              color: "#9a9288",
              maxWidth: "34rem",
              lineHeight: 1.7,
            }}
          >
            A decentralised system for custody, exchange, and provenance of
            museum-grade digital fine art on Ethereum.
          </p>
        </header>

        <section
          style={{
            fontSize: "0.9rem",
            color: "#c6beb2",
            lineHeight: 1.8,
          }}
        >
          <p style={{ marginBottom: "1rem" }}>
            The Facinations protocol introduces a layered market structure:
            gallery discovery, collector collections, curated exchanges, and
            vault-grade custody. Each layer writes to a shared provenance graph
            that captures cultural gravity, not just price.
          </p>
          <p>
            For the full technical specification, download the PDF whitepaper or
            inspect the open-source smart contracts that anchor custody,
            liquidity, and provenance to Ethereum.
          </p>
        </section>

        <div style={{ marginTop: "2.5rem", display: "flex", gap: "1rem" }}>
          <a
            href="/whitepaper.pdf"
            style={{
              padding: "0.75rem 1.6rem",
              borderRadius: "999px",
              border: "1px solid #d4af37",
              color: "#d4af37",
              fontFamily: "'Cinzel', serif",
              fontSize: "0.7rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            Download whitepaper
          </a>
          <a
            href="https://etherscan.io/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "0.75rem 1.6rem",
              borderRadius: "999px",
              border: "1px solid rgba(212,175,55,0.3)",
              color: "#9a9288",
              fontFamily: "'Cinzel', serif",
              fontSize: "0.7rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            View contracts
          </a>
        </div>
      </div>
    </main>
  );
}
