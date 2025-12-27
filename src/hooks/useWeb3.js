import { useCallback, useEffect, useMemo, useState } from "react";
import { BrowserProvider } from "ethers";

export function useWeb3() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);

  const hasWallet = useMemo(() => typeof window !== "undefined" && !!window.ethereum, []);

  const refresh = useCallback(async () => {
    if (!window.ethereum) return;
    const p = new BrowserProvider(window.ethereum);
    setProvider(p);

    const net = await p.getNetwork();
    setChainId(Number(net.chainId));

    const accounts = await p.send("eth_accounts", []);
    const a = accounts?.[0] ?? null;
    setAccount(a);

    if (a) {
      const s = await p.getSigner();
      setSigner(s);
    } else {
      setSigner(null);
    }
  }, []);

  const connect = useCallback(async () => {
    if (!window.ethereum) throw new Error("No wallet detected");
    await window.ethereum.request({ method: "eth_requestAccounts" });
    await refresh();
  }, [refresh]);

  useEffect(() => {
    if (!window.ethereum) return;
    refresh();

    const onAccounts = () => refresh();
    const onChain = () => refresh();

    window.ethereum.on("accountsChanged", onAccounts);
    window.ethereum.on("chainChanged", onChain);

    return () => {
      window.ethereum?.removeListener?.("accountsChanged", onAccounts);
      window.ethereum?.removeListener?.("chainChanged", onChain);
    };
  }, [refresh]);

  return { hasWallet, provider, signer, account, chainId, connect, refresh };
}
