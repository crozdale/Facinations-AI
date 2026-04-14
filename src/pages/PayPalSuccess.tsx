// src/pages/PayPalSuccess.tsx
// Landing page after PayPal buyer approves a subscription.
// PayPal redirects here with ?subscription_id=I-xxx&ba_token=xxx&tier=starter|gallery
// We POST to /api/paypal/capture to verify the subscription is ACTIVE and activate the plan.

import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSubscription } from "../context/SubscriptionContext";
import type { PlanTier } from "../context/SubscriptionContext";

type Status = "verifying" | "success" | "error";

const VALID_TIERS = new Set<string>(["starter", "gallery"]);

export default function PayPalSuccess() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate       = useNavigate();
  const { subscribe }  = useSubscription();

  const [status,   setStatus]   = useState<Status>("verifying");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const subscriptionId = searchParams.get("subscription_id");
    const tier           = searchParams.get("tier");

    if (!subscriptionId || !tier || !VALID_TIERS.has(tier)) {
      setErrorMsg(t("common.invalid_link", "Invalid checkout link."));
      setStatus("error");
      return;
    }

    (async () => {
      try {
        const res  = await fetch("/api/paypal/capture", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ subscriptionId, tier }),
        });
        const data = await res.json();

        if (!res.ok || !data.verified) {
          setErrorMsg(data.error ?? t("checkout.payment_not_captured", "Payment could not be captured."));
          setStatus("error");
          return;
        }

        subscribe(data.tier as PlanTier);
        setStatus("success");
        setTimeout(() => navigate("/billing"), 2500);
      } catch {
        setErrorMsg(t("common.service_unreachable", "Could not reach the verification service. Please contact support."));
        setStatus("error");
      }
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <main style={{ background: "#1c1c1c", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Cormorant+Garamond:ital,wght@0,300;1,300&display=swap');
        @keyframes pulse { 0%,100%{opacity:0.3} 50%{opacity:1} }
      `}</style>

      <div style={{ textAlign: "center", maxWidth: 480, padding: "2rem" }}>

        {status === "verifying" && (
          <>
            <div style={{ fontSize: "2rem", color: "rgba(212,175,55,0.4)", marginBottom: "1.5rem", animation: "pulse 1.6s ease-in-out infinite" }}>◈</div>
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: "0.9rem", color: "#f8f2e4", letterSpacing: "0.1em", margin: "0 0 0.5rem" }}>
              {t("checkout.confirming_paypal", "Confirming your PayPal subscription…")}
            </p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "#6a6258", fontSize: "0.85rem", margin: 0 }}>
              {t("checkout.just_a_moment", "This takes just a moment.")}
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div style={{ fontSize: "2.5rem", color: "#5cb85c", marginBottom: "1rem" }}>✓</div>
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: "1rem", color: "#f8f2e4", letterSpacing: "0.1em", margin: "0 0 0.5rem" }}>
              {t("checkout.payment_confirmed", "Subscription Activated")}
            </p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "#8a8278", fontSize: "0.9rem", margin: 0 }}>
              {t("checkout.welcome_returning", "Welcome to Facinations Studio. Returning you now…")}
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div style={{ fontSize: "2rem", color: "#e05", marginBottom: "1rem" }}>✗</div>
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: "0.9rem", color: "#f8f2e4", letterSpacing: "0.1em", margin: "0 0 0.75rem" }}>
              {t("checkout.payment_failed", "Activation Failed")}
            </p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", color: "#8a8278", fontSize: "0.85rem", margin: "0 0 1.5rem" }}>
              {errorMsg}
            </p>
            <button
              onClick={() => navigate("/pricing")}
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
              {t("common.return_to_pricing", "Return to Pricing")}
            </button>
          </>
        )}
      </div>
    </main>
  );
}
