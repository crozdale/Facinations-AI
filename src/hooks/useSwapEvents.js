import { useEffect } from "react";
import { ethers } from "ethers";
import { useEventProvider } from "./useEventProvider";

export function useSwapEvents(swapAddress, onEvent) {
  const provider = useEventProvider();

  useEffect(() => {
    if (!swapAddress) return;

    const swap = new ethers.Contract(
      swapAddress,
      [
        "event SwapExecuted(address indexed user,uint256 amountIn,uint256 amountOut)"
      ],
      provider
    );

    swap.on("SwapExecuted", (user, amountIn, amountOut) => {
      onEvent({ user, amountIn, amountOut });
    });

    return () => {
      swap.removeAllListeners();
    };
  }, [swapAddress]);
}
