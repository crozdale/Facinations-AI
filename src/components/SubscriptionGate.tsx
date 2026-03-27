// src/components/SubscriptionGate.tsx
// Wraps features that require a minimum Studio subscription tier.
// Renders children when the user's plan meets the requirement;
// otherwise shows an upgrade prompt.

import React from "react";
import { useTranslation } from "react-i18next";
import { useSubscription, PLANS, PlanTier, tierMeets } from "../context/SubscriptionContext";

interface Props {
  required: PlanTier;
  featureName?: string;
  children: React.ReactNode;
}

const S: Record<string, React.CSSProperties> = {
  gate: {
    border: "1px solid rgba(212,175,55,0.12)",
    background: "#090909",
    padding: "2.5rem 2rem",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
    margin: "1rem 0",
  },
  icon: { fontSize: "1.6rem" },
  heading: {
    fontFamily: "'Cinzel', serif",
    fontSize: "0.9rem",
    fontWeight: 400,
    color: "#f8f2e4",
    letterSpacing: "0.1em",
    margin: 0,
  },
  body: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "0.9rem",
    color: "#8a8278",
    lineHeight: 1.7,
    fontStyle: "italic",
    maxWidth: 400,
    margin: 0,
  },
  plansRow: {
    display: "flex",
    gap: "0.75rem",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: "0.5rem",
  },
  planCard: {
    border: "1px solid rgba(212,175,55,0.2)",
    padding: "1rem 1.25rem",
    background: "#242424",
    minWidth: 140,
    textAlign: "center",
    cursor: "pointer",
    transition: "border-color 0.2s, background 0.2s",
  },
  planCardFeatured: {
    border: "1px solid #d4af37",
    background: "rgba(212,175,55,0.04)",
  },
  planName: {
    fontFamily: "'Cinzel', serif",
    fontSize: "0.75rem",
    letterSpacing: "0.1em",
    color: "#d4af37",
    marginBottom: "0.3rem",
  },
  planPrice: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "1.1rem",
    color: "#ccc",
    marginBottom: "0.5rem",
  },
  planBtn: {
    padding: "0.4rem 1rem",
    background: "#d4af37",
    border: "none",
    color: "#141414",
    fontFamily: "'Cinzel', serif",
    fontSize: "0.55rem",
    letterSpacing: "0.15em",
    textTransform: "uppercase" as const,
    cursor: "pointer",
    width: "100%",
  },
};

export default function SubscriptionGate({ required, featureName = "this feature", children }: Props) {
  const { t } = useTranslation();
  const { tier, startCheckout } = useSubscription();

  if (tierMeets(tier, required)) return <>{children}</>;

  // Show plans that meet the requirement
  const eligiblePlans = PLANS.filter((p) => tierMeets(p.tier, required));
  const requiredPlan = PLANS.find((p) => p.tier === required);

  return (
    <div style={S.gate}>
      <span style={S.icon}>✦</span>
      <h3 style={S.heading}>
        {t("subscriptionGate.heading", { plan: requiredPlan?.label ?? "Studio" })}
      </h3>
      <p style={S.body}>
        {tier !== "none"
          ? t("subscriptionGate.body_upgrade", { feature: featureName, plan: requiredPlan?.label })
          : t("subscriptionGate.body_subscribe", { feature: featureName, plan: requiredPlan?.label })}
      </p>

      <div style={S.plansRow}>
        {eligiblePlans.map((plan) => (
          <div
            key={plan.tier}
            style={{
              ...S.planCard,
              ...(plan.tier === required ? S.planCardFeatured : {}),
            }}
          >
            <p style={S.planName}>{plan.label}</p>
            <p style={S.planPrice}>
              {plan.priceMonthly !== null ? `$${plan.priceMonthly}/mo` : t("subscriptionGate.price_contact")}
            </p>
            <button
              style={S.planBtn}
              onClick={() => startCheckout(plan.tier)}
            >
              {tier === "none" ? t("subscriptionGate.btn_subscribe") : t("subscriptionGate.btn_upgrade")}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
