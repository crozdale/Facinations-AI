// src/components/VaultDetail.jsx
import { useTranslation } from "react-i18next";

export default function VaultDetail({ vault }) {
  const { t } = useTranslation();

  if (!vault) {
    return <p>{t("vaultDetail.not_found", "Vault not found.")}</p>;
  }

  const etherscanUrl = `https://etherscan.io/token/${vault.contractAddress}?a=${vault.tokenId}`;

  return (
    <div className="vault-detail">
      <h2>{t("vaultDetail.vault_heading", "Vault {{vaultId}}", { vaultId: vault.vaultId })}</h2>
      <p><strong>{t("vaultDetail.label_id", "ID:")}  </strong> {vault.id}</p>
      <p><strong>{t("vaultDetail.label_token_id", "Token ID:")}  </strong> {vault.tokenId}</p>
      <p><strong>{t("vaultDetail.label_contract_addr", "Contract:")}  </strong> {vault.contractAddress}</p>
      <p>
        <a href={etherscanUrl} target="_blank" rel="noreferrer">
          {t("vaultDetail.view_etherscan", "View on Etherscan")}
        </a>
      </p>
    </div>
  );
}
