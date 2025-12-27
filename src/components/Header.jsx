import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import "../styles/theme.css";

export default function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <img src="/sigil-gold.png" alt="Sigil" className="sigil" />
        <span className="brand">Facinations</span>
      </div>

      <nav className="nav">
        <Link to="/">Home</Link>
        <Link to="/gallery">Gallery</Link>
        <Link to="/vaults">Vaults</Link>
      </nav>

      <ThemeToggle />
    </header>
  );
}
