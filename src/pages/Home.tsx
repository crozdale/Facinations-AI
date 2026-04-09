// src/pages/Home.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import xCoinLogo from "../assets/x-coin-logo.png";
import { BRAND } from "../brand/brandAssets";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Cinzel:wght@400;600;700&family=Cinzel+Decorative:wght@400&display=swap');

  .home-root { background:#1c1c1c; min-height:100vh; display:flex; flex-direction:column; align-items:center; font-family:'Cormorant Garamond',Georgia,serif; overflow-x:hidden; position:relative; }
  .home-bg { position:fixed; inset:0; background:radial-gradient(ellipse 70% 50% at 50% 20%,rgba(212,175,55,0.05) 0%,transparent 70%); pointer-events:none; z-index:0; }
  .home-grid { position:fixed; inset:0; background-image:linear-gradient(rgba(212,175,55,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(212,175,55,0.025) 1px,transparent 1px); background-size:80px 80px; pointer-events:none; z-index:0; mask-image:radial-gradient(ellipse 80% 80% at 50% 30%,black,transparent); }

  .home-content { position:relative; z-index:1; display:flex; flex-direction:column; align-items:center; width:100%; padding:3rem 2rem 5rem; }

  .blogazine-link { display:flex; flex-direction:column; align-items:center; margin-bottom:2.5rem; text-decoration:none; opacity:0; animation:fadeDown 0.8s ease 0.1s forwards; }
  .blogazine-logo { width:72px; height:72px; object-fit:cover; border-radius:50%; mix-blend-mode:screen; border:1px solid rgba(212,175,55,0.3); box-shadow:0 0 30px rgba(212,175,55,0.12); transition:box-shadow 0.3s,transform 0.3s; }
  .blogazine-link:hover .blogazine-logo { box-shadow:0 0 50px rgba(212,175,55,0.25); transform:scale(1.05); }
  .blogazine-label { color:rgba(212,175,55,0.6); font-family:'Cinzel',serif; font-size:0.52rem; letter-spacing:0.3em; text-transform:uppercase; margin-top:0.6rem; }

  .home-banner { width:340px; max-width:82%; margin-bottom:0.5rem; opacity:0; animation:fadeUp 1s ease 0.3s forwards; filter:drop-shadow(0 0 40px rgba(212,175,55,0.2)); }
  .home-eyebrow { font-family:'Cinzel',serif; font-size:0.58rem; letter-spacing:0.35em; text-transform:uppercase; color:rgba(212,175,55,0.45); margin-bottom:2.5rem; opacity:0; animation:fadeUp 0.8s ease 0.5s forwards; }
  .home-div { width:60px; height:1px; background:linear-gradient(to right,transparent,#d4af37,transparent); margin-bottom:2.5rem; opacity:0; animation:fadeIn 1s ease 0.6s forwards; }

  /* Dionysus Section */
  .dionysus-section { width:700px; max-width:95%; margin-bottom:3.5rem; opacity:0; animation:fadeUp 1.2s ease 0.95s forwards; }
  .dionysus-header { display:flex; align-items:baseline; justify-content:space-between; margin-bottom:1rem; }
  .dionysus-eyebrow { font-family:'Cinzel',serif; font-size:0.5rem; letter-spacing:0.38em; text-transform:uppercase; color:rgba(212,175,55,0.45); }
  .dionysus-title { font-family:'Cinzel',serif; font-size:0.82rem; letter-spacing:0.18em; color:rgba(212,175,55,0.75); font-weight:400; font-style:italic; margin:0; }
  .dionysus-rule { width:100%; height:1px; background:linear-gradient(to right,rgba(212,175,55,0.25),transparent); margin-bottom:1rem; }
  .dionysus-frame { position:relative; width:100%; background:#0e0e0e; border:1px solid rgba(212,175,55,0.15); box-shadow:0 20px 60px rgba(0,0,0,0.9); }
  .dionysus-frame::before { content:''; position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,rgba(212,175,55,0.45),transparent); z-index:1; pointer-events:none; }
  .dionysus-corner { position:absolute; width:14px; height:14px; border-color:rgba(212,175,55,0.35); border-style:solid; z-index:2; }
  .dionysus-corner.tl { top:-3px; left:-3px; border-width:1px 0 0 1px; }
  .dionysus-corner.tr { top:-3px; right:-3px; border-width:1px 1px 0 0; }
  .dionysus-corner.bl { bottom:-3px; left:-3px; border-width:0 0 1px 1px; }
  .dionysus-corner.br { bottom:-3px; right:-3px; border-width:0 1px 1px 0; }
  .dionysus-video { width:100%; display:block; max-height:520px; object-fit:contain; background:#0e0e0e; }
  .dionysus-caption { display:flex; align-items:center; justify-content:space-between; margin-top:0.75rem; padding:0 0.1rem; }
  .dionysus-caption-text { font-family:'Cormorant Garamond',serif; font-size:0.82rem; color:rgba(212,175,55,0.25); font-style:italic; margin:0; letter-spacing:0.04em; }
  .dionysus-hint { font-family:'Cinzel',serif; font-size:0.44rem; letter-spacing:0.22em; color:rgba(212,175,55,0.18); text-transform:uppercase; white-space:nowrap; }

  .home-cta { opacity:0; animation:fadeUp 1s ease 1.1s forwards; }
  .cta-primary { font-family:'Cinzel',serif; font-size:0.72rem; letter-spacing:0.25em; text-transform:uppercase; padding:1rem 3rem; background:rgba(212,175,55,0.1); border:1px solid #d4af37; color:#d4af37; cursor:pointer; transition:all 0.3s; display:inline-block; }
  .cta-primary:hover { box-shadow:0 0 40px rgba(212,175,55,0.18); background:rgba(212,175,55,0.18); }

  .home-subtitle { color:#b8b0a4; font-family:'Cormorant Garamond',serif; font-style:italic; font-size:clamp(1rem,2vw,1.2rem); text-align:center; max-width:580px; line-height:1.85; margin-top:2.5rem; padding:0 1rem; opacity:0; animation:fadeUp 1s ease 1.3s forwards; }

  .home-nav { display:flex; gap:0.5rem; flex-wrap:wrap; justify-content:center; margin-top:3rem; opacity:0; animation:fadeUp 1s ease 1.5s forwards; }
  .nav-pill { font-family:'Cinzel',serif; font-size:0.55rem; letter-spacing:0.2em; text-transform:uppercase; padding:0.45rem 1.1rem; background:none; border:1px solid rgba(212,175,55,0.18); color:#888; cursor:pointer; transition:all 0.25s; text-decoration:none; }
  .nav-pill:hover { border-color:rgba(212,175,55,0.5); color:#d4af37; background:rgba(212,175,55,0.05); }

  @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeDown { from{opacity:0;transform:translateY(-12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
`;

export default function Home() {
  const { t } = useTranslation();

  return (
    <main className="home-root">
      <style>{css}</style>

      <div className="home-bg" />
      <div className="home-grid" />

      <div className="home-content">
        <a
          href="https://xdale.io"
          target="_blank"
          rel="noopener noreferrer"
          className="blogazine-link"
        >
          <img src={xCoinLogo} alt="X-Coin" className="blogazine-logo" />
          <span className="blogazine-label">
            {t("hero.blogazine", "Visit Blogazine")}
          </span>
        </a>

        <img
          src={BRAND.FACINATIONS.WORDMARK}
          alt="Facinations"
          className="home-banner"
        />

        <div className="home-eyebrow">
          {t("home.eyebrow", "Decentralised Fine-Art Protocol · Ethereum")}
        </div>
        <div className="home-div" />

        {/* Dionysus */}
        <div className="dionysus-section">
          <div className="dionysus-header">
            <span className="dionysus-eyebrow">{t("home.moving_image", "Moving Image")}</span>
            <h2 className="dionysus-title">Dionysus</h2>
          </div>
          <div className="dionysus-rule" />
          <div className="dionysus-frame">
            <div className="dionysus-corner tl" />
            <div className="dionysus-corner tr" />
            <div className="dionysus-corner bl" />
            <div className="dionysus-corner br" />
            <video
              controls
              preload="metadata"
              playsInline
              className="dionysus-video"
            >
              <source src="/Dionysus.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="dionysus-caption">
            <p className="dionysus-caption-text">{t("home.artwork_caption", "A work presented on Facinations")}</p>
            <span className="dionysus-hint">{t("home.use_controls", "Use controls to play")}</span>
          </div>
        </div>

        <div className="home-cta">
          <Link to="/gallery" className="cta-primary">
            {t("home.enter_gallery", "✦ Enter Gallery")}
          </Link>
        </div>

        <p className="home-subtitle">{t("hero.subtitle")}</p>

        <nav className="home-nav">
          {[
            [t("nav.about", "About"), "/about"],
            [t("nav.studio", "Studio"), "/studio"],
            [t("nav.vaults", "Vaults"), "/vaults"],
            [t("home.nav_collection", "Collection"), "/galleries"],
            [t("home.nav_exchange", "Collection Exchange"), "/swapp"],
            [t("home.nav_whitepaper", "Whitepaper"), "/architecture"],
          ].map(([label, path]) => (
            <Link
              key={label}
              to={path}
              className="nav-pill"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </main>
  );
}
