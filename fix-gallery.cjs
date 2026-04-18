const fs = require('fs');
let c = fs.readFileSync('src/pages/Gallery.tsx', 'utf8');
c = c.replace('overflow: "hidden", fontFamily: "\'Cormorant Garamond\'', 'overflowY: "auto", fontFamily: "\'Cormorant Garamond\'');
fs.writeFileSync('src/pages/Gallery.tsx', c, 'utf8');
console.log('done');
