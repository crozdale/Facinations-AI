import { Link } from "react-router-dom";
import { BRAND } from "../brand/brandAssets";
import ConnectWalletButton from "./ConnectWalletButton";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-8 py-4 border-b bg-white">
      <Link to="/" className="flex items-center">
        <img
          src={BRAND.FACINATIONS.WORDMARK}
          alt="Façinations"
          className="h-10 w-auto"
        />
      </Link>

      <nav className="flex gap-8 text-lg font-medium">
        <Link to="/">Home</Link>
        <Link to="/gallery">Gallery</Link>
        <Link to="/vault">Vault</Link>
        <Link to="/swap">Swap</Link>
      </nav>

      <ConnectWalletButton />
    </header>
  );
}
