// api/webhooks/stripe.js
// POST /api/webhooks/stripe — receive and process Stripe webhook events.
//
// Required env vars:
//   STRIPE_SECRET_KEY       — for Stripe SDK
//   STRIPE_WEBHOOK_SECRET   — whsec_... from Stripe dashboard webhook settings
//   STRIPE_STARTER_PRICE_ID — price_xxx for starter plan
//   STRIPE_GALLERY_PRICE_ID — price_xxx for gallery plan
//   DATABASE_URL            — Postgres connection string
//
// Signature verification requires the raw request body — body parsing is disabled.
// Register this URL in Stripe dashboard → Developers → Webhooks.
// Events to enable: checkout.session.completed, customer.subscription.updated,
//   customer.subscription.deleted, invoice.paid, invoice.payment_failed

import Stripe from "stripe";
import { query } from "../lib/db.js";
import { runMigrations } from "../lib/migrate.js";

// Disable Vercel's automatic body parsing so we can verify the raw signature
export const config = { api: { bodyParser: false } };

/** Read raw body from the request stream. */
function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end",  () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

/** Map a Stripe Price ID to a plan tier string. */
function tierFromPriceId(priceId) {
  if (priceId === process.env.STRIPE_STARTER_PRICE_ID) return "starter";
  if (priceId === process.env.STRIPE_GALLERY_PRICE_ID) return "gallery";
  return null;
}

/** Upsert a subscription row keyed on stripe_customer_id. */
async function upsertSubscription({ customerId, subscriptionId, email, tier, status, periodEnd }) {
  await query(
    `INSERT INTO subscriptions
       (email, stripe_customer_id, stripe_subscription_id, tier, status, current_period_end, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, NOW())
     ON CONFLICT (stripe_customer_id) DO UPDATE SET
       stripe_subscription_id = EXCLUDED.stripe_subscription_id,
       tier                   = EXCLUDED.tier,
       status                 = EXCLUDED.status,
       current_period_end     = EXCLUDED.current_period_end,
       email                  = COALESCE(EXCLUDED.email, subscriptions.email),
       updated_at             = NOW()`,
    [email ?? null, customerId, subscriptionId, tier, status, periodEnd ?? null]
  );
}

let _migrated = false;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(500).json({ error: "Stripe webhook not configured" });
  }

  const stripe    = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-04-10" });
  const rawBody   = await getRawBody(req);
  const signature = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("[stripe webhook] signature verification failed:", err.message);
    return res.status(400).json({ error: `Webhook signature invalid: ${err.message}` });
  }

  // Ensure table exists (idempotent — cheap after first run)
  if (!_migrated) {
    try { await runMigrations(); _migrated = true; } catch (e) {
      console.warn("[stripe webhook] migration warning:", e.message);
    }
  }

  try {
    switch (event.type) {

      // ── Initial checkout completed ──────────────────────────────────────────
      case "checkout.session.completed": {
        const session = event.data.object;
        if (session.mode !== "subscription") break;

        const sub   = await stripe.subscriptions.retrieve(session.subscription);
        const price = sub.items.data[0]?.price?.id;
        const tier  = tierFromPriceId(price);
        if (!tier) break;

        await upsertSubscription({
          customerId:     session.customer,
          subscriptionId: session.subscription,
          email:          session.customer_details?.email ?? session.customer_email,
          tier,
          status:         "active",
          periodEnd:      new Date(sub.current_period_end * 1000),
        });
        break;
      }

      // ── Subscription updated (plan change, renewal, etc.) ───────────────────
      case "customer.subscription.updated": {
        const sub   = event.data.object;
        const price = sub.items.data[0]?.price?.id;
        const tier  = tierFromPriceId(price) ?? "starter";
        const status = sub.status === "active" ? "active"
                     : sub.status === "past_due" ? "past_due"
                     : sub.status;

        await upsertSubscription({
          customerId:     sub.customer,
          subscriptionId: sub.id,
          email:          null, // already stored from checkout
          tier,
          status,
          periodEnd:      new Date(sub.current_period_end * 1000),
        });
        break;
      }

      // ── Subscription cancelled ──────────────────────────────────────────────
      case "customer.subscription.deleted": {
        const sub = event.data.object;
        await query(
          `UPDATE subscriptions
           SET status = 'cancelled', tier = 'none', updated_at = NOW()
           WHERE stripe_customer_id = $1`,
          [sub.customer]
        );
        break;
      }

      // ── Invoice paid (renewal) ──────────────────────────────────────────────
      case "invoice.paid": {
        const invoice = event.data.object;
        if (!invoice.subscription) break;

        const sub  = await stripe.subscriptions.retrieve(invoice.subscription);
        await query(
          `UPDATE subscriptions
           SET status = 'active',
               current_period_end = $1,
               updated_at = NOW()
           WHERE stripe_customer_id = $2`,
          [new Date(sub.current_period_end * 1000), invoice.customer]
        );
        break;
      }

      // ── Payment failed ──────────────────────────────────────────────────────
      case "invoice.payment_failed": {
        const invoice = event.data.object;
        await query(
          `UPDATE subscriptions
           SET status = 'past_due', updated_at = NOW()
           WHERE stripe_customer_id = $1`,
          [invoice.customer]
        );
        break;
      }

      default:
        // Ignore unhandled event types
        break;
    }
  } catch (err) {
    console.error(`[stripe webhook] error processing ${event.type}:`, err.message);
    // Return 200 anyway — Stripe retries on non-2xx
    return res.status(200).json({ received: true, warning: err.message });
  }

  return res.status(200).json({ received: true });
}
