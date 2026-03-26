// api/kyc.js
// Vercel serverless function — initiates a KYC verification inquiry.
//
// Required env vars (Persona):
//   PERSONA_API_KEY         — from Persona dashboard (starts with persona_sandbox_... or persona_production_...)
//   PERSONA_TEMPLATE_ID     — Inquiry Template ID (tmpl_xxx) from Persona dashboard
//
// When Persona is not configured, returns { configured: false, applicationId } so
// KycVerify.tsx falls back to the manual-review stub flow.
//
// POST /api/kyc
// Body: { firstName, lastName, dob, country, docType }
// Returns: { configured, applicationId, resumeUrl? }

const PERSONA_BASE = "https://withpersona.com/api/v1";
const PERSONA_VERSION = "2023-01-05";

function personaConfigured() {
  return !!(process.env.PERSONA_API_KEY && process.env.PERSONA_TEMPLATE_ID);
}

async function createPersonaInquiry({ firstName, lastName, dob, country, applicationId }) {
  const res = await fetch(`${PERSONA_BASE}/inquiries`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.PERSONA_API_KEY}`,
      "Persona-Version": PERSONA_VERSION,
      "Content-Type": "application/json",
      "Key-Inflection": "camel",
    },
    body: JSON.stringify({
      data: {
        type: "inquiry",
        attributes: {
          inquiryTemplateId: process.env.PERSONA_TEMPLATE_ID,
          referenceId: applicationId,
          // Pre-fill known fields to speed up the hosted flow
          fields: {
            nameFirst: { value: firstName },
            nameLast:  { value: lastName },
            birthdate:  { value: dob },
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

  const json = await res.json();
  const inquiry = json.data;
  const attrs   = inquiry.attributes;

  // Build the hosted-flow resume URL using the session token
  const resumeToken = attrs.sessionToken ?? attrs["session-token"] ?? "";
  const resumeUrl = resumeToken
    ? `https://withpersona.com/verify?inquiry-id=${inquiry.id}&session-token=${resumeToken}`
    : null;

  return { inquiryId: inquiry.id, resumeUrl };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { firstName, lastName, dob, country, docType } = req.body ?? {};

  if (!firstName || !lastName || !dob || !country) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Generate a stable reference ID for this application
  const applicationId = crypto.randomUUID();

  if (!personaConfigured()) {
    // No provider — log and return stub so the UI can continue gracefully
    console.log(`[kyc] Persona not configured — stub application ${applicationId} for ${firstName} ${lastName} (${country})`);
    return res.status(200).json({ configured: false, applicationId });
  }

  try {
    const { inquiryId, resumeUrl } = await createPersonaInquiry({
      firstName, lastName, dob, country, applicationId,
    });

    console.log(`[kyc] Persona inquiry created: ${inquiryId} (ref: ${applicationId})`);

    return res.status(200).json({
      configured: true,
      applicationId: inquiryId, // use Persona's ID as the canonical reference
      resumeUrl,
    });
  } catch (err) {
    console.error("[kyc] Persona error:", err.message);
    return res.status(500).json({ error: "Failed to create verification inquiry" });
  }
}
