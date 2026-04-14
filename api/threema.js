// api/threema.js
// Threema Gateway API proxy — keeps gateway secret server-side.
// Required env vars:
//   THREEMA_GATEWAY_ID     — your Gateway ID, starts with * (e.g. *ABCDEF7)
//   THREEMA_GATEWAY_SECRET — Gateway API secret
//   THREEMA_ADMIN_ID       — Threema ID that receives community messages (default: UH64B9C6)

const GATEWAY_BASE = 'https://msgapi.threema.ch';

export default async function handler(req, res) {
  const GATEWAY_ID = process.env.THREEMA_GATEWAY_ID;
  const GATEWAY_SECRET = process.env.THREEMA_GATEWAY_SECRET;
  const ADMIN_ID = process.env.THREEMA_ADMIN_ID || 'UH64B9C6';

  // Allow CORS from same origin (Vercel handles this; explicit header for dev)
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (!GATEWAY_ID || !GATEWAY_SECRET) {
    return res.status(503).json({ error: 'Threema Gateway not configured. Set THREEMA_GATEWAY_ID and THREEMA_GATEWAY_SECRET.' });
  }

  // ── GET /api/threema?action=credits ─────────────────────────────────────────
  if (req.method === 'GET') {
    try {
      const r = await fetch(
        `${GATEWAY_BASE}/credits?from=${encodeURIComponent(GATEWAY_ID)}&secret=${encodeURIComponent(GATEWAY_SECRET)}`
      );
      if (!r.ok) return res.status(r.status).json({ error: `Gateway error ${r.status}` });
      const text = await r.text();
      return res.json({ credits: parseInt(text.trim(), 10) });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // ── POST /api/threema ────────────────────────────────────────────────────────
  if (req.method === 'POST') {
    const { action, to, text, from_name, from_email } = req.body ?? {};

    if (action === 'send') {
      if (!text || text.trim().length === 0) {
        return res.status(400).json({ error: 'Message text is required.' });
      }

      // Build message body — prepend sender info so admin knows who sent it
      const lines = [];
      if (from_name || from_email) {
        lines.push(`From: ${[from_name, from_email].filter(Boolean).join(' — ')}`);
        lines.push('');
      }
      lines.push(text.trim());
      const message = lines.join('\n');

      const recipient = to || ADMIN_ID;

      try {
        const params = new URLSearchParams({
          from: GATEWAY_ID,
          to: recipient,
          secret: GATEWAY_SECRET,
          text: message,
        });

        const r = await fetch(`${GATEWAY_BASE}/send_simple`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: params.toString(),
        });

        if (!r.ok) {
          const errText = await r.text();
          return res.status(r.status).json({ error: `Gateway error: ${errText}` });
        }

        const msgId = await r.text();
        return res.json({ success: true, messageId: msgId.trim() });
      } catch (e) {
        return res.status(500).json({ error: e.message });
      }
    }

    return res.status(400).json({ error: `Unknown action: ${action}` });
  }

  res.status(405).json({ error: 'Method not allowed.' });
}
