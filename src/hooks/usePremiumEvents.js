import { useEffect } from "react";
import { ethers } from "ethers";
import {
  XER_PREMIUM_GATE_ADDRESS,
  XER_PREMIUM_GATE_ABI
} from "../contracts/XERPremiumGate";
import { useEventProvider } from "./useEventProvider";

export function usePremiumEvents(onActivate) {
  const provider = useEventProvider();

  useEffect(() => {
    const gate = new ethers.Contract(
      XER_PREMIUM_GATE_ADDRESS,
      [
        "event PremiumActivated(address indexed user)"
      ],
      provider
    );

    gate.on("PremiumActivated", (user) => {
      onActivate(user);
    });

    return () => {
      gate.removeAllListeners();
    };
  }, []);
}
