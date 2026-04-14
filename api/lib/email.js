// api/lib/email.js
// Thin wrapper around the Resend API for transactional emails.
//
// Requires: RESEND_API_KEY (from resend.com — free tier: 3,000 emails/month)
// From address must be a verified domain in Resend.
// Set RESEND_FROM to e.g. "Musée-Crosdale <studio@xdale.art>"

const FROM = process.env.RESEND_FROM || "Musée-Crosdale <studio@xdale.art>";

/** Send a transactional email via Resend. Throws on failure. */
export async function sendEmail({ to, subject, html }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log(`[email] not configured — would send "${subject}" to ${to}`);
    return { ok: true, configured: false };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method:  "POST",
    headers: {
      Authorization:  `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM, to, subject, html }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend ${res.status}: ${body}`);
  }

  return { ok: true, configured: true };
}

// ── Templates ─────────────────────────────────────────────────────────────────

const BASE = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<style>
  body  { background:#080808; color:#e8e0d0; font-family:'Georgia',serif; margin:0; padding:0; }
  .wrap { max-width:540px; margin:0 auto; padding:3rem 2rem; }
  .eyebrow { font-family:Arial,sans-serif; font-size:10px; letter-spacing:4px; text-transform:uppercase;
             color:rgba(212,175,55,0.5); margin-bottom:1.5rem; }
  .title { font-family:Arial,sans-serif; font-size:22px; font-weight:400; color:#f0e8d0;
           letter-spacing:2px; margin:0 0 1.5rem; }
  .body  { font-size:15px; color:#9a9288; line-height:1.8; margin:0 0 2rem; }
  .divider { height:1px; background:linear-gradient(to right,transparent,rgba(212,175,55,0.3),transparent);
             margin:2rem 0; border:none; }
  .btn  { display:inline-block; padding:0.65rem 2rem; background:#d4af37; color:#050505;
          font-family:Arial,sans-serif; font-size:11px; letter-spacing:3px; text-transform:uppercase;
          text-decoration:none; }
  .footer { font-family:Arial,sans-serif; font-size:10px; color:rgba(255,255,255,0.15);
            letter-spacing:2px; text-transform:uppercase; margin-top:3rem; }
</style>
</head>
<body><div class="wrap">${content}</div></body>
</html>`;

export function tplWelcome({ tier, periodEnd }) {
  const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1);
  const date = periodEnd ? new Date(periodEnd).toLocaleDateString("en-GB", { day:"numeric", month:"long", year:"numeric" }) : null;
  return BASE(`
    <div class="eyebrow">Musée-Crosdale · Studio</div>
    <h1 class="title">Welcome to ${tierLabel} Studio</h1>
    <p class="body">
      Your subscription is now active. You have full access to all ${tierLabel} features —
      AI-guided lessons, gallery-quality display${tier === "gallery" ? ", NFT minting, and vault fractionalization" : ""}.
      ${date ? `<br/><br/>Your next billing date is <strong style="color:#d4af37">${date}</strong>.` : ""}
    </p>
    <hr class="divider"/>
    <a href="https://xdale.art/studio" class="btn">Enter Studio</a>
    <p class="footer">Musée-Crosdale &nbsp;·&nbsp; xdale.art</p>
  `);
}

export function tplReceipt({ tier, amount, periodEnd }) {
  const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1);
  const date = periodEnd ? new Date(periodEnd).toLocaleDateString("en-GB", { day:"numeric", month:"long", year:"numeric" }) : null;
  return BASE(`
    <div class="eyebrow">Payment Confirmed</div>
    <h1 class="title">Your Receipt</h1>
    <p class="body">
      Thank you — your payment of <strong style="color:#d4af37">$${amount}</strong> for
      <strong style="color:#d4af37">${tierLabel} Studio</strong> has been received.
      ${date ? `Your subscription renews on <strong style="color:#d4af37">${date}</strong>.` : ""}
    </p>
    <hr class="divider"/>
    <a href="https://xdale.art/studio" class="btn">Go to Studio</a>
    <p class="footer">Musée-Crosdale &nbsp;·&nbsp; xdale.art</p>
  `);
}

export function tplPaymentFailed() {
  return BASE(`
    <div class="eyebrow">Action Required</div>
    <h1 class="title">Payment Unsuccessful</h1>
    <p class="body">
      We were unable to process your most recent Studio subscription payment.
      Please update your payment method to retain access.
    </p>
    <hr class="divider"/>
    <a href="https://xdale.art/studio" class="btn">Update Payment</a>
    <p class="footer">Musée-Crosdale &nbsp;·&nbsp; xdale.art</p>
  `);
}

export function tplCancelled({ tier }) {
  const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1);
  return BASE(`
    <div class="eyebrow">Subscription Ended</div>
    <h1 class="title">Your ${tierLabel} Plan Has Been Cancelled</h1>
    <p class="body">
      Your Facinations Studio subscription has been cancelled and access has been removed.
      You're welcome to resubscribe at any time.
    </p>
    <hr class="divider"/>
    <a href="https://xdale.art/studio" class="btn">Resubscribe</a>
    <p class="footer">Musée-Crosdale &nbsp;·&nbsp; xdale.art</p>
  `);
}

export function tplWaitlist() {
  return BASE(`
    <div class="eyebrow">Musée-Crosdale · Studio</div>
    <h1 class="title">You're on the List</h1>
    <p class="body">
      Thank you for your interest in Facinations Studio. We'll be in touch with early access
      details as we approach launch. In the meantime, explore the gallery.
    </p>
    <hr class="divider"/>
    <a href="https://xdale.art/xdale" class="btn">Visit the Gallery</a>
    <p class="footer">Musée-Crosdale &nbsp;·&nbsp; xdale.art</p>
  `);
}
