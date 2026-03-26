// src/context/SubscriptionContext.tsx
// Holds the user's active Studio subscription tier.
// Persists to localStorage. In production, replace stub actions with Stripe Checkout calls.

import React, { createContext, useContext, useState, useCallback } from "react";

export type PlanTier = "none" | "starter" | "gallery" | "institutional";

export interface Plan {
  tier: PlanTier;
  label: string;
  priceMonthly: number | null; // null = contact sales
  description: string;
  features: string[];
  minLessonAccess: boolean;
  mintAccess: boolean;
  analyticsAccess: boolean;
}

export const PLANS: Plan[] = [
  {
    tier: "starter",
    label: "Starter",
    priceMonthly: 29,
    description: "For emerging artists exploring on-chain provenance.",
    features: [
      "AI-guided lesson library",
      "Gallery-quality artwork display",
      "Basic provenance certificate",
      "Community access",
    ],
    minLessonAccess: true,
    mintAccess: false,
    analyticsAccess: false,
  },
  {
    tier: "gallery",
    label: "Gallery",
    priceMonthly: 99,
    description: "For practising artists ready to tokenise their work.",
    features: [
      "Everything in Starter",
      "Mint artworks to chain (ERC721)",
      "Vault fractionalization eligibility",
      "Priority curator support",
    ],
    minLessonAccess: true,
    mintAccess: true,
    analyticsAccess: false,
  },
  {
    tier: "institutional",
    label: "Institutional",
    priceMonthly: null,
    description: "For galleries, estates, and institutional collections.",
    features: [
      "Everything in Gallery",
      "Multi-user team access",
      "Analytics dashboard",
      "Dedicated account manager",
    ],
    minLessonAccess: true,
    mintAccess: true,
    analyticsAccess: true,
  },
];

const TIER_RANK: Record<PlanTier, number> = {
  none: 0, starter: 1, gallery: 2, institutional: 3,
};

export function tierMeets(current: PlanTier, required: PlanTier): boolean {
  return TIER_RANK[current] >= TIER_RANK[required];
}

interface SubscriptionCtx {
  tier: PlanTier;
  activePlan: Plan | null;
  subscribe: (tier: PlanTier) => void;
  cancel: () => void;
  /** Redirects to Stripe Checkout for the given tier. Resolves before redirect. */
  startCheckout: (tier: PlanTier, email?: string) => Promise<void>;
  /** Billing details for display — stub values until Stripe is wired */
  nextBillingDate: string | null;
}

const LS_KEY = "facinations_sub_tier";

function loadTier(): PlanTier {
  try {
    const v = localStorage.getItem(LS_KEY);
    if (v === "starter" || v === "gallery" || v === "institutional") return v;
  } catch {}
  return "none";
}

function saveTier(t: PlanTier) {
  try { localStorage.setItem(LS_KEY, t); } catch {}
}

/** Stub next billing date: first of next month */
function nextMonthFirst(): string {
  const d = new Date();
  d.setMonth(d.getMonth() + 1, 1);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

const SubscriptionContext = createContext<SubscriptionCtx | null>(null);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [tier, setTier] = useState<PlanTier>(loadTier);

  const subscribe = useCallback((t: PlanTier) => {
    setTier(t);
    saveTier(t);
  }, []);

  const cancel = useCallback(() => {
    setTier("none");
    saveTier("none");
  }, []);

  const startCheckout = useCallback(async (t: PlanTier, email?: string) => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tier: t, ...(email ? { email } : {}) }),
    });
    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: "Unknown error" }));
      throw new Error(error ?? "Failed to start checkout");
    }
    const { url } = await res.json();
    window.location.href = url;
  }, []);

  const activePlan = PLANS.find((p) => p.tier === tier) ?? null;

  return (
    <SubscriptionContext.Provider value={{
      tier,
      activePlan,
      subscribe,
      cancel,
      startCheckout,
      nextBillingDate: tier !== "none" ? nextMonthFirst() : null,
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription(): SubscriptionCtx {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error("useSubscription must be used inside <SubscriptionProvider>");
  return ctx;
}
