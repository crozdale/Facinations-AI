import { useState, useEffect } from "react";
import { ethers } from "ethers";
export default function WalletConnect() {
  const [address, setAddress] = useState(null);
  const [status, setStatus] = useState("idle");
  useEffect(() => {
    const check = async () => {
      if (!window.ethereum) return;
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) { setAddress(await accounts[0].getAddress()); setStatus("connected"); }
      } catch {}
    };
    check();
    window.ethereum?.on("accountsChanged", (accounts) => {
      if (accounts.length > 0) { setAddress(accounts[0]); setStatus("connected"); }
      else { setAddress(null); setStatus("idle"); }
    });
  }, []);
  const connect = async () => {
    if (!window.ethereum) {
      window.open("https://wallet.uniswap.org", "_blank");
      return;
    }
    try {
      setStatus("connecting");
      await window.ethereum.request({ method: "wallet_requestPermissions", params: [{ eth_accounts: {} }] });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      setAddress(await signer.getAddress());
      setStatus("connected");
    } catch { setStatus("idle"); }
  };
  const disconnect = () => { setAddress(null); setStatus("idle"); };
  const short = address ? address.slice(0,6) + "..." + address.slice(-4) : null;
  return (
    <button className="wallet-button" onClick={status === "connected" ? disconnect : connect}
      style={{ fontFamily: "'Cinzel', serif", fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", padding: "0.45rem 1.1rem", background: "none", border: "1px solid rgba(212,175,55,0.4)", color: "#d4af37", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", whiteSpace: "nowrap", transition: "all 0.25s" }}>
      {status === "connected" && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#2ecc71", display: "inline-block", flexShrink: 0 }} />}
      {status === "connected" ? short : status === "connecting" ? "Connecting..." : "Connect Wallet"}
    </button>
  );
}