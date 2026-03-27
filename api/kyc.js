// api/kyc.js
// Consolidated KYC handler — replaces kyc.js + kyc/status.js
//
// POST /api/kyc           → initiate a KYC verification inquiry (Persona)
// GET  /api/kyc?id=xxx    → poll the status of a KYC inquiry
//
// (GET requests also routed here via Vercel rewrite from /api/kyc/status)
//
// Requires (Persona): PERSONA_API_KEY, PERSONA_TEMPLATE_ID

const PERSONA_BASE    = "https://withpersona.com/api/v1";
const PERSONA_VERSION = "2023-01-05";

function personaConfigured() {
  return !!(process.env.PERSONA_API_KEY && process.env.PERSONA_TEMPLATE_ID);
}

function mapPersonaStatus(personaStatus) {
  switch (personaStatus) {
    case "approved":  return "approved";
    case "declined":
    case "failed":
    case "expired":   return "rejected";
    default:          return "pending";
  }
}

async function createPersonaInquiry({ firstName, lastName, dob, country, applicationId }) {
  const res = await fetch(`${PERSONA_BASE}/inquiries`, {
    method: "POST",
    headers: {
      "Authorization":   `Bearer ${process.env.PERSONA_API_KEY}`,
      "Persona-Version": PERSONA_VERSION,
      "Content-Type":    "application/json",
      "Key-Inflection":  "camel",
    },
    body: JSON.stringify({
      data: {
        type: "inquiry",
        attributes: {
          inquiryTemplateId: process.env.PERSONA_TEMPLATE_ID,
          referenceId: applicationId,
          fields: {
            nameFirst: { value: firstName },
            nameLast:  { value: lastName  },
            birthdate:  { value: dob      },
            addressCountryCode: { value: country },
          },
        },
      },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Persona API error ${res.status}: ${body}`);
  }

  const json    = await res.json();
  const inquiry = json.data;
  const attrs   = inquiry.attributes;
  const resumeToken = attrs.sessionToken ?? attrs["session-token"] ?? "";
  const resumeUrl = resumeToken
    ? `https://withpersona.com/verify?inquiry-id=${inquiry.id}&session-token=${resumeToken}`
    : null;

  return { inquiryId: inquiry.id, resumeUrl };
}

export default async function handler(req, res) {
  // ── GET → status ──────────────────────────────────────────────────────────
  if (req.method === "GET") {
    const { id } = req.query ?? {};
    if (!id) return res.status(400).json({ error: "Missing id" });

    if (!process.env.PERSONA_API_KEY) {
      return res.status(200).json({ status: "pending", configured: false });
    }

    try {
      const personaRes = await fetch(`${PERSONA_BASE}/inquiries/${encodeURIComponent(id)}`, {
        headers: {
          "Authorization":   `Bearer ${process.env.PERSONA_API_KEY}`,
          "Persona-Version": PERSONA_VERSION,
          "Key-Inflection":  "camel",
        },
      });

      if (!personaRes.ok) {
        const body = await personaRes.text();
        console.error(`[kyc/status] Persona error ${personaRes.status}: ${body}`);
        return res.status(502).json({ error: "Failed to reach verification provider" });
      }

      const json         = await personaRes.json();
      const personaStatus = json.data?.attributes?.status ?? "pending";
      const status        = mapPersonaStatus(personaStatus);

      res.setHeader("Cache-Control", "s-maxage=15, stale-while-revalidate=5");
      return res.status(200).json({ status, configured: true });
    } catch (err) {
      console.error("[kyc/status] Error:", err.message);
      return res.status(500).json({ error: "Status check failed" });
    }
  }

  // ── POST → initiate ───────────────────────────────────────────────────────
  if (req.method === "POST") {
    const { firstName, lastName, dob, country, docType } = req.body ?? {};
    if (!firstName || !lastName || !dob || !country) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const applicationId = crypto.randomUUID();

    if (!personaConfigured()) {
      console.log(`[kyc] Persona not configured — stub application ${applicationId} for ${firstName} ${lastName} (${country})`);
      return res.status(200).json({ configured: false, applicationId });
    }

    try {
      const { inquiryId, resumeUrl } = await createPersonaInquiry({ firstName, lastName, dob, country, applicationId });
      console.log(`[kyc] Persona inquiry created: ${inquiryId} (ref: ${applicationId})`);
      return res.status(200).json({ configured: true, applicationId: inquiryId, resumeUrl });
    } catch (err) {
      console.error("[kyc] Persona error:", err.message);
      return res.status(500).json({ error: "Failed to create verification inquiry" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
