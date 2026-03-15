import { ethers } from "ethers";
import { CHAINS } from "../chains/chains";
import { useChain } from "./useChain";

export function useEventProvider() {
  const chainId = useChain();
  if (!chainId || !CHAINS[chainId]) return null;

  return new ethers.WebSocketProvider(
    CHAINS[chainId].ws
  );
}
