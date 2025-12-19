import { Outlet, Link } from "react-router-dom";
import { useWeb3 } from "../providers/Web3Provider";

export default function Layout() {
  const { account, connect } = useWeb3();

  return (
    <div>
      <nav style={{ padding: 16, display: "flex", gap: 12, alignItems: "center" }}>
        <Link to="/">Home</Link>
        <Link to="/gallery">Gallery</Link>
        <Link to="/vault">Vault</Link>
        <Link to="/swap">Swap</Link>

        <a
          href="https://xdalegallery.com"
          target="_blank"
          rel="noreferrer"
        >
          xDALE Gallery
        </a>

        <span style={{ marginLeft: "auto" }}>
          {account ? (
            <strong>
              {account.slice(0, 6)}…{account.slice(-4)}
            </strong>
          ) : (
            <button onClick={connect}>Connect Wallet</button>
          )}
        </span>
      </nav>

      <main style={{ padding: 24 }}>
        <Outlet />
      </main>
    </div>
  );
}

