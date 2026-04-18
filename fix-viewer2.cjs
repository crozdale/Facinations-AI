const fs = require('fs');
let c = fs.readFileSync('src/pages/Gallery.tsx', 'utf8');
c = c.replace('aspectRatio: "16/9"', 'aspectRatio: "21/9"');
c = c.replace('width: "52px", height: "52px"', 'width: "36px", height: "36px"');
c = c.replace('gap: "10px", padding: "16px"', 'gap: "6px", padding: "8px"');
fs.writeFileSync('src/pages/Gallery.tsx', c, 'utf8');
console.log('done');
