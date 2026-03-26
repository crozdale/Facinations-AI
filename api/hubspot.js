// api/hubspot.js
// POST /api/hubspot — upsert a HubSpot contact from any site form.
//
// Body: { email, firstName, lastName, formType, ...extra }
// formType: "artwork_enquiry" | "dealer_onboarding" | "kyc_lead"
//
// Requires: HUBSPOT_API_KEY (private-app token from HubSpot portal 1611965)
// When not configured, logs the submission and returns { ok: true, configured: false }.

const HUBSPOT_BASE = "https://api.hubapi.com";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, firstName, lastName, formType, ...extra } = req.body ?? {};

  if (!email) {
    return res.status(400).json({ error: "email is required" });
  }

  if (!process.env.HUBSPOT_API_KEY) {
    console.log(`[hubspot] not configured — would upsert: ${email} (${formType ?? "unknown"})`);
    return res.status(200).json({ ok: true, configured: false });
  }

  // ── Build properties ──────────────────────────────────────────────────────
  const properties = {
    email,
    ...(firstName && { firstname: firstName }),
    ...(lastName  && { lastname:  lastName  }),
    hs_lead_source: "Musée-Crosdale Website",
  };

  if (formType === "artwork_enquiry") {
    if (extra.message)      properties.message = extra.message;
    if (extra.artworkTitle) properties.subject  = `Enquiry: ${extra.artworkTitle}`;
  }

  if (formType === "dealer_onboarding") {
    if (extra.company)     properties.company = extra.company;
    if (extra.website)     properties.website = extra.website;
    if (extra.location)    properties.city    = extra.location;
    if (extra.description) properties.message = extra.description;
  }

  // ── Upsert via batch endpoint ─────────────────────────────────────────────
  try {
    const hsRes = await fetch(`${HUBSPOT_BASE}/crm/v3/objects/contacts/batch/upsert`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: [{ id: email, idProperty: "email", properties }],
      }),
    });

    if (!hsRes.ok) {
      const body = await hsRes.text();
      console.error(`[hubspot] ${hsRes.status}: ${body}`);
      return res.status(502).json({ error: "CRM submission failed" });
    }

    const data = await hsRes.json();
    return res.status(200).json({
      ok: true,
      configured: true,
      id: data.results?.[0]?.id ?? null,
    });
  } catch (err) {
    console.error("[hubspot] error:", err.message);
    return res.status(500).json({ error: "CRM error" });
  }
}
