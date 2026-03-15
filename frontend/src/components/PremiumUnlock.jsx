import { useState } from "react";
import { unlockPremium } from "../web3/premium";

export default function PremiumUnlock() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onUnlock() {
    try {
      setLoading(true);
      await unlockPremium();
    } catch (e) {
      setError(e.message || "Transaction failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h3>Premium Access</h3>
      <p>Unlock fractionalization & swaps</p>
      <p><strong>Cost:</strong> 100 XER</p>

      <button onClick={onUnlock} disabled={loading}>
        {loading ? "Processing…" : "Unlock Premium"}
      </button>

      {error && <p>{error}</p>}
    </div>
  );
}
