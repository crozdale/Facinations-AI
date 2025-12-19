/**
 * Canonical XDALE link authority
 * TEMP: xdale.io
 * FUTURE: swap back to xdalegallery.com in ONE place
 */

export const XDALE_BASE_URL = "https://xdale.io";

export function xdaleUrl(path = "/") {
  if (!path) return XDALE_BASE_URL;
  return `${XDALE_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}
