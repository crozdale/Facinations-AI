import { useState } from "react";
import { useTranslation } from "react-i18next";

// ── Data ─────────────────────────────────────────────────────────────────────

const TOOLS = [
  {
    category: "CRM & Contact Management",
    items: [
      { name: "HubSpot CRM", href: "https://www.hubspot.com/products/crm", desc: "Primary CRM for Fine Art Collectors and Art Community. Full pipeline, email sequences, lead scoring, and activity timeline. Free tier usable at launch; upgrade to Starter ($20/mo) at month 2." },
      { name: "Attio", href: "https://attio.com", desc: "Lightweight CRM for Crypto Speculator segment. Better suited for fast-moving, data-enriched outreach. Native Segment integration." },
      { name: "Apollo.io", href: "https://www.apollo.io", desc: "Contact list building. Search by job title (gallery director, art fund manager, crypto fund principal). Export to HubSpot via Zapier." },
      { name: "Hunter.io", href: "https://hunter.io", desc: "Email verification layer. Run every exported list through Hunter before sending. Reduces bounce rate below 2%." },
      { name: "LinkedIn Sales Navigator", href: "https://business.linkedin.com/sales-solutions/sales-navigator", desc: "Institutional outreach to collectors, family offices, and crypto funds. $100/mo but high ROI for enterprise deals." },
    ],
  },
  {
    category: "Media & Content",
    items: [
      { name: "Mailchimp", href: "https://mailchimp.com", desc: "Email marketing for Art Community (high frequency, nurture-led). Start with Mailchimp free tier. USD-billed." },
      { name: "Later or Buffer", href: "https://later.com", desc: "Social scheduling across Instagram, TikTok, X, Pinterest. Batch schedule one week at a time. Later has native TikTok support." },
      { name: "Canva Pro", href: "https://www.canva.com/pro", desc: "Design layer for social posts, newsletter headers, event invites. Maintain brand consistency across all four audiences from one workspace." },
      { name: "Descript or CapCut", href: "https://www.descript.com", desc: "Short-form video editing for TikTok and Reels. Descript for team workflows with transcript-based editing. CapCut for fast solo turnaround." },
    ],
  },
  {
    category: "Analytics & Data",
    items: [
      { name: "Segment", href: "https://segment.com", desc: "Customer data platform. Routes all in-app events (trade placed, referral clicked, artwork viewed) to HubSpot, Amplitude, and email tools simultaneously." },
      { name: "Amplitude", href: "https://amplitude.com", desc: "Product analytics. Tracks funnel conversion from signup to first trade. Identify drop-off points by audience segment." },
      { name: "Google Analytics 4", href: "https://analytics.google.com", desc: "Website and landing page performance. UTM tagging for all paid and influencer traffic sources." },
      { name: "FirstPromoter", href: "https://firstpromoter.com", desc: "Affiliate tracking for influencer programme. Real-time commission calculation and payout scheduling. USD-billed, $49/mo Starter." },
    ],
  },
];

const TIERS = [
  { tier: "Tier 1", followers: "5,000 – 49,999", commission: "1.5% of Platform Fees", extras: "Access to brand asset library, monthly affiliate newsletter", tools: "Dashboard, referral link generator, monthly performance report" },
  { tier: "Tier 2", followers: "50,000 – 499,999", commission: "2.0% of Platform Fees", extras: "Co-branded content budget (up to $500/mo), priority account manager, quarterly strategy call", tools: "All Tier 1 tools + co-branded landing page, custom UTM builder, audience insight reports" },
  { tier: "Tier 3", followers: "500,000+ (negotiated)", commission: "Negotiated — minimum 2.5%", extras: "Negotiated equity-adjacent participation, co-authorship on editorial, event invitations", tools: "All Tier 2 tools + dedicated integration support, bespoke reporting" },
];

