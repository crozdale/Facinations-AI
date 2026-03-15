import { useState } from "react";
import { ethers } from "ethers";
import { GOVERNANCE_ABI } from "../contracts/Governance";
import { useGovernance } from "../hooks/useGovernance";
import { useChain } from "../hooks/useChain";

export default function GovernancePanel() {
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
      <h3>Governance</h3>

      {governor && (
        <>
          <h4>Register Vault</h4>

          <input
            placeholder="Vault ID"
            onChange={e => setForm({ ...form, vaultId: e.target.value })}
          />
          <input
            placeholder="Vault Contract"
            onChange={e => setForm({ ...form, vaultContract: e.target.value })}
          />
          <input
            placeholder="Swap Contract"
            onChange={e => setForm({ ...form, swapContract: e.target.value })}
          />

          <label>
            <input
              type="checkbox"
              onChange={e =>
                setForm({ ...form, premiumRequired: e.target.checked })
              }
            />
            Premium Required
          </label>

          <button onClick={submitVault}>Register Vault</button>
        </>
      )}

      {emergency && (
        <>
          <h4>Emergency Controls</h4>
          <button onClick={pause}>Pause Protocol</button>
          <button onClick={unpause}>Unpause Protocol</button>
        </>
      )}

      {status && <p>{status}</p>}
    </section>
  );
}
