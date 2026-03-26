// src/hooks/useMeta.ts
// Lightweight <head> manager for a Vite SPA.
// Sets title, description, and Open Graph / Twitter Card meta tags on navigation.
// Resets to site defaults on unmount so tags are never stale between routes.

import { useEffect } from "react";

const SITE_NAME  = "Musée-Crosdale";
const SITE_URL   = "https://facinations.art";
const DEFAULT_IMG = "/images/Alchemist-of-Light.jpg";

const DEFAULTS = {
  title:       SITE_NAME,
  description: "A synthetic museum and intelligence console for vaulted culture, powered by the Facinations fine-art protocol.",
  image:       DEFAULT_IMG,
  type:        "website" as const,
};

export interface MetaOptions {
  title:        string;
  description:  string;
  image?:       string;  // absolute path or full URL
  type?:        "website" | "article";
  noIndex?:     boolean; // set true for admin/internal pages
}

// ── DOM helpers ───────────────────────────────────────────────────────────────
function setMeta(name: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.name = name;
    document.head.appendChild(el);
  }
  el.content = content;
}

function setProperty(property: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    document.head.appendChild(el);
  }
  el.content = content;
}

function setRobots(noIndex: boolean) {
  setMeta("robots", noIndex ? "noindex,nofollow" : "index,follow");
}

function applyMeta(opts: MetaOptions) {
  const fullTitle = opts.title === SITE_NAME
    ? SITE_NAME
    : `${opts.title} · ${SITE_NAME}`;

  const image = opts.image
    ? (opts.image.startsWith("http") ? opts.image : `${SITE_URL}${opts.image}`)
    : `${SITE_URL}${DEFAULTS.image}`;

  const url = typeof window !== "undefined" ? window.location.href : SITE_URL;

  // Standard
  document.title = fullTitle;
  setMeta("description", opts.description);

  // Open Graph
  setProperty("og:title",       fullTitle);
  setProperty("og:description", opts.description);
  setProperty("og:image",       image);
  setProperty("og:url",         url);
  setProperty("og:type",        opts.type ?? "website");
  setProperty("og:site_name",   SITE_NAME);

  // Twitter Card
  setMeta("twitter:card",        "summary_large_image");
  setMeta("twitter:title",       fullTitle);
  setMeta("twitter:description", opts.description);
  setMeta("twitter:image",       image);

  setRobots(opts.noIndex ?? false);
}

function resetToDefaults() {
  applyMeta({
    title:       SITE_NAME,
    description: DEFAULTS.description,
    image:       DEFAULTS.image,
  });
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useMeta(opts: MetaOptions) {
  useEffect(() => {
    applyMeta(opts);
    return resetToDefaults;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opts.title, opts.description, opts.image, opts.noIndex]);
}
