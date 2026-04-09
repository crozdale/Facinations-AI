import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "./Header";
import { BRAND } from "../brand/brandAssets";

// ── Newsletter + full footer combined ────────────────────────────────────────
function SiteFooter() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();
  const [email, setEmail]     = useState("");
  const [state, setState]     = useState<"idle" | "loading" | "done" | "error">("idle");

  async function subscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setState("loading");
    try {
      await fetch("/api/mailchimp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, tags: ["newsletter"] }),
      });
      setState("done");
    } catch {
      setState("error");
    }
  }

  return (
    <footer style={{ background: "#141414", borderTop: "1px solid rgba(212,175,55,0.12)" }}>

      {/* Newsletter row */}
      <div style={{
        padding: "3rem 2rem",
        textAlign: "center",
        borderBottom: "1px solid rgba(212,175,55,0.06)",
      }}>
        <p style={{
          fontFamily: "'Cinzel', serif",
          fontSize: "0.55rem",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "rgba(212,175,55,0.5)",
          margin: "0 0 1rem",
        }}>
          {t("footer.newsletter_eyebrow", "Private View · Musée-Crosdale")}
        </p>

        {state === "done" ? (
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "#5cb85c", fontSize: "0.9rem", margin: 0 }}>
            {t("footer.newsletter_confirmed", "You're on the list.")}
          </p>
        ) : (
          <form onSubmit={subscribe} style={{ display: "inline-flex", gap: 0, maxWidth: 400, width: "100%" }}>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("footer.newsletter_placeholder", "Your email address")}
              style={{
                flex: 1,
                padding: "0.6rem 0.9rem",
                background: "#202020",
                border: "1px solid rgba(212,175,55,0.2)",
                borderRight: "none",
                color: "#f2ece0",
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "0.9rem",
                outline: "none",
              }}
            />
            <button
              type="submit"
              disabled={state === "loading"}
              style={{
                padding: "0.6rem 1.4rem",
                background: state === "loading" ? "#1a1a1a" : "#d4af37",
                border: "1px solid rgba(212,175,55,0.2)",
                color: state === "loading" ? "#555" : "#141414",
                fontFamily: "'Cinzel', serif",
                fontSize: "0.55rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                cursor: state === "loading" ? "not-allowed" : "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {state === "loading" ? "…" : t("footer.newsletter_btn", "Subscribe")}
            </button>
          </form>
        )}

        {state === "error" && (
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "#888", fontSize: "0.8rem", marginTop: "0.5rem" }}>
            {t("footer.newsletter_error", "Something went wrong — please try again.")}
          </p>
        )}

        {/* Messenger link */}
        {import.meta.env.VITE_THREEMA_ID && (
          <div style={{ marginTop: "1.25rem" }}>
            <a
              href={`https://threema.id/${import.meta.env.VITE_THREEMA_ID}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                fontFamily: "'Cinzel', serif",
                fontSize: "0.5rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(212,175,55,0.35)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(212,175,55,0.7)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(212,175,55,0.35)")}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.5C16.5 22.15 20 17.25 20 12V6L12 2z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              Threema
            </a>
          </div>
        )}
      </div>

      {/* Bottom nav + brand row */}
      <div style={{
        padding: "2rem 2.5rem",
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
        gap: "1.5rem",
        flexWrap: "wrap",
      }}>
        {/* Left — brand */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
          <img
            src={BRAND.FACINATIONS.WORDMARK}
            alt="Facinations"
            style={{ height: 22, objectFit: "contain", objectPosition: "left", filter: "drop-shadow(0 0 8px rgba(212,175,55,0.15))" }}
          />
          <span style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "0.45rem",
            letterSpacing: "0.2em",
            color: "#6a6258",
            textTransform: "uppercase",
          }}>
            © {year} · {t("footer.protocol_tagline", "Decentralised Fine-Art Protocol")}
          </span>
        </div>

        {/* Centre — nav links */}
        <nav style={{ display: "flex", gap: "0.25rem", flexWrap: "wrap", justifyContent: "center" }}>
          {([
            [t("nav.gallery", "Gallery"),      "/gallery"],
            [t("nav.vaults", "Vaults"),        "/vaults"],
            [t("nav.swap", "Swap"),            "/swap"],
            [t("nav.swapp", "P2P Swapp"),      "/swapp"],
            [t("nav.dashboard", "Dashboard"),  "/dashboard"],
            [t("nav.studio", "Studio"),        "/studio"],
            [t("nav.galleries", "Galleries"),  "/galleries"],
            [t("nav.aiCurator", "AI Curator"), "/curator"],
            [t("nav.analytics", "Analytics"),  "/analytics"],
            [t("nav.about", "About"),          "/about"],
            [t("nav.legal", "Legal"),          "/legal"],
            [t("nav.arch", "Whitepaper"),      "/architecture"],
          ] as [string, string][]).map(([label, path]) => (
            <Link
              key={label}
              to={path}
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "0.5rem",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#8a8278",
                textDecoration: "none",
                padding: "0.3rem 0.55rem",
                border: "1px solid transparent",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#d4af37";
                e.currentTarget.style.borderColor = "rgba(212,175,55,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#8a8278";
                e.currentTarget.style.borderColor = "transparent";
              }}
            >
              {label}
            </Link>
          ))}
          <a
            href="https://xervault.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "0.5rem",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "rgba(212,175,55,0.45)",
              textDecoration: "none",
              padding: "0.3rem 0.55rem",
              border: "1px solid rgba(212,175,55,0.15)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#d4af37";
              e.currentTarget.style.borderColor = "rgba(212,175,55,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(212,175,55,0.45)";
              e.currentTarget.style.borderColor = "rgba(212,175,55,0.15)";
            }}
          >
            XerVault
          </a>
        </nav>

        {/* Right — chain info */}
        <div style={{ textAlign: "right" }}>
          <div style={{
            fontFamily: "monospace",
            fontSize: "0.55rem",
            color: "#6a6258",
            letterSpacing: "0.05em",
            marginBottom: "0.2rem",
          }}>
            0x33d1de58…157f
          </div>
          <div style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "0.45rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#2e2820",
          }}>
            Ethereum Sepolia
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── Layout shell ──────────────────────────────────────────────────────────────
export default function Layout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();

  return (
    <div style={{
      minHeight: "100vh",
      background: "#1c1c1c",
      color: "#f2ece0",
      display: "flex",
      flexDirection: "column",
      position: "relative",
    }}>
      {/* Subtle global background grid */}
      <div style={{
        position: "fixed",
        inset: 0,
        backgroundImage: "linear-gradient(rgba(212,175,55,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.018) 1px, transparent 1px)",
        backgroundSize: "80px 80px",
        pointerEvents: "none",
        zIndex: 0,
        maskImage: "radial-gradient(ellipse 90% 90% at 50% 20%, black, transparent)",
      }} />

      {/* Gold top accent line */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "1px",
        background: "linear-gradient(to right, transparent 0%, rgba(212,175,55,0.6) 30%, rgba(212,175,55,0.9) 50%, rgba(212,175,55,0.6) 70%, transparent 100%)",
        zIndex: 300,
      }} />

      {/* Skip-to-content */}
      <a
        href="#main-content"
        style={{ position: "absolute", left: "-9999px", top: "auto", width: 1, height: 1, overflow: "hidden" }}
        onFocus={(e) => {
          e.currentTarget.style.left = "1rem";
          e.currentTarget.style.top = "1rem";
          e.currentTarget.style.width = "auto";
          e.currentTarget.style.height = "auto";
          e.currentTarget.style.zIndex = "9999";
          e.currentTarget.style.background = "#d4af37";
          e.currentTarget.style.color = "#141414";
          e.currentTarget.style.padding = "0.5rem 1rem";
          e.currentTarget.style.fontFamily = "'Cinzel', serif";
          e.currentTarget.style.fontSize = "0.7rem";
          e.currentTarget.style.letterSpacing = "0.15em";
        }}
        onBlur={(e) => {
          e.currentTarget.style.left = "-9999px";
          e.currentTarget.style.width = "1px";
          e.currentTarget.style.height = "1px";
        }}
      >
        {t("common.skip_to_content")}
      </a>

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", flex: 1 }}>
        <Header />
        <main id="main-content" style={{ flex: 1 }} tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
      </div>
    </div>
  );
}
