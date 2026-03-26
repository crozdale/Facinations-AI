// src/pages/VaultDetail.tsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { VAULTS } from "../features/vaults/registry/vaultRegistry";
import { useVaultDetail } from "../features/vaults/hooks/useVaultDetail";
import FractionPanel from "../components/FractionPanel";
import WalletGate from "../components/WalletGate";

const labelStyle: React.CSSProperties = {
  fontSize: "0.85rem",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: "#888",
};

const VaultDetail: React.FC = () => {
  const { t } = useTranslation();
  const { vaultId } = useParams<{ vaultId: string }>();

  // Registry for canonical metadata
  const registryVault = VAULTS.find((v) => v.vaultId === vaultId);

  const {
    vault: liveVault,
    loading,
    error,
  } = useVaultDetail(vaultId);

  // Prefer live data if present, fall back to registry
  const vault = liveVault ?? registryVault ?? null;

  if (!vault) {
    return (
      <main style={{ padding: "2rem", color: "#eee" }}>
        <p>{t("vaultDetail.not_found")}</p>
        <Link to="/vaults" style={{ color: "#d4af37" }}>
          {t("vaultDetail.back")}
        </Link>
      </main>
    );
  }

  const tvlDisplay =
    liveVault?.tvlUsd != null ? `$${Number(liveVault.tvlUsd).toLocaleString()}` : "—";

  const sharePriceDisplay =
    liveVault?.sharePriceUsd != null ? `$${Number(liveVault.sharePriceUsd).toLocaleString()}` : "—";

  const volume24hDisplay =
    liveVault?.volume24hUsd != null ? `$${Number(liveVault.volume24hUsd).toLocaleString()}` : "—";

  const holdersDisplay =
    liveVault?.holders != null ? Number(liveVault.holders).toLocaleString() : "—";

  const positions = liveVault?.positions ?? [];

  return (
    <WalletGate>
    <main style={{ padding: "2rem", color: "#eee" }}>
      <Link
        to="/vaults"
        style={{
          color: "#d4af37",
          display: "inline-block",
          marginBottom: "1rem",
          textDecoration: "none",
        }}
      >
        {t("vaultDetail.back")}
      </Link>

      {/* Header */}
      <header style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ color: "#d4af37", marginBottom: "0.5rem" }}>
          {vault.name}
        </h1>
        <p style={{ margin: 0, color: "#aaa" }}>{vault.description}</p>

        {loading && (
          <p style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: "#777" }}>
            {t("vaultDetail.loading_metrics")}
          </p>
        )}
        {error && (
          <p style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: "#f88" }}>
            {t("vaultDetail.metrics_unavailable")}
          </p>
        )}
      </header>

      {/* Core info */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <div>
          <div style={labelStyle}>{t("vaultDetail.label_vault_id")}</div>
          <div style={{ fontFamily: "monospace", fontSize: "0.9rem" }}>
            {vault.vaultId}
          </div>
        </div>

        <div>
          <div style={labelStyle}>{t("vaultDetail.label_contract")}</div>
          <div style={{ fontFamily: "monospace", fontSize: "0.9rem" }}>
            {vault.contractAddress}
          </div>
        </div>

        <div>
          <div style={labelStyle}>{t("vaultDetail.label_chain")}</div>
          <div>{t("vaultDetail.label_mainnet", { id: vault.chainId })}</div>
        </div>

        <div>
          <div style={labelStyle}>{t("vaultDetail.label_access")}</div>
          <div>{vault.premiumRequired ? t("vaultDetail.label_premium") : t("vaultDetail.label_open")}</div>
        </div>
      </section>

      {/* Metrics & Price */}
      <section
        style={{
          marginBottom: "2rem",
          padding: "1.5rem",
          borderRadius: 8,
          border: "1px solid rgba(212,175,55,0.25)",
          background: "#050505",
        }}
      >
        <h2
          style={{
            fontSize: "0.95rem",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "#d4af37",
            marginTop: 0,
            marginBottom: "1rem",
          }}
        >
          {t("vaultDetail.section_metrics")}
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1rem",
          }}
        >
          <div>
            <div style={labelStyle}>{t("vaultDetail.label_tvl")}</div>
            <div style={{ fontSize: "1rem" }}>{tvlDisplay}</div>
          </div>

          <div>
            <div style={labelStyle}>{t("vaultDetail.label_share_price")}</div>
            <div style={{ fontSize: "1rem" }}>{sharePriceDisplay}</div>
          </div>

          <div>
            <div style={labelStyle}>{t("vaultDetail.label_volume_24h")}</div>
            <div style={{ fontSize: "1rem" }}>{volume24hDisplay}</div>
          </div>

          <div>
            <div style={labelStyle}>{t("vaultDetail.label_holders")}</div>
            <div style={{ fontSize: "1rem" }}>{holdersDisplay}</div>
          </div>
        </div>
      </section>

      {/* Fraction Panel — shown for fractionalised vaults */}
      {registryVault && registryVault.fractionTokenId > 0 && (
        <FractionPanel vault={registryVault} />
      )}

      {/* Positions */}
      <section
        style={{
          padding: "1.5rem",
          borderRadius: 8,
          border: "1px solid rgba(212,175,55,0.25)",
          background: "#050505",
        }}
      >
        <h2
          style={{
            fontSize: "0.95rem",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "#d4af37",
            marginTop: 0,
            marginBottom: "1rem",
          }}
        >
          {t("vaultDetail.section_positions")}
        </h2>

        {positions.length === 0 ? (
          <p style={{ fontSize: "0.85rem", color: "#aaa" }}>
            {t("vaultDetail.positions_empty")}
          </p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "0.85rem",
              color: "#ddd",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: "left",
                    padding: "0.5rem 0.25rem",
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {t("vaultDetail.col_asset")}
                </th>
                <th
                  style={{
                    textAlign: "right",
                    padding: "0.5rem 0.25rem",
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {t("vaultDetail.col_weight")}
                </th>
                <th
                  style={{
                    textAlign: "right",
                    padding: "0.5rem 0.25rem",
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {t("vaultDetail.col_value")}
                </th>
              </tr>
            </thead>
            <tbody>
              {positions.map((p) => (
                <tr key={p.id}>
                  <td style={{ padding: "0.5rem 0.25rem" }}>
                    {p.assetSymbol}
                  </td>
                  <td
                    style={{
                      padding: "0.5rem 0.25rem",
                      textAlign: "right",
                    }}
                  >
                    {Number(p.weightBps) / 100}%
                  </td>
                  <td
                    style={{
                      padding: "0.5rem 0.25rem",
                      textAlign: "right",
                    }}
                  >
                    {p.valueUsd != null
                      ? `$${Number(p.valueUsd).toLocaleString()}`
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
    </WalletGate>
  );
};

export default VaultDetail;
