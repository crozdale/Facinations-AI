import { useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  XER_PREMIUM_GATE_ADDRESS,
  XER_PREMIUM_GATE_ABI
} from "../contracts/XERPremiumGate";

export function usePremium() {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function check() {
      if (!window.ethereum) return;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      const gate = new ethers.Contract(
        XER_PREMIUM_GATE_ADDRESS,
        XER_PREMIUM_GATE_ABI,
        provider
      );

      const result = await gate.isPremium(address);
      setIsPremium(result);
      setLoading(false);
    }

    check();
  }, []);

  return { isPremium, loading };
}
