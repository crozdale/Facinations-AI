// src/pages/CheckoutSuccess.tsx
// Landing page after Stripe Checkout completes.
// Reads ?session_id=&tier= from the URL, verifies with the server, then activates the plan.

import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSubscription } from "../context/SubscriptionContext";
import type { PlanTier } from "../context/SubscriptionContext";

type Status = "verifying" | "success" | "error";

const VALID_TIERS = new Set<string>(["starter", "gallery"]);

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { subscribe } = useSubscription();

  const [status, setStatus] = useState<Status>("verifying");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    const tier = searchParams.get("tier");

    if (!sessionId || !tier || !VALID_TIERS.has(tier)) {
      setErrorMsg("Invalid checkout link.");
      setStatus("error");
      return;
    }

    (async () => {
      try {
        const res = await fetch(`/api/checkout/verify?session_id=${encodeURIComponent(sessionId)}&tier=${encodeURIComponent(tier)}`);
        const data = await res.json();

        if (!res.ok || !data.verified) {
          setErrorMsg(data.error ?? "Payment could not be verified.");
          setStatus("error");
          return;
        }

        subscribe(data.tier as PlanTier);

        // Persist Stripe customer ID so SubscriptionContext can sync on future loads
        if (data.customerId) {
          try { localStorage.setItem("facinations_stripe_cid", data.customerId); } catch {}
        }

        // Subscribe to Mailchimp tagged by plan tier (best-effort)
        if (data.customerEmail) {
          fetch("/api/mailchimp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: data.customerEmail,
              tags: [`studio-${data.tier}`],
            }),
          }).catch(() => {});
        }

        setStatus("success");
        setTimeout(() => navigate("/studio"), 2500);
      } catch {
        setErrorMsg("Could not reach the verification service. Please contact support.");
        setStatus("error");
      }
    })();
  }, []); // run once on mount

  return (
    <main style={{ background: "#080808", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Cormorant+Garamond:ital,wght@0,300;1,300&display=swap');
      `}</style>

      <div style={{ textAlign: "center", maxWidth: 480, padding: "2rem" }}>

        {status === "verifying" && (
          <>
            <div style={{ fontSize: "2rem", color: "rgba(212,175,55,0.4)", marginBottom: "1.5rem", animation: "pulse 1.6s ease-in-out infinite" }}>◈</div>
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: "0.9rem", color: "#f0e8d0", letterSpacing: "0.1em", margin: "0 0 0.5rem" }}>
              Verifying your subscription…
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
              Subscription Activated
            </p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "#6a6258", fontSize: "0.9rem", margin: 0 }}>
              Welcome to Facinations Studio. Returning you now…
            </p>
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

        <style>{`@keyframes pulse { 0%,100%{opacity:0.3} 50%{opacity:1} }`}</style>
      </div>
    </main>
  );
}
