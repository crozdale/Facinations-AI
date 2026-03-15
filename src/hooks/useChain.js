import { useEffect, useState } from "react";

export function useChain() {
  const [chainId, setChainId] = useState(null);

  useEffect(() => {
    if (!window.ethereum) return;

    async function load() {
      const id = await window.ethereum.request({
        method: "eth_chainId"
      });
      setChainId(parseInt(id, 16));
    }

    window.ethereum.on("chainChanged", (id) => {
      setChainId(parseInt(id, 16));
    });

    load();
  }, []);

  return chainId;
}
