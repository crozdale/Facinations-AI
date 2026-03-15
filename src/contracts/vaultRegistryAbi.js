export const VAULT_REGISTRY_ABI = [
  "function vaultCount() view returns (uint256)",
  "function vaultByIndex(uint256 index) view returns (string vaultId, address vaultContract, bool premiumRequired)"
];
