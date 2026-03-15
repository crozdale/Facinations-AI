import { useState } from "react";
import { executeSwap } from "../web3/swap";
import PremiumGate from "./PremiumGate";

export default function SwapPanel({ swapAddress, premiumRequired, isPremium }) {
  const [amount, setAmount] = useState("");

  async function onSwap() {
    const amt = BigInt(amount);
    await executeSwap(swapAddress, amt);
  }

  return (
    <PremiumGate allowed={!premiumRequired || isPremium}>
      <div>
        <input
          placeholder="Amount In"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />
        <button onClick={onSwap}>Swap</button>
      </div>
    </PremiumGate>
  );
}