const TERMS = [
  { title: "1. Definitions", body: `Affiliate / Creator: An individual or entity accepted into the Facinations Creator & Affiliate Programme.\nReferral Link: A unique tracked URL or code assigned to each Affiliate.\nQualifying Referral: A new user who registers via an Affiliate's link, completes KYC, and executes at least one trade.\nPlatform Fee: 0.5% of total trade value on each matched trade.\nCommission: Percentage of Platform Fees payable to the Affiliate per tier schedule.\nAttribution Window: 90-day registration + 12-month earning window from first Qualifying Trade.` },
  { title: "2. Eligibility & Enrolment", body: `• Must be 18 years of age or older.\n• Company reserves the right to accept or reject any application.\n• Applicants must disclose audience demographics and follower counts.\n• Corporate entities may enrol with company registration documents.\n• Existing Facinations users may apply but must avoid conflicts of interest.` },
  { title: "3. Prohibited Persons & Activities", body: `Not eligible: Politically Exposed Persons (PEPs), sanctioned individuals, persons convicted of fraud or financial crime, competitors or their employees.` },
  { title: "4. Commission Tiers & Rates", body: `Tiers are reviewed quarterly. Promotion and demotion may occur based on performance metrics. Commission is calculated on Platform Fees from Qualifying Referrals during the Attribution Window. Commission is not payable on the Affiliate's own trades or those of household members.\n\nThe Company reserves the right to adjust commission rates on 30 days' written notice.` },
  { title: "5. Attribution, Tracking & Payments", body: `Attribution: 90-day registration window. 12-month earning window from first Qualifying Trade.\nCookie: First-click attribution. 30-day cookie window.\nPayment: Monthly, within 15 business days of month-end.\nMinimum payout: $50 (rolls to next month if below threshold).\nMethods: ACH/Wire transfer, PayPal, or USDC.\nCurrency: USD.\nTax: Affiliates are solely responsible for declaring and paying all applicable taxes.` },
  { title: "6. Compliance & Disclosure Obligations", body: `• Clearly disclose commercial relationship in every piece of content containing a Referral Link.\n• Acceptable formats: #ad, #sponsored, #FacinationsPartner, or explicit verbal statement.\n• Disclosures must appear before the referral call-to-action.\n• All promotional content is subject to pre-approval (48 hours before publication; 24-hour response).\n• Do not target content at persons under 18.` },
  { title: "7. Prohibited Promotional Conduct", body: `Immediate termination and forfeiture of accrued commissions for:\n• Paid search on Facinations brand terms without written consent.\n• Cookie stuffing, link cloaking, click fraud, or artificial inflation.\n• Incentivising referrals with unapproved rewards.\n• False or misleading claims about Facinations.\n• Spam — unsolicited bulk emails/messages.` },
  { title: "8–13. IP, Data, Termination & Liability", body: `IP: Limited licence to use Facinations branding for approved content only. Affiliates retain content ownership; grant Company a perpetual, royalty-free licence to share approved content.\n\nData: Both parties comply with applicable US privacy law (CCPA and federal standards).\n\nTermination: 14 days' written notice by either party. Immediate termination for material breach, fraud, or harmful conduct. 6-month clawback right on termination for breach.\n\nLiability: Capped at 3 months' commissions. No liability for indirect or consequential loss.\n\nGoverning Law: State of New York, United States. Disputes to senior representatives, then mediation, then litigation.` },
];

const TABS_KEYS = [
  { key: "marketing.tab_tools",     label: "Tool Stack" },
  { key: "marketing.tab_affiliate", label: "Affiliate Programme" },
  { key: "marketing.tab_terms",     label: "Terms & Conditions" },
] as const;
type Tab = "Tool Stack" | "Affiliate Programme" | "Terms & Conditions";

// ── Styles ────────────────────────────────────────────────────────────────────
const S = {
  page: { minHeight: "100vh", background: "#1a1a1a", color: "#f2ece0", padding: "4rem 2rem" } as const,
  maxW: { maxWidth: 1000, margin: "0 auto" } as const,
  eyebrow: { fontFamily: "'Cinzel',serif", fontSize: "0.55rem", letterSpacing: "0.35em", textTransform: "uppercase" as const, color: "rgba(212,175,55,0.55)", marginBottom: "1rem" },
  h1: { fontFamily: "'Cinzel',serif", fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 400, color: "#f2ece0", letterSpacing: "0.1em", margin: "0 0 2.5rem" },
  tabs: { display: "flex", gap: "0.25rem", borderBottom: "1px solid rgba(212,175,55,0.12)", marginBottom: "2.5rem" } as const,
  sectionHead: { fontFamily: "'Cinzel',serif", fontSize: "0.9rem", letterSpacing: "0.15em", color: "#d4af37", margin: "2rem 0 1rem", fontWeight: 400 },
  table: { width: "100%", borderCollapse: "collapse" as const, marginBottom: "2rem" },
  th: { fontFamily: "'Cinzel',serif", fontSize: "0.55rem", letterSpacing: "0.2em", textTransform: "uppercase" as const, color: "rgba(212,175,55,0.6)", padding: "0.6rem 1rem", textAlign: "left" as const, borderBottom: "1px solid rgba(212,175,55,0.12)" },
  td: { fontFamily: "'Cormorant Garamond',serif", fontSize: "0.9rem", color: "#c8c0b4", padding: "0.7rem 1rem", borderBottom: "1px solid rgba(212,175,55,0.06)", verticalAlign: "top" as const },
  tdName: { fontFamily: "'Cinzel',serif", fontSize: "0.65rem", letterSpacing: "0.1em", color: "#f2ece0", padding: "0.7rem 1rem", borderBottom: "1px solid rgba(212,175,55,0.06)", verticalAlign: "top" as const, whiteSpace: "nowrap" as const },
  termBlock: { borderLeft: "2px solid rgba(212,175,55,0.2)", paddingLeft: "1.25rem", marginBottom: "1.5rem" },
  termTitle: { fontFamily: "'Cinzel',serif", fontSize: "0.65rem", letterSpacing: "0.15em", color: "#d4af37", marginBottom: "0.5rem", cursor: "pointer" as const },
  termBody: { fontFamily: "'Cormorant Garamond',serif", fontSize: "0.9rem", color: "#a09890", whiteSpace: "pre-line" as const, lineHeight: 1.7 },
};

