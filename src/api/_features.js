export function getServerFeatures() {
  return {
    SWAP_ENABLED: process.env.FAC_SWAP_ENABLED === "true",
    MINT_ENABLED: process.env.FAC_MINT_ENABLED === "true",
    MARKETPLACE_ENABLED: process.env.FAC_MARKETPLACE_ENABLED === "true",
  };
}
