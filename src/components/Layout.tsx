import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "./Header";

function NewsletterFooter() {
  const { t } = useTranslation();
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
    <footer style={{
      borderTop: "1px solid rgba(212,175,55,0.1)",
      background: "#050505",
      padding: "2rem",
      textAlign: "center",
    }}>
      <p style={{
        fontFamily: "'Cinzel', serif",
        fontSize: "0.55rem",
        letterSpacing: "0.3em",
        textTransform: "uppercase",
        color: "rgba(212,175,55,0.5)",
        margin: "0 0 0.75rem",
      }}>
        {t("footer.newsletter_eyebrow", "Private View · Musée-Crosdale")}
      </p>

      {state === "done" ? (
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "#5cb85c", fontSize: "0.85rem", margin: 0 }}>
          {t("footer.newsletter_confirmed", "You're on the list.")}
        </p>
      ) : (
        <form onSubmit={subscribe} style={{ display: "inline-flex", gap: "0", maxWidth: 380, width: "100%" }}>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("footer.newsletter_placeholder", "Your email address")}
            style={{
              flex: 1,
              padding: "0.55rem 0.85rem",
              background: "#0a0a0a",
              border: "1px solid rgba(212,175,55,0.2)",
              borderRight: "none",
              color: "#e8e0d0",
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "0.9rem",
              outline: "none",
            }}
          />
          <button
            type="submit"
            disabled={state === "loading"}
            style={{
              padding: "0.55rem 1.25rem",
              background: state === "loading" ? "#1a1a1a" : "#d4af37",
              border: "1px solid rgba(212,175,55,0.2)",
              color: state === "loading" ? "#555" : "#050505",
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

      {/* Messenger links */}
      <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "center", gap: "1.25rem", alignItems: "center" }}>
        {import.meta.env.VITE_THREEMA_ID && (
          <a
            href={`https://threema.id/${import.meta.env.VITE_THREEMA_ID}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Message us on Threema"
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
            {/* Threema shield icon (inline SVG) */}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 2L4 6v6c0 5.25 3.5 10.15 8 11.5C16.5 22.15 20 17.25 20 12V6L12 2z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            Threema
          </a>
        )}
      </div>
    </footer>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col">
      {/* Skip-to-content link — visible on keyboard focus only */}
      <a
        href="#main-content"
        style={{
          position: "absolute",
          left: "-9999px",
          top: "auto",
          width: 1,
          height: 1,
          overflow: "hidden",
        }}
        onFocus={(e) => {
          e.currentTarget.style.left = "1rem";
          e.currentTarget.style.top = "1rem";
          e.currentTarget.style.width = "auto";
          e.currentTarget.style.height = "auto";
          e.currentTarget.style.zIndex = "9999";
          e.currentTarget.style.background = "#d4af37";
          e.currentTarget.style.color = "#050505";
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

      <Header />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        {children}
      </main>
      <NewsletterFooter />
    </div>
  );
}