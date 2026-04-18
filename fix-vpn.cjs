const fs = require('fs');
let c = fs.readFileSync('src/pages/Gallery.tsx', 'utf8');

// Fix the VPN section - wrap both the text div AND the anchor in the conditional
c = c.replace(
  '{openVpn && <div style={{ fontSize: "0.72rem", color: "#8a8278"',
  '{openVpn && <><div style={{ fontSize: "0.72rem", color: "#8a8278"'
);
c = c.replace(
  '{t("gallery.hide_doc", "Connect VPN")}\n        </a>}\n      </div>',
  '{t("gallery.hide_doc", "Connect VPN")}\n        </a></>\n      }\n      </div>'
);

fs.writeFileSync('src/pages/Gallery.tsx', c, 'utf8');
console.log('done');
