// src/features/vaults/hooks/useVaults.ts
// Returns vaults as RegistryVault[] — the shape Vaults.tsx and VaultDetail expect.
//
// Data strategy:
//   1. Query the live subgraph for on-chain vault data (id, name, tvlUsd, status).
//   2. Merge each subgraph vault with its matching registry entry (by name) to
//      supply fields not stored on-chain: apy, riskScore, volatility, description,
//      premiumRequired, chainId.
//   3. If the subgraph is unreachable or returns nothing, fall back to the static
//      registry so the page always renders.

import { useQuery } from "@apollo/client";
import { VAULTS_QUERY } from "../api/vaultsQuery";
import type { VaultsQueryData, VaultsQueryVars } from "../types/vaults";
import { VAULTS as REGISTRY, type RegistryVault } from "../registry/vaultRegistry";

// Build a registry lookup keyed by lowercase name for O(1) merge.
const REGISTRY_BY_NAME = new Map(
  REGISTRY.map((r) => [r.name.toLowerCase(), r])
);

// Merge a subgraph vault with its registry counterpart.
// Subgraph wins for: contractAddress (= id), tvlUsd when present.
// Registry wins for: everything else (apy, riskScore, volatility, description, etc.).
function mergeVault(sv: VaultsQueryData["vaults"][number]): RegistryVault {
  const reg = REGISTRY_BY_NAME.get((sv.name ?? "").toLowerCase());

  const tvlFromChain =
    sv.tvlUsd != null && sv.tvlUsd !== ""
      ? parseFloat(sv.tvlUsd)
      : null;

  return {
    vaultId:         reg?.vaultId         ?? sv.id,
    name:            sv.name              ?? reg?.name ?? "Unknown Vault",
    description:     reg?.description     ?? "",
    contractAddress: sv.id,
    chainId:         reg?.chainId         ?? 1,
    premiumRequired: reg?.premiumRequired ?? false,
    apy:             reg?.apy             ?? null,
    riskScore:       reg?.riskScore       ?? "Medium",
    volatility:      reg?.volatility      ?? "Medium",
    // Prefer live on-chain TVL; fall back to registry stub.
    tvlUsd:          tvlFromChain         ?? reg?.tvlUsd ?? null,
  };
}

interface UseVaultsOptions {
  /** Search string forwarded to the subgraph where clause. */
  nameSearch?: string | null;
  /** Max vaults to fetch. Defaults to 50. */
  first?: number;
}

export function useVaults(options?: UseVaultsOptions) {
  const { nameSearch = null, first = 50 } = options ?? {};

  const { data, loading, error } = useQuery<VaultsQueryData, VaultsQueryVars>(
    VAULTS_QUERY,
    {
      variables: { skip: 0, first, nameSearch },
      fetchPolicy: "cache-and-network",
      // Don't throw — we handle errors gracefully below.
      errorPolicy: "all",
    }
  );

  const subgraphVaults = data?.vaults ?? [];
  const hasSubgraphData = subgraphVaults.length > 0;

  // Merge subgraph results with registry; fall back to registry on empty/error.
  const vaults: RegistryVault[] = hasSubgraphData
    ? subgraphVaults.map(mergeVault)
    : REGISTRY;

  // Only surface the error to the UI if we have no data to show at all.
  const surfacedError = error && !hasSubgraphData ? error : null;

  return {
    vaults,
    loading: loading && !hasSubgraphData,
    error: surfacedError,
    /** True when the subgraph returned data (vs. falling back to registry). */
    isLive: hasSubgraphData,
  };
}
