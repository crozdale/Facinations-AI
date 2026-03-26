// src/pages/CryptoSuccess.tsx
// Landing page after Coinbase Commerce payment completes.
// Coinbase redirects here with ?tier= in the URL.
// We poll /api/coinbase/verify (with charge_id from localStorage) to confirm settlement.

import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSubscription } from "../context/SubscriptionContext";
import type { PlanTier } from "../context/SubscriptionContext";

type Status = "verifying" | "success" | "pending" | "error";

const VALID_TIERS = new Set<string>(["starter", "gallery"]);
const LS_KEY = "facinations_cb_charge";

export default function CryptoSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { subscribe } = useSubscription();

  const [status, setStatus]   = useState<Status>("verifying");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const tier     = searchParams.get("tier");
    const chargeId = localStorage.getItem(LS_KEY);

    if (!tier || !VALID_TIERS.has(tier)) {
      setErrorMsg("Invalid checkout link.");
      setStatus("error");
      return;
    }

    if (!chargeId) {
      // No charge ID stored — payment may still settle; show pending state
      setStatus("pending");
      return;
    }

    (async () => {
      try {
        const res  = await fetch(`/api/coinbase/verify?charge_id=${encodeURIComponent(chargeId)}&tier=${encodeURIComponent(tier)}`);
        const data = await res.json();

        if (!res.ok) {
          setErrorMsg(data.error ?? "Verification failed.");
          setStatus("error");
          return;
        }

        if (data.verified) {
          localStorage.removeItem(LS_KEY);
          subscribe(data.tier as PlanTier);
          setStatus("success");
          setTimeout(() => navigate("/studio"), 2500);
        } else {
          // Charge exists but not yet settled (crypto confirmations take time)
          setStatus("pending");
        }
      } catch {
        setErrorMsg("Could not reach the verification service. Please contact support.");
        setStatus("error");
      }
    })();
  }, []);

  return (
    <main style={{ background: "#080808", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Cormorant+Garamond:ital,wght@0,300;1,300&display=swap');
        @keyframes pulse { 0%,100%{opacity:0.3} 50%{opacity:1} }
      `}</style>

      <div style={{ textAlign: "center", maxWidth: 520, padding: "2rem" }}>

        {status === "verifying" && (
          <>
            <div style={{ fontSize: "2rem", color: "rgba(212,175,55,0.4)", marginBottom: "1.5rem", animation: "pulse 1.6s ease-in-out infinite" }}>◈</div>
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: "0.9rem", color: "#f0e8d0", letterSpacing: "0.1em", margin: "0 0 0.5rem" }}>
              Verifying your payment…
            </p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "#4a4238", fontSize: "0.85rem", margin: 0 }}>
              This takes just a moment.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div style={{ fontSize: "2.5rem", color: "#5cb85c", marginBottom: "1rem" }}>✓</div>
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: "1rem", color: "#f0e8d0", letterSpacing: "0.1em", margin: "0 0 0.5rem" }}>
              Payment Confirmed
            </p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "#6a6258", fontSize: "0.9rem", margin: 0 }}>
              Welcome to Facinations Studio. Returning you now…
            </p>
          </>
        )}

        {status === "pending" && (
          <>
            <div style={{ fontSize: "2rem", color: "#d4af37", marginBottom: "1.5rem", animation: "pulse 2s ease-in-out infinite" }}>⧗</div>
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: "0.9rem", color: "#f0e8d0", letterSpacing: "0.1em", margin: "0 0 0.75rem" }}>
              Awaiting Confirmation
            </p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "#6a6258", fontSize: "0.85rem", margin: "0 0 1.5rem" }}>
              Your crypto payment has been received and is awaiting blockchain confirmation.
              This can take a few minutes. You'll gain access as soon as it's confirmed.
            </p>
            <button
              onClick={() => navigate("/studio")}
              style={{
                padding: "0.6rem 1.75rem",
                background: "transparent",
                border: "1px solid rgba(212,175,55,0.3)",
                color: "#d4af37",
                fontFamily: "'Cinzel', serif",
                fontSize: "0.6rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              Return to Studio
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <div style={{ fontSize: "2rem", color: "#e05", marginBottom: "1rem" }}>✗</div>
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: "0.9rem", color: "#f0e8d0", letterSpacing: "0.1em", margin: "0 0 0.75rem" }}>
              Verification Failed
            </p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "#6a6258", fontSize: "0.85rem", margin: "0 0 1.5rem" }}>
              {errorMsg}
            </p>
            <button
              onClick={() => navigate("/studio")}
              style={{
                padding: "0.6rem 1.75rem",
                background: "transparent",
                border: "1px solid rgba(212,175,55,0.3)",
                color: "#d4af37",
                fontFamily: "'Cinzel', serif",
                fontSize: "0.6rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              Return to Studio
            </button>
          </>
        )}
      </div>
    </main>
  );
}
