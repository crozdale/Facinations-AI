import { useVaults } from "../hooks/useVaults";
import { usePremium } from "../hooks/usePremium";
import "./VaultList.css";

export default function VaultList() {
  const vaults = useVaults();
  const { isPremium } = usePremium();

  return (
    <section className="vault-list">
      <h2>Vaults</h2>

      {vaults.map((vault) => {
        const locked = vault.premiumRequired && !isPremium;

        return (
          <div
            key={vault.vaultId}
            className={`vault-card ${locked ? "locked" : ""}`}
          >
            <h3>{vault.name}</h3>
            <p>{vault.description}</p>

            {vault.premiumRequired && (
              <span className="badge">
                {locked ? "Premium Required" : "Premium"}
              </span>
            )}

            <button disabled={locked}>
              {locked ? "Locked" : "Open Vault"}
            </button>
          </div>
        );
      })}
    </section>
  );
}
