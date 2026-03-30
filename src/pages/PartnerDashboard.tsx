import { useMeta } from "../hooks/useMeta";
import { Link } from "react-router-dom";

const TIERS = [
  { tier: "Tier 1", followers: "5,000 – 49,999", commission: "1.5% of Platform Fees", payout: "$50 min · USD · Monthly" },
  { tier: "Tier 2", followers: "50,000 – 499,999", commission: "2.0% of Platform Fees", payout: "$500/mo budget · Priority AM" },
  { tier: "Tier 3", followers: "500,000+", commission: "Negotiated ≥ 2.5%", payout: "Bespoke · Equity-adjacent" },
];

const S = {
  page: { minHeight: "100vh", background: "#1a1a1a", color: "#f2ece0", padding: "4rem 2rem" } as const,
  maxW: { maxWidth: 800, margin: "0 auto" } as const,
  eyebrow: { fontFamily: "'Cinzel',serif", fontSize: "0.55rem", letterSpacing: "0.35em", textTransform: "uppercase" as const, color: "rgba(212,175,55,0.55)", marginBottom: "1rem" },
  h1: { fontFamily: "'Cinzel',serif", fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 400, color: "#f2ece0", letterSpacing: "0.1em", margin: "0 0 0.75rem" },
  sub: { fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic" as const, color: "#8a8278", fontSize: "1.05rem", marginBottom: "3rem" },
  sectionHead: { fontFamily: "'Cinzel',serif", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "rgba(212,175,55,0.6)", margin: "2.5rem 0 1rem" },
  card: { padding: "1rem 1.25rem", background: "rgba(212,175,55,0.03)", border: "1px solid rgba(212,175,55,0.12)", borderLeft: "2px solid rgba(212,175,55,0.35)", marginBottom: "0.75rem" },
  tierLabel: { fontFamily: "'Cinzel',serif", fontSize: "0.68rem", letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "#d4af37", margin: 0 },
  detail: { fontFamily: "'Cormorant Garamond',serif", fontSize: "0.9rem", color: "#8a8278", margin: "0.2rem 0 0", fontStyle: "italic" as const },
  cta: { display: "inline-block" as const, fontFamily: "'Cinzel',serif", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase" as const, padding: "0.75rem 2rem", border: "1px solid #d4af37", color: "#d4af37", textDecoration: "none", marginTop: "2.5rem", transition: "all 0.2s" },
};

export default function PartnerDashboard() {
  useMeta({
    title: "Consultant Portal — Musée-Crosdale",
    description: "Facinations affiliate and consultant partner programme.",
  });

  return (
    <div style={S.page}>
      <div style={S.maxW}>
        <p style={S.eyebrow}>Facinations · Partners</p>
        <h1 style={S.h1}>Consultant Portal</h1>
        <p style={S.sub}>Earn commission referring collectors, dealers, and institutions to the Facinations protocol.</p>

        <p style={S.sectionHead}>Commission Tiers</p>
        {TIERS.map(t => (
          <div key={t.tier} style={S.card}>
            <p style={S.tierLabel}>{t.tier} · {t.followers} followers</p>
            <p style={S.detail}>{t.commission} &nbsp;·&nbsp; {t.payout}</p>
          </div>
        ))}

        <p style={S.sectionHead}>How it works</p>
        <div style={S.card}>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1rem", color: "#c8c0b4", lineHeight: 1.8, margin: 0 }}>
            Apply below to receive your unique referral link. Share it with collectors, gallery owners, or DeFi traders.
            When a referred user completes KYC and places their first trade, commission begins accruing.
            Paid monthly in <strong style={{ color: "#d4af37" }}>USD</strong> via ACH, PayPal, or USDC —
            minimum threshold <strong style={{ color: "#d4af37" }}>$50</strong>.
          </p>
        </div>

        <p style={S.sectionHead}>Governing Terms</p>
        <div style={S.card}>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "0.9rem", color: "#8a8278", margin: 0, fontStyle: "italic", lineHeight: 1.7 }}>
            90-day attribution window · 12-month earning window · First-click attribution · 30-day cookie<br />
            Governed by the laws of the State of New York, United States.
          </p>
        </div>

        <Link
          to="/marketing"
          style={S.cta}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(212,175,55,0.1)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
        >
          Full Programme Details & Terms →
        </Link>
      </div>
    </div>
  );
}
