// api/vault/enquire.js
// POST /api/vault/enquire — fraction purchase enquiry.
// Records the interest, sends a confirmation email, syncs to HubSpot + Mailchimp.

import { sendEmail }  from "../lib/email.js";
import { query }      from "../lib/db.js";

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN ?? "";

function cors(res) {
  if (ALLOWED_ORIGIN) res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { vaultId, vaultName, tokenId, quantity, walletAddress, name, email, message } = req.body ?? {};

  if (!vaultId || !email || !quantity) {
    return res.status(400).json({ error: "vaultId, email and quantity are required" });
  }

  const qty = Number(quantity);
  if (!Number.isInteger(qty) || qty < 1 || qty > 10_000) {
    return res.status(400).json({ error: "Invalid quantity" });
  }

  // ── Persist to DB (if configured) ──────────────────────────────────────────
  if (process.env.DATABASE_URL) {
    try {
      await query(
        `INSERT INTO vault_enquiries
           (vault_id, token_id, quantity, wallet_address, name, email, message, created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,NOW())
         ON CONFLICT DO NOTHING`,
        [vaultId, tokenId ?? 1, qty, walletAddress ?? null, name ?? null, email, message ?? null]
      ).catch(() => {}); // table may not exist yet — non-fatal
    } catch {}
  }

  // ── HubSpot CRM ─────────────────────────────────────────────────────────────
  if (process.env.HUBSPOT_ACCESS_TOKEN) {
    const [firstName, ...rest] = (name ?? "").trim().split(" ");
    fetch(`${process.env.VERCEL_URL ? "https://" + process.env.VERCEL_URL : ""}/api/hubspot`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        formType: "artwork_enquiry",
        email,
        firstName: firstName || undefined,
        lastName: rest.join(" ") || undefined,
        message: `Fraction enquiry — ${vaultName ?? vaultId}, qty: ${qty}. ${message ?? ""}`.trim(),
        artworkTitle: vaultName ?? vaultId,
      }),
    }).catch(() => {});
  }

  // ── Mailchimp tag ────────────────────────────────────────────────────────────
  if (process.env.MAILCHIMP_API_KEY && process.env.MAILCHIMP_LIST_ID) {
    const [firstName, ...rest] = (name ?? "").trim().split(" ");
    fetch(`${process.env.VERCEL_URL ? "https://" + process.env.VERCEL_URL : ""}/api/mailchimp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, firstName: firstName || undefined, lastName: rest.join(" ") || undefined, tags: ["vault-enquiry"] }),
    }).catch(() => {});
  }

  // ── Confirmation email ───────────────────────────────────────────────────────
  if (process.env.RESEND_API_KEY) {
    await sendEmail({
      to: email,
      subject: `Your enquiry — ${vaultName ?? vaultId} fractions`,
      html: `
        <div style="background:#080808;padding:2.5rem;font-family:'Cormorant Garamond',Georgia,serif;color:#e8e0d0;max-width:600px;margin:0 auto">
          <p style="font-family:'Cinzel',serif;font-size:0.55rem;letter-spacing:0.4em;text-transform:uppercase;color:#d4af37;margin:0 0 1.5rem">Facinations · Vault Fractions</p>
          <h1 style="font-family:'Cinzel',serif;font-size:1.3rem;font-weight:400;color:#f0e8d0;letter-spacing:0.06em;margin:0 0 1rem">Enquiry Received</h1>
          <p style="font-size:0.95rem;color:#9a9288;line-height:1.8;margin:0 0 1.5rem">
            Thank you${name ? ", " + name.split(" ")[0] : ""}. We have received your expression of interest in <strong style="color:#d4af37">${qty} fraction${qty > 1 ? "s" : ""}</strong> of <strong style="color:#f0e8d0">${vaultName ?? vaultId}</strong>.
          </p>
          <p style="font-size:0.9rem;color:#6a6258;line-height:1.8;margin:0 0 2rem;font-style:italic">
            A curator will be in touch within two business days to discuss provenance documentation, pricing, and on-chain settlement.
          </p>
          ${walletAddress ? `<p style="font-family:monospace;font-size:0.75rem;color:#4a4238;word-break:break-all;margin:0 0 1.5rem">Wallet: ${walletAddress}</p>` : ""}
          <hr style="border:none;border-top:1px solid rgba(212,175,55,0.1);margin:0 0 1.5rem">
          <p style="font-family:'Cinzel',serif;font-size:0.5rem;letter-spacing:0.3em;text-transform:uppercase;color:rgba(212,175,55,0.25);margin:0">Facinations Studio · Powered by Musée-Crosdale</p>
        </div>
      `,
    }).catch(() => {});
  }

  return res.status(200).json({ ok: true });
}
