// src/pages/BlogazineRedirect.jsx
import { useEffect } from "react";

export default function BlogazineRedirect() {
  useEffect(() => {
    window.location.href = "https://xdale.io";
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#e6dfd4",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        fontFamily: "'Cormorant Garamond', Georgia, serif",
      }}
    >
      <div style={{ maxWidth: "22rem", textAlign: "center" }}>
        <h1
          style={{
            fontSize: "1.6rem",
            fontWeight: 600,
            marginBottom: "0.75rem",
          }}
        >
          Redirecting to Blogazine
        </h1>
        <p
          style={{
            fontSize: "0.9rem",
            color: "#9a9288",
            marginBottom: "1rem",
          }}
        >
          You&apos;re being redirected to the Facinations Blogazine at xdale.io
          for market insights, narratives, and partner opportunities.
        </p>
        <a
          href="https://xdale.io"
          style={{
            padding: "0.6rem 1.4rem",
            borderRadius: "999px",
            border: "1px solid rgba(212,175,55,0.4)",
            fontSize: "0.8rem",
            color: "#d4af37",
            textDecoration: "none",
          }}
        >
          Continue to Blogazine
        </a>
      </div>
    </div>
  );
}
