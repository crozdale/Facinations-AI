// wire-hypsoverse-vimeo.mjs
// Run with: node wire-hypsoverse-vimeo.mjs
// from C:\Users\crozd\musee-crosdale

import fs from "fs";
import path from "path";

const root = "src";

function patch(file, replacements) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) { console.log(`SKIP (not found): ${file}`); return; }
  let src = fs.readFileSync(full, "utf8");
  const original = src;
  for (const [from, to] of replacements) {
    src = src.split(from).join(to);
  }
  if (src === original) { console.log(`SKIP (no changes): ${file}`); return; }
  fs.writeFileSync(full, src, "utf8");
  console.log(`PATCHED: ${file}`);
}

// ── 1. Rename TeleportViewer → HypsoverseViewer ──────────────────────────────
const oldPath = path.join(root, "components/teleport/TeleportViewer.tsx");
const newPath = path.join(root, "components/teleport/HypsoverseViewer.tsx");
if (fs.existsSync(oldPath)) {
  fs.renameSync(oldPath, newPath);
  console.log("RENAMED: TeleportViewer.tsx → HypsoverseViewer.tsx");
}

// ── 2. Write the new HypsoverseViewer component ───────────────────────────────
fs.writeFileSync(newPath, `import React from "react";
import { useTranslation } from "react-i18next";

interface HypsoverseViewerProps {
  sceneId?: string;
  splatCount?: string;
  artworkTitle?: string;
}

const IMMERSIVE_URL = "https://xervault.com/gallery";
const GALLERY_URL   = "https://xdale.net/Musee-crosdale/gallery";

export function HypsoverseViewer({ splatCount, artworkTitle }: HypsoverseViewerProps) {
  const { t } = useTranslation();

  return (
    <div style={{ borderRadius: "10px", border: "1px solid #1D9E75", overflow: "hidden", background: "#04342C" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "7px", padding: "8px 12px", borderBottom: "1px solid #0F6E56" }}>
        <div style={{ width: "16px", height: "16px", borderRadius: "3px", background: "#1D9E75", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#9FE1CB" }} />
        </div>
        <span style={{ fontSize: "12px", fontWeight: 500, color: "#9FE1CB", fontFamily: "'Cinzel',serif", letterSpacing: "0.06em" }}>
          Hypsoverse
        </span>
        {splatCount && (
          <span style={{ marginLeft: "auto", fontSize: "10px", padding: "2px 6px", borderRadius: "999px", background: "#0F6E56", color: "#9FE1CB" }}>
            {splatCount} {t("teleport.splats")}
          </span>
        )}
      </div>

      {/* Preview */}
      <div style={{ aspectRatio: "16/9", display: "flex", alignItems: "center", justifyContent: "center", background: "#030f0a" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", padding: "16px", textAlign: "center" }}>
          <div style={{ width: "52px", height: "52px", borderRadius: "50%", border: "1.5px solid #5DCAA5", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 0, height: 0, borderTop: "9px solid transparent", borderBottom: "9px solid transparent", borderLeft: "16px solid #9FE1CB", marginLeft: "4px" }} />
          </div>
          {artworkTitle && (
            <span style={{ fontSize: "11px", color: "#9FE1CB", fontFamily: "'Cinzel',serif", letterSpacing: "0.08em" }}>
              {artworkTitle}
            </span>
          )}
          <span style={{ fontSize: "9px", color: "#5DCAA5", opacity: 0.6, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'Cinzel',serif" }}>
            Gaussian Splat · Immersive 3D
          </span>
        </div>
      </div>

      {/* Two action buttons */}
      <div style={{ padding: "8px 12px", borderTop: "1px solid #0F6E56", display: "flex", gap: "6px", flexWrap: "wrap" }}>

        {/* Enter immersive space → xervault.com/gallery */}
        <a
          href={IMMERSIVE_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flex: 1, textAlign: "center",
            fontSize: "10px", padding: "5px 10px", borderRadius: "6px",
            border: "1px solid #1D9E75", color: "#9FE1CB",
            background: "rgba(29,158,117,0.18)", cursor: "pointer",
            textDecoration: "none", fontFamily: "'Cinzel',serif",
            letterSpacing: "0.07em", whiteSpace: "nowrap",
          }}
        >
          {t("hypsoverse.enter")}
        </a>

        {/* View gallery → xdale.net/Musee-crosdale/gallery */}
        <a
          href={GALLERY_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flex: 1, textAlign: "center",
            fontSize: "10px", padding: "5px 10px", borderRadius: "6px",
            border: "1px solid #0F6E56", color: "#5DCAA5",
            background: "transparent", cursor: "pointer",
            textDecoration: "none", fontFamily: "'Cinzel',serif",
            letterSpacing: "0.07em", whiteSpace: "nowrap",
          }}
        >
          {t("galleryPanel.view_on_xdale")}
        </a>

      </div>

      {/* Powered by footer */}
      <div style={{ padding: "4px 12px 6px", display: "flex", justifyContent: "flex-end" }}>
        <span style={{ fontSize: "9px", color: "#1D9E75", fontFamily: "'Cinzel',serif", letterSpacing: "0.1em", opacity: 0.6 }}>
          {t("hypsoverse.powered_by")}
        </span>
      </div>

    </div>
  );
}
`, "utf8");
console.log("WRITTEN: HypsoverseViewer.tsx");

