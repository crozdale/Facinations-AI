
// src/hooks/useSwapContract.ts
import { useMemo } from "react";
import { ethers } from "ethers";
import { VAULT_SWAP_ABI } from "../contracts/VaultSwap";

export function useSwapContract(
  swapAddress: string | undefined,
  signer: ethers.Signer | null | undefined
) {
  return useMemo(() => {
    if (!swapAddress || !signer) return null;
    return new ethers.Contract(swapAddress, VAULT_SWAP_ABI, signer);
  }, [swapAddress, signer]);
}
