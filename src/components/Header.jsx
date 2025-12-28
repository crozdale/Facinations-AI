import { Link } from "react-router-dom";
import "./Header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="logo">
        <img src="/sigil.png" alt="Sigil" />
        <span>Facinations</span>
      </div>

      <nav>
        <Link to="/">Home</Link>
        <Link to="/gallery">Gallery</Link>
        <Link to="/vaults">Vaults</Link>
      </nav>

      <button className="theme-btn">🌙 Dark</button>
    </header>
  );
}
