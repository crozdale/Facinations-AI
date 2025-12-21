import { createContext, useContext, useEffect, useState } from "react";
import { BrowserProvider } from "ethers";

const Web3Context = createContext({
  provider: null,
  account: null,
  chainId: null,
  connect: async () => {},
});

export function Web3Provider({ children }) {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);

  useEffect(() => {
    if (!window.ethereum) return;

    const p = new BrowserProvider(window.ethereum);
    setProvider(p);

    p.getNetwork().then((network) => {
      setChainId(Number(network.chainId));
    });

    window.ethereum.on("accountsChanged", (accounts) => {
      setAccount(accounts?.[0] ?? null);
    });

    window.ethereum.on("chainChanged", (hexId) => {
      setChainId(parseInt(hexId, 16));
    });

    return () => {
      window.ethereum.removeAllListeners("accountsChanged");
      window.ethereum.removeAllListeners("chainChanged");
    };
  }, []);

  async function connect() {
    if (!window.ethereum) {
      alert("No Ethereum wallet detected. Please install MetaMask.");
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
      }
    } catch (err) {
      console.error("Wallet connection rejected:", err);
    }
  }

  return (
    <Web3Context.Provider value={{ provider, account, chainId, connect }}>
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  return useContext(Web3Context);
}
