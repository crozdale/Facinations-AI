// src/pages/Collection.jsx
import React, { useMemo } from "react";

const mockCollection = [
  {
    id: "work-1",
    title: "Narrative Abstraction #3",
    artist: "Silvana Junod",
    period: "Mid-period",
    acquisitionDate: "2025-11-02",
    imageUrl: "/collection/work-1.jpg",
    events: [
      { type: "acquired", at: "Primary sale", date: "2025-11-02" },
      { type: "exhibited", at: "Facinations Seasonal Salon", date: "2026-02-14" },
    ],
    valuationNote:
      "Institutional demand emerging for narrative abstraction in this series.",
  },
  {
    id: "work-2",
    title: "Early Study for Leaf Machine",
    artist: "Bayliss / Nemesis Archive",
    period: "Early-period",
    acquisitionDate: "2024-06-18",
    imageUrl: "/collection/work-2.jpg",
    events: [
      { type: "vaulted", at: "Facinations Vault / NYC", date: "2025-03-09" },
    ],
    valuationNote:
      "Anchored in early-period provenance, strong cultural gravity.",
  },
];

export default function Collection() {
  const aiPrompts = useMemo(
    () => [
      "Your collection leans toward mid-period narrative abstraction.",
      "High institutional interest in works with early vault provenance.",
      "Exchange opportunity emerging around “Narrative Abstraction #3”.",
    ],
    []
  );

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
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "3rem 2rem 4rem",
        }}
      >
        {/* Header */}
        <header style={{ marginBottom: "2.5rem" }}>
          <div
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "0.58rem",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "rgba(212,175,55,0.55)",
              marginBottom: "0.8rem",
            }}
          >
            Collection
          </div>
          <h1
            style={{
              fontSize: "2.1rem",
              fontWeight: 400,
              letterSpacing: "0.08em",
              marginBottom: "0.8rem",
            }}
          >
            Your private salon of cultural capital
          </h1>
          <p
            style={{
              fontSize: "0.95rem",
              color: "#9a9288",
              maxWidth: "34rem",
              lineHeight: 1.7,
            }}
          >
            Works displayed as a curated exhibition, with provenance and
            valuation narratives. You now possess cultural responsibility.
          </p>
        </header>

        {/* Intelligence + summary */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 1.5fr)",
            gap: "1.5rem",
            marginBottom: "3rem",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "0.55rem",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "rgba(212,175,55,0.55)",
                marginBottom: "0.6rem",
              }}
            >
              Collection intelligence
            </div>
            {aiPrompts.map((text, idx) => (
              <p
                key={idx}
                style={{
                  fontSize: "0.8rem",
                  color: "#9a9288",
                  background:
                    "radial-gradient(circle at top left, rgba(212,175,55,0.12), rgba(8,8,8,1))",
                  border: "1px solid rgba(212,175,55,0.18)",
                  borderRadius: "10px",
                  padding: "0.6rem 0.9rem",
                  marginBottom: "0.5rem",
                }}
              >
                {text}
              </p>
            ))}
          </div>

          <div
            style={{
              background:
                "radial-gradient(circle at top right, rgba(212,175,55,0.18), rgba(12,12,12,1))",
              border: "1px solid rgba(212,175,55,0.25)",
              borderRadius: "14px",
              padding: "1rem 1.2rem",
              boxShadow: "0 18px 55px rgba(0,0,0,0.9)",
            }}
          >
            <div
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "0.55rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "rgba(8,8,8,0.7)",
                marginBottom: "0.4rem",
              }}
            >
              Portfolio overview
            </div>
            <p style={{ fontSize: "0.9rem", marginBottom: "0.25rem" }}>
              2 works held, 1 vaulted, 1 actively circulating through curated
              exchanges.
            </p>
            <p
              style={{
                fontSize: "0.8rem",
                color: "rgba(8,8,8,0.8)",
              }}
            >
              Cultural gravity increases as provenance moves through notable
              collectors and institutions.
            </p>
          </div>
        </section>

        {/* Salon wall */}
        <section>
          <div
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "0.55rem",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "rgba(212,175,55,0.55)",
              marginBottom: "1rem",
            }}
          >
            Salon wall
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1.8rem",
            }}
          >
            {mockCollection.map((work) => (
              <article
                key={work.id}
                style={{
                  background:
                    "radial-gradient(circle at top, rgba(212,175,55,0.12), #050505)",
                  border: "1px solid rgba(212,175,55,0.22)",
                  borderRadius: "18px",
                  overflow: "hidden",
                  boxShadow: "0 32px 90px rgba(0,0,0,0.95)",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    paddingBottom: "133%",
                    background: "black",
                  }}
                >
                  <img
                    src={work.imageUrl}
                    alt={work.title}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>

                <div style={{ padding: "1rem 1.1rem 1rem" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "0.6rem",
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontSize: "1rem",
                          fontWeight: 600,
                          marginBottom: "0.2rem",
                        }}
                      >
                        {work.title}
                      </h3>
                      <p
                        style={{
                          fontSize: "0.8rem",
                          color: "#b0a89e",
                        }}
                      >
                        {work.artist} · {work.period}
                      </p>
                    </div>
                    <span
                      style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: "0.55rem",
                        letterSpacing: "0.24em",
                        textTransform: "uppercase",
                        color: "rgba(212,175,55,0.7)",
                        marginTop: "0.25rem",
                      }}
                    >
                      In collection
                    </span>
                  </div>

                  {/* Provenance */}
                  <div style={{ marginBottom: "0.6rem" }}>
                    <div
                      style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: "0.55rem",
                        letterSpacing: "0.24em",
                        textTransform: "uppercase",
                        color: "rgba(212,175,55,0.55)",
                        marginBottom: "0.25rem",
                      }}
                    >
                      Provenance
                    </div>
                    <ol
                      style={{
                        listStyle: "none",
                        padding: 0,
                        margin: 0,
                        fontSize: "0.78rem",
                        color: "#b0a89e",
                      }}
                    >
                      {work.events.map((event, idx) => (
                        <li key={idx} style={{ marginBottom: "0.15rem" }}>
                          <span style={{ color: "#e6dfd4", textTransform: "capitalize" }}>
                            {event.type}
                          </span>{" "}
                          at {event.at} · {event.date}
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Valuation narrative */}
                  <div style={{ marginBottom: "0.8rem" }}>
                    <div
                      style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: "0.55rem",
                        letterSpacing: "0.24em",
                        textTransform: "uppercase",
                        color: "rgba(212,175,55,0.55)",
                        marginBottom: "0.25rem",
                      }}
                    >
                      Valuation narrative
                    </div>
                    <p
                      style={{
                        fontSize: "0.78rem",
                        color: "#e6dfd4",
                      }}
                    >
                      {work.valuationNote}
                    </p>
                  </div>

                  {/* Bridge actions */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "0.5rem",
                      fontSize: "0.75rem",
                    }}
                  >
                    <a
                      href="/exchange"
                      style={{
                        flex: 1,
                        textAlign: "center",
                        padding: "0.45rem 0.6rem",
                        borderRadius: "999px",
                        border: "1px solid rgba(212,175,55,0.6)",
                        color: "#d4af37",
                        textTransform: "uppercase",
                        letterSpacing: "0.16em",
                        fontFamily: "'Cinzel', serif",
                        fontSize: "0.6rem",
                        textDecoration: "none",
                      }}
                    >
                      Collection exchange
                    </a>
                    <a
                      href="/vaults"
                      style={{
                        flex: 1,
                        textAlign: "center",
                        padding: "0.45rem 0.6rem",
                        borderRadius: "999px",
                        border: "1px solid rgba(212,175,55,0.25)",
                        color: "#9a9288",
                        textTransform: "uppercase",
                        letterSpacing: "0.16em",
                        fontFamily: "'Cinzel', serif",
                        fontSize: "0.6rem",
                        textDecoration: "none",
                      }}
                    >
                      View vault status
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
