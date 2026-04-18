const fs = require('fs');
let c = fs.readFileSync('src/pages/Gallery.tsx', 'utf8');

const header = `      <header style={{ textAlign: "center", padding: "4rem 2rem 3rem", position: "relative", borderBottom: "1px solid rgba(212,175,55,0.08)" }}>`;
const videoBlock = `      <div style={{ padding: "2rem" }}>
        <div style={{ margin: "1.5rem -2rem 0", position: "relative", width: "calc(100% + 4rem)", height: "480px", overflow: "hidden", background: "#000" }}>
          <VideoHero />
        </div>`;
const videoBlockReplacement = `      <div style={{ padding: "2rem" }}>`;

// Move video above header by restructuring
c = c.replace(
  `      <header style={{ textAlign: "center", padding: "4rem 2rem 3rem"`,
  `      <div style={{ position: "relative", width: "100%", height: "480px", overflow: "hidden", background: "#000" }}><VideoHero /></div>\n      <header style={{ textAlign: "center", padding: "4rem 2rem 3rem"`
);

// Remove the old video block
c = c.replace(
  `        <div style={{ margin: "1.5rem -2rem 0", position: "relative", width: "calc(100% + 4rem)", height: "480px", overflow: "hidden", background: "#000" }}>
          <VideoHero />
        </div>\n\n`,
  ``
);

fs.writeFileSync('src/pages/Gallery.tsx', c, 'utf8');
console.log('done');
