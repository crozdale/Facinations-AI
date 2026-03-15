import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CHAINS } from "../chains/chains";
import { useChain } from "./useChain";

const REGISTRY_ABI = [
  "function getVaults() view returns (tuple(string vaultId,address vaultContract,address swapContract,bool premiumRequired)[])"
];

export function useOnChainVaults() {
  const chainId = useChain();
  const [vaults, setVaults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!chainId || !CHAINS[chainId]) return;

    async function load() {
      const provider = new ethers.JsonRpcProvider(
        CHAINS[chainId].rpc
      );

      const registry = new ethers.Contract(
        import.meta.env[`VITE_REGISTRY_${chainId}`],
        REGISTRY_ABI,
        provider
      );

      const data = await registry.getVaults();
      setVaults(data);
      setLoading(false);
    }

    load();
  }, [chainId]);

  return { vaults, loading, chainId };
}
