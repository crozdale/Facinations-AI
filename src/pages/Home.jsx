// src/pages/Home.jsx
import React, { useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import xCoinLogo from "../assets/x-coin-logo.png";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Cinzel:wght@400;600;700&family=Cinzel+Decorative:wght@400&display=swap');

  .home-root { background:#080808; min-height:100vh; display:flex; flex-direction:column; align-items:center; font-family:'Cormorant Garamond',Georgia,serif; overflow-x:hidden; position:relative; }
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

  .home-video-wrap { position:relative; width:700px; max-width:95%; margin-bottom:3rem; opacity:0; animation:fadeUp 1.2s ease 0.7s forwards; }
  .home-video { width:100%; border-radius:2px; border:1px solid rgba(212,175,55,0.2); box-shadow:0 30px 80px rgba(0,0,0,0.95); display:block; }
  .video-corner { position:absolute; width:16px; height:16px; border-color:rgba(212,175,55,0.4); border-style:solid; }
  .video-corner.tl { top:-4px; left:-4px; border-width:1px 0 0 1px; }
  .video-corner.tr { top:-4px; right:-4px; border-width:1px 1px 0 0; }
  .video-corner.bl { bottom:-4px; left:-4px; border-width:0 0 1px 1px; }
  .video-corner.br { bottom:-4px; right:-4px; border-width:0 1px 1px 0; }

  .home-cta { opacity:0; animation:fadeUp 1s ease 1.1s forwards; }
  .cta-primary { font-family:'Cinzel',serif; font-size:0.72rem; letter-spacing:0.25em; text-transform:uppercase; padding:1rem 3rem; background:rgba(212,175,55,0.1); border:1px solid #d4af37; color:#d4af37; cursor:pointer; transition:all 0.3s; display:inline-block; }
  .cta-primary:hover { box-shadow:0 0 40px rgba(212,175,55,0.18); background:rgba(212,175,55,0.18); }

  .home-subtitle { color:#9a9288; font-family:'Cormorant Garamond',serif; font-style:italic; font-size:clamp(1rem,2vw,1.2rem); text-align:center; max-width:580px; line-height:1.85; margin-top:2.5rem; padding:0 1rem; opacity:0; animation:fadeUp 1s ease 1.3s forwards; }

  .home-nav { display:flex; gap:0.5rem; flex-wrap:wrap; justify-content:center; margin-top:3rem; opacity:0; animation:fadeUp 1s ease 1.5s forwards; }
  .nav-pill { font-family:'Cinzel',serif; font-size:0.55rem; letter-spacing:0.2em; text-transform:uppercase; padding:0.45rem 1.1rem; background:none; border:1px solid rgba(212,175,55,0.18); color:#888; cursor:pointer; transition:all 0.25s; text-decoration:none; }
  .nav-pill:hover { border-color:rgba(212,175,55,0.5); color:#d4af37; background:rgba(212,175,55,0.05); }

  @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeDown { from{opacity:0;transform:translateY(-12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
`;

export default function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

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
          src="/facinations-gold.png"
          alt="Facinations"
          className="home-banner"
        />

        <div className="home-eyebrow">
          Decentralised Fine-Art Protocol · Ethereum
        </div>
        <div className="home-div" />

        <div className="home-video-wrap">
          <div className="video-corner tl" />
          <div className="video-corner tr" />
          <div className="video-corner bl" />
          <div className="video-corner br" />
          <video
            ref={videoRef}
            playsInline
            autoPlay
            muted
            loop
            className="home-video"
          >
            <source src="/hero.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="home-cta">
          <a
            onClick={() => navigate("/gallery")}
            className="cta-primary"
            style={{ cursor: "pointer" }}
          >
            ✦ Enter Gallery
          </a>
        </div>

        <p className="home-subtitle">{t("hero.subtitle")}</p>

        <nav className="home-nav">
          {[
            ["About", "/about"],
            ["Studio", "/studio"],
            ["Vaults", "/vaults"],
            ["Collection", "/collection"],
            ["Collection Exchange", "/exchange"],
            ["Whitepaper", "/whitepaper"],
          ].map(([label, path]) => (
            <a
              key={label}
              onClick={() => navigate(path)}
              className="nav-pill"
              style={{ cursor: "pointer" }}
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </main>
  );
}