// ── 3. Update barrel export ───────────────────────────────────────────────────
const indexPath = path.join(root, "components/teleport/index.ts");
if (fs.existsSync(indexPath)) {
  let idx = fs.readFileSync(indexPath, "utf8");
  idx = idx.split("TeleportViewer").join("HypsoverseViewer");
  idx = idx.split("./TeleportViewer").join("./HypsoverseViewer");
  fs.writeFileSync(indexPath, idx, "utf8");
  console.log("PATCHED: components/teleport/index.ts");
} else {
  fs.writeFileSync(indexPath, `export { HypsoverseViewer } from "./HypsoverseViewer";\n`, "utf8");
  console.log("CREATED: components/teleport/index.ts");
}

// ── 4. Update Gallery.tsx (lightbox AiPanel) ──────────────────────────────────
patch("pages/Gallery.tsx", [
  [
    `import { TeleportViewer } from "../components/teleport";`,
    `import { HypsoverseViewer } from "../components/teleport";`,
  ],
  [
    `<TeleportViewer
          sceneId={\`scene_\${filename.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 20)}\`}
          artworkTitle={label}
        />`,
    `<HypsoverseViewer
          artworkTitle={label}
        />`,
  ],
  [`>3D Immersive</div>`, `>{t("teleport.immersive_3d")}</div>`],
]);

// ── 5. Update GalleryPanel.tsx ────────────────────────────────────────────────
patch("components/GalleryPanel.tsx", [
  [`import { TeleportViewer } from "./teleport";`, `import { HypsoverseViewer } from "./teleport";`],
  [`<TeleportViewer`, `<HypsoverseViewer`],
  [`</TeleportViewer>`, `</HypsoverseViewer>`],
  [`{showVimeo ? "Hide" : "Watch"} Artist Documentary`,
   `{showVimeo ? t("galleryPanel.hide_doc") : t("galleryPanel.watch_doc")}`],
]);

// ── 6. Update Architecture.tsx ───────────────────────────────────────────────
patch("pages/Architecture.tsx", [
  [`"Flow 4: Teleport"`, `"Flow 4: Hypsoverse"`],
]);

// ── 7. Patch all 12 i18n files ────────────────────────────────────────────────
const langs = ["en","fr","de","es","it","pt-BR","ru","zh-CN","ja","ko","ar","hi"];
const langIdx = { en:0, fr:1, de:2, es:3, it:4, "pt-BR":5, ru:6, "zh-CN":7, ja:8, ko:9, ar:10, hi:11 };

const hypsoverseKeys = {
  enter: [
    "Enter Immersive Space",
    "Entrer dans l'espace immersif",
    "Immersiven Raum betreten",
    "Entrar en espacio inmersivo",
    "Entra nello spazio immersivo",
    "Entrar no espaço imersivo",
    "Войти в иммерсивное пространство",
    "进入沉浸式空间",
    "イマーシブ空間に入る",
    "몰입형 공간 입장",
    "دخول الفضاء الغامر",
    "इमर्सिव स्पेस में प्रवेश करें",
  ],
  powered_by: [
    "Powered by Hypsoverse",
    "Propulsé par Hypsoverse",
    "Unterstützt von Hypsoverse",
    "Desarrollado por Hypsoverse",
    "Powered by Hypsoverse",
    "Desenvolvido por Hypsoverse",
    "На основе Hypsoverse",
    "由 Hypsoverse 驱动",
    "Hypsoverse を使用",
    "Hypsoverse 제공",
    "مدعوم من Hypsoverse",
    "Hypsoverse द्वारा संचालित",
  ],
};

for (const lang of langs) {
  const file = path.join("public/locales", lang, "translation.json");
  if (!fs.existsSync(file)) continue;
  const obj = JSON.parse(fs.readFileSync(file, "utf8"));
  const i = langIdx[lang];

  if (!obj.teleport) obj.teleport = {};
  obj.teleport.varjo = "Hypsoverse";
  obj.teleport.immersive_3d = "Hypsoverse · 3D";

  if (!obj.hypsoverse) obj.hypsoverse = {};
  for (const [key, vals] of Object.entries(hypsoverseKeys)) {
    obj.hypsoverse[key] = vals[i];
  }

  fs.writeFileSync(file, JSON.stringify(obj, null, 2), "utf8");
  console.log(`UPDATED i18n: ${lang}`);
}

console.log("\nAll done. Run: pnpm build");
