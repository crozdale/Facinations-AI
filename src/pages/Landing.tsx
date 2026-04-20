// src/pages/Landing.tsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Montserrat:wght@300;400;500&display=swap');

  .fac-root {
    --ink:        #1a1814;
    --ink-mid:    #4a4640;
    --ink-muted:  #8a8680;
    --ink-faint:  #c8c4be;
    --paper:      #faf8f4;
    --paper-warm: #f3f0ea;
    --gold:       #b8975a;
    --gold-lt:    #d4b47a;
    --rule:       rgba(26,24,20,0.12);
    --serif:      'EB Garamond', Georgia, serif;
    --display:    'Cormorant Garamond', Georgia, serif;
    --sans:       'Montserrat', sans-serif;
    background: var(--paper);
    color: var(--ink);
    font-family: var(--serif);
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
    transition: background 0.3s ease, color 0.3s ease;
  }
  .fac-root.fac-dark {
    --ink:        #f2ece0;
    --ink-mid:    #c8bfb0;
    --ink-muted:  #8a8278;
    --ink-faint:  #3a3830;
    --paper:      #18160f;
    --paper-warm: #1e1c14;
    --gold:       #d4af37;
    --gold-lt:    #b8975a;
    --rule:       rgba(242,236,224,0.08);
  }

  .fac-root:not(.fac-dark) .fac-nav { background: rgba(250,248,244,0.92); }
  .fac-root.fac-dark       .fac-nav { background: rgba(18,16,10,0.92); }

  .fac-nav {
    position:fixed; top:0; left:0; right:0; z-index:200;
    display:flex; align-items:center; justify-content:space-between;
    padding:1.5rem 4rem;
    backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px);
    border-bottom:0.5px solid var(--rule);
    transition:background 0.3s;
  }
  .fac-logo { font-family:var(--display); font-size:22px; font-weight:300; letter-spacing:0.12em; color:var(--ink); text-transform:uppercase; text-decoration:none; }
  .fac-logo span { color:var(--gold); }
  .fac-nav-links { display:flex; gap:2.5rem; list-style:none; margin:0; padding:0; }
  .fac-nav-links a { font-family:var(--sans); font-size:10px; font-weight:400; letter-spacing:0.16em; text-transform:uppercase; color:var(--ink-muted); text-decoration:none; transition:color 0.2s; cursor:pointer; }
  .fac-nav-links a:hover { color:var(--ink); }
  .fac-nav-right { display:flex; align-items:center; gap:1rem; }

  .fac-toggle { display:flex; align-items:center; gap:7px; background:none; border:none; cursor:pointer; padding:0; }
  .fac-toggle-label { font-family:var(--sans); font-size:9px; letter-spacing:0.14em; text-transform:uppercase; color:var(--ink-muted); }
  .fac-toggle-track { width:32px; height:18px; border-radius:9px; background:var(--ink-faint); border:0.5px solid var(--rule); position:relative; transition:background 0.25s, border-color 0.25s; flex-shrink:0; }
  .fac-dark .fac-toggle-track { background:rgba(212,175,55,0.18); border-color:rgba(212,175,55,0.3); }
  .fac-toggle-thumb { position:absolute; top:2px; left:2px; width:13px; height:13px; border-radius:50%; background:var(--ink-muted); transition:transform 0.25s, background 0.25s; }
  .fac-dark .fac-toggle-thumb { transform:translateX(14px); background:var(--gold); }

  .fac-nav-cta { font-family:var(--sans); font-size:10px; font-weight:500; letter-spacing:0.14em; text-transform:uppercase; color:var(--ink); border:0.5px solid var(--ink-faint); padding:10px 20px; background:transparent; cursor:pointer; transition:border-color 0.2s, background 0.2s, color 0.2s; }
  .fac-nav-cta:hover { border-color:var(--ink); background:var(--ink); color:var(--paper); }

  .fac-hero { min-height:100vh; display:grid; grid-template-columns:1fr 1fr; padding-top:80px; }
  .fac-hero-left { padding:8rem 4rem 6rem; display:flex; flex-direction:column; justify-content:center; border-right:0.5px solid var(--rule); }
  .fac-eyebrow { font-family:var(--sans); font-size:10px; font-weight:400; letter-spacing:0.2em; text-transform:uppercase; color:var(--gold); margin-bottom:2.5rem; opacity:0; transform:translateY(12px); animation:facFadeUp 0.7s ease forwards 0.2s; }
  .fac-headline { font-family:var(--display); font-size:clamp(44px,4.5vw,64px); font-weight:300; line-height:1.08; color:var(--ink); margin-bottom:2.5rem; opacity:0; transform:translateY(16px); animation:facFadeUp 0.8s ease forwards 0.35s; }
  .fac-headline em { font-style:italic; color:var(--ink-mid); }
  .fac-rule { width:40px; height:0.5px; background:var(--gold); margin-bottom:2rem; opacity:0; animation:facFadeIn 0.6s ease forwards 0.55s; }
  .fac-subhead { font-size:17px; line-height:1.9; color:var(--ink-mid); max-width:440px; margin-bottom:3rem; opacity:0; transform:translateY(12px); animation:facFadeUp 0.8s ease forwards 0.65s; }
  .fac-hero-ctas { display:flex; align-items:center; gap:2rem; opacity:0; animation:facFadeIn 0.6s ease forwards 0.85s; }
  .fac-btn-primary { font-family:var(--sans); font-size:10px; font-weight:500; letter-spacing:0.16em; text-transform:uppercase; color:var(--paper); background:var(--ink); border:none; padding:16px 32px; cursor:pointer; transition:background 0.2s, transform 0.15s; }
  .fac-btn-primary:hover { background:var(--ink-mid); transform:translateY(-1px); }
  .fac-btn-ghost { font-family:var(--sans); font-size:10px; font-weight:400; letter-spacing:0.14em; text-transform:uppercase; color:var(--ink-muted); background:transparent; border:none; cursor:pointer; text-decoration:underline; text-underline-offset:5px; text-decoration-color:var(--ink-faint); transition:color 0.2s; }
  .fac-btn-ghost:hover { color:var(--ink); }

  .fac-hero-right { position:relative; background:var(--paper-warm); display:flex; flex-direction:column; justify-content:flex-end; padding:4rem; overflow:hidden; transition:background 0.3s; }
  .fac-ornament { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:340px; height:340px; border:0.5px solid var(--rule); border-radius:50%; opacity:0; animation:facFadeIn 1.2s ease forwards 0.9s; }
  .fac-ornament::before { content:''; position:absolute; inset:24px; border:0.5px solid var(--rule); border-radius:50%; }
  .fac-ornament::after { content:''; position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:12px; height:12px; border:0.5px solid var(--gold); border-radius:50%; }
  .fac-hero-stats { display:flex; flex-direction:column; gap:1.5rem; opacity:0; transform:translateY(12px); animation:facFadeUp 0.8s ease forwards 1s; position:relative; z-index:1; }
  .fac-hero-stat { display:flex; align-items:baseline; gap:1rem; padding-bottom:1.5rem; border-bottom:0.5px solid var(--rule); }
  .fac-hero-stat:last-child { border-bottom:none; padding-bottom:0; }
  .fac-stat-val { font-family:var(--display); font-size:38px; font-weight:300; color:var(--ink); line-height:1; min-width:80px; }
  .fac-stat-label { font-family:var(--sans); font-size:10px; font-weight:400; letter-spacing:0.12em; text-transform:uppercase; color:var(--ink-muted); line-height:1.6; }

  .fac-trust-bar { border-top:0.5px solid var(--rule); border-bottom:0.5px solid var(--rule); display:flex; overflow:hidden; }
  .fac-trust-item { flex:1; padding:1.25rem 2rem; font-family:var(--sans); font-size:9px; font-weight:400; letter-spacing:0.18em; text-transform:uppercase; color:var(--ink-muted); border-right:0.5px solid var(--rule); text-align:center; }
  .fac-trust-item:last-child { border-right:none; }

  .fac-section { padding:7rem 4rem; border-bottom:0.5px solid var(--rule); opacity:0; transform:translateY(24px); transition:opacity 0.7s ease, transform 0.7s ease, background 0.3s; }
  .fac-section.fac-visible { opacity:1; transform:none; }
  .fac-section-inner { max-width:1100px; margin:0 auto; }
  .fac-section-label { font-family:var(--sans); font-size:9px; font-weight:500; letter-spacing:0.2em; text-transform:uppercase; color:var(--gold); margin-bottom:2rem; }
  .fac-section-title { font-family:var(--display); font-size:clamp(32px,3.2vw,46px); font-weight:300; line-height:1.18; color:var(--ink); max-width:560px; margin-bottom:1.25rem; }
  .fac-section-title em { font-style:italic; color:var(--ink-mid); }
  .fac-section-sub { font-size:16px; line-height:1.85; color:var(--ink-mid); max-width:520px; margin-bottom:4rem; }

  .fac-steps { display:flex; flex-direction:column; }
  .fac-step { display:grid; grid-template-columns:72px 1fr; gap:0 2.5rem; padding:2.5rem 0; border-top:0.5px solid var(--rule); }
  .fac-step:last-child { border-bottom:0.5px solid var(--rule); }
  .fac-step-num { font-family:var(--display); font-size:13px; font-weight:300; letter-spacing:0.1em; color:var(--ink-faint); padding-top:4px; }
  .fac-step-title { font-family:var(--serif); font-size:18px; font-weight:500; color:var(--ink); margin-bottom:0.6rem; line-height:1.4; }
  .fac-step-desc { font-size:15px; line-height:1.8; color:var(--ink-mid); }
  .fac-step-tag { display:inline-block; margin-top:0.85rem; font-family:var(--sans); font-size:9px; letter-spacing:0.14em; text-transform:uppercase; color:var(--gold); border:0.5px solid var(--gold-lt); padding:4px 10px; }

  .fac-callout { margin-top:4rem; padding:3rem 3.5rem; background:var(--paper-warm); border:0.5px solid var(--rule); display:grid; grid-template-columns:1fr 1fr 1fr; gap:3rem; position:relative; transition:background 0.3s; }
  .fac-callout::before { content:'Typical facility terms'; position:absolute; top:-8px; left:3.5rem; background:var(--paper-warm); padding:0 8px; font-family:var(--sans); font-size:9px; letter-spacing:0.18em; text-transform:uppercase; color:var(--ink-muted); }
  .fac-callout-val { font-family:var(--display); font-size:40px; font-weight:300; color:var(--ink); line-height:1; margin-bottom:0.5rem; }
  .fac-callout-desc { font-family:var(--sans); font-size:10px; font-weight:400; letter-spacing:0.08em; color:var(--ink-muted); line-height:1.65; text-transform:uppercase; }

  .fac-why-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:0; }
  .fac-why-item { padding:2.5rem 2.5rem 2.5rem 0; border-top:0.5px solid var(--rule); border-right:0.5px solid var(--rule); }
  .fac-why-item:nth-child(3n) { border-right:none; padding-right:0; }
  .fac-why-item-inner { padding-left:2.5rem; }
  .fac-why-roman { font-family:var(--display); font-size:13px; font-weight:300; letter-spacing:0.1em; color:var(--gold); margin-bottom:1.25rem; }
  .fac-why-title { font-family:var(--serif); font-size:17px; font-weight:500; color:var(--ink); margin-bottom:0.75rem; line-height:1.45; }
  .fac-why-desc { font-size:14px; line-height:1.8; color:var(--ink-mid); }

  .fac-closing { padding:7rem 4rem; display:flex; align-items:center; justify-content:space-between; gap:3rem; flex-wrap:wrap; background:var(--ink); transition:background 0.3s; }
  .fac-closing-text { font-family:var(--display); font-size:clamp(26px,2.8vw,38px); font-weight:300; color:var(--paper); line-height:1.3; max-width:460px; }
  .fac-closing-text em { font-style:italic; color:var(--gold-lt); }
  .fac-btn-light { font-family:var(--sans); font-size:10px; font-weight:500; letter-spacing:0.16em; text-transform:uppercase; color:var(--ink); background:var(--paper); border:none; padding:18px 36px; cursor:pointer; white-space:nowrap; flex-shrink:0; transition:background 0.2s, transform 0.15s; }
  .fac-btn-light:hover { background:var(--paper-warm); transform:translateY(-1px); }

  .fac-footer { padding:2rem 4rem; border-top:0.5px solid rgba(250,248,244,0.08); background:var(--ink); display:flex; align-items:center; justify-content:space-between; transition:background 0.3s; }
  .fac-footer-logo { font-family:var(--display); font-size:16px; font-weight:300; letter-spacing:0.14em; text-transform:uppercase; color:rgba(250,248,244,0.4); }
  .fac-footer-note { font-family:var(--sans); font-size:9px; letter-spacing:0.1em; color:rgba(250,248,244,0.3); text-transform:uppercase; }

  @keyframes facFadeUp { to { opacity:1; transform:translateY(0); } }
  @keyframes facFadeIn { to { opacity:1; } }

  @media (max-width:900px) {
    .fac-nav { padding:1.25rem 2rem; }
    .fac-nav-links { display:none; }
    .fac-hero { grid-template-columns:1fr; min-height:auto; }
    .fac-hero-left { padding:6rem 2rem 3rem; border-right:none; }
    .fac-hero-right { display:none; }
    .fac-trust-bar { flex-wrap:wrap; }
    .fac-trust-item { flex:0 0 50%; border-bottom:0.5px solid var(--rule); }
    .fac-section { padding:4rem 2rem; }
    .fac-why-grid { grid-template-columns:1fr 1fr; }
    .fac-why-item:nth-child(3n) { border-right:0.5px solid var(--rule); }
    .fac-why-item:nth-child(2n) { border-right:none; padding-right:0; }
    .fac-callout { grid-template-columns:1fr; gap:2rem; }
    .fac-closing { padding:4rem 2rem; flex-direction:column; align-items:flex-start; }
    .fac-footer { padding:1.5rem 2rem; }
  }
