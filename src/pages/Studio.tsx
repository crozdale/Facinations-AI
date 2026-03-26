import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import MintButton from "../components/MintButton";
import MistralWidget from "../components/MistralWidget";
import StudioLessons from "../components/StudioLessons";
import SubscriptionGate from "../components/SubscriptionGate";
import { useSubscription, PLANS } from "../context/SubscriptionContext";
import { useMeta } from "../hooks/useMeta";

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
  useMeta({
    title: "Studio",
    description: "Mint artworks to chain, access AI-guided lessons, and subscribe to the Facinations Studio — built for artists and collectors.",
    image: "/images/Astral-Cartographer.jpg",
  });
  const { tier, activePlan, subscribe, cancel, startCheckout, startCryptoCheckout, startPayPalCheckout, nextBillingDate } = useSubscription();
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [cryptoLoading, setCryptoLoading]     = useState<string | null>(null);
  const [paypalLoading, setPaypalLoading]     = useState<string | null>(null);
  const [selected, setSelected] = useState(null);
  const [waitlistForm, setWaitlistForm] = useState({ email: "", practice: "", goal: "" });
  const [waitlistDone, setWaitlistDone] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [confirmCancel, setConfirmCancel] = useState(false);

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
      {/* Waitlist */}
      <div style={{ maxWidth: "820px", margin: "3rem auto 0", padding: "0 1rem" }}>
        {waitlistDone ? (
          <div style={{ border: "1px solid rgba(212,175,55,0.2)", background: "rgba(212,175,55,0.03)", padding: "3rem 2rem", textAlign: "center" }}>
            <div style={{ fontSize: "1.5rem", color: "#d4af37", marginBottom: "1rem" }}>✦</div>
            <p style={{ fontFamily: "'Cinzel', serif", fontSize: "1.2rem", color: "#f0e8d0", margin: "0 0 0.5rem" }}>{t("studio.waitlist_joined")}</p>
            <p style={{ fontStyle: "italic", color: "#6a6258", fontSize: "0.9rem", margin: 0 }}>{t("studio.waitlist_note")}</p>
          </div>
        ) : (
          <div style={{ border: "1px solid rgba(212,175,55,0.15)", padding: "2.5rem 2rem" }}>
            <div className="studio-eyebrow" style={{ marginBottom: "0.5rem" }}>{t("studio.early_access")}</div>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontWeight: 400, fontSize: "1.3rem", color: "#f0e8d0", letterSpacing: "0.08em", margin: "0 0 1.5rem" }}>
              {t("studio.waitlist_heading")}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "480px" }}>
              <div>
                <label className="mint-label">{t("studio.label_email")} *</label>
                <input
                  type="email"
                  className="mint-input"
                  value={waitlistForm.email}
                  onChange={(e) => setWaitlistForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder={t("studio.placeholder_email")}
                />
              </div>
              <div>
                <label className="mint-label">{t("studio.label_practice")}</label>
                <input
                  type="text"
                  className="mint-input"
                  value={waitlistForm.practice}
                  onChange={(e) => setWaitlistForm((f) => ({ ...f, practice: e.target.value }))}
                  placeholder={t("studio.placeholder_practice")}
                />
              </div>
              <div>
                <label className="mint-label">{t("studio.label_goals")}</label>
                <textarea
                  className="mint-input"
                  rows={3}
                  value={waitlistForm.goal}
                  onChange={(e) => setWaitlistForm((f) => ({ ...f, goal: e.target.value }))}
                  placeholder={t("studio.placeholder_goals")}
                  style={{ resize: "vertical" }}
                />
              </div>
              <button
                onClick={() => waitlistForm.email && setWaitlistDone(true)}
                disabled={!waitlistForm.email}
                style={{
                  padding: "0.75rem 2rem",
                  background: waitlistForm.email ? "#d4af37" : "#333",
                  border: "none",
                  color: waitlistForm.email ? "#050505" : "#666",
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.62rem",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  cursor: waitlistForm.email ? "pointer" : "not-allowed",
                  alignSelf: "flex-start",
                }}
              >
                {t("studio.btn_waitlist")}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* AI Lesson flows — Starter+ */}
      <div style={{ padding: "4rem 0 2rem" }}>
        <SubscriptionGate required="starter" featureName="AI-guided lessons">
          <StudioLessons />
        </SubscriptionGate>
      </div>

      <div style={{ padding:"0 1rem" }}>

        {/* Active subscription management panel */}
        {tier !== "none" && activePlan && (
          <div style={{ maxWidth: 860, margin: "0 auto 2rem", border: "1px solid rgba(92,184,92,0.2)", background: "rgba(92,184,92,0.03)", padding: "1.25rem 1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <p style={{ fontFamily: "'Cinzel', serif", fontSize: "0.55rem", letterSpacing: "0.2em", color: "#5cb85c", textTransform: "uppercase", margin: "0 0 0.3rem" }}>{t("studio.active_plan")}</p>
                <p style={{ fontFamily: "'Cinzel', serif", fontSize: "1rem", color: "#f0e8d0", letterSpacing: "0.08em", margin: "0 0 0.2rem" }}>{activePlan.label}</p>
                {activePlan.priceMonthly !== null
                  ? <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.85rem", color: "#6a6258", fontStyle: "italic", margin: 0 }}>
                      {t("studio.billing_info", { price: activePlan.priceMonthly, date: nextBillingDate })}
                    </p>
                  : <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.85rem", color: "#6a6258", fontStyle: "italic", margin: 0 }}>{t("studio.billing_annual")}</p>
                }
              </div>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                {confirmCancel ? (
                  <>
                    <span style={{ fontFamily: "'Cinzel', serif", fontSize: "0.6rem", color: "#e05", letterSpacing: "0.1em" }}>{t("studio.btn_cancel_confirm")}</span>
                    <button onClick={() => { cancel(); setConfirmCancel(false); }} style={{ padding: "0.4rem 1rem", background: "transparent", border: "1px solid #e05", color: "#e05", fontFamily: "'Cinzel', serif", fontSize: "0.55rem", letterSpacing: "0.12em", cursor: "pointer" }}>{t("studio.btn_cancel_yes")}</button>
                    <button onClick={() => setConfirmCancel(false)} style={{ padding: "0.4rem 1rem", background: "transparent", border: "1px solid #333", color: "#666", fontFamily: "'Cinzel', serif", fontSize: "0.55rem", letterSpacing: "0.12em", cursor: "pointer" }}>{t("studio.btn_cancel_keep")}</button>
                  </>
                ) : (
                  <button onClick={() => setConfirmCancel(true)} style={{ padding: "0.4rem 1rem", background: "transparent", border: "1px solid rgba(212,175,55,0.15)", color: "#4a4238", fontFamily: "'Cinzel', serif", fontSize: "0.55rem", letterSpacing: "0.12em", cursor: "pointer" }}>{t("studio.btn_cancel_sub")}</button>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="plans-grid">
          {PLANS.map(plan => {
            const isCurrent = plan.tier === tier;
            const isDowngrade = tier !== "none" && ["starter","gallery","institutional"].indexOf(plan.tier) < ["starter","gallery","institutional"].indexOf(tier);
            return (
              <div key={plan.tier} className={`plan-card${plan.tier === "gallery" ? " featured" : ""}`}>
                {isCurrent && <div className="plan-badge" style={{ color: "#5cb85c" }}>{t("studio.current_plan")}</div>}
                {!isCurrent && plan.tier === "gallery" && <div className="plan-badge">{t("studio.recommended")}</div>}
                <div className="plan-name">{plan.label}</div>
                <div style={{ fontFamily: "'Cinzel', serif", fontSize: "0.85rem", color: plan.priceMonthly !== null ? "#d4af37" : "#9a9288", letterSpacing: "0.05em", marginBottom: "0.4rem" }}>
                  {plan.priceMonthly !== null ? t("studio.price_monthly", { price: plan.priceMonthly }) : t("studio.price_contact")}
                </div>
                <div className="plan-desc">{plan.description}</div>
                <ul className="plan-features">{plan.features.map((f, i) => <li key={i}>{f}</li>)}</ul>
                {!isCurrent && (
                  plan.tier === "institutional" ? (
                    <a
                      href="mailto:studio@facinations.art"
                      style={{
                        display: "block", marginTop: "1.25rem", width: "100%", padding: "0.55rem",
                        background: "transparent", border: "1px solid rgba(212,175,55,0.3)",
                        color: "#9a9288", fontFamily: "'Cinzel', serif", fontSize: "0.55rem",
                        letterSpacing: "0.18em", textTransform: "uppercase", textDecoration: "none",
                        textAlign: "center", boxSizing: "border-box",
                      }}
                    >
                      {t("studio.price_contact")}
                    </a>
                  ) : (
                    <div style={{ marginTop: "1.25rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                      <button
                        disabled={!!checkoutLoading}
                        onClick={async () => {
                          setCheckoutLoading(plan.tier);
                          try {
                            await startCheckout(plan.tier);
                          } catch (err: any) {
                            alert(err?.message ?? "Could not start checkout. Please try again.");
                            setCheckoutLoading(null);
                          }
                        }}
                        style={{
                          width: "100%", padding: "0.55rem",
                          background: plan.tier === "gallery" ? "#d4af37" : "transparent",
                          border: plan.tier === "gallery" ? "none" : "1px solid rgba(212,175,55,0.3)",
                          color: plan.tier === "gallery" ? "#050505" : "#9a9288",
                          fontFamily: "'Cinzel', serif", fontSize: "0.55rem",
                          letterSpacing: "0.18em", textTransform: "uppercase",
                          cursor: checkoutLoading ? "not-allowed" : "pointer",
                          opacity: checkoutLoading && checkoutLoading !== plan.tier ? 0.5 : 1,
                        }}
                      >
                        {checkoutLoading === plan.tier
                          ? "Redirecting…"
                          : tier === "none" || isDowngrade
                            ? t("subscriptionGate.btn_subscribe")
                            : t("subscriptionGate.btn_upgrade")}
                      </button>
                      <button
                        disabled={!!cryptoLoading}
                        onClick={async () => {
                          setCryptoLoading(plan.tier);
                          try {
                            await startCryptoCheckout(plan.tier);
                          } catch (err: any) {
                            alert(err?.message ?? "Could not start crypto checkout. Please try again.");
                            setCryptoLoading(null);
                          }
                        }}
                        style={{
                          width: "100%", padding: "0.45rem",
                          background: "transparent",
                          border: "1px solid rgba(212,175,55,0.15)",
                          color: "#4a4238",
                          fontFamily: "'Cinzel', serif", fontSize: "0.5rem",
                          letterSpacing: "0.15em", textTransform: "uppercase",
                          cursor: cryptoLoading ? "not-allowed" : "pointer",
                          opacity: cryptoLoading && cryptoLoading !== plan.tier ? 0.5 : 1,
                        }}
                      >
                        {cryptoLoading === plan.tier ? "Redirecting…" : "Pay with Crypto"}
                      </button>
                      <button
                        disabled={!!paypalLoading}
                        onClick={async () => {
                          setPaypalLoading(plan.tier);
                          try {
                            await startPayPalCheckout(plan.tier);
                          } catch (err: any) {
                            alert(err?.message ?? "Could not start PayPal checkout. Please try again.");
                            setPaypalLoading(null);
                          }
                        }}
                        style={{
                          width: "100%", padding: "0.45rem",
                          background: "transparent",
                          border: "1px solid rgba(212,175,55,0.15)",
                          color: "#4a4238",
                          fontFamily: "'Cinzel', serif", fontSize: "0.5rem",
                          letterSpacing: "0.15em", textTransform: "uppercase",
                          cursor: paypalLoading ? "not-allowed" : "pointer",
                          opacity: paypalLoading && paypalLoading !== plan.tier ? 0.5 : 1,
                        }}
                      >
                        {paypalLoading === plan.tier ? "Redirecting…" : "Pay with PayPal"}
                      </button>
                    </div>
                  )
                )}
              </div>
            );
          })}
        </div>
        <div className="mint-section">
          <div className="mint-section-title">✦ {t("studio.mint_title")}</div>
          <SubscriptionGate required="gallery" featureName={t("studio.mint_title")}>
          <div className="mint-flow">
            <div>
              <div className="mint-label" style={{marginBottom:"0.5rem"}}>{t("studio.mint_label_artwork")}</div>
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
                : <div className="mint-preview-empty">{t("studio.mint_placeholder_artwork")}</div>
              }
              <div>
                <label className="mint-label">{t("studio.mint_label_name")}</label>
                <input className="mint-input" value={name} onChange={e=>setName(e.target.value)} placeholder={t("studio.mint_placeholder_name")} />
              </div>
              <div>
                <label className="mint-label">{t("studio.mint_label_desc")}</label>
                <textarea className="mint-input" rows={3} value={description} onChange={e=>setDescription(e.target.value)} placeholder={t("studio.mint_placeholder_desc")} style={{resize:"vertical"}} />
              </div>
              <MintButton metadata={metadata} disabled={!selected} />
            </div>
          </div>
          </SubscriptionGate>
        </div>
        <p className="studio-disclaimer">{t("studio.disclaimer")}</p>
      </div>
      <MistralWidget context="studio" />
    </main>
  );
}
