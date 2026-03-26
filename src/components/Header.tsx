// src/components/Header.jsx
import "./Header.css";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import WalletConnect from "./WalletConnect";

export default function Header() {
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
    localStorage.setItem("facinations_lang", e.target.value);
  };

  const links = [
    ["/", "nav.home", "Home"],
    ["/about", "nav.about", "About"],
    ["/gallery", "nav.gallery", "Gallery"],
    ["/vaults", "nav.vaults", "Vaults"],
    ["/swap", "nav.swap", "Swap"],
    ["/studio", "nav.studio", "Studio"],
    ["/dashboard", "nav.dashboard", "Dashboard"],
    ["/architecture", "nav.arch", "Docs"],
    ["/legal", "nav.legal", "Legal"],
  ];

  return (
    <>
      <header className="site-header">
        <div className="logo">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            <img
              src="/facinations-gold.png"
              alt="Musee Crosdale"
              style={{ height: "38px", objectFit: "contain" }}
            />
          </Link>
        </div>
        <nav className="nav" aria-label="Main navigation">
          {links.map(([path, key, fallback]) => (
            <Link
              key={path}
              to={path}
              className={location.pathname === path ? "nav-active" : ""}
              aria-current={location.pathname === path ? "page" : undefined}
            >
              {t(key, fallback)}
            </Link>
          ))}
        </nav>
        <div className="header-right">
          <select
            className="lang-select"
            value={i18n.language || "en"}
            onChange={handleLanguageChange}
            aria-label="Select language"
          >
            {[
              ["en", "EN"],
              ["es", "ES"],
              ["fr", "FR"],
              ["pt-BR", "PT"],
              ["it", "IT"],
              ["de", "DE"],
              ["ko", "KO"],
              ["zh-CN", "ZH"],
              ["ja", "JA"],
              ["ru", "RU"],
              ["ar", "AR"],
              ["hi", "HI"],
            ].map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
          <WalletConnect />
          <button
            className="hamburger"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <span className={`ham-line ${menuOpen ? "open" : ""}`} />
            <span className={`ham-line ${menuOpen ? "open" : ""}`} />
            <span className={`ham-line ${menuOpen ? "open" : ""}`} />
          </button>
        </div>
      </header>
      {menuOpen && (
        <nav id="mobile-menu" className="mobile-menu" aria-label="Mobile navigation">
          <div className="mobile-menu-inner">
            {links.map(([path, key, fallback]) => (
              <Link
                key={path}
                to={path}
                className={`mobile-link ${
                  location.pathname === path ? "mobile-link-active" : ""
                }`}
                onClick={() => setMenuOpen(false)}
                aria-current={location.pathname === path ? "page" : undefined}
              >
                {t(key, fallback)}
              </Link>
            ))}
            <div className="mobile-lang">
              <select
                className="lang-select"
                value={i18n.language || "en"}
                onChange={handleLanguageChange}
                aria-label="Select language"
              >
                {[
                  ["en", "EN"],
                  ["es", "ES"],
                  ["fr", "FR"],
                  ["pt-BR", "PT"],
                  ["it", "IT"],
                  ["de", "DE"],
                  ["ko", "KO"],
                  ["zh-CN", "ZH"],
                  ["ja", "JA"],
                  ["ru", "RU"],
                  ["ar", "AR"],
                  ["hi", "HI"],
                ].map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </nav>
      )}
    </>
  );
}
