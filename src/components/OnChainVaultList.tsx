import { useTranslation } from "react-i18next";
import { useOnChainVaults } from "../hooks/useOnChainVaults";
import { usePremium } from "../hooks/usePremium";
import { Link } from "react-router-dom";
import "./OnChainVaultList.css";

export default function OnChainVaultList() {
  const { t } = useTranslation();
  const { vaults, loading } = useOnChainVaults();
  const { isPremium } = usePremium();

  if (loading) {
    return <p style={{ textAlign: "center" }}>{t("vaults.loading", "Loading vaults…")}</p>;
  }

  return (
    <section className="vault-list">
      <h2>{t("vaults.on_chain_title", "On-Chain Vaults")}</h2>

      {vaults.map((vault) => {
        const locked = vault.premiumRequired && !isPremium;

        return (
          <div
            key={vault.vaultId}
            className={`vault-card ${locked ? "locked" : ""}`}
          >
            <h3>{vault.vaultId}</h3>

            <p>
              {t("vaults.contract_label", "Contract:")}{" "}<code>{vault.vaultContract}</code>
            </p>

            {vault.premiumRequired && (
              <span className="badge">
                {locked ? t("vaults.premium_badge", "Premium Required") : t("vaults.premium", "Premium")}
              </span>
            )}

            {locked ? (
              <button disabled>{t("vaults.locked", "Locked")}</button>
            ) : (
              <Link to={`/vaults/${vault.vaultId}`}>
                <button>{t("vaults.open_vault", "Open Vault")}</button>
              </Link>
            )}
          </div>
        );
      })}
    </section>
  );
}
