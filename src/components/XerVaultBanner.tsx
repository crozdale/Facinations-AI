import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useXerVaultRef } from "../hooks/useXerVaultRef";

/**
 * Shown when a user arrives from xervault.com (?ref=xervault).
 * Sits above the WalletGate so it's visible before wallet connection.
 */
export default function XerVaultBanner() {
  const { t } = useTranslation();
  const isXerVault = useXerVaultRef();
  const [dismissed, setDismissed] = useState(false);

  if (!isXerVault || dismissed) return null;

  return (
    <div style={{
      background: "rgba(212,175,55,0.05)",
      borderBottom: "1px solid rgba(212,175,55,0.18)",
      padding: "0.7rem 2rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "1rem",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
        <a
          href="https://xervault.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "0.5rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#d4af37",
            textDecoration: "none",
            border: "1px solid rgba(212,175,55,0.35)",
            padding: "0.15rem 0.55rem",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          XerVault
        </a>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "0.88rem",
          color: "rgba(212,175,55,0.8)",
          margin: 0,
          fontStyle: "italic",
          lineHeight: 1.4,
        }}>
          {t("xervaultBanner.tagline")}
        </p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
        style={{
          background: "none",
          border: "none",
          color: "#6a6258",
          cursor: "pointer",
          fontSize: "1.1rem",
          lineHeight: 1,
          flexShrink: 0,
          padding: 0,
          transition: "color 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#d4af37")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#6a6258")}
      >
        ×
      </button>
    </div>
  );
}
