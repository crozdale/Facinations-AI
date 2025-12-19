import { createContext, useContext, useEffect, useState } from "react";
import { BrowserProvider } from "ethers";

const Web3Context = createContext(null);

export function Web3Provider({ children }) {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);

  async function connect() {
    if (!window.ethereum) {
      alert("No wallet detected");
      return;
    }
    const p = new BrowserProvider(window.ethereum);
    const signer = await p.getSigner();
    const addr = await signer.getAddress();
    const network = await p.getNetwork();

    setProvider(p);
    setAccount(addr);
    setChainId(Number(network.chainId));
  }

  useEffect(() => {
    if (!window.ethereum) return;
    window.ethereum.on("accountsChanged", () => connect());
    window.ethereum.on("chainChanged", () => window.location.reload());
  }, []);

  return (
    <Web3Context.Provider value={{ provider, account, chainId, connect }}>
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  return useContext(Web3Context);
}
