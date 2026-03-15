// src/components/Footer.jsx
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "#060606",
        borderTop: "1px solid rgba(212,175,55,0.1)",
        padding: "2.5rem 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "1rem",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.3rem",
        }}
      >
        <span
          style={{
            fontFamily: "'Cinzel Decorative', serif",
            color: "#d4af37",
            fontSize: "0.75rem",
            letterSpacing: "0.15em",
          }}
        >
          Façinations
        </span>
        <span
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "0.5rem",
            letterSpacing: "0.2em",
            color: "#2a2a2a",
            textTransform: "uppercase",
          }}
        >
          © {year} · Decentralised Fine-Art Protocol
        </span>
      </div>

      <div
        style={{
          display: "flex",
          gap: "0.4rem",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {[
          ["Legal", "/legal"],
          ["About", "/about"],
          ["Whitepaper", "/whitepaper"],
          ["Architecture", "/architecture"],
        ].map(([label, path]) => (
          <Link
            key={label}
            to={path}
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "0.52rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#333",
              textDecoration: "none",
              padding: "0.3rem 0.6rem",
              border: "1px solid transparent",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#d4af37";
              e.currentTarget.style.borderColor = "rgba(212,175,55,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#333";
              e.currentTarget.style.borderColor = "transparent";
            }}
          >
            {label}
          </Link>
        ))}
      </div>

      <div
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: "0.48rem",
          letterSpacing: "0.18em",
          color: "#1e1e1e",
          textTransform: "uppercase",
        }}
      >
        0x33d1de58...157f · Ethereum Sepolia
      </div>
    </footer>
  );
}
