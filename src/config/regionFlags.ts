// src/config/regionFlags.ts
// Region-based feature gating. Set VITE_REGION in .env to override detection.
// Valid values: US | EU | UK | CA | ROW (rest of world)

export type Region = "US" | "EU" | "UK" | "CA" | "ROW";

interface RegionPolicy {
  swapsEnabled: boolean;
  leverageEnabled: boolean;
  studioSubscriptionEnabled: boolean;
  kycRequired: boolean;
  restrictionMessage: string | null;
}

const POLICIES: Record<Region, RegionPolicy> = {
  US: {
    swapsEnabled: true,
    leverageEnabled: false,
    studioSubscriptionEnabled: true,
    kycRequired: true,
    restrictionMessage:
      "Leveraged positions are not available to US users. KYC required for swap and subscription features.",
  },
  EU: {
    swapsEnabled: true,
    leverageEnabled: true,
    studioSubscriptionEnabled: true,
    kycRequired: true,
    restrictionMessage: "KYC required under EU MiCA regulations before accessing swap features.",
  },
  UK: {
    swapsEnabled: true,
    leverageEnabled: false,
    studioSubscriptionEnabled: true,
    kycRequired: true,
    restrictionMessage:
      "Leveraged positions are not available to UK users under FCA guidelines. KYC required.",
  },
  CA: {
    swapsEnabled: true,
    leverageEnabled: false,
    studioSubscriptionEnabled: true,
    kycRequired: true,
    restrictionMessage:
      "Leveraged positions are restricted for Canadian users. KYC required.",
  },
  ROW: {
    swapsEnabled: true,
    leverageEnabled: true,
    studioSubscriptionEnabled: true,
    kycRequired: false,
    restrictionMessage: null,
  },
};

/** Returns the active region. Reads VITE_REGION env var; falls back to ROW. */
export function getRegion(): Region {
  const env = (import.meta.env?.VITE_REGION as string | undefined)?.toUpperCase();
  if (env && env in POLICIES) return env as Region;
  return "ROW";
}

/** Returns the full policy for the current region. */
export function getRegionPolicy(): RegionPolicy {
  return POLICIES[getRegion()];
}

/** True when swaps are available in this region. */
export function swapsAllowed(): boolean {
  return POLICIES[getRegion()].swapsEnabled;
}

/** True when KYC must be completed before a feature is unlocked. */
export function kycRequired(): boolean {
  return POLICIES[getRegion()].kycRequired;
}

/** Human-readable restriction notice, or null if no restrictions. */
export function regionRestrictionMessage(): string | null {
  return POLICIES[getRegion()].restrictionMessage;
}