`;

export default function Landing() {
  const navigate = useNavigate();
  const sectionsRef = useRef<HTMLDivElement>(null);
  const [dark, setDark] = useState<boolean>(() => {
    try { return localStorage.getItem("fac-theme") === "dark"; } catch { return false; }
  });

  const toggleTheme = () =>
    setDark((d) => {
      const next = !d;
      try { localStorage.setItem("fac-theme", next ? "dark" : "light"); } catch {}
      return next;
    });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("fac-visible"); }),
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );
    const root = sectionsRef.current;
    if (!root) return;
    root.querySelectorAll(".fac-section").forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const why = [
    { r:"I",   title:"You never relinquish ownership",     desc:"Title remains yours throughout the facility term. There are no scenarios — default or otherwise — in which works are liquidated without your explicit instruction." },
    { r:"II",  title:"Appraisals you can trust",           desc:"We use the same independent appraisal firms retained by the major auction houses — not in-house valuations designed to minimise LTV." },
    { r:"III", title:"No auction pressure, ever",          desc:"We have no commercial interest in your works reaching the secondary market. Our revenue comes from the facility, not from commissions on a sale." },
    { r:"IV",  title:"Custody at institutional standards", desc:"Temperature, humidity, and security protocols meet the requirements of major museum loans — the same standard your works deserve when they leave your walls." },
    { r:"V",   title:"Flexibility, not covenants",         desc:"Draw what you need, when you need it. Repay early without penalty. Add qualifying works to increase your facility limit without renegotiating." },
    { r:"VI",  title:"Complete discretion",                desc:"Your collection, facility terms, and identity are never disclosed. We do not publish client lists, case studies, or transaction details — in any form." },
  ];

  return (
    <div className={`fac-root${dark ? " fac-dark" : ""}`} ref={sectionsRef}>
      <style>{css}</style>

      {/* NAV */}
      <nav className="fac-nav">
        <a href="/" className="fac-logo">Facin<span>·</span>ations</a>
        <ul className="fac-nav-links">
          <li><a onClick={() => scrollTo("how-it-works")}>How it works</a></li>
          <li><a onClick={() => scrollTo("why")}>Why Facinations</a></li>
          <li><a onClick={() => scrollTo("contact")}>Contact</a></li>
          <li><a onClick={() => navigate("/home")}>Museum</a></li>
        </ul>
        <div className="fac-nav-right">
          <button className="fac-toggle" onClick={toggleTheme} aria-label="Toggle light/dark mode">
            <span className="fac-toggle-label">{dark ? "Light" : "Dark"}</span>
            <span className="fac-toggle-track">
              <span className="fac-toggle-thumb" />
            </span>
          </button>
          <button className="fac-nav-cta" onClick={() => scrollTo("contact")}>
            Request consultation
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="fac-hero">
        <div className="fac-hero-left">
          <p className="fac-eyebrow">Private Client — Art Finance</p>
          <h1 className="fac-headline">
            Your collection<br />should work as hard<br />as you <em>did to build it.</em>
          </h1>
          <div className="fac-rule" />
          <p className="fac-subhead">
            For collectors of museum-quality works, Facinations provides discreet credit
            facilities secured against your physical holdings — so capital remains available
            without the permanence of a sale.
          </p>
          <div className="fac-hero-ctas">
            <button className="fac-btn-primary" onClick={() => scrollTo("contact")}>
              Request a private consultation
            </button>
            <button className="fac-btn-ghost" onClick={() => scrollTo("how-it-works")}>
              How it works
            </button>
          </div>
        </div>
        <div className="fac-hero-right">
          <div className="fac-ornament" />
          <div className="fac-hero-stats">
            {[
              { val:"50–65%",    label:"Loan-to-value\nagainst appraised works" },
              { val:"$2M+",      label:"Minimum collection\nvalue to qualify" },
              { val:"Revolving", label:"Draw and repay\non your schedule" },
            ].map((s) => (
              <div className="fac-hero-stat" key={s.val}>
                <div className="fac-stat-val">{s.val}</div>
                <div className="fac-stat-label">
                  {s.label.split("\n").map((l, i) => (
                    <React.Fragment key={i}>{l}{i === 0 && <br />}</React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className="fac-trust-bar">
        {["Blue-chip works only","Institutional vault custody","No forced liquidation","Complete discretion"].map((t) => (
          <div className="fac-trust-item" key={t}>{t}</div>
        ))}
      </div>

      {/* HOW IT WORKS */}
      <section className="fac-section" id="how-it-works">
        <div className="fac-section-inner">
          <p className="fac-section-label">How it works</p>
          <h2 className="fac-section-title">Your vault becomes a credit line.<br /><em>Your art stays yours.</em></h2>
          <p className="fac-section-sub">
            The process is designed for collectors who expect discretion at every step — from
            initial appraisal through to drawdown.
          </p>
          <div className="fac-steps">
            {[
              { n:"01", title:"Submit your collection for appraisal",                      desc:"Share provenance documentation and condition reports. Our appraisal partners — the same firms retained by Sotheby's and Christie's — establish fair market values for each qualifying work.",                                                                              tag:"Confidential" },
              { n:"02", title:"Works transfer to institutional-grade vault custody",       desc:"Qualifying pieces are transferred to a climate-controlled, fully insured facility. You retain title. Works are held as collateral — never sold, never made available to third parties.",                                                                               tag:"Climate-controlled vault" },
              { n:"03", title:"Access a revolving credit facility at your discretion",     desc:"Draw down against your collection's appraised value — typically 50–65% LTV — as your liquidity needs arise. Repay on your own terms. No fixed monthly obligations, no covenant triggers.",                                                                             tag:"Revolving facility" },
              { n:"04", title:"Reclaim your works upon repayment",                         desc:"Settle the outstanding balance and your collection is returned fully intact, with a complete custodial record. Rotate works in and out of the facility as your collection evolves.",                                                                                    tag:"Full restitution" },
            ].map((s) => (
              <div className="fac-step" key={s.n}>
                <div className="fac-step-num">{s.n}</div>
                <div>
                  <p className="fac-step-title">{s.title}</p>
                  <p className="fac-step-desc">{s.desc}</p>
                  <span className="fac-step-tag">{s.tag}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="fac-callout">
            <div><p className="fac-callout-val">50–65%</p><p className="fac-callout-desc">Loan-to-value against appraised market value</p></div>
            <div><p className="fac-callout-val">$2M+</p><p className="fac-callout-desc">Minimum collection value for qualification</p></div>
            <div><p className="fac-callout-val">Revolving</p><p className="fac-callout-desc">Draw and repay on your schedule, no fixed term</p></div>
          </div>
        </div>
      </section>

      {/* WHY FACINATIONS */}
      <section className="fac-section" id="why">
        <div className="fac-section-inner">
          <p className="fac-section-label">Why Facinations</p>
          <h2 className="fac-section-title">Built for the collector,<br /><em>not the bank.</em></h2>
          <p className="fac-section-sub">
            Most liquidity solutions treat art as a distressed asset. We treat it as what it
            is — a considered, irreplaceable holding that deserves better.
          </p>
          <div className="fac-why-grid">
            {why.map((w, i) => (
              <div className="fac-why-item" key={w.r}>
                <div className={i % 3 !== 0 ? "fac-why-item-inner" : ""}>
                  <p className="fac-why-roman">{w.r}</p>
                  <p className="fac-why-title">{w.title}</p>
                  <p className="fac-why-desc">{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING */}
      <div className="fac-closing" id="contact">
        <p className="fac-closing-text">
          Ready to unlock what your collection is <em>already worth?</em>
        </p>
        <button className="fac-btn-light" onClick={() => navigate("/home")}>
          Enter Musée-Crosdale
        </button>
      </div>

      <footer className="fac-footer">
        <div className="fac-footer-logo">Facinations</div>
        <div className="fac-footer-note">Private Client — Art Finance — New York</div>
      </footer>
    </div>
  );
}
