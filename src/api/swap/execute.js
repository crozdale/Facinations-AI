import { getServerFeatures } from "../_features.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ code: "METHOD_NOT_ALLOWED" });

  const features = getServerFeatures();
  if (!features.SWAP_ENABLED) return res.status(403).json({ code: "SWAP_DISABLED" });
  if (!features.MARKETPLACE_ENABLED) return res.status(403).json({ code: "MARKETPLACE_NOT_ACTIVE" });

  const { quoteId, wallet, signature } = req.body ?? {};
  if (!quoteId || !wallet || !signature) {
    return res.status(400).json({ code: "BAD_REQUEST" });
  }

  // TODO: Validate quote existence + expiry in a real store (KV/Redis/db).
  // TODO: Validate signature against a structured message (EIP-191 or EIP-712).
  // TODO: Enforce nonce/replay protections.

  // Stub response:
  return res.status(200).json({
    ok: true,
    code: "EXECUTE_ACCEPTED",
    message: "Execution accepted for processing (stub).",
  });
}
