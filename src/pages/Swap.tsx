// src/pages/Swap.tsx
import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFacinationsSwap } from "../hooks/useFacinationsSwap";
import { swapsAllowed, regionRestrictionMessage } from "../config/regionFlags";
import WalletGate from "../components/WalletGate";
import { useMeta } from "../hooks/useMeta";
import { VAULTS } from "../features/vaults/registry/vaultRegistry";
import type { RegistryVault } from "../features/vaults/registry/vaultRegistry";

const TOKENS = [
  { id: "XER",  label: "XER — The Fine Art Coin" },
  { id: "ETH",  label: "ETH — Ether" },
  { id: "USDC", label: "USDC — USD Coin" },
  { id: "FRAC", label: "FRAC — Vault Fraction Token" },
];

const SLIPPAGE = 0.005; // 0.5%

type TxState = "idle" | "loading" | "confirmed" | "error";

const Swap: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  // Vault context from ?vault= param
  const vaultParam = searchParams.get("vault");
  const vault: RegistryVault | null = vaultParam
    ? (VAULTS.find((v) => v.vaultId === vaultParam) ?? null)
    : null;

  const [tokenIn,  setTokenIn]  = useState("ETH");
  const [tokenOut, setTokenOut] = useState(vault ? "FRAC" : "XER");
  const [amountIn, setAmountIn] = useState(vaultParam ? "1.0" : "");
  const [quote,    setQuote]    = useState<string | null>(null);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [quoteError,   setQuoteError]   = useState<string | null>(null);
  const [txState, setTxState]   = useState<TxState>("idle");
  const [txHash,  setTxHash]    = useState<string | null>(null);
  const [txError, setTxError]   = useState<string | null>(null);

  useMeta({
    title: t("swap.title"),
    description: "Exchange XER, ETH, USDC, and FRAC fraction tokens via the Facinations on-chain swap protocol.",
  });

  const { getQuote, executeSwap, isOnCorrectChain, account, connect } =
    useFacinationsSwap(vault?.contractAddress);

  const swapsOk   = swapsAllowed();
  const regionMsg = regionRestrictionMessage();

  // When vault changes (e.g. back-navigation), sync token out
  useEffect(() => {
    if (vault) {
      setTokenOut("FRAC");
      if (!amountIn) setAmountIn("1.0");
    }
  }, [vaultParam]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset quote when inputs change
  useEffect(() => {
    setQuote(null);
    setTxState("idle");
    setTxHash(null);
  }, [tokenIn, tokenOut, amountIn]);

  async function handleGetQuote() {
    setQuoteError(null);
    setLoadingQuote(true);
    try {
      const result = await getQuote(amountIn);
      setQuote(result);
    } catch (e: any) {
      setQuoteError(e?.message ?? "Unable to fetch quote");
      setQuote(null);
    } finally {
      setLoadingQuote(false);
    }
  }

  async function handleExecuteSwap() {
    if (!quote) return;
    setTxState("loading");
    setTxError(null);
    setTxHash(null);
    try {
      const minOut = (parseFloat(quote) * (1 - SLIPPAGE)).toFixed(18);
      const receipt = await executeSwap(amountIn, minOut);
      setTxHash(receipt?.hash ?? null);
      setTxState("confirmed");
    } catch (e: any) {
      setTxError(e?.message ?? "Swap failed");
      setTxState("error");
    }
  }

  const canRequestQuote = !!amountIn && parseFloat(amountIn) > 0 && isOnCorrectChain && swapsOk && !!account;
  const canExecute      = !!quote && txState === "idle" && isOnCorrectChain && swapsOk && !!account;

  // ── Styles ──────────────────────────────────────────────────────────────────
  const selectStyle: React.CSSProperties = {
    width: "100%", padding: "0.5rem 0.75rem",
    border: "1px solid rgba(212,175,55,0.3)", background: "#020202",
    color: "#eee", fontSize: "0.85rem", fontFamily: "'Cormorant Garamond', serif",
    appearance: "none", cursor: "pointer",
  };
  const labelStyle: React.CSSProperties = {
    display: "block", marginBottom: "0.25rem", fontSize: "0.7rem",
    textTransform: "uppercase", letterSpacing: "0.12em",
    color: "#888", fontFamily: "'Cinzel', serif",
  };
  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "0.5rem 0.75rem",
    border: "1px solid rgba(212,175,55,0.3)", background: "#020202",
    color: "#eee", fontSize: "0.9rem", fontFamily: "'Cormorant Garamond', serif",
    boxSizing: "border-box",
  };

  return (
    <main style={{ background: "#080808", minHeight: "100vh" }}>
      {/* Risk Banner */}
      <div style={{ background: "rgba(212,175,55,0.05)", borderBottom: "1px solid rgba(212,175,55,0.15)", padding: "0.75rem 2rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <span style={{ color: "#d4af37", fontSize: "0.9rem", flexShrink: 0 }}>⚠</span>
        <p style={{ fontSize: "0.78rem", color: "rgba(212,175,55,0.75)", margin: 0, lineHeight: 1.5 }}>
          {t("swap.risk_banner")}{" "}
          <Link to="/legal" style={{ color: "#d4af37", textDecoration: "underline" }}>{t("common.risk_disclosures")}</Link>
        </p>
      </div>

      {/* Region restriction */}
      {regionMsg && (
        <div style={{ background: "rgba(220,80,30,0.06)", borderBottom: "1px solid rgba(220,80,30,0.2)", padding: "0.6rem 2rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ color: "#e05520", fontSize: "0.85rem", flexShrink: 0 }}>⛔</span>
          <p style={{ fontSize: "0.78rem", color: "rgba(220,120,80,0.9)", margin: 0, lineHeight: 1.5 }}>{regionMsg}</p>
        </div>
      )}

      <div style={{ padding: "2rem" }}>
        <h1 style={{ color: "#d4af37", marginBottom: "0.5rem", fontFamily: "'Cinzel', serif", fontWeight: 400, letterSpacing: "0.1em" }}>
          {t("swap.title")}
        </h1>
        <p style={{ marginBottom: "2rem", color: "#9a9288", fontStyle: "italic", fontSize: "0.95rem" }}>
          {t("swap.subtitle")}
        </p>

        <WalletGate>
        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "flex-start" }}>

          {/* Vault context card */}
          {vault && (
            <div style={{ flex: "1 1 260px", maxWidth: 300, border: "1px solid rgba(212,175,55,0.2)", background: "#050505", padding: "1.25rem" }}>
              <p style={{ fontFamily: "'Cinzel', serif", fontSize: "0.55rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#4a4238", margin: "0 0 0.4rem" }}>
                {t("swap.vault_context")}
              </p>
              <p style={{ fontFamily: "'Cinzel', serif", fontSize: "0.95rem", color: "#d4af37", letterSpacing: "0.08em", margin: "0 0 0.5rem" }}>
                {vault.name}
              </p>
              {vault.description && (
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.85rem", color: "#6a6258", fontStyle: "italic", lineHeight: 1.6, margin: "0 0 1rem" }}>
                  {vault.description}
                </p>
              )}
              <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap" }}>
                {vault.apy !== null && (
                  <div>
                    <p style={{ fontFamily: "'Cinzel', serif", fontSize: "0.52rem", letterSpacing: "0.1em", color: "#333", textTransform: "uppercase", margin: "0 0 0.2rem" }}>APY</p>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", color: "#d4af37", margin: 0 }}>{vault.apy}%</p>
                  </div>
                )}
                {vault.tvlUsd !== null && vault.tvlUsd > 0 && (
                  <div>
                    <p style={{ fontFamily: "'Cinzel', serif", fontSize: "0.52rem", letterSpacing: "0.1em", color: "#333", textTransform: "uppercase", margin: "0 0 0.2rem" }}>TVL</p>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", color: "#ccc", margin: 0 }}>${vault.tvlUsd.toLocaleString()}</p>
                  </div>
                )}
                <div>
                  <p style={{ fontFamily: "'Cinzel', serif", fontSize: "0.52rem", letterSpacing: "0.1em", color: "#333", textTransform: "uppercase", margin: "0 0 0.2rem" }}>Risk</p>
                  <p style={{ fontFamily: "'Cinzel', serif", fontSize: "0.75rem", color: vault.riskScore === "Low" ? "#5cb85c" : vault.riskScore === "High" ? "#e05" : "#d4af37", margin: 0 }}>
                    {vault.riskScore}
                  </p>
                </div>
              </div>
              <Link to={`/vaults/${vault.vaultId}`} style={{ display: "inline-block", marginTop: "1rem", fontFamily: "'Cinzel', serif", fontSize: "0.55rem", letterSpacing: "0.12em", color: "rgba(212,175,55,0.5)", textDecoration: "none" }}>
                {t("vaults.btn_view")} →
              </Link>
            </div>
          )}

          {/* Swap form */}
          <section style={{ flex: "1 1 320px", maxWidth: 480, padding: "1.5rem", border: "1px solid rgba(212,175,55,0.2)", background: "#050505" }}>

            {/* Token In */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={labelStyle}>{t("swap.label_from")}</label>
              <select value={tokenIn} onChange={(e) => setTokenIn(e.target.value)} style={selectStyle}>
                {TOKENS.map((tk) => <option key={tk.id} value={tk.id}>{tk.label}</option>)}
              </select>
            </div>

            {/* Amount */}
            <div style={{ marginBottom: "0.5rem" }}>
              <label style={labelStyle}>{t("swap.label_amount")}</label>
              <input
                type="number"
                min="0"
                step="any"
                value={amountIn}
                onChange={(e) => setAmountIn(e.target.value)}
                placeholder={t("swap.placeholder_amount")}
                style={inputStyle}
              />
            </div>

            {/* Arrow */}
            <div style={{ textAlign: "center", padding: "0.5rem 0", color: "rgba(212,175,55,0.4)", fontSize: "1.2rem" }}>
              {t("swap.arrow")}
            </div>

            {/* Token Out */}
            <div style={{ marginBottom: "1rem" }}>
              <label style={labelStyle}>{t("swap.label_to")}</label>
              <select value={tokenOut} onChange={(e) => setTokenOut(e.target.value)} style={selectStyle}>
                {TOKENS.filter((tk) => tk.id !== tokenIn).map((tk) => <option key={tk.id} value={tk.id}>{tk.label}</option>)}
              </select>
            </div>

            {/* Estimated output */}
            <div style={{ marginBottom: quote ? "0.5rem" : "1rem" }}>
              <label style={labelStyle}>{t("swap.label_output")}</label>
              <input
                type="text"
                value={quote ?? ""}
                placeholder={loadingQuote ? t("swap.fetching_quote") : t("swap.placeholder_quote")}
                readOnly
                style={{ ...inputStyle, color: "#aaa" }}
              />
            </div>

            {/* Min received */}
            {quote && (
              <div style={{ marginBottom: "1rem" }}>
                <label style={labelStyle}>{t("swap.label_min_received")}</label>
                <input
                  type="text"
                  value={(parseFloat(quote) * (1 - SLIPPAGE)).toFixed(6)}
                  readOnly
                  style={{ ...inputStyle, color: "#555", fontSize: "0.82rem" }}
                />
              </div>
            )}

            {/* XER fee notice */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.6rem 0.75rem", border: "1px solid rgba(212,175,55,0.15)", background: "rgba(212,175,55,0.03)", marginBottom: "1rem" }}>
              <span style={{ color: "#d4af37", fontSize: "0.8rem" }}>⚡</span>
              <p style={{ margin: 0, fontSize: "0.75rem", color: "rgba(212,175,55,0.7)", fontFamily: "'Cinzel', serif", letterSpacing: "0.05em" }}>
                {t("swap.fee_notice")}
              </p>
            </div>

            {/* Connect wallet prompt */}
            {!account && (
              <button
                type="button"
                onClick={() => connect().catch(() => {})}
                style={{ width: "100%", padding: "0.65rem", border: "none", background: "#d4af37", color: "#050505", fontFamily: "'Cinzel', serif", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer", marginBottom: "0.75rem" }}
              >
                {t("swap.btn_connect_wallet")}
              </button>
            )}

            {/* Get Quote */}
            {account && (
              <button
                type="button"
                onClick={handleGetQuote}
                disabled={!canRequestQuote || loadingQuote}
                style={{ width: "100%", padding: "0.65rem", border: "none", background: canRequestQuote ? "#d4af37" : "#333", color: canRequestQuote ? "#050505" : "#666", fontFamily: "'Cinzel', serif", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", cursor: canRequestQuote ? "pointer" : "not-allowed", marginBottom: "0.75rem" }}
              >
                {loadingQuote ? t("swap.btn_quote_loading") : t("swap.btn_quote")}
              </button>
            )}

            {quoteError && (
              <p style={{ marginBottom: "0.75rem", fontSize: "0.82rem", color: "#f88" }}>{quoteError}</p>
            )}

            {/* Execute Swap */}
            {account && (
              <button
                type="button"
                onClick={handleExecuteSwap}
                disabled={!canExecute || txState === "loading"}
                style={{ width: "100%", padding: "0.65rem", border: "1px solid rgba(212,175,55,0.15)", background: canExecute ? "rgba(212,175,55,0.08)" : "transparent", color: canExecute ? "#d4af37" : "#555", fontFamily: "'Cinzel', serif", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", cursor: canExecute ? "pointer" : "not-allowed" }}
              >
                {txState === "loading" ? t("swap.btn_execute_loading") : t("swap.btn_execute")}
              </button>
            )}

            {/* Tx confirmation */}
            {txState === "confirmed" && (
              <div style={{ marginTop: "1rem", padding: "0.75rem", border: "1px solid rgba(92,184,92,0.25)", background: "rgba(92,184,92,0.04)" }}>
                <p style={{ margin: 0, fontFamily: "'Cinzel', serif", fontSize: "0.65rem", letterSpacing: "0.12em", color: "#5cb85c" }}>
                  {t("swap.tx_confirmed")}
                </p>
                {txHash && (
                  <p style={{ margin: "0.3rem 0 0", fontFamily: "monospace", fontSize: "0.7rem", color: "#4a4238", wordBreak: "break-all" }}>
                    {t("swap.label_tx")}: {txHash}
                  </p>
                )}
              </div>
            )}

            {/* Tx error */}
            {txState === "error" && txError && (
              <p style={{ marginTop: "0.75rem", fontSize: "0.82rem", color: "#f88" }}>{txError}</p>
            )}
          </section>
        </div>
        </WalletGate>
      </div>
    </main>
  );
};

export default Swap;
