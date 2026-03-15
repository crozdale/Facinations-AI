import { useState } from "react";

/**
 * Slippage stored as percent (e.g. 0.5 = 0.5%)
 */
export function useSlippage(defaultPct = 0.5) {
  const [slippagePct, setSlippagePct] = useState(defaultPct);

  function computeMinOut(quotedOut) {
    if (!quotedOut) return null;
    const factor = (100 - slippagePct) / 100;
    return Math.floor(Number(quotedOut) * factor);
  }

  return {
    slippagePct,
    setSlippagePct,
    computeMinOut
  };
}
