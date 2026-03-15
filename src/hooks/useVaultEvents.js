import { useEffect } from "react";
import { ethers } from "ethers";
import { useEventProvider } from "./useEventProvider";

export function useVaultEvents(vaultAddress, onEvent) {
  const provider = useEventProvider();

  useEffect(() => {
    if (!vaultAddress) return;

    const vault = new ethers.Contract(
      vaultAddress,
      [
        "event Fractionalized(address indexed user,uint256 amount)"
      ],
      provider
    );

    vault.on("Fractionalized", (user, amount) => {
      onEvent({ user, amount });
    });

    return () => {
      vault.removeAllListeners();
    };
  }, [vaultAddress]);
}
