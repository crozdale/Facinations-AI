// Canonical network configuration
// ETH-DRY: Ethereum enabled for READ-ONLY hydration

export const NETWORKS = {
  ethereum: {
    chainId: 1,
    name: "Ethereum",
    rpcFallback: "https://rpc.ankr.com/eth"
  },

  polygon: {
    chainId: 137,
    name: "Polygon",
    rpcFallback: "https://polygon-rpc.com"
  }
};
