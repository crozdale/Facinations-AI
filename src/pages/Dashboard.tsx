// src/pages/Dashboard.tsx
// Wallet-gated personal dashboard.
// Shows: XER balance, vault positions, trade history, fees generated, KYC + subscription status.

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ethers } from "ethers";
import { useQuery, gql } from "@apollo/client";
import { useKyc } from "../context/KycContext";
import { useSubscription } from "../context/SubscriptionContext";
import { useMeta } from "../hooks/useMeta";
import { VAULTS } from "../features/vaults/registry/vaultRegistry";

// ── Subgraph queries ──────────────────────────────────────────────────────────
const USER_POSITIONS_QUERY = gql`
  query UserPositions($address: String!) {
    userPositions(
      where: { user: $address }
      orderBy: updatedAt
      orderDirection: desc
    ) {
      id
      vaultId
      fractionBalance
      entryXerAmount
      updatedAt
    }
  }
`;

const USER_TRADES_QUERY = gql`
  query UserTrades($address: String!) {
    trades(
      where: { user: $address }
      first: 20
      orderBy: timestamp
      orderDirection: desc
    ) {
      id
      fractionId
      xerAmount
      fractionAmount
      timestamp
    }
  }
`;

// ── Types ─────────────────────────────────────────────────────────────────────
interface Position {
  id: string;
  vaultId: string;
  fractionBalance: string;
  entryXerAmount: string;
  updatedAt: string;
}

interface Trade {
  id: string;
  fractionId: string;
  xerAmount: string;
  fractionAmount: string;
  timestamp: string;
}

// ── Wallet hook ───────────────────────────────────────────────────────────────
function useEthAddress() {
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    if (!window.ethereum) return;
    const init = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum as any);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) setAddress(await accounts[0].getAddress());
      } catch {}
    };
    init();
    (window.ethereum as any).on("accountsChanged", (accounts: string[]) => {
      setAddress(accounts[0] ?? null);
    });
  }, []);

  async function connect() {
    if (!window.ethereum) { alert("No wallet detected. Install MetaMask."); return; }
    setConnecting(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum as any);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAddress(accounts[0] ?? null);
    } catch {}
    setConnecting(false);
  }

  function disconnect() { setAddress(null); }

  return { address, connect, disconnect, connecting };
}

