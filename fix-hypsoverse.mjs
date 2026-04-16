import fs from "fs";
import path from "path";
const root = "src";
function patchFile(file, fn) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) { console.log("SKIP: " + file); return; }
  let src = fs.readFileSync(full, "utf8");
  const next = fn(src);
  if (next === src) { console.log("SKIP (no changes): " + file); return; }
  fs.writeFileSync(full, next, "utf8");
  console.log("PATCHED: " + file);
}
patchFile("pages/Gallery.tsx", (src) => {
  src = src.replace(/import\s*\{\s*TeleportViewer\s*\}\s*from\s*["']\.\.\/components\/teleport["']/, 'import { HypsoverseViewer } from "../components/teleport"');
  src = src.replace(/<TeleportViewer[\s\S]*?\/>/, '<HypsoverseViewer\n          artworkTitle={label}\n        />');
  src = src.replace(/>3D Immersive<\/div>/, '>{t("teleport.immersive_3d")}</div>');
  return src;
});
patchFile("components/GalleryPanel.tsx", (src) => {
  src = src.replace(/import\s*\{\s*TeleportViewer\s*\}\s*from\s*["']\.\/teleport["']/, 'import { HypsoverseViewer } from "./teleport"');
  src = src.replace(/<TeleportViewer/g, '<HypsoverseViewer');
  src = src.replace(/<\/TeleportViewer>/g, '</HypsoverseViewer>');
  src = src.replace(/\{showVimeo\s*\?\s*["']Hide["']\s*:\s*["']Watch["']\}\s*Artist Documentary/, '{showVimeo ? t("galleryPanel.hide_doc") : t("galleryPanel.watch_doc")}');
  return src;
});
const langs = ["en","fr","de","es","it","pt-BR","ru","zh-CN","ja","ko","ar","hi"];
for (const lang of langs) {
  const file = path.join("public/locales", lang, "translation.json");
  if (!fs.existsSync(file)) continue;
  let raw = fs.readFileSync(file, "utf8");
  if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
  const obj = JSON.parse(raw);
  if (!obj.teleport) obj.teleport = {};
  obj.teleport.varjo = "Hypsoverse";
  obj.teleport.immersive_3d = "Hypsoverse 3D";
  if (!obj.hypsoverse) obj.hypsoverse = {};
  obj.hypsoverse.enter = "Enter Immersive Space";
  obj.hypsoverse.powered_by = "Powered by Hypsoverse";
  fs.writeFileSync(file, JSON.stringify(obj, null, 2), "utf8");
  console.log("UPDATED i18n: " + lang);
}
console.log("Done. Run: pnpm build");