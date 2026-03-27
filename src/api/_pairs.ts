// Token pairs routable through Uniswap V3 on Sepolia.
// FRAC (ERC-1155) is intentionally excluded — not tradeable via Uniswap.
export const SUPPORTED_PAIRS = [
  { chainId: 11155111, fromAsset: "ETH",  toAsset: "XER"  },
  { chainId: 11155111, fromAsset: "XER",  toAsset: "ETH"  },
  { chainId: 11155111, fromAsset: "USDC", toAsset: "XER"  },
  { chainId: 11155111, fromAsset: "XER",  toAsset: "USDC" },
];
