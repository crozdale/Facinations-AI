/**
 * src/styles/tokens.ts
 *
 * Single source of truth for design tokens used in inline styles.
 * Mirrors the CSS custom properties defined in index.css so that
 * components using style={{}} props stay in sync with the token system.
 *
 * Usage:
 *   import { t } from "../styles/tokens";
 *   <div style={{ color: t.gold, background: t.bg }} />
 */

export const tk = {
  // ── Backgrounds ──────────────────────────────────────────────────
  bg:          "#080808",
  card:        "#0a0a0a",
  cardSurface: "#050505",

  // ── Foregrounds ──────────────────────────────────────────────────
  fg:          "#e8e0d0",
  fgMuted:     "#9a9288",
  fgDim:       "#6a6258",
  fgInverse:   "#050505",

  // ── Gold (primary accent) ─────────────────────────────────────────
  gold:        "#d4af37",

  // ── Borders (gold-tinted at various opacities) ────────────────────
  border:       "rgba(212,175,55,0.25)",
  borderFaint:  "rgba(212,175,55,0.08)",
  borderMid:    "rgba(212,175,55,0.15)",
  borderStrong: "rgba(212,175,55,0.4)",

  // ── Semantic tints ────────────────────────────────────────────────
  goldTint03:  "rgba(212,175,55,0.03)",
  goldTint05:  "rgba(212,175,55,0.05)",
  goldTint10:  "rgba(212,175,55,0.1)",

  // ── Risk / status ─────────────────────────────────────────────────
  riskLow:    "#5cb85c",
  riskMedium: "#d4af37",
  riskHigh:   "#e00055",

  // ── Typography ───────────────────────────────────────────────────
  fontDisplay: "'Cinzel', serif",
  fontBody:    "'Cormorant Garamond', Georgia, serif",

  // ── Motion ───────────────────────────────────────────────────────
  ease:        "cubic-bezier(0.4, 0, 0.2, 1)",
} as const;

/** @deprecated use `tk` */
export const t = tk;
export type Tokens = typeof tk;
