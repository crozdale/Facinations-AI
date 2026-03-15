/**
 * Facinations — Canonical Vault Registry
 * -------------------------------------
 * If a vault is not declared here, it does not exist.
 */

export const VAULTS = [
  {
    vaultId: "VAULT-ALBATRIX-001",
    name: "Albatrix I",
    description: "Genesis fractionalized artwork vault.",
    contractAddress: "0x0000000000000000000000000000000000000000",
    chainId: 1,
    premiumRequired: true
  },
  {
    vaultId: "VAULT-OPEN-ARCHIVE",
    name: "Open Archive",
    description: "Read-only provenance archive.",
    contractAddress: "0x0000000000000000000000000000000000000000",
    chainId: 1,
    premiumRequired: false
  }
];
