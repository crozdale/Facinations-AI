// api/lib/auth.js
// JWT verification for Supabase-issued tokens.
//
// Uses Supabase's JWKS endpoint so both the current ECC P-256 key and the
// legacy HS256 key (still valid for expiring tokens) are accepted automatically.
//
// Required env var: SUPABASE_URL  (e.g. https://xxxx.supabase.co)

import { createRemoteJWKSet, jwtVerify } from "jose";

let _jwks = null;

function getJWKS() {
  if (!_jwks) {
    const url = process.env.SUPABASE_URL;
    if (!url) throw new Error("SUPABASE_URL is not set");
    _jwks = createRemoteJWKSet(
      new URL(`${url}/auth/v1/.well-known/jwks.json`)
    );
  }
  return _jwks;
}

/**
 * Extract and verify the Supabase JWT from the Authorization header.
 * Returns the decoded JWT payload on success, throws on any failure.
 */
export async function verifyAuth(req) {
  const header = req.headers["authorization"] ?? "";
  if (!header.startsWith("Bearer ")) throw new Error("Missing bearer token");
  const token = header.slice(7);
  const { payload } = await jwtVerify(token, getJWKS(), {
    issuer: process.env.SUPABASE_URL,
  });
  return payload;
}

/**
 * Guard for Vercel API routes.
 * On success: sets req.user to the JWT payload and returns true.
 * On failure: writes a 401 response and returns false.
 *
 * Usage:
 *   if (!await requireAuth(req, res)) return;
 */
export async function requireAuth(req, res) {
  try {
    req.user = await verifyAuth(req);
    return true;
  } catch {
    res.status(401).json({ error: "Unauthorised" });
    return false;
  }
}
