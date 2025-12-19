import { Link } from "react-router-dom";
import { xdaleUrl } from "../config/links";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-8 py-4 border-b">
      <Link to="/" className="font-serif text-xl">
        Façinations™
      </Link>

      <nav className="flex gap-6">
        <Link to="/gallery">Gallery</Link>
        <Link to="/vault">Vault</Link>
        <Link to="/swap">Swap</Link>

        <a
          href={xdaleUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium"
        >
          Visit XDALE
        </a>
      </nav>
    </header>
  );
}
