import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMeta } from "../hooks/useMeta";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Cinzel:wght@400;600;700&display=swap');
  .legal-root { background: #080808; min-height: 100vh; font-family: 'Cormorant Garamond', Georgia, serif; color: #e8e0d0; }
  .legal-hero { text-align: center; padding: 5rem 2rem 3rem; position: relative; border-bottom: 1px solid rgba(212,175,55,0.08); }
  .legal-hero::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 70% 60% at 50% 0%, rgba(212,175,55,0.04) 0%, transparent 70%); pointer-events: none; }
  .legal-eyebrow { font-family: 'Cinzel', serif; font-size: 0.6rem; letter-spacing: 0.35em; text-transform: uppercase; color: #d4af37; margin-bottom: 1rem; }
  .legal-title { font-family: 'Cinzel', serif; font-size: clamp(1.8rem, 4vw, 2.8rem); font-weight: 400; color: #f0e8d0; letter-spacing: 0.1em; margin: 0; }
  .legal-div { width: 60px; height: 1px; background: linear-gradient(to right, transparent, #d4af37, transparent); margin: 1.5rem auto 0; }
  .legal-risk-banner { background: rgba(212,175,55,0.05); border-bottom: 1px solid rgba(212,175,55,0.15); padding: 0.75rem 2rem; display: flex; align-items: center; gap: 0.75rem; }
  .legal-risk-text { font-size: 0.78rem; color: rgba(212,175,55,0.75); line-height: 1.5; }
  .legal-tabs { display: flex; border-bottom: 1px solid rgba(212,175,55,0.1); padding: 0 2rem; max-width: 820px; margin: 0 auto; }
  .legal-tab { font-family: 'Cinzel', serif; font-size: 0.58rem; letter-spacing: 0.25em; text-transform: uppercase; padding: 1rem 1.5rem; cursor: pointer; border: none; background: none; transition: color 0.2s; border-bottom: 2px solid transparent; margin-bottom: -1px; }
  .legal-tab.active { color: #d4af37; border-bottom-color: #d4af37; }
  .legal-tab:not(.active) { color: rgba(212,175,55,0.35); }
  .legal-tab:not(.active):hover { color: rgba(212,175,55,0.65); }
  .legal-body { max-width: 820px; margin: 0 auto; padding: 3rem 2rem 6rem; }
  .legal-section-meta { display: flex; align-items: center; gap: 1rem; margin-bottom: 2.5rem; }
  .legal-tag { font-family: 'Cinzel', serif; font-size: 0.5rem; letter-spacing: 0.3em; text-transform: uppercase; color: #d4af37; border: 1px solid rgba(212,175,55,0.25); padding: 0.25rem 0.75rem; }
  .legal-date { font-size: 0.75rem; color: rgba(212,175,55,0.35); font-style: italic; }
  .legal-item { border-bottom: 1px solid rgba(212,175,55,0.07); padding-bottom: 2rem; margin-bottom: 2rem; }
  .legal-item:last-child { border-bottom: none; }
  .legal-item-heading { font-family: 'Cinzel', serif; font-size: 1.1rem; font-weight: 400; color: #f0e8d0; letter-spacing: 0.05em; margin: 0 0 0.75rem; }
  .legal-item-body { font-size: 1rem; line-height: 1.9; color: #9a9288; font-style: italic; margin: 0; }
`;

// Labels and tags are resolved inside the component using t()
const SECTION_IDS = [
  { id: "tos",     labelKey: "legal.tab_terms",   tagKey: "legal.tag_legal" },
  { id: "privacy", labelKey: "legal.tab_privacy",  tagKey: "legal.tag_privacy" },
  { id: "risk",    labelKey: "legal.tab_risk",     tagKey: "legal.tag_risk" },
] as const;

const SECTIONS = [
  {
    id: "tos",
    label: "Terms of Service",
    tag: "Legal",
    content: [
      { heading: "1. Acceptance of Terms", body: "By accessing or using the Facinations protocol and Musée-Crosdale platform (collectively, the \"Platform\"), you agree to be bound by these Terms of Service. If you do not agree, you may not use the Platform." },
      { heading: "2. Eligibility", body: "You must be at least 18 years of age and legally capable of entering into binding contracts. Use of Swaps and Vault features may be restricted in certain jurisdictions." },
      { heading: "3. Platform Description", body: "Facinations provides a protocol for the circulation, curation, and exchange of fine art as digital assets. The Platform includes Gallery, Vaults, Swap, Studio, and XdaleGallery surfaces." },
      { heading: "4. User Accounts", body: "You are responsible for maintaining the security of your account credentials and connected wallet. Facinations is not liable for losses resulting from unauthorized account access." },
      { heading: "5. Intellectual Property", body: "Artists and creators retain rights to their work. By listing on the Platform, you grant Facinations a non-exclusive license to display and promote your work within the Platform." },
      { heading: "6. Prohibited Conduct", body: "You may not use the Platform for money laundering, fraud, market manipulation, or any activity that violates applicable law. Misuse may result in immediate suspension." },
      { heading: "7. Fees", body: "Swap transactions require an XER fee. Vault creation and management may incur protocol fees. All fees are disclosed prior to transaction execution." },
      { heading: "8. Limitation of Liability", body: "Facinations provides the Platform on an \"as-is\" basis. We are not liable for any loss of art, token value, or data arising from use of the Platform, smart contract bugs, or third-party service failures." },
      { heading: "9. Governing Law", body: "These terms are governed by the laws of the jurisdiction in which Facinations is incorporated. Disputes shall be resolved by binding arbitration." },
      { heading: "10. Changes to Terms", body: "We may update these Terms at any time. Continued use of the Platform after changes constitutes acceptance. Significant changes will be communicated via the Platform." },
    ],
  },
  {
    id: "privacy",
    label: "Privacy Policy",
    tag: "Privacy",
    content: [
      { heading: "1. Data We Collect", body: "We collect wallet addresses, email addresses (where provided), artwork metadata, transaction records, and usage analytics. We do not collect government ID unless required for KYC." },
      { heading: "2. How We Use Your Data", body: "Data is used to operate the Platform, generate curator notes, provide analytics to dealers, facilitate swaps, and comply with legal obligations." },
      { heading: "3. Data Sharing", body: "We do not sell your personal data. We may share data with KYC providers, payment processors, and legal authorities where required by law." },
      { heading: "4. On-Chain Data", body: "Blockchain transactions are public by nature. Wallet addresses and transaction hashes visible on-chain are not considered private information." },
      { heading: "5. Cookies and Analytics", body: "The Platform uses analytics tools to measure usage. You may opt out of non-essential analytics. Essential cookies are required for platform functionality." },
      { heading: "6. Data Retention", body: "We retain your data for as long as your account is active or as required by law. You may request deletion of your personal data subject to legal retention obligations." },
      { heading: "7. Your Rights", body: "Depending on your jurisdiction, you may have rights to access, correct, delete, or port your personal data. Contact privacy@facinations.io to exercise these rights." },
      { heading: "8. Security", body: "We implement industry-standard security measures including encryption, access controls, and regular audits. No system is completely secure; use the Platform at your own risk." },
    ],
  },
  {
    id: "risk",
    label: "Risk Disclosures",
    tag: "Risk",
    content: [
      { heading: "General Investment Risk", body: "Art and digital assets are speculative investments. Past performance does not guarantee future results. You may lose some or all of the value of assets held or traded on the Platform." },
      { heading: "Swap and DeFi Risk", body: "Token swaps involve smart contract risk, liquidity risk, and price volatility. Slippage, front-running, and oracle manipulation may result in unfavorable execution prices." },
      { heading: "Vault Risk", body: "Vaults are subject to underlying asset price risk, smart contract vulnerabilities, and liquidity constraints. TVL figures are estimates and may not reflect realisable value." },
      { heading: "XER Fee Risk", body: "XER token fees are required for premium platform functions. XER itself is a volatile digital asset. Fee costs may increase materially during periods of high network demand." },
      { heading: "Regulatory Risk", body: "The regulatory environment for digital assets and art tokenisation is evolving rapidly. Changes in law may restrict or eliminate your ability to use certain Platform features." },
      { heading: "Counterparty Risk", body: "Swap offers involve counterparty risk. Facinations does not guarantee the performance of any counterparty, the authenticity of any artwork, or the solvency of any dealer." },
      { heading: "Technical Risk", body: "The Platform may experience downtime, bugs, or security incidents. Facinations is not liable for losses arising from technical failures, including third-party infrastructure outages." },
      { heading: "Region-Specific Restrictions", body: "Certain features including Swaps, leveraged positions, and specific token pairs may be unavailable in your jurisdiction. It is your responsibility to comply with local laws." },
    ],
  },
];

export default function Legal() {
  const { t } = useTranslation();
  useMeta({
    title: t("legal.title"),
    description: "Terms of Service, Privacy Policy, and Risk Disclosures for Musée-Crosdale and the Facinations protocol.",
    noIndex: false,
  });
  const [active, setActive] = useState("tos");
  const section = SECTIONS.find((s) => s.id === active)!;
  const sectionMeta = SECTION_IDS.find((s) => s.id === active)!;

  return (
    <div className="legal-root">
      <style>{css}</style>

      <div className="legal-hero">
        <div className="legal-eyebrow">{t("legal.eyebrow")}</div>
        <h1 className="legal-title">{t("legal.title")}</h1>
        <p style={{ fontStyle: "italic", color: "#6a6258", fontSize: "0.85rem", marginTop: "0.5rem" }}>
          {t("legal.subtitle")}
        </p>
        <div className="legal-div" />
      </div>

      <div className="legal-risk-banner">
        <span style={{ color: "#d4af37", fontSize: "0.9rem", flexShrink: 0 }}>⚠</span>
        <p className="legal-risk-text">
          {t("legal.risk_banner")}
        </p>
      </div>

      <div className="legal-tabs">
        {SECTION_IDS.map((s) => (
          <button
            key={s.id}
            className={`legal-tab${active === s.id ? " active" : ""}`}
            onClick={() => setActive(s.id)}
          >
            {t(s.labelKey)}
          </button>
        ))}
      </div>

      <div className="legal-body">
        <div className="legal-section-meta">
          <span className="legal-tag">{t(sectionMeta.tagKey)}</span>
          <span className="legal-date">{t("legal.last_updated")}</span>
        </div>
        {section.content.map((item, i) => (
          <div key={i} className="legal-item">
            <h3 className="legal-item-heading">{item.heading}</h3>
            <p className="legal-item-body">{item.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
