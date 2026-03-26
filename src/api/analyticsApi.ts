// src/api/analyticsApi.ts
// Client-side fetch wrapper for /api/analytics.

export interface DailyRow {
  date: string;
  swapCount: number;
  swapVolumeXer: number;
  xerFeesCollected: number;
  activeVaultCount: number;
}

export interface VaultRow {
  vaultId: string;
  tradeCount: number;
  xerInflow: number;
}

export interface BusinessMetrics {
  activeSubs:    number;
  pastDue:       number;
  churned:       number;
  newThisWeek:   number;
  waitlistCount: number;
  mrr:           number;
  tierBreakdown: { tier: string; count: number }[];
}

export interface AnalyticsResponse {
  configured: boolean;
  daily:    DailyRow[];
  vaultTvl: VaultRow[];
  business?: BusinessMetrics;
}

export async function fetchAnalytics(): Promise<AnalyticsResponse> {
  const res = await fetch("/api/analytics");
  if (!res.ok) {
    throw new Error(`Analytics API error: ${res.status}`);
  }
  return res.json();
}
