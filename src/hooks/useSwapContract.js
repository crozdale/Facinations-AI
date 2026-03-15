import { ethers } from "ethers";
import { VAULT_SWAP_ABI } from "../contracts/VaultSwap";

export function useSwapContract(swapAddress, signer) {
  if (!swapAddress || !signer) return null;
  return new ethers.Contract(swapAddress, VAULT_SWAP_ABI, signer);
}
