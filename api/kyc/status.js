// api/kyc/status.js
// Vercel serverless function — polls the status of a KYC inquiry.
//
// GET /api/kyc/status?id=inq_xxx
// Returns: { status: "pending" | "approved" | "rejected" }
//
// When Persona is not configured, always returns { status: "pending" }
// (manual review — admin approves via Persona dashboard or other means).

const PERSONA_BASE = "https://withpersona.com/api/v1";
const PERSONA_VERSION = "2023-01-05";

// Map Persona inquiry statuses to our internal KycStatus type
function mapPersonaStatus(personaStatus) {
  switch (personaStatus) {
    case "approved":
      return "approved";
    case "declined":
    case "failed":
    case "expired":
      return "rejected";
    default:
      // created | pending | needs_review | etc.
      return "pending";
  }
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query ?? {};

  if (!id) {
    return res.status(400).json({ error: "Missing id" });
  }

  if (!process.env.PERSONA_API_KEY) {
    // Not configured — status is managed manually
    return res.status(200).json({ status: "pending", configured: false });
  }

  try {
    const personaRes = await fetch(`${PERSONA_BASE}/inquiries/${encodeURIComponent(id)}`, {
      headers: {
        "Authorization": `Bearer ${process.env.PERSONA_API_KEY}`,
        "Persona-Version": PERSONA_VERSION,
        "Key-Inflection": "camel",
      },
    });

    if (!personaRes.ok) {
      const body = await personaRes.text();
      console.error(`[kyc/status] Persona error ${personaRes.status}: ${body}`);
      return res.status(502).json({ error: "Failed to reach verification provider" });
    }

    const json = await personaRes.json();
    const personaStatus = json.data?.attributes?.status ?? "pending";
    const status = mapPersonaStatus(personaStatus);

    // Short cache — 15s — so polling isn't hammered but stays fresh
    res.setHeader("Cache-Control", "s-maxage=15, stale-while-revalidate=5");

    return res.status(200).json({ status, configured: true });
  } catch (err) {
    console.error("[kyc/status] Error:", err.message);
    return res.status(500).json({ error: "Status check failed" });
  }
}
