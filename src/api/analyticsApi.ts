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

export interface AnalyticsResponse {
  configured: boolean;
  daily: DailyRow[];
  vaultTvl: VaultRow[];
}

export async function fetchAnalytics(): Promise<AnalyticsResponse> {
  const res = await fetch("/api/analytics");
  if (!res.ok) {
    throw new Error(`Analytics API error: ${res.status}`);
  }
  return res.json();
}
