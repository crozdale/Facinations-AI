// api/coinbase/verify.js
// GET /api/coinbase/verify?charge_id=xxx&tier=starter|gallery
// Returns: { verified: boolean, tier: string | null }
//
// Polls Coinbase Commerce for the charge status.
// A charge is considered verified when its timeline contains COMPLETED or CONFIRMED.

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { charge_id, tier } = req.query;

  if (!charge_id || !tier) {
    return res.status(400).json({ error: "charge_id and tier are required" });
  }

  const apiKey = process.env.COINBASE_COMMERCE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Coinbase Commerce is not configured" });
  }

  try {
    const ccRes = await fetch(`https://api.commerce.coinbase.com/charges/${charge_id}`, {
      headers: {
        "X-CC-Api-Key": apiKey,
        "X-CC-Version": "2018-03-22",
      },
    });

    if (!ccRes.ok) {
      const body = await ccRes.text();
      console.error(`[coinbase/verify] ${ccRes.status}: ${body}`);
      return res.status(502).json({ error: "Could not fetch charge from Coinbase" });
    }

    const { data } = await ccRes.json();

    // Charge is settled when COMPLETED or CONFIRMED appears in the timeline
    const SETTLED = new Set(["COMPLETED", "CONFIRMED"]);
    const verified = Array.isArray(data.timeline) &&
      data.timeline.some((e) => SETTLED.has(e.status));

    // Also check metadata tier matches to prevent spoofing
    const chargeTier = data.metadata?.tier;
    const tiersMatch = chargeTier === tier;

    return res.status(200).json({
      verified: verified && tiersMatch,
      tier: verified && tiersMatch ? tier : null,
    });
  } catch (err) {
    console.error("[coinbase/verify] error:", err.message);
    return res.status(500).json({ error: "Coinbase verification error" });
  }
}
