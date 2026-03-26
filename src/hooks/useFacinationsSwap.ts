// src/hooks/useFacinationsSwap.ts
// All swaps execute through the Vault Sale contract (VAULT_SALE_ADDRESS).
// The vaultAddress param is informational only — passed through for future ABI extensions
// that accept a vault address (e.g. swapForVault(vault, amountIn, minOut)).
import { useMemo } from "react";
import { ethers } from "ethers";
import { useSwapContract } from "./useSwapContract";
import { VAULT_SALE_ADDRESS } from "../config/swapContracts";
import { useWeb3 } from "./useWeb3";

export function useFacinationsSwap(_vaultAddress?: string) {
  const { signer, chainId, connect, account } = useWeb3();

  const isOnCorrectChain = useMemo(() => !!chainId, [chainId]);

  // Always use the Vault Sale contract for execution
  const contract = useSwapContract(VAULT_SALE_ADDRESS || undefined, signer || undefined);

  async function getQuote(amountInHuman: string): Promise<string | null> {
    if (!contract || !amountInHuman) return null;
    const amountIn = ethers.parseUnits(amountInHuman, 18);
    const amountOut = await contract.getQuote(amountIn);
    return ethers.formatUnits(amountOut, 18);
  }

  async function executeSwap(amountInHuman: string, minOutHuman: string) {
    if (!contract) throw new Error("Swap contract not ready");
    if (!amountInHuman) throw new Error("Missing amountIn");
    const amountIn = ethers.parseUnits(amountInHuman, 18);
    const minOut =
      minOutHuman && Number(minOutHuman) > 0
        ? ethers.parseUnits(minOutHuman, 18)
        : 0n;
    const tx = await contract.swap(amountIn, minOut);
    return tx.wait();
  }

  return {
    contract,
    isOnCorrectChain,
    account,
    connect,
    getQuote,
    executeSwap,
  };
}
