// Canonical, chain-agnostic registry
// Replace / extend entries as needed

export const VAULTS = [
  {
    id: "untitled-study-1",
    title: "Untitled Study I",
    artist: "Artist Name",
    network: 137,
    vaultType: "NFT Fractional Vault",
    contract: "0x0000000000000000000000000000000000000000", // ← replace later
    externalUrl: "https://xdale.io/artwork/untitled-study-1",
    status: "active",
  },
  {
    id: "untitled-study-2",
    title: "Untitled Study II",
    artist: "Artist Name",
    year: "2024",
    medium: "Mixed Media",
    network: 137,
    vaultType: "NFT Vault",
    contract: null, // no on-chain vault yet
    externalUrl: "https://xdale.io/artwork/untitled-study-2",
    status: "draft",
  },
];

