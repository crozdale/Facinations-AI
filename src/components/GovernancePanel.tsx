import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ethers } from "ethers";
import { GOVERNANCE_ABI } from "../contracts/Governance";
import { useGovernance } from "../hooks/useGovernance";
import { useChain } from "../hooks/useChain";

export default function GovernancePanel() {
  const { t } = useTranslation();
  const { governor, emergency } = useGovernance();
  const chainId = useChain();

  const [form, setForm] = useState({
    vaultId: "",
    vaultContract: "",
    swapContract: "",
    premiumRequired: false
  });

  const [status, setStatus] = useState("");

  if (!governor && !emergency) return null;

  async function submitVault() {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const gov = new ethers.Contract(
        import.meta.env[`VITE_GOVERNANCE_${chainId}`],
        GOVERNANCE_ABI,
        signer
      );

      setStatus("Submitting vault registration…");

      const tx = await gov.registerVault(
        form.vaultId,
        form.vaultContract,
        form.swapContract,
        form.premiumRequired
      );

      await tx.wait();
      setStatus("Vault registered");
    } catch {
      setStatus("Registration failed");
    }
  }

  async function pause() {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const gov = new ethers.Contract(
        import.meta.env[`VITE_GOVERNANCE_${chainId}`],
        GOVERNANCE_ABI,
        signer
      );

      setStatus("Pausing protocol…");
      const tx = await gov.pauseProtocol();
      await tx.wait();
      setStatus("Protocol paused");
    } catch {
      setStatus("Pause failed");
    }
  }

  async function unpause() {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const gov = new ethers.Contract(
        import.meta.env[`VITE_GOVERNANCE_${chainId}`],
        GOVERNANCE_ABI,
        signer
      );

      setStatus("Unpausing protocol…");
      const tx = await gov.unpauseProtocol();
      await tx.wait();
      setStatus("Protocol unpaused");
    } catch {
      setStatus("Unpause failed");
    }
  }

  return (
    <section style={{ marginTop: "60px" }}>
      <h3>{t("governance.title")}</h3>

      {governor && (
        <>
          <h4>{t("governance.register_vault")}</h4>

          <input
            placeholder={t("governance.vault_id_ph")}
            onChange={e => setForm({ ...form, vaultId: e.target.value })}
          />
          <input
            placeholder={t("governance.vault_contract_ph")}
            onChange={e => setForm({ ...form, vaultContract: e.target.value })}
          />
          <input
            placeholder={t("governance.swap_contract_ph")}
            onChange={e => setForm({ ...form, swapContract: e.target.value })}
          />

          <label>
            <input
              type="checkbox"
              onChange={e =>
                setForm({ ...form, premiumRequired: e.target.checked })
              }
            />
            {t("governance.premium_required")}
          </label>

          <button onClick={submitVault}>{t("governance.register_btn")}</button>
        </>
      )}

      {emergency && (
        <>
          <h4>{t("governance.emergency")}</h4>
          <button onClick={pause}>{t("governance.pause")}</button>
          <button onClick={unpause}>{t("governance.unpause")}</button>
        </>
      )}

      {status && <p>{status}</p>}
    </section>
  );
}
