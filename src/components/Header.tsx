// src/components/Header.tsx
import "./Header.css";
import { Link, useLocation } from "react-router-dom";
import { BRAND } from "../brand/brandAssets";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import WalletConnect from "./WalletConnect";

const NAV_SECTIONS = [
  {
    label: "Collectors",
    key: "nav.collectorsSection",
    items: [
      { path: "/gallery",   label: "Gallery",     key: "nav.gallery",   descKey: "nav.gallery_desc",           desc: "Browse & acquire artworks" },
      { path: "/vaults",    label: "Vaults",      key: "nav.vaults",    descKey: "nav.vaults_desc",            desc: "Secure art custody" },
      { path: "/dashboard", label: "Dashboard",   key: "nav.dashboard", descKey: "nav.dashboard_desc",         desc: "Your vaulted assets" },
    ],
  },
  {
    label: "Speculators",
    key: "nav.speculatorsSection",
    items: [
      { path: "/swap",  label: "Swap",      key: "nav.swap",  descKey: "nav.swap_desc",  desc: "Swap art-fraction tokens" },
      { path: "/swapp", label: "P2P Swapp", key: "nav.swapp", descKey: "nav.swapp_desc", desc: "Peer-to-peer trades" },
    ],
  },
  {
    label: "Community",
    key: "nav.communitySection",
    items: [
      { path: "/community", label: "Discord & Threema", key: "nav.community",  descKey: "nav.community_desc",  desc: "Live chat · Encrypted messaging" },
      { path: "/xdale",     label: "Xdale Gallery",  key: "nav.xdale",      descKey: "nav.xdale_desc",      desc: "Curated exhibitions" },
      { path: "/galleries", label: "Galleries",      key: "nav.galleries",  descKey: "nav.galleries_desc",  desc: "All gallery spaces" },
    ],
  },
  {
    label: "Platform",
    key: "nav.platformSection",
    items: [
      { path: "/about",        label: "About",      key: "nav.about",     descKey: "nav.about_desc",     desc: "Protocol overview" },
      { path: "/architecture", label: "Whitepaper", key: "nav.arch",      descKey: "nav.arch_desc",      desc: "Technical architecture" },
      { path: "/analytics",    label: "Analytics",  key: "nav.analytics", descKey: "nav.analytics_desc", desc: "Portfolio insights" },
      { path: "/legal",        label: "Legal",      key: "nav.legal",     descKey: "nav.legal_desc",     desc: "Terms & disclosures" },
    ],
  },
  {
    label: "Partners",
    key: "nav.partnersSection",
    items: [
      { path: "/studio",            label: "Artist Studio",     key: "nav.studio",           descKey: "nav.studio_desc",           desc: "Publish & mint artwork" },
      { path: "/curator",           label: "AI Curator",        key: "nav.aiCurator",        descKey: "nav.aiCurator_desc",        desc: "Intelligent art insights" },
      { path: "/dealer-crm",        label: "Dealer CRM",        key: "nav.dealerCrm",        descKey: "nav.dealerCrm_desc",        desc: "Client & deal management" },
      { path: "/partner-dashboard", label: "Consultant Portal", key: "nav.consultantPortal", descKey: "nav.consultantPortal_desc", desc: "Affiliate commissions · USD" },
      { path: "/marketing",         label: "Sales & Marketing", key: "nav.marketing",        descKey: "nav.marketing_desc",        desc: "Campaign & affiliate docs" },
    ],
  },
];

const LANGS = [
  ["en","EN"],["es","ES"],["fr","FR"],["pt-BR","PT"],
  ["it","IT"],["de","DE"],["ko","KO"],["zh-CN","ZH"],
  ["ja","JA"],["ru","RU"],["ar","AR"],["hi","HI"],
] as const;

export default function Header() {
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const location = useLocation();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
    localStorage.setItem("facinations_lang", e.target.value);
  };

  const isActive = (items: any[]) =>
    items.some((i) => i.path && location.pathname === i.path);

  return (
    <>
      <header className="site-header">
        {/* Logo */}
        <div className="logo">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            <img src={BRAND.FACINATIONS.WORDMARK} alt="Musee Crosdale" style={{ height: "38px", objectFit: "contain" }} />
          </Link>
        </div>

        {/* Desktop grouped nav */}
        <nav className="nav" aria-label="Main navigation">
          {NAV_SECTIONS.map((section) => (
            <div
              key={section.key}
              className={`nav-group${isActive(section.items) ? " nav-group-active" : ""}`}
              onMouseEnter={() => setOpenSection(section.key)}
              onMouseLeave={() => setOpenSection(null)}
            >
              <button className="nav-group-btn" aria-haspopup="true" aria-expanded={openSection === section.key}>
                {t(section.key, section.label)}
                <span className="nav-chevron">▾</span>
              </button>
              {openSection === section.key && (
                <div className="nav-dropdown" role="menu">
                  {section.items.map((item) =>
                    (item as any).href ? (
                      <a
                        key={(item as any).href}
                        href={(item as any).href}
                        target="_blank"
                        rel="noopener noreferrer"
                        role="menuitem"
                        className="nav-dropdown-item"
                        onClick={() => setOpenSection(null)}
                      >
                        <span className="nav-dropdown-label">{t(item.key, item.label)}</span>
                        <span className="nav-dropdown-desc">{t((item as any).descKey ?? "", item.desc)}</span>
                      </a>
                    ) : (
                      <Link
                        key={(item as any).path}
                        to={(item as any).path}
                        role="menuitem"
                        className={`nav-dropdown-item${location.pathname === (item as any).path ? " active" : ""}`}
                        onClick={() => setOpenSection(null)}
                      >
                        <span className="nav-dropdown-label">{t(item.key, item.label)}</span>
                        <span className="nav-dropdown-desc">{t((item as any).descKey ?? "", item.desc)}</span>
                      </Link>
                    )
                  )}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right controls */}
        <div className="header-right">
          <select
            className="lang-select"
            value={i18n.language || "en"}
            onChange={handleLanguageChange}
            aria-label={t("common.select_language", "Select language")}
          >
            {LANGS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <WalletConnect />
          <button
            className="hamburger"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? t("common.close_menu", "Close menu") : t("common.open_menu", "Open menu")}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <span className={`ham-line ${menuOpen ? "open" : ""}`} />
            <span className={`ham-line ${menuOpen ? "open" : ""}`} />
            <span className={`ham-line ${menuOpen ? "open" : ""}`} />
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <nav id="mobile-menu" className="mobile-menu" aria-label="Mobile navigation">
          <div className="mobile-menu-inner">
            {NAV_SECTIONS.map((section) => (
              <div key={section.key} className="mobile-section">
                <p className="mobile-section-label">{t(section.key, section.label)}</p>
                {section.items.map((item: any) =>
                  item.href ? (
                    <a
                      key={item.href}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mobile-link"
                      onClick={() => setMenuOpen(false)}
                    >
                      {t(item.key, item.label)}
                    </a>
                  ) : (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`mobile-link${location.pathname === item.path ? " mobile-link-active" : ""}`}
                      onClick={() => setMenuOpen(false)}
                      aria-current={location.pathname === item.path ? "page" : undefined}
                    >
                      {t(item.key, item.label)}
                    </Link>
                  )
                )}
              </div>
            ))}
            <div className="mobile-lang">
              <select
                className="lang-select"
                value={i18n.language || "en"}
                onChange={handleLanguageChange}
                aria-label={t("common.select_language", "Select language")}
              >
                {LANGS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          </div>
        </nav>
      )}
    </>
  );
}
