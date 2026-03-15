import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Cinzel:wght@400;600;700&family=Cinzel+Decorative:wght@400&display=swap');

  .about-root {
    background: #080808;
    color: #e8e0d0;
    min-height: 100vh;
    font-family: 'Cormorant Garamond', Georgia, serif;
    overflow-x: hidden;
  }

  /* -- HERO -- */
  .hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 6rem 2rem 4rem;
    overflow: hidden;
  }

  .hero-bg {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 80% 60% at 50% 40%, rgba(212,175,55,0.06) 0%, transparent 70%),
      radial-gradient(ellipse 40% 40% at 20% 80%, rgba(212,175,55,0.04) 0%, transparent 60%),
      radial-gradient(ellipse 50% 30% at 80% 20%, rgba(180,140,40,0.03) 0%, transparent 60%);
    pointer-events: none;
  }

  .hero-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(212,175,55,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(212,175,55,0.03) 1px, transparent 1px);
    background-size: 80px 80px;
    pointer-events: none;
    mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black, transparent);
  }

  .hero-eyebrow {
    font-family: 'Cinzel', serif;
    font-size: 0.65rem;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: #d4af37;
    margin-bottom: 2rem;
    opacity: 0;
    animation: fadeUp 0.8s ease 0.2s forwards;
  }

  .hero-title {
    font-family: 'Cinzel Decorative', serif;
    font-size: clamp(3rem, 8vw, 7rem);
    font-weight: 400;
    letter-spacing: 0.08em;
    line-height: 1.05;
    color: #f0e8d0;
    margin: 0 0 0.15em;
    opacity: 0;
    animation: fadeUp 1s ease 0.4s forwards;
  }

  .hero-title-accent {
    display: block;
    color: #d4af37;
    font-size: 0.55em;
    letter-spacing: 0.2em;
    font-family: 'Cinzel', serif;
    font-weight: 400;
    margin-top: 0.4em;
  }

  .hero-divider {
    width: 1px;
    height: 80px;
    background: linear-gradient(to bottom, transparent, #d4af37, transparent);
    margin: 2rem auto;
    opacity: 0;
    animation: fadeIn 1s ease 0.8s forwards;
  }

  .hero-lead {
    max-width: 680px;
    font-size: clamp(1.15rem, 2.2vw, 1.45rem);
    line-height: 1.75;
    color: #c8bfaf;
    font-weight: 300;
    font-style: italic;
    opacity: 0;
    animation: fadeUp 1s ease 1s forwards;
  }

  .hero-lead strong {
    color: #d4af37;
    font-style: normal;
    font-weight: 400;
  }

  .hero-cta-row {
    display: flex;
    gap: 1rem;
    margin-top: 3rem;
    flex-wrap: wrap;
    justify-content: center;
    opacity: 0;
    animation: fadeUp 1s ease 1.2s forwards;
  }

  .btn-primary {
    font-family: 'Cinzel', serif;
    font-size: 0.68rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    padding: 0.85rem 2.2rem;
    background: rgba(212,175,55,0.12);
    border: 1px solid #d4af37;
    color: #d4af37;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-block;
  }
  .btn-primary:hover {
    background: rgba(212,175,55,0.22);
    box-shadow: 0 0 30px rgba(212,175,55,0.15);
  }

  .btn-ghost {
    font-family: 'Cinzel', serif;
    font-size: 0.68rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    padding: 0.85rem 2.2rem;
    background: none;
    border: 1px solid rgba(212,175,55,0.3);
    color: #888;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-block;
  }
  .btn-ghost:hover { border-color: #d4af37; color: #d4af37; }

  /* -- SCROLL HINT -- */
  .scroll-hint {
    position: absolute;
    bottom: 2.5rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    opacity: 0;
    animation: fadeIn 1s ease 2s forwards;
  }
  .scroll-hint span {
    font-family: 'Cinzel', serif;
    font-size: 0.5rem;
    letter-spacing: 0.3em;
    color: #333;
    text-transform: uppercase;
  }
  .scroll-line {
    width: 1px;
    height: 40px;
    background: linear-gradient(to bottom, #d4af37, transparent);
    animation: scrollPulse 2s ease-in-out infinite;
  }

  /* -- SECTION SHARED -- */
  .section {
    padding: 7rem 2rem;
    max-width: 1100px;
    margin: 0 auto;
  }

  .section-label {
    font-family: 'Cinzel', serif;
    font-size: 0.6rem;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: #d4af37;
    margin-bottom: 1.2rem;
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  .section-label::before {
    content: '';
    display: block;
    width: 30px;
    height: 1px;
    background: #d4af37;
    flex-shrink: 0;
  }

  .section-title {
    font-family: 'Cinzel', serif;
    font-size: clamp(1.6rem, 3.5vw, 2.6rem);
    font-weight: 400;
    color: #f0e8d0;
    line-height: 1.2;
    margin: 0 0 2rem;
    letter-spacing: 0.05em;
  }

  .section-body {
    font-size: 1.05rem;
    line-height: 1.9;
    color: #9a9080;
    font-weight: 300;
    max-width: 680px;
  }

  /* -- PROBLEMS -- */
  .problems-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1px;
    background: rgba(212,175,55,0.08);
    margin-top: 4rem;
    border: 1px solid rgba(212,175,55,0.08);
  }

  .problem-card {
    background: #080808;
    padding: 2.5rem 2rem;
    position: relative;
    transition: background 0.3s;
  }
  .problem-card:hover { background: rgba(212,175,55,0.03); }
  .problem-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 2px; height: 0;
    background: #d4af37;
    transition: height 0.4s ease;
  }
  .problem-card:hover::before { height: 100%; }

  .problem-number {
    font-family: 'Cinzel', serif;
    font-size: 0.55rem;
    letter-spacing: 0.3em;
    color: rgba(212,175,55,0.4);
    margin-bottom: 1rem;
  }

  .problem-title {
    font-family: 'Cinzel', serif;
    font-size: 0.9rem;
    color: #d4af37;
    letter-spacing: 0.1em;
    margin-bottom: 0.8rem;
  }

  .problem-body {
    font-size: 0.9rem;
    line-height: 1.75;
    color: #8a8278;
  }

  /* -- ARCHITECTURE -- */
  .arch-section {
    background: #060606;
    border-top: 1px solid rgba(212,175,55,0.07);
    border-bottom: 1px solid rgba(212,175,55,0.07);
    padding: 7rem 2rem;
  }

  .arch-inner {
    max-width: 1100px;
    margin: 0 auto;
  }

  .arch-pillars {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 2px;
    margin-top: 4rem;
    background: rgba(212,175,55,0.06);
  }

  .pillar {
    background: #060606;
    padding: 2.5rem 1.8rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    transition: background 0.3s;
  }
  .pillar:hover { background: rgba(212,175,55,0.04); }

  .pillar-icon {
    font-size: 1.4rem;
    margin-bottom: 0.3rem;
  }

  .pillar-name {
    font-family: 'Cinzel', serif;
    font-size: 0.72rem;
    letter-spacing: 0.15em;
    color: #d4af37;
    text-transform: uppercase;
  }

  .pillar-tag {
    font-family: 'Cinzel', serif;
    font-size: 0.5rem;
    letter-spacing: 0.2em;
    color: rgba(212,175,55,0.35);
    border: 1px solid rgba(212,175,55,0.15);
    padding: 0.2rem 0.5rem;
    display: inline-block;
    width: fit-content;
  }

  .pillar-desc {
    font-size: 0.88rem;
    line-height: 1.7;
    color: #7a7268;
  }

  /* -- TOKEN ECONOMICS -- */
  .token-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1px;
    background: rgba(212,175,55,0.07);
    margin-top: 3rem;
    border: 1px solid rgba(212,175,55,0.07);
  }

  @media (max-width: 600px) { .token-row { grid-template-columns: 1fr; } }

  .token-card {
    background: #080808;
    padding: 2.5rem 2rem;
  }

  .token-symbol {
    font-family: 'Cinzel Decorative', serif;
    font-size: 2.2rem;
    color: #d4af37;
    letter-spacing: 0.1em;
    line-height: 1;
    margin-bottom: 0.3rem;
  }

  .token-type {
    font-family: 'Cinzel', serif;
    font-size: 0.55rem;
    letter-spacing: 0.25em;
    color: rgba(212,175,55,0.4);
    text-transform: uppercase;
    margin-bottom: 1.2rem;
  }

  .token-desc {
    font-size: 0.92rem;
    line-height: 1.75;
    color: #8a8278;
  }

  .fee-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 1px solid rgba(212,175,55,0.08);
    flex-wrap: wrap;
    gap: 2rem;
  }

  .fee-item { text-align: center; }

  .fee-pct {
    font-family: 'Cinzel Decorative', serif;
    font-size: 2.5rem;
    color: #d4af37;
    line-height: 1;
  }

  .fee-label {
    font-family: 'Cinzel', serif;
    font-size: 0.55rem;
    letter-spacing: 0.2em;
    color: #444;
    text-transform: uppercase;
    margin-top: 0.4rem;
  }

  /* -- ROADMAP -- */
  .roadmap {
    position: relative;
    margin-top: 4rem;
  }

  .roadmap::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 1px;
    background: linear-gradient(to bottom, transparent, rgba(212,175,55,0.3), transparent);
  }

  .phase {
    padding: 0 0 3rem 2.5rem;
    position: relative;
  }

  .phase::before {
    content: '';
    position: absolute;
    left: -4px; top: 0.5rem;
    width: 8px; height: 8px;
    border: 1px solid #d4af37;
    background: #080808;
    transform: rotate(45deg);
  }

  .phase.active::before { background: #d4af37; }

  .phase-label {
    font-family: 'Cinzel', serif;
    font-size: 0.55rem;
    letter-spacing: 0.25em;
    color: rgba(212,175,55,0.5);
    text-transform: uppercase;
    margin-bottom: 0.4rem;
  }

  .phase-title {
    font-family: 'Cinzel', serif;
    font-size: 0.95rem;
    color: #d4af37;
    letter-spacing: 0.1em;
    margin-bottom: 0.6rem;
  }

  .phase-desc {
    font-size: 0.88rem;
    line-height: 1.7;
    color: #7a7268;
    max-width: 560px;
  }

  /* -- CLOSING CTA -- */
  .closing {
    text-align: center;
    padding: 8rem 2rem;
    position: relative;
    overflow: hidden;
  }

  .closing-bg {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse 60% 60% at 50% 50%, rgba(212,175,55,0.05) 0%, transparent 70%);
    pointer-events: none;
  }

  .closing-title {
    font-family: 'Cinzel', serif;
    font-size: clamp(1.4rem, 3vw, 2.2rem);
    color: #f0e8d0;
    letter-spacing: 0.08em;
    margin-bottom: 1.5rem;
    font-weight: 400;
  }

  .closing-body {
    font-size: 1.05rem;
    line-height: 1.85;
    color: #8a8278;
    max-width: 560px;
    margin: 0 auto 3rem;
    font-style: italic;
  }

  .contract-tag {
    display: inline-block;
    font-family: 'Cinzel', serif;
    font-size: 0.55rem;
    letter-spacing: 0.2em;
    color: rgba(212,175,55,0.4);
    border: 1px solid rgba(212,175,55,0.12);
    padding: 0.4rem 1rem;
    margin-top: 2rem;
  }

  /* -- GOLD DIVIDER -- */
  .gold-div {
    width: 60px;
    height: 1px;
    background: linear-gradient(to right, transparent, #d4af37, transparent);
    margin: 2rem auto;
  }

  /* -- ANIMATIONS -- */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes scrollPulse {
    0%, 100% { opacity: 0.4; transform: scaleY(1); }
    50%       { opacity: 1;   transform: scaleY(1.2); }
  }

  .reveal {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.8s ease, transform 0.8s ease;
  }
  .reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
      }),
      { threshold: 0.12 }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export default function About() {
  useReveal();

  return (
    <div className="about-root">
      <style>{css}</style>

      {/* -- HERO -- */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grid" />

        <div className="hero-eyebrow">Decentralised Fine-Art Protocol &middot; Built on Ethereum</div>

        <h1 className="hero-title">
          Fa&ccedil;inations
          <span className="hero-title-accent">Where Culture Meets the Chain</span>
        </h1>

        <div className="hero-divider" />

        <p className="hero-lead">
          A sovereign layer for fine art on the open web &mdash; combining{" "}
          <strong>on-chain provenance</strong>, <strong>fractional ownership</strong>,
          and <strong>geospatial intelligence</strong> to make the{" "}
          USD 65-billion art market transparent, liquid, and accessible.
        </p>

        <div className="hero-cta-row">
          <a href="/gallery" className="btn-primary">Enter the Gallery</a>
          <a href="https://xdale.io" target="_blank" rel="noreferrer" className="btn-ghost">Read the Whitepaper</a>
        </div>

        <div className="scroll-hint">
          <div className="scroll-line" />
          <span>Explore</span>
        </div>
      </section>

      {/* -- PROBLEM -- */}
      <section className="section">
        <div className="section-label reveal">The Problem</div>
        <h2 className="section-title reveal">An opaque market, ripe for reinvention</h2>
        <p className="section-body reveal">
          The global fine-art market exceeds USD 65 billion annually, yet it remains characterised
          by information asymmetry, opaque provenance chains, illiquidity, and restricted access.
          Fa&ccedil;inations was built to change that.
        </p>

        <div className="problems-grid reveal">
          {[
            { n: "01", t: "Opacity", b: "Provenance chains are fragmented, unverifiable, and controlled by intermediaries. Buyers cannot trust what they cannot see." },
            { n: "02", t: "Illiquidity", b: "High-value works are indivisible by nature. No standardised mechanism exists for fractional participation by retail investors." },
            { n: "03", t: "No Geography", b: "Existing blockchain art solutions capture digital metadata but ignore the physical world. Cultural geography is a material determinant of value." },
          ].map(p => (
            <div className="problem-card" key={p.n}>
              <div className="problem-number">{p.n}</div>
              <div className="problem-title">{p.t}</div>
              <div className="problem-body">{p.b}</div>
            </div>
          ))}
        </div>
      </section>

      {/* -- ARCHITECTURE -- */}
      <div className="arch-section">
        <div className="arch-inner">
          <div className="section-label reveal">Protocol Architecture</div>
          <h2 className="section-title reveal">Four pillars. One sovereign layer.</h2>
          <p className="section-body reveal">
            Every component of the Fa&ccedil;inations protocol is designed to be open, composable,
            and built for long-term institutional adoption.
          </p>

          <div className="arch-pillars reveal">
            {[
              { icon: "\u25C6", name: "On-Chain Provenance", tag: "ERC-721 \u00B7 IPFS", desc: "Every artwork minted as an ERC-721 token carrying artist identity, creation coordinates, exhibition history, legal-pack hash, and appraiser signatures." },
              { icon: "\u25C8", name: "Fractional Vaults", tag: "ERC-1155 \u00B7 FAC Shares", desc: "NFTs locked into FractionalVault contracts issue ERC-1155 share tokens. Holders receive rental income, resale proceeds, and governance weight." },
              { icon: "\u25C9", name: "Swapp AMM", tag: "Bonding Curve \u00B7 Chainlink", desc: "FAC vault shares trade on Swapp, a bonding-curve AMM seeded by a Chainlink oracle ingesting auction-house data to establish a fair-value floor." },
              { icon: "\u25CE", name: "CivMap Oracle", tag: "Geospatial \u00B7 GeoHash", desc: "Geospatial provenance encoded on-chain. Each NFT carries a geoHash from its physical origin, powering a live civilisation heat-map in the Gallery UI." },
            ].map(p => (
              <div className="pillar" key={p.name}>
                <div className="pillar-icon" style={{ color: "#d4af37" }}>{p.icon}</div>
                <div className="pillar-name">{p.name}</div>
                <div className="pillar-tag">{p.tag}</div>
                <div className="pillar-desc">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* -- TOKEN ECONOMICS -- */}
      <section className="section">
        <div className="section-label reveal">Token Economics</div>
        <h2 className="section-title reveal">Two tokens. Aligned incentives.</h2>

        <div className="token-row reveal">
          <div className="token-card">
            <div className="token-symbol">XER</div>
            <div className="token-type">Utility &amp; Access Token</div>
            <div className="token-desc">
              The protocol utility token. Holding XER above the XERPremiumGate threshold
              unlocks institutional features: bulk vault creation, priority minting, and
              reduced Swapp fees. Supply is non-inflationary post-launch.
            </div>
          </div>
          <div className="token-card">
            <div className="token-symbol">FAC</div>
            <div className="token-type">Vault Share Token</div>
            <div className="token-desc">
              Per-vault ERC-1155 units with fixed supply. FAC holders vote on vault governance:
              reserve price, exhibition licensing, and insurance. Ownership made legible, liquid, and democratic.
            </div>
          </div>
        </div>

        <div className="fee-row reveal">
          {[
            { pct: "0.5%", label: "Primary Mint" },
            { pct: "1.0%", label: "Vault Creation" },
            { pct: "0.3%", label: "Swapp Trades" },
          ].map(f => (
            <div className="fee-item" key={f.label}>
              <div className="fee-pct">{f.pct}</div>
              <div className="fee-label">{f.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* -- ROADMAP -- */}
      <div className="arch-section">
        <div className="arch-inner">
          <div className="section-label reveal">Roadmap</div>
          <h2 className="section-title reveal">The path to mainnet and beyond</h2>

          <div className="roadmap reveal">
            {[
              { phase: "Phase 1 \u00B7 Current", title: "Testnet", desc: "ERC-721 minting live on Sepolia. Role-based access operational. Gallery, Studio, Vault, and Swap UI deployed. Localisation across 9 languages.", active: true },
              { phase: "Phase 2", title: "Mainnet Launch", desc: "Deploy to Ethereum mainnet. Launch Swapp AMM with Chainlink integration. Deploy The Graph subgraph. Activate XERPremiumGate.", active: false },
              { phase: "Phase 3", title: "CivMap & DAO", desc: "Activate geospatial provenance encoding. Deploy CivMap oracle and Gallery heat-map. Launch DAO with XER-weighted voting.", active: false },
              { phase: "Phase 4", title: "Cross-chain & Custody", desc: "Bridge FAC shares to Polygon and Base. Partner with regulated custodians. Explore L2 deployment for high-volume minting.", active: false },
            ].map(p => (
              <div className={`phase${p.active ? " active" : ""}`} key={p.title}>
                <div className="phase-label">{p.phase}</div>
                <div className="phase-title">{p.title}</div>
                <div className="phase-desc">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* -- CLOSING CTA -- */}
      <section className="closing">
        <div className="closing-bg" />
        <div className="gold-div" />
        <h2 className="closing-title reveal">
          An open invitation to galleries, institutions, and collectors
        </h2>
        <p className="closing-body reveal">
          Fa&ccedil;inations is open, composable, and designed for long-term institutional adoption.
          Partners, galleries, and developers are invited to engage with the testnet
          ahead of mainnet launch.
        </p>
        <div className="hero-cta-row reveal" style={{ justifyContent: "center" }}>
          <a href="https://xdale.io" target="_blank" rel="noreferrer" className="btn-primary">Visit xdale.io</a>
          <a href="/gallery" className="btn-ghost">Enter the Gallery</a>
        </div>
        <div className="reveal">
          <div className="contract-tag">
            Fa&ccedil;inations NFT &middot; 0x33d1de58274E55B391D8D105A8a9B469AA50157f &middot; Ethereum Sepolia
          </div>
        </div>
      </section>
    </div>
  );
}
