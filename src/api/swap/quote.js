import { getServerFeatures } from "../_features.js";
import { SUPPORTED_PAIRS } from "../_pairs.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ code: "METHOD_NOT_ALLOWED" });

  const features = getServerFeatures();
  if (!features.SWAP_ENABLED) return res.status(403).json({ code: "SWAP_DISABLED" });
  if (!features.MARKETPLACE_ENABLED) return res.status(403).json({ code: "MARKETPLACE_NOT_ACTIVE" });

  const { chainId, fromAsset, toAsset, fromAmount, wallet } = req.body ?? {};

  if (!chainId || !fromAsset || !toAsset || !fromAmount || !wallet) {
    return res.status(400).json({ code: "BAD_REQUEST" });
  }

  const allowed = SUPPORTED_PAIRS.some(
    (p) => p.chainId === chainId && p.fromAsset === fromAsset && p.toAsset === toAsset
  );

  if (!allowed) return res.status(400).json({ code: "PAIR_NOT_SUPPORTED" });

  // Minimal stub: return an allowlisted "quote shell".
  // Replace with real router logic later (e.g., 0x, Uniswap, bespoke vault router).
  const quoteId = `q_${Date.now()}`;
  const expiresAt = Math.floor(Date.now() / 1000) + 60; // 60s TTL

  return res.status(200).json({
    allowed: true,
    quoteId,
    expiresAt,
    tx: {
      to: "0x0000000000000000000000000000000000000000",
      data: "0x",
      value: "0",
    },
  });
}
