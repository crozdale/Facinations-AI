import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useWallet } from "../hooks/useWallet";
import { useVaultContract } from "../hooks/useVaultContract";

export default function VaultInteraction({ vault }) {
  const { t } = useTranslation();
  const { signer, address, connect } = useWallet();
  const contract = useVaultContract(vault.vaultContract, signer);

  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");

  async function fractionalize() {
    if (!contract) return;
    try {
      setStatus(t("vault.submitting_tx", "Submitting transaction…"));
      const tx = await contract.fractionalize(amount);
      await tx.wait();
      setStatus(t("vault.fractionalization_complete", "Fractionalization complete"));
    } catch (err) {
      setStatus(t("vault.tx_failed", "Transaction failed"));
    }
  }

  if (!address) {
    return <button onClick={connect}>{t("wallet.connect", "Connect Wallet")}</button>;
  }

  return (
    <section style={{ marginTop: "30px" }}>
      <h3>{t("vault.actions_title", "Vault Actions")}</h3>

      <input
        type="number"
        placeholder={t("common.amount", "Amount")}
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />

      <button onClick={fractionalize}>{t("vault.fractionalize", "Fractionalize")}</button>

      {status && <p>{status}</p>}
    </section>
  );
}
