import { useState } from "react";

export function useXerSwap() {
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");

  // deterministic placeholder rate
  const RATE = 1.0;

  function onFromChange(v) {
    setFromAmount(v);
    if (!v || isNaN(Number(v))) {
      setToAmount("");
      return;
    }
    setToAmount((Number(v) * RATE).toString());
  }

  function swapDirection() {
    const f = fromAmount;
    setFromAmount(toAmount);
    setToAmount(f);
  }

  return {
    fromAmount,
    toAmount,
    onFromChange,
    swapDirection,
    RATE,
  };
}
