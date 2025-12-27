/**
 * Façinations — Canonical Vault Registry
 * --------------------------------------------------
 * This file is the single source of truth for:
 * - Vault existence
 * - Artwork metadata
 * - Chain + contract bindings
 * - Legal pack references
 * - External provenance links
 *
 * Rule:
 * If a vault is not declared here, it does not exist.
 */

export const VAULTS = [
  {
    vaultId: "VAULT-ALBATRIX-001",

    artwork: {
      title: "Untitled Study I",
      artist: "Artist Name",
      year: "2024",
      medium: "Mixed Media",
    },

    chain: {
      chainId: 137,
      name: "Polygon",
    },

    vaultType: "NFT Fractional Vault",

    contracts: {
      vault: "0x0000000000000000000000000000000000000000", // replace when deployed
      fraction: null, // populated only after fractionalization
    },

    externalLinks: {
      xdaleGallery: "https://xdalegallery.com/artwork/untitled-study-i",
      explorer: null, // auto-derived once vault address is set
      thirdParty: [], // e.g. Magic Eden, OpenSea (optional)
    },

    legal: {
      jurisdiction: "UK",
      version: "v1.0",
      pdfPath:
        "/vaults/VAULT-ALBATRIX-001/Legal-Pack-UK-ALBATRIX-001-v1.0.pdf",
    },

    status: "active", // draft | active | frozen | retired
  },
];

/**
 * Lookup helpers
 * --------------------------------------------------
 */

export function getVaultById(vaultId) {
  return VAULTS.find((v) => v.vaultId === vaultId);
}

export function getAllActiveVaults() {
  return VAULTS.filter((v) => v.status === "active");
}

export function getVaultAddress(vaultId) {
  const vault = getVaultById(vaultId);
  return vault?.contracts?.vault ?? null;
}
