// api/subscribe.ts
// Vercel serverless function — captures gallery subscription requests via Resend.
// Deploy: place this file at /api/subscribe.ts in your project root.
// Env var required: RESEND_API_KEY (set in Vercel dashboard → Settings → Environment Variables)

import type { VercelRequest, VercelResponse } from "@vercel/node";

const NOTIFY_EMAIL = "gallery@xdale.net"; // ← your inbox for new subscription alerts
const FROM_EMAIL   = "Musée-Crosdale <noreply@xdale.net>"; // ← must match verified Resend domain

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only accept POST
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body ?? {};

  // Basic validation
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({ error: "A valid email address is required." });
  }

  const sanitised = email.trim().toLowerCase();

  try {
    // 1. Notify you of the new subscriber
    const notify = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [NOTIFY_EMAIL],
        reply_to: sanitised,
        subject: "New Hypsoverse gallery access request",
        html: `
          <div style="font-family:Georgia,serif;max-width:480px;margin:0 auto;padding:2rem;color:#1a1814;">
            <p style="font-size:0.75rem;letter-spacing:0.2em;text-transform:uppercase;color:#b8975a;margin-bottom:1rem;">
              Musée-Crosdale — Gallery Access
            </p>
            <h2 style="font-weight:400;font-size:1.4rem;margin-bottom:1rem;">
              New subscription request
            </h2>
            <p style="color:#4a4640;line-height:1.7;">
              <strong>${sanitised}</strong> has requested gallery access via the Hypsoverse gate on xdale.net.
            </p>
            <p style="margin-top:1.5rem;font-size:0.85rem;color:#8a8680;">
              Reply directly to this email to follow up with the subscriber.
            </p>
          </div>
        `,
      }),
    });

    if (!notify.ok) {
      const err = await notify.text();
      console.error("Resend notify error:", err);
      return res.status(502).json({ error: "Failed to send notification." });
    }

    // 2. Send a confirmation to the subscriber
    const confirm = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [sanitised],
        subject: "Your Musée-Crosdale gallery access request",
        html: `
          <div style="font-family:Georgia,serif;max-width:480px;margin:0 auto;padding:2rem;color:#1a1814;background:#faf8f4;">
            <p style="font-size:0.7rem;letter-spacing:0.22em;text-transform:uppercase;color:#b8975a;margin-bottom:1.5rem;">
              Musée-Crosdale
            </p>
            <h2 style="font-family:Georgia,serif;font-weight:400;font-size:1.5rem;line-height:1.3;margin-bottom:1.25rem;color:#1a1814;">
              Your access request has been received.
            </h2>
            <p style="color:#4a4640;line-height:1.8;font-size:1rem;margin-bottom:1.25rem;">
              Thank you for requesting gallery access. We'll be in touch shortly with your subscription details and full access to Hypsoverse immersive environments.
            </p>
            <p style="color:#8a8680;font-size:0.9rem;line-height:1.7;font-style:italic;">
              In the meantime, you may continue as a guest with limited access to the collection.
            </p>
            <div style="margin-top:2rem;padding-top:1.5rem;border-top:1px solid #e8e4de;">
              <p style="font-size:0.72rem;color:#b8975a;letter-spacing:0.1em;text-transform:uppercase;margin:0;">
                Musée-Crosdale — Private Client
              </p>
              <p style="font-size:0.72rem;color:#c8c4be;margin:0.3rem 0 0;">
                xdale.net
              </p>
            </div>
          </div>
        `,
      }),
    });

    if (!confirm.ok) {
      // Non-fatal — subscriber notification went out, confirmation failed
      console.warn("Resend confirm email failed — continuing.");
    }

    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error("subscribe handler error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
}