function tabBtn(active: boolean) {
  return {
    fontFamily: "'Cinzel',serif",
    fontSize: "0.58rem",
    letterSpacing: "0.18em",
    textTransform: "uppercase" as const,
    background: "none",
    border: "none",
    borderBottom: active ? "1px solid #d4af37" : "1px solid transparent",
    color: active ? "#d4af37" : "#666",
    padding: "0.6rem 1rem",
    cursor: "pointer" as const,
    transition: "all 0.2s",
    marginBottom: "-1px",
  };
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function Marketing() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>("Tool Stack");
  const [openTerm, setOpenTerm] = useState<string | null>(null);

  return (
    <div style={S.page}>
      <div style={S.maxW}>
        <p style={S.eyebrow}>{t("marketing.eyebrow", "Facinations · Sales & Marketing")}</p>
        <h1 style={S.h1}>{t("marketing.heading", "Partner Resources")}</h1>

        {/* Tabs */}
        <div style={S.tabs}>
          {TABS_KEYS.map(tab_item => (
            <button key={tab_item.label} style={tabBtn(tab === tab_item.label)} onClick={() => setTab(tab_item.label)}>{t(tab_item.key, tab_item.label)}</button>
          ))}
        </div>

        {/* Tool Stack */}
        {tab === "Tool Stack" && (
          <div>
            {TOOLS.map(section => (
              <div key={section.category}>
                <h3 style={S.sectionHead}>{section.category}</h3>
                <table style={S.table}>
                  <thead>
                    <tr>
                      <th style={S.th}>{t("marketing.col_tool", "Tool")}</th>
                      <th style={S.th}>{t("marketing.col_purpose", "Purpose")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.items.map(item => (
                      <tr key={item.name}>
                        <td style={S.tdName}>
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#d4af37", textDecoration: "none", borderBottom: "1px solid rgba(212,175,55,0.3)", paddingBottom: "1px", transition: "border-color 0.2s" }}
                            onMouseEnter={e => (e.currentTarget.style.borderColor = "#d4af37")}
                            onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(212,175,55,0.3)")}
                          >
                            {item.name}
                          </a>
                        </td>
                        <td style={S.td}>{item.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}

        {/* Affiliate Programme */}
        {tab === "Affiliate Programme" && (
          <div>
            <h3 style={S.sectionHead}>{t("partner.section_tiers", "Commission Tiers")}</h3>
            <table style={S.table}>
              <thead>
                <tr>
                  {([
                    ["marketing.col_tier", "Tier"],
                    ["marketing.col_followers", "Followers"],
                    ["marketing.col_commission", "Commission"],
                    ["marketing.col_extras", "Extras"],
                    ["marketing.col_tools_col", "Tools"],
                  ] as [string,string][]).map(([k, h]) => (
                    <th key={h} style={S.th}>{t(k, h)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TIERS.map(t => (
                  <tr key={t.tier}>
                    <td style={S.tdName}>{t.tier}</td>
                    <td style={S.td}>{t.followers}</td>
                    <td style={S.td}>{t.commission}</td>
                    <td style={S.td}>{t.extras}</td>
                    <td style={S.td}>{t.tools}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ ...S.td, background: "rgba(212,175,55,0.04)", padding: "1rem", borderLeft: "2px solid rgba(212,175,55,0.2)" }}>
              {t("marketing.payment_schedule", "Payment schedule: Monthly within 15 business days of month-end. Minimum payout $50 (rolls to next month if below threshold). Methods: ACH/Wire, PayPal, or USDC. Currency: USD.")}
            </p>
          </div>
        )}

        {/* Terms */}
        {tab === "Terms & Conditions" && (
          <div>
            {TERMS.map(term => (
              <div key={term.title} style={S.termBlock}>
                <p
                  style={S.termTitle}
                  onClick={() => setOpenTerm(openTerm === term.title ? null : term.title)}
                >
                  {openTerm === term.title ? "▾" : "▸"} {term.title}
                </p>
                {openTerm === term.title && (
                  <p style={S.termBody}>{term.body}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
