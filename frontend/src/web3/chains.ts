export const CHAINS = {
  ethereum: {
    id: 1,
    subgraph: import.meta.env.VITE_SUBGRAPH_ETH,
  },
  polygon: {
    id: 137,
    subgraph: import.meta.env.VITE_SUBGRAPH_POLY,
  },
};
