import { useTranslation } from "react-i18next";
import { useVaults } from "../hooks/useVaults";
import { usePremium } from "../hooks/usePremium";
import "./VaultList.css";

export default function VaultList() {
  const { t } = useTranslation();
  const vaults = useVaults();
  const { isPremium } = usePremium();

  return (
    <section className="vault-list">
      <h2>{t("vaultList.title")}</h2>

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
                {locked ? t("vaultList.locked") : t("vaults.premium")}
              </span>
            )}

            <button disabled={locked}>
              {locked ? t("vaultList.locked") : t("vaultList.open_vault")}
            </button>
          </div>
        );
      })}
    </section>
  );
}
