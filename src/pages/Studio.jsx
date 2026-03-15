import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import MintButton from "../components/MintButton";
import MistralWidget from "../components/MistralWidget";

const IMAGES = [
  "Alchemist-of-Light.jpg","Ancient-Citadel.jpg","Andromeda-Rising.jpg",
  "Annunciation-Study.jpg","Archangel-Michael.jpg","Aria-of-the-Abyss.jpg",
  "Astral-Cartographer.jpg","Azure-Sentinel.jpg","Battle-of-Agincourt.jpg",
  "Birth-of-Venus-Study.jpg","Blue-Harmony.jpg","Byzantine-Madonna.jpg",
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Cinzel:wght@400;600;700&family=Cinzel+Decorative:wght@400&display=swap');
  .studio-root { background:#080808; min-height:100vh; font-family:'Cormorant Garamond',Georgia,serif; color:#e8e0d0; }
  .studio-hero { text-align:center; padding:5rem 2rem 3rem; position:relative; border-bottom:1px solid rgba(212,175,55,0.08); }
  .studio-hero::before { content:''; position:absolute; inset:0; background:radial-gradient(ellipse 70% 60% at 50% 0%,rgba(212,175,55,0.05) 0%,transparent 70%); pointer-events:none; }
  .studio-eyebrow { font-family:'Cinzel',serif; font-size:0.6rem; letter-spacing:0.35em; text-transform:uppercase; color:#d4af37; margin-bottom:1rem; }
  .studio-title { font-family:'Cinzel',serif; font-size:clamp(1.8rem,4vw,3rem); font-weight:400; color:#f0e8d0; letter-spacing:0.1em; margin:0 0 1rem; }
  .studio-desc { font-size:1.1rem; color:#9a9288; max-width:560px; margin:0 auto; line-height:1.8; font-style:italic; }
  .studio-div { width:60px; height:1px; background:linear-gradient(to right,transparent,#d4af37,transparent); margin:1.5rem auto 0; }
  .plans-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:1px; background:rgba(212,175,55,0.08); max-width:1000px; margin:4rem auto 0; border:1px solid rgba(212,175,55,0.08); }
  .plan-card { background:#080808; padding:2.5rem 2rem; transition:background 0.3s; }
  .plan-card:hover { background:rgba(212,175,55,0.03); }
  .plan-card.featured { background:rgba(212,175,55,0.04); border-top:2px solid #d4af37; }
  .plan-badge { font-family:'Cinzel',serif; font-size:0.5rem; letter-spacing:0.3em; text-transform:uppercase; color:#d4af37; margin-bottom:0.75rem; }
  .plan-name { font-family:'Cinzel',serif; font-size:1rem; color:#f0e8d0; letter-spacing:0.1em; margin-bottom:0.6rem; }
  .plan-desc { font-size:0.88rem; color:#7a7268; line-height:1.7; margin-bottom:1.5rem; }
  .plan-features { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:0.5rem; }
  .plan-features li { font-size:0.88rem; color:#9a9288; line-height:1.6; padding-left:1rem; position:relative; }
  .plan-features li::before { content:'◆'; position:absolute; left:0; font-size:0.4rem; color:rgba(212,175,55,0.4); top:0.35em; }
  .mint-section { max-width:820px; margin:4rem auto 0; padding:0 1rem 5rem; }
  .mint-section-title { font-family:'Cinzel',serif; font-size:1rem; color:#d4af37; letter-spacing:0.15em; text-align:center; margin-bottom:2rem; }
  .mint-flow { display:grid; grid-template-columns:1fr 1fr; gap:2rem; align-items:start; }
  .artwork-picker { display:grid; grid-template-columns:repeat(3,1fr); gap:4px; max-height:340px; overflow-y:auto; }
  .artwork-thumb { aspect-ratio:1; object-fit:cover; cursor:pointer; border:2px solid transparent; transition:all 0.2s; filter:brightness(0.7); }
  .artwork-thumb:hover { filter:brightness(1); border-color:rgba(212,175,55,0.4); }
  .artwork-thumb.selected { border-color:#d4af37; filter:brightness(1); box-shadow:0 0 20px rgba(212,175,55,0.2); }
  .mint-form { display:flex; flex-direction:column; gap:1rem; }
  .mint-preview { width:100%; aspect-ratio:1; object-fit:cover; border:1px solid rgba(212,175,55,0.2); margin-bottom:0.5rem; }
  .mint-preview-empty { width:100%; aspect-ratio:1; background:#0c0c0c; border:1px solid rgba(212,175,55,0.1); display:flex; align-items:center; justify-content:center; color:#2a2a2a; font-family:'Cinzel',serif; font-size:0.6rem; letter-spacing:0.2em; margin-bottom:0.5rem; }
  .mint-input { background:#0c0c0c; border:1px solid rgba(212,175,55,0.15); color:#e8e0d0; padding:0.65rem 0.85rem; font-family:'Cormorant Garamond',serif; font-size:0.95rem; width:100%; box-sizing:border-box; transition:border-color 0.2s; }
  .mint-input:focus { outline:none; border-color:rgba(212,175,55,0.4); }
  .mint-input::placeholder { color:#333; }
  .mint-label { font-family:'Cinzel',serif; font-size:0.52rem; letter-spacing:0.2em; color:rgba(212,175,55,0.5); text-transform:uppercase; margin-bottom:0.25rem; display:block; }
  .studio-disclaimer { text-align:center; font-size:0.72rem; color:#2a2a2a; font-family:'Cinzel',serif; letter-spacing:0.1em; max-width:640px; margin:2rem auto 0; padding:0 2rem 3rem; }
  @media (max-width:640px) { .mint-flow { grid-template-columns:1fr; } }
`;

export default function Studio() {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const metadata = selected ? {
    name: name || selected.replace(/-/g," ").replace(".jpg",""),
    description: description || "A work from the Facinations collection.",
    image: `${window.location.origin}/images/${selected}`,
    attributes: [{ trait_type: "Collection", value: "Facinations" }],
  } : null;

  const plans = [
    { name: t("studio.starter"), desc: t("studio.starter_desc"), features: [t("studio.starter_f1"),t("studio.starter_f2"),t("studio.starter_f3"),t("studio.starter_f4")] },
    { name: t("studio.gallery_plan"), desc: t("studio.gallery_desc"), features: [t("studio.gallery_f1"),t("studio.gallery_f2"),t("studio.gallery_f3"),t("studio.gallery_f4")], featured:true, badge:t("studio.recommended") },
    { name: t("studio.institutional"), desc: t("studio.institutional_desc"), features: [t("studio.institutional_f1"),t("studio.institutional_f2"),t("studio.institutional_f3")] },
  ];

  return (
    <main className="studio-root">
      <style>{css}</style>
      <div className="studio-hero">
        <div className="studio-eyebrow">{t("studio.title")}</div>
        <h1 className="studio-title">{t("studio.subtitle")}</h1>
        <p className="studio-desc">{t("studio.desc")}</p>
        <div className="studio-div" />
      </div>
      <div style={{ padding:"0 1rem" }}>
        <div className="plans-grid">
          {plans.map(plan => (
            <div key={plan.name} className={`plan-card${plan.featured?" featured":""}`}>
              {plan.badge && <div className="plan-badge">{plan.badge}</div>}
              <div className="plan-name">{plan.name}</div>
              <div className="plan-desc">{plan.desc}</div>
              <ul className="plan-features">{plan.features.map((f,i) => <li key={i}>{f}</li>)}</ul>
            </div>
          ))}
        </div>
        <div className="mint-section">
          <div className="mint-section-title">✦ Mint an Artwork to Chain</div>
          <div className="mint-flow">
            <div>
              <div className="mint-label" style={{marginBottom:"0.5rem"}}>Select Artwork</div>
              <div className="artwork-picker">
                {IMAGES.map(img => (
                  <img key={img} src={`/images/${img}`} alt={img}
                    className={`artwork-thumb${selected===img?" selected":""}`}
                    onClick={() => { setSelected(img); setName(img.replace(/-/g," ").replace(".jpg","")); }}
                  />
                ))}
              </div>
            </div>
            <div className="mint-form">
              {selected
                ? <img src={`/images/${selected}`} alt={selected} className="mint-preview" />
                : <div className="mint-preview-empty">Select an artwork</div>
              }
              <div>
                <label className="mint-label">Artwork Name</label>
                <input className="mint-input" value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Alchemist of Light" />
              </div>
              <div>
                <label className="mint-label">Description</label>
                <textarea className="mint-input" rows={3} value={description} onChange={e=>setDescription(e.target.value)} placeholder="Describe this work..." style={{resize:"vertical"}} />
              </div>
              <MintButton metadata={metadata} disabled={!selected} />
            </div>
          </div>
        </div>
        <p className="studio-disclaimer">{t("studio.disclaimer")}</p>
      </div>
      <MistralWidget context="studio" />
    </main>
  );
}
