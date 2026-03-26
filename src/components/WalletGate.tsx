// src/components/WalletGate.tsx
// Renders children only when a wallet is connected.
// Shows a minimal connect prompt otherwise — no email, no subscription required.

import React from "react";
import { useWeb3 } from "../providers/Web3Provider";

interface Props {
  children: React.ReactNode;
}

const S: Record<string, React.CSSProperties> = {
  gate: {
    border: "1px solid rgba(212,175,55,0.12)",
    background: "#090909",
    padding: "3rem 2rem",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1.25rem",
    margin: "2rem 0",
  },
  icon: {
    width: 40,
    height: 40,
    border: "1px solid rgba(212,175,55,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1rem",
    color: "rgba(212,175,55,0.5)",
  },
  heading: {
    fontFamily: "'Cinzel', serif",
    fontSize: "0.85rem",
    fontWeight: 400,
    color: "#f0e8d0",
    letterSpacing: "0.1em",
    margin: 0,
  },
  body: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "0.9rem",
    color: "#6a6258",
    lineHeight: 1.75,
    fontStyle: "italic",
    maxWidth: 360,
    margin: 0,
  },
  btn: {
    padding: "0.65rem 2rem",
    background: "#d4af37",
    border: "none",
    color: "#050505",
    fontFamily: "'Cinzel', serif",
    fontSize: "0.58rem",
    letterSpacing: "0.22em",
    textTransform: "uppercase" as const,
    cursor: "pointer",
    transition: "background 0.2s",
  },
  note: {
    fontFamily: "'Cinzel', serif",
    fontSize: "0.48rem",
    letterSpacing: "0.2em",
    textTransform: "uppercase" as const,
    color: "rgba(212,175,55,0.25)",
    border: "1px solid rgba(212,175,55,0.08)",
    padding: "0.2rem 0.6rem",
  },
};

export default function WalletGate({ children }: Props) {
  const { account, connect } = useWeb3();

  if (account) return <>{children}</>;

  return (
    <div style={S.gate}>
      <div style={S.icon}>◈</div>
      <h3 style={S.heading}>Wallet Required</h3>
      <p style={S.body}>
        Connect your wallet to access this section. No account or email address is required.
      </p>
      <button style={S.btn} onClick={connect}>
        Connect Wallet
      </button>
      <span style={S.note}>Your wallet address is your identity — nothing else is stored</span>
    </div>
  );
}
