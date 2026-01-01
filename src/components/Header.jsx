import { Link } from "react-router-dom";
import "./Header.css";

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="logo-wrap">
          <img
            src="/xdale-logo.png"
            alt="XDALE"
            style={{
              height: "48px",
              width: "auto",
              cursor: "pointer",
            }}
          />
        </Link>

        <nav className="site-nav">
          <Link to="/">Home</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/vaults">Vaults</Link>
          <Link to="/swap">Swap</Link>
          <Link to="/legal">Legal</Link>
        </nav>
      </div>
    </header>
  );
}
