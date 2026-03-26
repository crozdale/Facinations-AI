// src/features/vaults/registry/vaultRegistry.ts

export interface RegistryVault {
  vaultId: string;
  name: string;
  description: string;
  contractAddress: string;
  chainId: number;
  premiumRequired: boolean;
  // Derived metrics — computed from on-chain data when available, estimated otherwise
  apy: number | null;          // annualised yield percentage e.g. 4.2
  riskScore: "Low" | "Medium" | "High";
  volatility: "Low" | "Medium" | "High";
  tvlUsd: number | null;       // total value locked in USD
}

export const VAULTS: RegistryVault[] = [
  {
    vaultId: "VAULT-ALBATRIX-001",
    name: "Albatrix I",
    description: "Genesis fractionalized artwork vault. First-edition Crosdale works secured on-chain with ERC1155 fraction tokens.",
    contractAddress: "0x0A6C0cd989fd3643AE60C5C910C03fbAB25242dF",
    chainId: 11155111, // Sepolia
    premiumRequired: true,
    apy: 4.2,
    riskScore: "Medium",
    volatility: "Medium",
    tvlUsd: 128000,
  },
  {
    vaultId: "VAULT-OPEN-ARCHIVE",
    name: "Open Archive",
    description: "Read-only provenance archive. Public access to verified artwork metadata and chain-of-custody records.",
    contractAddress: "0x89E4041e2B51De805C824A4391e4f8216a7529cd",
    chainId: 11155111, // Sepolia
    premiumRequired: false,
    apy: null,
    riskScore: "Low",
    volatility: "Low",
    tvlUsd: 0,
  },
];
