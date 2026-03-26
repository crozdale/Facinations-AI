// src/pages/Vaults.tsx
import React, { useState, useDeferredValue } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useVaults } from "../features/vaults/hooks/useVaults";
import { regionRestrictionMessage, swapsAllowed } from "../config/regionFlags";
import { useMeta } from "../hooks/useMeta";
import WalletGate from "../components/WalletGate";

const RISK_COLORS: Record<string, string> = {
  Low: "#5cb85c",
  Medium: "#d4af37",
  High: "#e05",
};

const Vaults = () => {
  const { t } = useTranslation();

  useMeta({
    title: t("vaults.title"),
    description: "Explore fractionalized fine-art vaults on the Facinations protocol. View APY, TVL, risk scores, and swap vault fractions.",
    image: "/images/Andromeda-Rising.jpg",
  });

  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const regionMsg = regionRestrictionMessage();
  const swapsOk = swapsAllowed();

  const subgraphSearch = deferredSearch.trim().length >= 3 ? deferredSearch.trim() : null;
  const { vaults, loading, error, isLive } = useVaults({ nameSearch: subgraphSearch });
  const safeVaults = vaults || [];

  const normalizedSearch = deferredSearch.trim().toLowerCase();

  const filteredVaults = safeVaults.filter((v) => {
    if (!normalizedSearch) return true;
    return (
      v.name.toLowerCase().includes(normalizedSearch) ||
      v.vaultId.toLowerCase().includes(normalizedSearch)
    );
  });

  if (loading && safeVaults.length === 0) {
    return <div style={{ color: "#ccc", padding: "2rem" }}>{t("vaults.loading")}</div>;
  }

  if (error) {
    return (
      <div style={{ color: "#f88", padding: "2rem" }}>
        {t("vaults.error")}
      </div>
    );
  }

  return (
    <WalletGate>
    <main style={{ background: "#080808", minHeight: "100vh" }}>
      {/* Risk Banner */}
      <div style={{
        background: "rgba(212,175,55,0.05)",
        borderBottom: "1px solid rgba(212,175,55,0.15)",
        padding: "0.75rem 2rem",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
      }}>
        <span style={{ color: "#d4af37", fontSize: "0.9rem", flexShrink: 0 }}>⚠</span>
        <p style={{ fontSize: "0.78rem", color: "rgba(212,175,55,0.75)", margin: 0, lineHeight: 1.5 }}>
          {t("vaults.risk_banner")}{" "}
          <Link to="/legal" style={{ color: "#d4af37", textDecoration: "underline" }}>{t("common.risk_disclosures")}</Link>
        </p>
      </div>

      {/* Region restriction notice */}
      {regionMsg && (
        <div style={{
          background: "rgba(220,80,30,0.06)",
          borderBottom: "1px solid rgba(220,80,30,0.2)",
          padding: "0.6rem 2rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}>
          <span style={{ color: "#e05520", fontSize: "0.85rem", flexShrink: 0 }}>⛔</span>
          <p style={{ fontSize: "0.78rem", color: "rgba(220,120,80,0.9)", margin: 0, lineHeight: 1.5 }}>
            {regionMsg}
          </p>
        </div>
      )}

      <div style={{ padding: "2rem" }}>
        <header style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
          <h1 style={{ color: "#d4af37", margin: 0, fontFamily: "'Cinzel', serif", fontWeight: 400, letterSpacing: "0.1em" }}>
            {t("vaults.title")}
          </h1>
          <span style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "0.5rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: isLive ? "#5cb85c" : "#4a4238",
            border: `1px solid ${isLive ? "rgba(92,184,92,0.25)" : "rgba(212,175,55,0.1)"}`,
            padding: "0.15rem 0.5rem",
          }}>
            {isLive ? t("vaults.badge_live") : t("vaults.badge_cached")}
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("vaults.search_placeholder")}
            style={{
              flex: "0 0 260px",
              padding: "0.4rem 0.6rem",
              borderRadius: 4,
              border: "1px solid rgba(212,175,55,0.4)",
              background: "#050505",
              color: "#eee",
              fontSize: "0.85rem",
            }}
          />
        </header>

        {filteredVaults.length === 0 && !loading && (
          <p style={{ color: "#aaa" }}>{t("vaults.empty")}</p>
        )}

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "1rem",
        }}>
          {filteredVaults.map((v) => (
            <div
              key={v.vaultId}
              style={{
                border: "1px solid rgba(212,175,55,0.25)",
                padding: "1.25rem",
                borderRadius: "6px",
                background: "#0a0a0a",
                color: "#eee",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <Link to={`/vaults/${v.vaultId}`} style={{ textDecoration: "none" }}>
                <h2 style={{ margin: "0 0 0.25rem", fontSize: "1rem", color: "#d4af37", fontFamily: "'Cinzel', serif", fontWeight: 400 }}>
                  {v.name}
                </h2>
              </Link>

              <p style={{ margin: 0, fontSize: "0.75rem", color: "#6a6258", fontFamily: "monospace" }}>
                {v.vaultId}
              </p>

              {v.description && (
                <p style={{ margin: 0, fontSize: "0.85rem", color: "#9a9288", lineHeight: 1.6, fontStyle: "italic" }}>
                  {v.description}
                </p>
              )}

              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
                {v.apy !== null && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.1rem" }}>
                    <span style={{ fontSize: "0.6rem", color: "#555", fontFamily: "'Cinzel', serif", letterSpacing: "0.1em", textTransform: "uppercase" }}>{t("vaults.label_apy")}</span>
                    <span style={{ fontSize: "0.9rem", color: "#d4af37", fontFamily: "'Cormorant Garamond', serif" }}>{v.apy}%</span>
                  </div>
                )}
                {v.tvlUsd !== null && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.1rem" }}>
                    <span style={{ fontSize: "0.6rem", color: "#555", fontFamily: "'Cinzel', serif", letterSpacing: "0.1em", textTransform: "uppercase" }}>{t("vaults.label_tvl")}</span>
                    <span style={{ fontSize: "0.9rem", color: "#ccc", fontFamily: "'Cormorant Garamond', serif" }}>
                      {v.tvlUsd === 0 ? "—" : `$${v.tvlUsd.toLocaleString()}`}
                    </span>
                  </div>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.1rem" }}>
                  <span style={{ fontSize: "0.6rem", color: "#555", fontFamily: "'Cinzel', serif", letterSpacing: "0.1em", textTransform: "uppercase" }}>{t("vaults.label_risk")}</span>
                  <span style={{ fontSize: "0.8rem", color: RISK_COLORS[v.riskScore] ?? "#aaa", fontFamily: "'Cinzel', serif" }}>{v.riskScore}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.1rem" }}>
                  <span style={{ fontSize: "0.6rem", color: "#555", fontFamily: "'Cinzel', serif", letterSpacing: "0.1em", textTransform: "uppercase" }}>{t("vaults.label_vol")}</span>
                  <span style={{ fontSize: "0.8rem", color: RISK_COLORS[v.volatility] ?? "#aaa", fontFamily: "'Cinzel', serif" }}>{v.volatility}</span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem", marginTop: "0.25rem", flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.72rem", color: "#6a6258", fontFamily: "'Cinzel', serif", letterSpacing: "0.1em" }}>
                  {t("vaults.label_chain", { id: v.chainId })}
                </span>
                {v.premiumRequired && (
                  <span style={{
                    fontSize: "0.62rem",
                    color: "#d4af37",
                    border: "1px solid rgba(212,175,55,0.3)",
                    padding: "0.15rem 0.5rem",
                    letterSpacing: "0.15em",
                    fontFamily: "'Cinzel', serif",
                  }}>
                    {t("vaults.badge_premium")}
                  </span>
                )}
              </div>

              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                <Link
                  to={`/vaults/${v.vaultId}`}
                  style={{ fontSize: "0.7rem", color: "#d4af37", border: "1px solid rgba(212,175,55,0.3)", padding: "0.35rem 0.75rem", textDecoration: "none", letterSpacing: "0.12em", fontFamily: "'Cinzel', serif", textTransform: "uppercase" }}
                >
                  {t("vaults.btn_view")}
                </Link>
                {swapsOk ? (
                  <Link
                    to={`/swap?vault=${v.vaultId}`}
                    style={{ fontSize: "0.7rem", color: "#9a9288", border: "1px solid rgba(212,175,55,0.15)", padding: "0.35rem 0.75rem", textDecoration: "none", letterSpacing: "0.12em", fontFamily: "'Cinzel', serif", textTransform: "uppercase" }}
                  >
                    {t("vaults.btn_swap")}
                  </Link>
                ) : (
                  <span style={{ fontSize: "0.7rem", color: "#444", border: "1px solid #222", padding: "0.35rem 0.75rem", letterSpacing: "0.12em", fontFamily: "'Cinzel', serif", textTransform: "uppercase", cursor: "not-allowed" }}>
                    {t("vaults.btn_swap_restricted")}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
    </WalletGate>
  );
};

export default Vaults;
