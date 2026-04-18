const fs = require('fs');
const p = 'src/pages/Gallery.tsx';
let src = fs.readFileSync(p, 'utf8');
const TARGET = '      {/* Curator analysis */}';
if (!src.includes(TARGET)) { console.log('ERROR: target not found'); process.exit(1); }
const VIMEO =
'      {/* Vimeo */}\n' +
'      <div style={{ padding: "0.75rem", borderBottom: "1px solid rgba(212,175,55,0.07)", flexShrink: 0 }}>\n' +
'        <div style={{ fontSize: "0.58rem", color: "#d4af37", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "0.5rem" }}>\n' +
'          {t("gallery.watch_on_vimeo", "Watch on Vimeo")}\n' +
'        </div>\n' +
'        <a\n' +
'          href="https://vimeo.com/musee-crosdale"\n' +
'          target="_blank"\n' +
'          rel="noopener noreferrer"\n' +
'          style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.45rem 0.75rem", borderRadius: "4px", background: "rgba(26,183,234,0.08)", border: "1px solid rgba(26,183,234,0.35)", color: "#1ab7ea", textDecoration: "none", fontFamily: "\'Cinzel\',serif", fontSize: "0.62rem", letterSpacing: "0.1em" }}\n' +
'        >\n' +
'          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881L5.322 12.5C4.603 9.913 3.834 8.619 3.01 8.619c-.179 0-.806.378-1.881 1.132L0 8.332c1.185-1.044 2.351-2.084 3.501-3.128C5.08 3.732 6.266 2.989 7.055 2.917c1.867-.18 3.016 1.1 3.447 3.838.465 2.953.789 4.789.971 5.507.539 2.45 1.131 3.674 1.776 3.674.502 0 1.256-.796 2.265-2.385 1.004-1.589 1.54-2.797 1.612-3.628.144-1.371-.395-2.061-1.612-2.061-.574 0-1.167.121-1.777.391 1.186-3.868 3.434-5.757 6.762-5.637 2.473.06 3.628 1.664 3.478 4.799z"/></svg>\n' +
'          {t("gallery.watch_doc", "Watch on Vimeo")}\n' +
'        </a>\n' +
'      </div>\n\n' +
'      {/* VPN */}\n' +
'      <div style={{ padding: "0.75rem", borderBottom: "1px solid rgba(212,175,55,0.07)", flexShrink: 0 }}>\n' +
'        <div style={{ fontSize: "0.58rem", color: "#d4af37", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "0.5rem" }}>\n' +
'          {t("gallery.private_viewing", "Private Viewing")}\n' +
'        </div>\n' +
'        <div style={{ fontSize: "0.72rem", color: "#8a8278", fontFamily: "\'Cormorant Garamond\',serif", fontStyle: "italic", lineHeight: 1.5, marginBottom: "0.5rem" }}>\n' +
'          {t("gallery.vpn_notice", "For collector privacy, connect via a trusted VPN.")}\n' +
'        </div>\n' +
'        <a\n' +
'          href="https://protonvpn.com"\n' +
'          target="_blank"\n' +
'          rel="noopener noreferrer"\n' +
'          style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.4rem 0.75rem", borderRadius: "4px", background: "rgba(109,74,255,0.1)", border: "1px solid rgba(109,74,255,0.35)", color: "#9d80ff", textDecoration: "none", fontFamily: "\'Cinzel\',serif", fontSize: "0.6rem", letterSpacing: "0.1em" }}\n' +
'        >\n' +
'          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>\n' +
'          {t("gallery.hide_doc", "Connect VPN")}\n' +
'        </a>\n' +
'      </div>\n\n';
src = src.replace(TARGET, VIMEO + TARGET);
fs.writeFileSync(p, src, 'utf8');
console.log('Done');
