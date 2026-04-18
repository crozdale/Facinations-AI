const fs = require('fs');
let c = fs.readFileSync('src/pages/Gallery.tsx', 'utf8');

// Add state for all three dropdowns
c = c.replace(
  'function AiPanel({ filename, allImages, onJump }: { filename: string; allImages: string[]; onJump: (f:string)=>void }) {\n  const { t } = useTranslation();',
  'function AiPanel({ filename, allImages, onJump }: { filename: string; allImages: string[]; onJump: (f:string)=>void }) {\n  const { t } = useTranslation();\n  const [open3d, setOpen3d] = React.useState(false);\n  const [openVimeo, setOpenVimeo] = React.useState(false);\n  const [openVpn, setOpenVpn] = React.useState(false);'
);

// 3D viewer toggle
c = c.replace(
  '<div style={{ fontSize: "0.58rem", color: "#d4af37", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: teleportOpen ? "0.5rem" : 0, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>{t("teleport.immersive_3d")}<span>{teleportOpen ? "?" : "?"}</span></div>\n          {teleportOpen && <HypsoverseViewer artworkTitle={label} />}',
  '<div onClick={() => setOpen3d(o => !o)} style={{ fontSize: "0.58rem", color: "#d4af37", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: open3d ? "0.5rem" : 0, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>{t("teleport.immersive_3d")}<span style={{fontSize:"0.5rem"}}>{open3d ? "?" : "?"}</span></div>\n          {open3d && <HypsoverseViewer artworkTitle={label} />}'
);

// Vimeo toggle
c = c.replace(
  '<div style={{ fontSize: "0.58rem", color: "#d4af37", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "0.5rem" }}>\n          {t("gallery.watch_on_vimeo", "Watch on Vimeo")}\n        </div>',
  '<div onClick={() => setOpenVimeo(o => !o)} style={{ fontSize: "0.58rem", color: "#d4af37", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: openVimeo ? "0.5rem" : 0, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}><span>{t("gallery.watch_on_vimeo", "Watch on Vimeo")}</span><span style={{fontSize:"0.5rem"}}>{openVimeo ? "?" : "?"}</span></div>'
);

// Wrap Vimeo link in conditional
c = c.replace(
  '<a\n          href="https://vimeo.com/musee-crosdale"',
  '{openVimeo && <a\n          href="https://vimeo.com/musee-crosdale"'
);
c = c.replace(
  '{t("gallery.watch_doc", "Watch on Vimeo")}\n        </a>\n      </div>\n\n      {/* VPN */}',
  '{t("gallery.watch_doc", "Watch on Vimeo")}\n        </a>}\n      </div>\n\n      {/* VPN */}'
);

// VPN toggle
c = c.replace(
  '<div style={{ fontSize: "0.58rem", color: "#d4af37", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "0.5rem" }}>\n          {t("gallery.private_viewing", "Private Viewing")}\n        </div>',
  '<div onClick={() => setOpenVpn(o => !o)} style={{ fontSize: "0.58rem", color: "#d4af37", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: openVpn ? "0.5rem" : 0, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}><span>{t("gallery.private_viewing", "Private Viewing")}</span><span style={{fontSize:"0.5rem"}}>{openVpn ? "?" : "?"}</span></div>'
);

// Wrap VPN content in conditional
c = c.replace(
  '<div style={{ fontSize: "0.72rem", color: "#8a8278"',
  '{openVpn && <div style={{ fontSize: "0.72rem", color: "#8a8278"'
);
c = c.replace(
  '{t("gallery.hide_doc", "Connect VPN")}\n        </a>\n      </div>',
  '{t("gallery.hide_doc", "Connect VPN")}\n        </a>}\n      </div>'
);

fs.writeFileSync('src/pages/Gallery.tsx', c, 'utf8');
console.log('done');
