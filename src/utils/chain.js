export function getChainKey(chainId) {
  // Polygon mainnet
  if (Number(chainId) === 137) return "polygon";
  // Polygon Amoy (optional)
  if (Number(chainId) === 80002) return "polygonAmoy";
  // Polygon Mumbai (legacy)
  if (Number(chainId) === 80001) return "polygonMumbai";
  return null;
}
