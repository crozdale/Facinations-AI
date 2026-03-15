import { useOnChainVaults } from "../hooks/useOnChainVaults";
import { usePremium } from "../hooks/usePremium";
import { Link } from "react-router-dom";
import "./OnChainVaultList.css";

export default function OnChainVaultList() {
  const { vaults, loading } = useOnChainVaults();
  const { isPremium } = usePremium();

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading vaults…</p>;
  }

  return (
    <section className="vault-list">
      <h2>On-Chain Vaults</h2>

      {vaults.map((vault) => {
        const locked = vault.premiumRequired && !isPremium;

        return (
          <div
            key={vault.vaultId}
            className={`vault-card ${locked ? "locked" : ""}`}
          >
            <h3>{vault.vaultId}</h3>

            <p>
              Contract: <code>{vault.vaultContract}</code>
            </p>

            {vault.premiumRequired && (
              <span className="badge">
                {locked ? "Premium Required" : "Premium"}
              </span>
            )}

            {locked ? (
              <button disabled>Locked</button>
            ) : (
              <Link to={`/vault/${vault.vaultId}`}>
                <button>Open Vault</button>
              </Link>
            )}
          </div>
        );
      })}
    </section>
  );
}
