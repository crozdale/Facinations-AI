import { useState } from "react";
import { useWallet } from "../hooks/useWallet";
import { useVaultContract } from "../hooks/useVaultContract";

export default function VaultInteraction({ vault }) {
  const { signer, address, connect } = useWallet();
  const contract = useVaultContract(vault.vaultContract, signer);

  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");

  async function fractionalize() {
    if (!contract) return;
    try {
      setStatus("Submitting transaction…");
      const tx = await contract.fractionalize(amount);
      await tx.wait();
      setStatus("Fractionalization complete");
    } catch (err) {
      setStatus("Transaction failed");
    }
  }

  if (!address) {
    return <button onClick={connect}>Connect Wallet</button>;
  }

  return (
    <section style={{ marginTop: "30px" }}>
      <h3>Vault Actions</h3>

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={e => setAmount(e.target.value)}
      />

      <button onClick={fractionalize}>Fractionalize</button>

      {status && <p>{status}</p>}
    </section>
  );
}
