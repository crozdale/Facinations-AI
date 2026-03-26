// src/components/FractionPanel.tsx
// Displayed on VaultDetail for fractionalised vaults.
// Shows the user's on-chain ERC1155 fraction balance, an acquire enquiry form,
// and a peer-to-peer transfer form (if the user holds fractions).

import React, { useState, useEffect, useCallback } from "react";
import { BrowserProvider, Contract, toUtf8Bytes } from "ethers";
import { useWeb3 } from "../providers/Web3Provider";
import type { RegistryVault } from "../features/vaults/registry/vaultRegistry";

// Minimal ERC1155 ABI — only what we need
const ERC1155_ABI = [
  "function balanceOf(address account, uint256 id) view returns (uint256)",
  "function safeTransferFrom(address from, address to, uint256 id, uint256 value, bytes data)",
];

// ── CSS ────────────────────────────────────────────────────────────────────────
const css = `
  .fp-root { border: 1px solid rgba(212,175,55,0.2); background: #050505; margin-top: 2rem; }
  .fp-header { padding: 1.5rem 1.75rem 1rem; border-bottom: 1px solid rgba(212,175,55,0.08); }
  .fp-eyebrow { font-family:'Cinzel',serif; font-size:0.52rem; letter-spacing:0.4em; text-transform:uppercase; color:#d4af37; margin:0 0 0.4rem; }
  .fp-title { font-family:'Cinzel',serif; font-size:1rem; font-weight:400; color:#f0e8d0; letter-spacing:0.06em; margin:0; }
  .fp-body { padding:1.5rem 1.75rem; display:flex; flex-direction:column; gap:1.5rem; }
  .fp-stats { display:grid; grid-template-columns:repeat(auto-fit,minmax(120px,1fr)); gap:1rem; }
  .fp-stat-label { font-family:'Cinzel',serif; font-size:0.5rem; letter-spacing:0.18em; text-transform:uppercase; color:#4a4238; margin:0 0 0.25rem; }
  .fp-stat-value { font-family:'Cormorant Garamond',serif; font-size:1.1rem; color:#e8e0d0; margin:0; }
  .fp-stat-value.gold { color:#d4af37; }
  .fp-tabs { display:flex; gap:0; border-bottom:1px solid rgba(212,175,55,0.08); }
  .fp-tab { padding:0.6rem 1.2rem; font-family:'Cinzel',serif; font-size:0.55rem; letter-spacing:0.15em; text-transform:uppercase; background:none; border:none; border-bottom:2px solid transparent; color:#3a3228; cursor:pointer; transition:color .2s; }
  .fp-tab:hover { color:#9a9288; }
  .fp-tab.active { color:#d4af37; border-bottom-color:#d4af37; }
  .fp-form { display:flex; flex-direction:column; gap:0.75rem; }
  .fp-row { display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; }
  @media(max-width:540px) { .fp-row { grid-template-columns:1fr; } }
  .fp-label { font-family:'Cinzel',serif; font-size:0.5rem; letter-spacing:0.15em; text-transform:uppercase; color:rgba(212,175,55,0.4); display:block; margin-bottom:0.25rem; }
  .fp-input { width:100%; box-sizing:border-box; padding:0.5rem 0.7rem; background:#060606; border:1px solid rgba(212,175,55,0.12); color:#e8e0d0; font-family:'Cormorant Garamond',serif; font-size:0.9rem; }
  .fp-input:focus { outline:none; border-color:rgba(212,175,55,0.35); }
  .fp-input::placeholder { color:#222; }
  .fp-textarea { width:100%; box-sizing:border-box; padding:0.5rem 0.7rem; background:#060606; border:1px solid rgba(212,175,55,0.12); color:#e8e0d0; font-family:'Cormorant Garamond',serif; font-size:0.9rem; resize:vertical; }
  .fp-textarea:focus { outline:none; border-color:rgba(212,175,55,0.35); }
  .fp-textarea::placeholder { color:#222; }
  .fp-btn { padding:0.6rem 1.75rem; background:#d4af37; border:none; color:#050505; font-family:'Cinzel',serif; font-size:0.55rem; letter-spacing:0.2em; text-transform:uppercase; cursor:pointer; transition:background .2s; align-self:flex-start; }
  .fp-btn:hover { background:#c09f27; }
  .fp-btn:disabled { background:#222; color:#444; cursor:not-allowed; }
  .fp-btn-ghost { padding:0.6rem 1.5rem; background:transparent; border:1px solid rgba(212,175,55,0.2); color:#6a6258; font-family:'Cinzel',serif; font-size:0.55rem; letter-spacing:0.2em; text-transform:uppercase; cursor:pointer; }
  .fp-notice { padding:0.75rem 1rem; font-family:'Cormorant Garamond',serif; font-size:0.85rem; line-height:1.7; font-style:italic; }
  .fp-notice.amber { border-left:2px solid rgba(212,175,55,0.4); color:#9a9288; background:rgba(212,175,55,0.03); }
  .fp-notice.green { border-left:2px solid rgba(92,184,92,0.4); color:#5cb85c; background:rgba(92,184,92,0.03); }
  .fp-notice.red { border-left:2px solid rgba(220,80,80,0.4); color:#e07070; background:rgba(220,80,80,0.03); }
  .fp-connect-prompt { text-align:center; padding:2rem 1rem; }
  .fp-balance-badge { display:inline-flex; align-items:center; gap:0.5rem; padding:0.35rem 0.85rem; border:1px solid rgba(212,175,55,0.2); background:rgba(212,175,55,0.04); }
  .fp-balance-label { font-family:'Cinzel',serif; font-size:0.5rem; letter-spacing:0.2em; text-transform:uppercase; color:#4a4238; }
  .fp-balance-value { font-family:'Cormorant Garamond',serif; font-size:1rem; color:#d4af37; }
`;

