import { useTranslation } from "react-i18next";
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Cinzel:wght@400;600;700&display=swap');
  .legal-root { background: #080808; min-height: 100vh; font-family: 'Cormorant Garamond', Georgia, serif; color: #e8e0d0; }
  .legal-hero { text-align: center; padding: 5rem 2rem 3rem; position: relative; border-bottom: 1px solid rgba(212,175,55,0.08); }
  .legal-hero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 70% 60% at 50% 0%, rgba(212,175,55,0.04) 0%, transparent 70%); pointer-events: none; }
  .legal-eyebrow { font-family: 'Cinzel', serif; font-size: 0.6rem; letter-spacing: 0.35em; text-transform: uppercase; color: #d4af37; margin-bottom: 1rem; }
  .legal-title { font-family: 'Cinzel', serif; font-size: clamp(1.8rem, 4vw, 2.8rem); font-weight: 400; color: #f0e8d0; letter-spacing: 0.1em; margin: 0; }
  .legal-div { width: 60px; height: 1px; background: linear-gradient(to right, transparent, #d4af37, transparent); margin: 1.5rem auto 0; }
  .legal-body { max-width: 760px; margin: 4rem auto; padding: 0 2rem 6rem; }
  .legal-p { font-size: 1.05rem; line-height: 1.95; color: #9a9288; margin-bottom: 1.5rem; font-style: italic; }
`;
export default function Legal() {
  const { t } = useTranslation();
  return (
    <div className="legal-root">
      <style>{css}</style>
      <div className="legal-hero">
        <div className="legal-eyebrow">Disclaimer and Terms</div>
        <h1 className="legal-title">{t("legal.title")}</h1>
        <div className="legal-div" />
      </div>
      <div className="legal-body">
        <p className="legal-p">{t("legal.body")}</p>
        <p className="legal-p">{t("legal.body2")}</p>
      </div>
    </div>
  );
}
