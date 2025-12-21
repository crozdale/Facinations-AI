export const VAULTS = [
  {
    id: "untitled-study-1",
    title: "Untitled Study I",
    artist: "Artist Name",
    year: "2024",
    medium: "Mixed Media",
    status: "active",
    chainId: 137,
    vaultType: "NFT Fractional Vault",

    // Fraction schema (deterministic placeholders)
    fraction: {
      symbol: "UST1",
      decimals: 18,
      totalSupply: 100_000,     // fractions
      price: 1.25,              // USD per fraction (placeholder)
      nav: 125_000,             // USD (totalSupply * price)
      circulating: 0,           // placeholder
    },
  },
];


