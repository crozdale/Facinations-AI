import { createContext, useContext, useState } from "react";
import { BrowserProvider } from "ethers";

const Web3Context = createContext();

export function Web3Provider({ children }) {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);

  const connect = async () => {
    const eth = window.ethereum;
    if (!eth) return alert("Install MetaMask");

    const provider = new BrowserProvider(eth);
    const signer = await provider.getSigner();
    const network = await provider.getNetwork();

    setProvider(provider);
    setAccount(await signer.getAddress());
    setChainId(Number(network.chainId));
  };

  return (
    <Web3Context.Provider value={{ provider, account, chainId, connect }}>
      {children}
    </Web3Context.Provider>
  );
}

export const useWeb3 = () => useContext(Web3Context);
