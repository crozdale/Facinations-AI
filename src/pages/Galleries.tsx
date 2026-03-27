// src/pages/Galleries.tsx
// Directory of all active galleries on the platform.

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMeta } from "../hooks/useMeta";

interface GalleryEntry {
  slug: string;
  name: string;
  blurb: string | null;
  location: string | null;
  logo_url: string | null;
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=Cinzel:wght@400;600&display=swap');
  .gl-root { background:#1c1c1c; min-height:100vh; color:#f2ece0; }
  .gl-header { padding:4rem 2rem 3rem; max-width:1100px; margin:0 auto; }
  .gl-eyebrow { font-family:'Cinzel',serif; font-size:0.52rem; letter-spacing:0.4em; text-transform:uppercase; color:#d4af37; margin:0 0 0.75rem; }
  .gl-title { font-family:'Cinzel',serif; font-size:clamp(1.8rem,4vw,2.8rem); font-weight:400; color:#f8f2e4; letter-spacing:0.06em; margin:0 0 0.75rem; }
  .gl-subtitle { font-family:'Cormorant Garamond',serif; font-size:1rem; color:#8a8278; line-height:1.8; font-style:italic; max-width:520px; margin:0; }
  .gl-divider { height:1px; background:linear-gradient(to right,transparent,rgba(212,175,55,0.2),transparent); margin:0 2rem; }
  .gl-grid { max-width:1100px; margin:0 auto; padding:3rem 2rem 6rem; display:grid; grid-template-columns:repeat(auto-fill,minmax(300px,1fr)); gap:1.5rem; }
  .gl-card { border:1px solid rgba(212,175,55,0.1); background:#202020; padding:1.75rem; display:flex; flex-direction:column; gap:1rem; text-decoration:none; transition:border-color .2s; }
  .gl-card:hover { border-color:rgba(212,175,55,0.3); }
  .gl-card-logo { width:48px; height:48px; border:1px solid rgba(212,175,55,0.15); background:#242424; display:flex; align-items:center; justify-content:center; font-family:'Cinzel',serif; font-size:1.1rem; color:rgba(212,175,55,0.35); flex-shrink:0; }
  .gl-card-name { font-family:'Cinzel',serif; font-size:1rem; font-weight:400; color:#f8f2e4; letter-spacing:0.06em; margin:0; transition:color .2s; }
  .gl-card:hover .gl-card-name { color:#d4af37; }
  .gl-card-blurb { font-family:'Cormorant Garamond',serif; font-size:0.88rem; color:#8a8278; line-height:1.75; font-style:italic; margin:0; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }
  .gl-card-location { font-family:'Cinzel',serif; font-size:0.5rem; letter-spacing:0.2em; text-transform:uppercase; color:rgba(212,175,55,0.3); margin:0; }
  .gl-card-cta { font-family:'Cinzel',serif; font-size:0.55rem; letter-spacing:0.2em; text-transform:uppercase; color:#d4af37; margin-top:auto; }
`;

export default function Galleries() {
  useMeta({
    title: "Galleries — Musée-Crosdale",
    description: "Discover curated galleries on the Facinations platform — contemporary and emerging artists with on-chain provenance.",
  });

  const [galleries, setGalleries] = useState<GalleryEntry[]>([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    fetch("/api/galleries")
      .then((r) => r.json())
      .then((data) => setGalleries(data.galleries ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="gl-root">
      <style>{css}</style>

      <div className="gl-header">
        <p className="gl-eyebrow">Musée-Crosdale · Platform</p>
        <h1 className="gl-title">Galleries</h1>
        <p className="gl-subtitle">
          Partner galleries and dealers exhibiting on the Facinations platform, with verified on-chain provenance for every work.
        </p>
      </div>

      <div className="gl-divider" />

      {loading ? (
        <div style={{ textAlign:"center", padding:"4rem", fontFamily:"'Cinzel',serif", fontSize:"0.6rem", letterSpacing:"0.35em", color:"rgba(212,175,55,0.3)", textTransform:"uppercase" }}>
          Loading…
        </div>
      ) : (
        <div className="gl-grid">
          {galleries.map((g) => (
            <Link key={g.slug} to={`/gallery/${g.slug}`} className="gl-card">
              <div style={{ display:"flex", alignItems:"center", gap:"1rem" }}>
                {g.logo_url
                  ? <img src={g.logo_url} alt={g.name} style={{ width:48, height:48, objectFit:"cover", border:"1px solid rgba(212,175,55,0.15)" }} />
                  : <div className="gl-card-logo">{g.name.charAt(0)}</div>
                }
                <h2 className="gl-card-name">{g.name}</h2>
              </div>
              {g.blurb && <p className="gl-card-blurb">{g.blurb}</p>}
              {g.location && <p className="gl-card-location">{g.location}</p>}
              <span className="gl-card-cta">View Gallery →</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