// ── XER balance hook ──────────────────────────────────────────────────────────
function useXerBalance(address: string | null) {
  const [balance, setBalance] = useState<string | null>(null);

  useEffect(() => {
    if (!address || !window.ethereum) { setBalance(null); return; }
    let cancelled = false;
    (async () => {
      try {
        // Read XER address from env; fall back to zero address (returns 0 gracefully)
        const xerAddr = import.meta.env.VITE_XER_TOKEN_ADDRESS as string | undefined;
        if (!xerAddr || xerAddr === "0x0000000000000000000000000000000000000000") {
          setBalance("—");
          return;
        }
        const provider = new ethers.BrowserProvider(window.ethereum as any);
        const abi = ["function balanceOf(address) view returns (uint256)", "function decimals() view returns (uint8)"];
        const token = new ethers.Contract(xerAddr, abi, provider);
        const [raw, dec] = await Promise.all([token.balanceOf(address), token.decimals()]);
        if (!cancelled) setBalance(parseFloat(ethers.formatUnits(raw, dec)).toLocaleString(undefined, { maximumFractionDigits: 4 }));
      } catch {
        if (!cancelled) setBalance("—");
      }
    })();
    return () => { cancelled = true; };
  }, [address]);

  return balance;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function short(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function tsToDate(ts: string) {
  return new Date(parseInt(ts) * 1000).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function vaultName(vaultId: string) {
  return VAULTS.find((v) => v.vaultId === vaultId || v.contractAddress.toLowerCase() === vaultId.toLowerCase())?.name ?? vaultId;
}

// ── Styles ────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Cinzel:wght@400;600;700&display=swap');
  .dash-root { background:#080808; min-height:100vh; font-family:'Cormorant Garamond',serif; color:#e8e0d0; }
  .dash-inner { max-width:1040px; margin:0 auto; padding:2.5rem 1.5rem 6rem; }
  .dash-eyebrow { font-family:'Cinzel',serif; font-size:0.55rem; letter-spacing:0.4em; text-transform:uppercase; color:#d4af37; margin-bottom:0.4rem; }
  .dash-heading { font-family:'Cinzel',serif; font-size:1.6rem; font-weight:400; color:#f0e8d0; letter-spacing:0.08em; margin:0 0 0.25rem; }
  .dash-addr { font-family:monospace; font-size:0.8rem; color:#6a6258; }
  .dash-cards { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:1rem; margin:2rem 0; }
  .dash-card { border:1px solid rgba(212,175,55,0.15); background:#0a0a0a; padding:1.25rem 1.5rem; }
  .dash-card-label { font-family:'Cinzel',serif; font-size:0.52rem; letter-spacing:0.18em; text-transform:uppercase; color:#4a4238; margin:0 0 0.4rem; }
  .dash-card-value { font-family:'Cormorant Garamond',serif; font-size:1.6rem; color:#d4af37; margin:0; line-height:1.1; }
  .dash-card-sub { font-size:0.72rem; color:#4a4238; margin:0.2rem 0 0; font-style:italic; }
  .dash-section { margin-top:2.5rem; }
  .dash-section-title { font-family:'Cinzel',serif; font-size:0.6rem; letter-spacing:0.3em; text-transform:uppercase; color:#d4af37; margin:0 0 1rem; }
  .dash-table { width:100%; border-collapse:collapse; }
  .dash-th { font-family:'Cinzel',serif; font-size:0.55rem; letter-spacing:0.12em; text-transform:uppercase; color:#4a4238; padding:0.5rem 0.75rem; text-align:left; border-bottom:1px solid rgba(212,175,55,0.1); }
  .dash-td { font-family:'Cormorant Garamond',serif; font-size:0.88rem; color:#ccc; padding:0.55rem 0.75rem; border-bottom:1px solid rgba(255,255,255,0.03); }
  .dash-td-gold { color:#d4af37; }
  .dash-td-mono { font-family:monospace; font-size:0.75rem; color:#6a6258; }
  .dash-empty { font-family:'Cormorant Garamond',serif; font-size:0.88rem; color:#2a2a2a; font-style:italic; padding:1.5rem 0; text-align:center; border:1px solid rgba(212,175,55,0.06); }
  .dash-status-row { display:flex; gap:1rem; flex-wrap:wrap; margin-top:1rem; }
  .dash-status-card { flex:1; min-width:220px; border:1px solid rgba(212,175,55,0.12); background:#0a0a0a; padding:1.25rem; }
  .dash-badge { display:inline-block; font-family:'Cinzel',serif; font-size:0.52rem; letter-spacing:0.15em; text-transform:uppercase; padding:0.2rem 0.6rem; border:1px solid; }
  .dash-badge-green { color:#5cb85c; border-color:rgba(92,184,92,0.3); }
  .dash-badge-amber { color:#d4af37; border-color:rgba(212,175,55,0.3); }
  .dash-badge-red   { color:#e05; border-color:rgba(220,0,80,0.3); }
  .dash-badge-grey  { color:#4a4238; border-color:#222; }
  .dash-cta { display:inline-block; margin-top:0.75rem; padding:0.45rem 1.25rem; font-family:'Cinzel',serif; font-size:0.55rem; letter-spacing:0.15em; text-transform:uppercase; text-decoration:none; background:#d4af37; color:#050505; border:none; cursor:pointer; }
  .dash-cta-ghost { display:inline-block; margin-top:0.75rem; padding:0.45rem 1.25rem; font-family:'Cinzel',serif; font-size:0.55rem; letter-spacing:0.15em; text-transform:uppercase; text-decoration:none; background:transparent; color:#6a6258; border:1px solid rgba(212,175,55,0.2); cursor:pointer; }
  /* Gate */
  .dash-gate { display:flex; align-items:center; justify-content:center; min-height:60vh; }
  .dash-gate-inner { text-align:center; max-width:400px; }
  .dash-connect-btn { padding:0.75rem 2.5rem; background:#d4af37; border:none; color:#050505; font-family:'Cinzel',serif; font-size:0.65rem; letter-spacing:0.2em; text-transform:uppercase; cursor:pointer; margin-top:1.5rem; }
  .dash-connect-btn:disabled { background:#333; color:#555; cursor:not-allowed; }
`;

// ── Connect gate ──────────────────────────────────────────────────────────────
function ConnectGate({ onConnect, connecting }: { onConnect: () => void; connecting: boolean }) {
  const { t } = useTranslation();
  return (
    <div className="dash-gate">
      <div className="dash-gate-inner">
        <div style={{ fontSize: "2rem", marginBottom: "1rem", color: "rgba(212,175,55,0.3)" }}>◈</div>
        <h1 style={{ fontFamily: "'Cinzel',serif", fontSize: "1.1rem", fontWeight: 400, color: "#f0e8d0", letterSpacing: "0.08em", margin: "0 0 0.5rem" }}>
          {t("dashboard.connect_heading")}
        </h1>
        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "0.9rem", color: "#6a6258", lineHeight: 1.7, fontStyle: "italic", margin: 0 }}>
          {t("dashboard.connect_body")}
        </p>
        <button className="dash-connect-btn" onClick={onConnect} disabled={connecting}>
          {connecting ? t("wallet.connecting") : t("wallet.connect")}
        </button>
        {!window.ethereum && (
          <p style={{ marginTop: "1rem", fontFamily: "'Cinzel',serif", fontSize: "0.55rem", letterSpacing: "0.1em", color: "#2a2a2a" }}>
            {t("wallet.metamask_required")}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Main dashboard ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { t } = useTranslation();
  useMeta({ title: t("dashboard.title"), description: "Your Facinations account — vault positions, XER balance, trade history, KYC and subscription status.", noIndex: true });

  const { address, connect, disconnect, connecting } = useEthAddress();
  const xerBalance = useXerBalance(address);
  const { status: kycStatus } = useKyc();
  const { tier, activePlan } = useSubscription();

  const lowerAddr = address?.toLowerCase() ?? "";

  const { data: posData, loading: posLoading, error: posError } = useQuery<{ userPositions: Position[] }>(
    USER_POSITIONS_QUERY,
    { variables: { address: lowerAddr }, skip: !address, errorPolicy: "all" }
  );

  const { data: tradeData, loading: tradeLoading, error: tradeError } = useQuery<{ trades: Trade[] }>(
    USER_TRADES_QUERY,
    { variables: { address: lowerAddr }, skip: !address, errorPolicy: "all" }
  );

  const subgraphUnavailable = !!(posError || tradeError);

  const positions = posData?.userPositions ?? [];
  const trades    = tradeData?.trades ?? [];

  const totalEntryXer = positions.reduce((s, p) => s + parseFloat(p.entryXerAmount || "0"), 0);
  const totalFees     = trades.reduce((s, t) => s + parseFloat(t.xerAmount || "0") * 0.003, 0);

  // ── KYC badge ──
  const kycBadge = {
    idle:     { cls: "dash-badge-grey",  label: t("dashboard.kyc_not_started") },
    pending:  { cls: "dash-badge-amber", label: t("dashboard.kyc_pending") },
    approved: { cls: "dash-badge-green", label: t("dashboard.kyc_verified") },
    rejected: { cls: "dash-badge-red",   label: t("dashboard.kyc_failed") },
  }[kycStatus];

  return (
    <div className="dash-root">
      <style>{css}</style>

      {!address ? (
        <ConnectGate onConnect={connect} connecting={connecting} />
      ) : (
        <div className="dash-inner">
          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "0.5rem" }}>
            <div>
              <p className="dash-eyebrow">{t("dashboard.section_account")}</p>
              <h1 className="dash-heading">{t("dashboard.title")}</h1>
              <p className="dash-addr">{address}</p>
            </div>
            <button className="dash-cta-ghost" onClick={disconnect} style={{ marginTop: 0 }}>{t("dashboard.btn_disconnect")}</button>
          </div>

          {/* Overview cards */}
          <div className="dash-cards">
            <div className="dash-card">
              <p className="dash-card-label">{t("dashboard.card_xer_balance")}</p>
              <p className="dash-card-value">{xerBalance ?? "…"}</p>
              <p className="dash-card-sub">{t("dashboard.card_xer_unit")}</p>
            </div>
            <div className="dash-card">
              <p className="dash-card-label">{t("dashboard.card_positions")}</p>
              <p className="dash-card-value">{posLoading ? "…" : positions.filter((p) => parseFloat(p.fractionBalance) > 0).length}</p>
              <p className="dash-card-sub">{t("dashboard.card_positions_unit")}</p>
            </div>
            <div className="dash-card">
              <p className="dash-card-label">{t("dashboard.card_entry_value")}</p>
              <p className="dash-card-value">{totalEntryXer > 0 ? totalEntryXer.toFixed(2) : "—"}</p>
              <p className="dash-card-sub">{t("dashboard.card_entry_unit")}</p>
            </div>
            <div className="dash-card">
              <p className="dash-card-label">{t("dashboard.card_fees")}</p>
              <p className="dash-card-value">{totalFees > 0 ? totalFees.toFixed(4) : "—"}</p>
              <p className="dash-card-sub">{t("dashboard.card_fees_unit")}</p>
            </div>
          </div>

          {/* Subgraph unavailable notice */}
          {subgraphUnavailable && (
            <div style={{ marginBottom: "1.5rem", padding: "0.65rem 1rem", border: "1px solid rgba(212,175,55,0.12)", background: "rgba(212,175,55,0.03)", fontSize: "0.78rem", color: "#4a4238", fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic" }}>
              On-chain data is temporarily unavailable — the subgraph may be syncing. Wallet balances and status are unaffected.
            </div>
          )}

          {/* Vault Positions */}
          <div className="dash-section">
            <p className="dash-section-title">{t("dashboard.section_positions")}</p>
            {posLoading ? (
              <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "0.85rem", color: "#2a2a2a", fontStyle: "italic" }}>{t("dashboard.positions_loading")}</p>
            ) : positions.length === 0 ? (
              <div className="dash-empty">{t("dashboard.positions_empty")}</div>
            ) : (
              <table className="dash-table">
                <thead>
                  <tr>
                    <th className="dash-th">{t("nav.vaults")}</th>
                    <th className="dash-th" style={{ textAlign: "right" }}>{t("dashboard.col_fraction")}</th>
                    <th className="dash-th" style={{ textAlign: "right" }}>{t("dashboard.col_entry")}</th>
                    <th className="dash-th">{t("dashboard.col_updated")}</th>
                    <th className="dash-th"></th>
                  </tr>
                </thead>
                <tbody>
                  {positions.map((p) => (
                    <tr key={p.id}>
                      <td className="dash-td">{vaultName(p.vaultId)}</td>
                      <td className="dash-td" style={{ textAlign: "right" }}>{parseFloat(p.fractionBalance).toLocaleString(undefined, { maximumFractionDigits: 4 })}</td>
                      <td className="dash-td dash-td-gold" style={{ textAlign: "right" }}>{parseFloat(p.entryXerAmount).toFixed(4)}</td>
                      <td className="dash-td dash-td-mono">{tsToDate(p.updatedAt)}</td>
                      <td className="dash-td">
                        <Link to={`/vaults/${p.vaultId}`} style={{ fontFamily: "'Cinzel',serif", fontSize: "0.55rem", letterSpacing: "0.1em", color: "rgba(212,175,55,0.5)", textDecoration: "none" }}>
                          {t("dashboard.col_link")}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Trade History */}
          <div className="dash-section">
            <p className="dash-section-title">{t("dashboard.section_trades")}</p>
            {tradeLoading ? (
              <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "0.85rem", color: "#2a2a2a", fontStyle: "italic" }}>{t("dashboard.trades_loading")}</p>
            ) : trades.length === 0 ? (
              <div className="dash-empty">{t("dashboard.trades_empty")}</div>
            ) : (
              <table className="dash-table">
                <thead>
                  <tr>
                    <th className="dash-th">{t("dashboard.col_date")}</th>
                    <th className="dash-th">{t("dashboard.col_fraction_label")}</th>
                    <th className="dash-th" style={{ textAlign: "right" }}>{t("dashboard.col_xer_amount")}</th>
                    <th className="dash-th" style={{ textAlign: "right" }}>{t("dashboard.col_fraction_amount")}</th>
                    <th className="dash-th" style={{ textAlign: "right" }}>{t("dashboard.col_fee")}</th>
                  </tr>
                </thead>
                <tbody>
                  {trades.map((t) => (
                    <tr key={t.id}>
                      <td className="dash-td dash-td-mono">{tsToDate(t.timestamp)}</td>
                      <td className="dash-td">{vaultName(t.fractionId)}</td>
                      <td className="dash-td dash-td-gold" style={{ textAlign: "right" }}>{parseFloat(t.xerAmount).toFixed(4)}</td>
                      <td className="dash-td" style={{ textAlign: "right" }}>{parseFloat(t.fractionAmount).toFixed(4)}</td>
                      <td className="dash-td" style={{ textAlign: "right", color: "#5cb85c", fontFamily: "'Cormorant Garamond',serif", fontSize: "0.85rem" }}>
                        {(parseFloat(t.xerAmount) * 0.003).toFixed(5)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Account status: KYC + Subscription */}
          <div className="dash-section">
            <p className="dash-section-title">{t("dashboard.section_status")}</p>
            <div className="dash-status-row">

              {/* KYC */}
              <div className="dash-status-card">
                <p style={{ fontFamily: "'Cinzel',serif", fontSize: "0.55rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#4a4238", margin: "0 0 0.6rem" }}>
                  {t("dashboard.kyc_label")}
                </p>
                <span className={`dash-badge ${kycBadge.cls}`}>{kycBadge.label}</span>
                {kycStatus === "idle" && (
                  <>
                    <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "0.82rem", color: "#6a6258", fontStyle: "italic", margin: "0.6rem 0 0" }}>
                      {t("dashboard.kyc_required_note")}
                    </p>
                    <Link to="/kyc" className="dash-cta">{t("dashboard.kyc_start")}</Link>
                  </>
                )}
                {kycStatus === "pending" && (
                  <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "0.82rem", color: "#6a6258", fontStyle: "italic", margin: "0.6rem 0 0" }}>
                    {t("dashboard.kyc_review_note")}
                  </p>
                )}
                {kycStatus === "rejected" && (
                  <Link to="/kyc" className="dash-cta">{t("dashboard.kyc_retry")}</Link>
                )}
                {kycStatus === "approved" && (
                  <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "0.82rem", color: "#5cb85c", fontStyle: "italic", margin: "0.6rem 0 0" }}>
                    {t("dashboard.kyc_complete")}
                  </p>
                )}
              </div>

              {/* Subscription */}
              <div className="dash-status-card">
                <p style={{ fontFamily: "'Cinzel',serif", fontSize: "0.55rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#4a4238", margin: "0 0 0.6rem" }}>
                  {t("dashboard.subscription_label")}
                </p>
                <span className={`dash-badge ${tier !== "none" ? "dash-badge-green" : "dash-badge-grey"}`}>
                  {tier === "none" ? t("dashboard.subscription_none") : activePlan?.label ?? tier}
                </span>
                {tier === "none" ? (
                  <>
                    <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "0.82rem", color: "#6a6258", fontStyle: "italic", margin: "0.6rem 0 0" }}>
                      {t("dashboard.subscription_note")}
                    </p>
                    <Link to="/studio" className="dash-cta">{t("dashboard.subscription_plans")}</Link>
                  </>
                ) : (
                  <>
                    {activePlan?.priceMonthly && (
                      <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "0.82rem", color: "#6a6258", fontStyle: "italic", margin: "0.6rem 0 0" }}>
                        {t("dashboard.subscription_price", { price: activePlan.priceMonthly })}
                      </p>
                    )}
                    <Link to="/studio" className="dash-cta-ghost">{t("dashboard.subscription_manage")}</Link>
                  </>
                )}
              </div>

              {/* Wallet */}
              <div className="dash-status-card">
                <p style={{ fontFamily: "'Cinzel',serif", fontSize: "0.55rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#4a4238", margin: "0 0 0.6rem" }}>
                  {t("dashboard.wallet_label")}
                </p>
                <span className="dash-badge dash-badge-green">{t("dashboard.wallet_connected")}</span>
                <p style={{ fontFamily: "monospace", fontSize: "0.72rem", color: "#4a4238", margin: "0.6rem 0 0", wordBreak: "break-all" }}>
                  {short(address)}
                </p>
                <Link to="/swap" className="dash-cta-ghost">{t("dashboard.wallet_go_swap")}</Link>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
