// src/components/KycGate.tsx
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { kycRequired } from "../config/regionFlags";
import { useKyc } from "../context/KycContext";

interface Props {
  children: React.ReactNode;
  featureName?: string;
}

const S: Record<string, React.CSSProperties> = {
  gate: { border: "1px solid rgba(212,175,55,0.15)", background: "#0a0a0a", padding: "2rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" },
  icon: { fontSize: "1.8rem", color: "#d4af37" },
  heading: { fontFamily: "'Cinzel', serif", fontSize: "0.9rem", fontWeight: 400, color: "#f0e8d0", letterSpacing: "0.1em", margin: 0 },
  body: { fontFamily: "'Cormorant Garamond', serif", fontSize: "0.9rem", color: "#6a6258", lineHeight: 1.7, fontStyle: "italic", maxWidth: 380, margin: 0 },
  btn: { padding: "0.6rem 1.75rem", background: "#d4af37", border: "none", color: "#050505", fontFamily: "'Cinzel', serif", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase" as const, cursor: "pointer", textDecoration: "none", display: "inline-block" },
  btnOutline: { padding: "0.6rem 1.75rem", background: "transparent", border: "1px solid rgba(212,175,55,0.3)", color: "#d4af37", fontFamily: "'Cinzel', serif", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase" as const, cursor: "pointer", textDecoration: "none", display: "inline-block" },
  badge: { fontFamily: "'Cinzel', serif", fontSize: "0.55rem", letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "rgba(212,175,55,0.5)", border: "1px solid rgba(212,175,55,0.15)", padding: "0.2rem 0.6rem" },
};

export default function KycGate({ children, featureName = "this feature" }: Props) {
  const { t } = useTranslation();
  const required = kycRequired();
  const { status, reset } = useKyc();

  if (!required) return <>{children}</>;
  if (status === "approved") return <>{children}</>;

  if (status === "pending") {
    return (
      <div style={S.gate}>
        <span style={{ fontSize: "1.8rem" }}>⏳</span>
        <h3 style={S.heading}>{t("kycGate.pending_heading")}</h3>
        <p style={S.body}>{t("kycGate.pending_body", { feature: featureName })}</p>
        <span style={S.badge}>{t("kycGate.pending_badge")}</span>
      </div>
    );
  }

  if (status === "rejected") {
    return (
      <div style={S.gate}>
        <span style={{ fontSize: "1.8rem", color: "#e05" }}>✗</span>
        <h3 style={{ ...S.heading, color: "#e05" }}>{t("kycGate.failed_heading")}</h3>
        <p style={S.body}>{t("kycGate.failed_body")}</p>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Link to="/kyc" style={S.btn}>{t("common.retry")}</Link>
          <button style={S.btnOutline} onClick={reset}>{t("common.reset")}</button>
        </div>
      </div>
    );
  }

  return (
    <div style={S.gate}>
      <span style={S.icon}>🔒</span>
      <h3 style={S.heading}>{t("kycGate.idle_heading")}</h3>
      <p style={S.body}>{t("kycGate.idle_body", { feature: featureName })}</p>
      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", justifyContent: "center" }}>
        <Link to="/kyc" style={S.btn}>{t("kycGate.btn_verify")}</Link>
        <Link to="/legal" style={S.btnOutline}>{t("kycGate.btn_why")}</Link>
      </div>
      <span style={S.badge}>{t("kycGate.badge_required", { region: "Your Region" })}</span>
    </div>
  );
}