type PanelTab = "acquire" | "transfer";

interface Props {
  vault: RegistryVault;
}

export default function FractionPanel({ vault }: Props) {
  const { provider, account, connect } = useWeb3();
  const [tab, setTab] = useState<PanelTab>("acquire");

  // On-chain balance
  const [balance, setBalance] = useState<bigint | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);

  // Acquire form
  const [acqForm, setAcqForm] = useState({ name: "", email: "", quantity: "1", message: "" });
  const [acqState, setAcqState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [acqError, setAcqError] = useState("");

  // Transfer form
  const [xfrForm, setXfrForm] = useState({ to: "", quantity: "1" });
  const [xfrState, setXfrState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [xfrError, setXfrError] = useState("");
  const [xfrTx, setXfrTx] = useState("");

  // ── Load on-chain balance ────────────────────────────────────────────────────
  const loadBalance = useCallback(async () => {
    if (!account || !provider || !vault.fractionTokenId) return;
    setBalanceLoading(true);
    try {
      const contract = new Contract(vault.contractAddress, ERC1155_ABI, provider);
      const raw: bigint = await contract.balanceOf(account, BigInt(vault.fractionTokenId));
      setBalance(raw);
    } catch {
      setBalance(null);
    } finally {
      setBalanceLoading(false);
    }
  }, [account, provider, vault.contractAddress, vault.fractionTokenId]);

  useEffect(() => { loadBalance(); }, [loadBalance]);

  // ── Acquire enquiry ──────────────────────────────────────────────────────────
  async function handleAcquire() {
    if (!acqForm.email || !acqForm.quantity) return;
    setAcqState("sending");
    setAcqError("");
    try {
      const res = await fetch("/api/vault/enquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vaultId:       vault.vaultId,
          vaultName:     vault.name,
          tokenId:       vault.fractionTokenId,
          quantity:      Number(acqForm.quantity),
          walletAddress: account ?? undefined,
          name:          acqForm.name || undefined,
          email:         acqForm.email,
          message:       acqForm.message || undefined,
        }),
      });
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(error);
      }
      setAcqState("done");
    } catch (e: unknown) {
      setAcqError(e instanceof Error ? e.message : "Something went wrong");
      setAcqState("error");
    }
  }

  // ── Peer transfer ────────────────────────────────────────────────────────────
  async function handleTransfer() {
    if (!account || !provider || !xfrForm.to || !xfrForm.quantity) return;
    if (!xfrForm.to.match(/^0x[0-9a-fA-F]{40}$/)) {
      setXfrError("Invalid Ethereum address");
      return;
    }
    const qty = Number(xfrForm.quantity);
    if (!qty || qty < 1) { setXfrError("Invalid quantity"); return; }
    if (balance !== null && BigInt(qty) > balance) {
      setXfrError(`Insufficient balance (you hold ${balance.toString()})`);
      return;
    }
    setXfrState("sending");
    setXfrError("");
    try {
      const signer = await (provider as BrowserProvider).getSigner();
      const contract = new Contract(vault.contractAddress, ERC1155_ABI, signer);
      const tx = await contract.safeTransferFrom(
        account,
        xfrForm.to,
        BigInt(vault.fractionTokenId),
        BigInt(qty),
        toUtf8Bytes("")
      );
      await tx.wait();
      setXfrTx(tx.hash as string);
      setXfrState("done");
      await loadBalance();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Transaction failed";
      setXfrError(msg.length > 120 ? msg.slice(0, 120) + "…" : msg);
      setXfrState("error");
    }
  }

  if (!vault.fractionTokenId) return null;

  const balanceDisplay = balanceLoading ? "…" : balance !== null ? balance.toString() : "—";
  const hasBalance = balance !== null && balance > 0n;
  const priceDisplay = vault.fractionPriceXer != null
    ? `${vault.fractionPriceXer.toLocaleString()} XER`
    : "POA";

  return (
    <div className="fp-root">
      <style>{css}</style>

      <div className="fp-header">
        <p className="fp-eyebrow">Fractional Ownership</p>
        <h3 className="fp-title">{vault.name} — Fractions</h3>
      </div>

      <div className="fp-body">

        {/* Stats */}
        <div className="fp-stats">
          <div>
            <p className="fp-stat-label">Total Fractions</p>
            <p className="fp-stat-value">{vault.totalFractions.toLocaleString()}</p>
          </div>
          <div>
            <p className="fp-stat-label">Available</p>
            <p className="fp-stat-value gold">{vault.availableFractions.toLocaleString()}</p>
          </div>
          <div>
            <p className="fp-stat-label">Price / Fraction</p>
            <p className="fp-stat-value">{priceDisplay}</p>
          </div>
          <div>
            <p className="fp-stat-label">Token ID</p>
            <p className="fp-stat-value" style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>
              ERC1155 #{vault.fractionTokenId}
            </p>
          </div>
        </div>

        {/* Wallet balance or connect prompt */}
        {!account ? (
          <div className="fp-connect-prompt">
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "0.9rem", color: "#6a6258", fontStyle: "italic", margin: "0 0 1rem" }}>
              Connect your wallet to view your fraction balance.
            </p>
            <button className="fp-btn" onClick={connect}>Connect Wallet</button>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div className="fp-balance-badge">
              <span className="fp-balance-label">Your Balance</span>
              <span className="fp-balance-value">{balanceDisplay} fractions</span>
            </div>
            <span style={{ fontFamily: "monospace", fontSize: "0.7rem", color: "#3a3228" }}>
              {account.slice(0, 6)}…{account.slice(-4)}
            </span>
          </div>
        )}

        {/* Tabs */}
        <div>
          <div className="fp-tabs">
            <button
              className={`fp-tab${tab === "acquire" ? " active" : ""}`}
              onClick={() => setTab("acquire")}
            >
              Acquire Fractions
            </button>
            {hasBalance && (
              <button
                className={`fp-tab${tab === "transfer" ? " active" : ""}`}
                onClick={() => setTab("transfer")}
              >
                Transfer
              </button>
            )}
          </div>

          {/* ── Acquire tab ── */}
          {tab === "acquire" && (
            <div style={{ paddingTop: "1.25rem" }}>
              {acqState === "done" ? (
                <div className="fp-notice green">
                  Enquiry submitted. A curator will be in touch within two business days to discuss provenance documentation and on-chain settlement.
                </div>
              ) : (
                <div className="fp-form">
                  <div className="fp-notice amber">
                    Fraction acquisition is a curated process. Submit your expression of interest and our team will complete the on-chain transfer after verification.
                  </div>

                  <div className="fp-row">
                    <div>
                      <label className="fp-label">Full Name</label>
                      <input
                        className="fp-input"
                        value={acqForm.name}
                        onChange={(e) => setAcqForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="fp-label">Email *</label>
                      <input
                        className="fp-input"
                        type="email"
                        value={acqForm.email}
                        onChange={(e) => setAcqForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="fp-label">Fractions Requested *</label>
                    <input
                      className="fp-input"
                      type="number"
                      min={1}
                      max={vault.availableFractions}
                      value={acqForm.quantity}
                      onChange={(e) => setAcqForm(f => ({ ...f, quantity: e.target.value }))}
                      style={{ maxWidth: 160 }}
                    />
                    {vault.fractionPriceXer != null && Number(acqForm.quantity) > 0 && (
                      <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "0.78rem", color: "#6a6258", margin: "0.35rem 0 0", fontStyle: "italic" }}>
                        Indicative total: {(Number(acqForm.quantity) * vault.fractionPriceXer).toLocaleString()} XER
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="fp-label">Message (optional)</label>
                    <textarea
                      className="fp-textarea"
                      rows={3}
                      value={acqForm.message}
                      onChange={(e) => setAcqForm(f => ({ ...f, message: e.target.value }))}
                      placeholder="Any additional context…"
                    />
                  </div>

                  {acqState === "error" && (
                    <div className="fp-notice red">{acqError}</div>
                  )}

                  <button
                    className="fp-btn"
                    onClick={handleAcquire}
                    disabled={!acqForm.email || !acqForm.quantity || acqState === "sending"}
                  >
                    {acqState === "sending" ? "Submitting…" : "Submit Enquiry"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── Transfer tab ── */}
          {tab === "transfer" && hasBalance && (
            <div style={{ paddingTop: "1.25rem" }}>
              {xfrState === "done" ? (
                <div className="fp-notice green">
                  Transfer confirmed.{" "}
                  <a
                    href={`https://sepolia.etherscan.io/tx/${xfrTx}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#d4af37", textDecoration: "none" }}
                  >
                    View on Etherscan ↗
                  </a>
                </div>
              ) : (
                <div className="fp-form">
                  <div className="fp-notice amber">
                    Transfer fractions to another wallet via ERC1155 safeTransferFrom. Ensure your wallet is connected to Sepolia.
                  </div>

                  <div>
                    <label className="fp-label">Recipient Address *</label>
                    <input
                      className="fp-input"
                      value={xfrForm.to}
                      onChange={(e) => setXfrForm(f => ({ ...f, to: e.target.value }))}
                      placeholder="0x…"
                      style={{ fontFamily: "monospace", fontSize: "0.82rem" }}
                    />
                  </div>

                  <div>
                    <label className="fp-label">Quantity *</label>
                    <input
                      className="fp-input"
                      type="number"
                      min={1}
                      max={Number(balance)}
                      value={xfrForm.quantity}
                      onChange={(e) => setXfrForm(f => ({ ...f, quantity: e.target.value }))}
                      style={{ maxWidth: 160 }}
                    />
                    <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "0.78rem", color: "#6a6258", margin: "0.35rem 0 0", fontStyle: "italic" }}>
                      Max: {balance?.toString()} fractions
                    </p>
                  </div>

                  {xfrState === "error" && (
                    <div className="fp-notice red">{xfrError}</div>
                  )}

                  <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                    <button
                      className="fp-btn"
                      onClick={handleTransfer}
                      disabled={!xfrForm.to || !xfrForm.quantity || xfrState === "sending"}
                    >
                      {xfrState === "sending" ? "Awaiting confirmation…" : "Transfer On-Chain"}
                    </button>
                    <button
                      className="fp-btn-ghost"
                      onClick={() => { setXfrState("idle"); setXfrError(""); }}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
