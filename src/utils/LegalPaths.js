export function legalPackPath({ vaultId, jurisdiction, version }) {
  return `/vaults/${vaultId}/Legal-Pack-${jurisdiction}-${vaultId}-${version}.pdf`;
}
