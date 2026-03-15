import { useState } from "react";
import { ethers } from "ethers";
import ABI from "../abi/FacinationsNFT.json";

const CONTRACT = "0x851dA473dA73Ab445641D8b0D981Aa66C917090F";
const SEPOLIA = "0xaa36a7";

export default function MintButton({ metadata }) {
  const [status, setStatus] = useState("idle");
  const [txHash, setTxHash] = useState(null);
  const [error, setError] = useState(null);

  const buildTokenURI = (meta) => {
    const json = JSON.stringify({
      name: meta.name || "Facinations Artwork",
      description: meta.description || "A work from the Facinations collection.",
      image: meta.image || "",
      attributes: meta.attributes || [],
    });
    return "data:application/json;base64," + btoa(unescape(encodeURIComponent(json)));
  };

  const mint = async () => {
    setError(null);
    try {
      setStatus("connecting");
      if (!window.ethereum) throw new Error("No wallet found. Install Uniswap or MetaMask.");
      try {
        await window.ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: SEPOLIA }] });
      } catch (sw) {
        if (sw.code === 4902) {
          await window.ethereum.request({ method: "wallet_addEthereumChain", params: [{
            chainId: SEPOLIA, chainName: "Sepolia Testnet",
            nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
            rpcUrls: ["https://ethereum-sepolia-rpc.publicnode.com"],
            blockExplorerUrls: ["https://sepolia.etherscan.io"],
          }]});
        } else throw sw;
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT, ABI, signer);
      const tokenURI = buildTokenURI(metadata || {});
      setStatus("minting");
      const tx = await contract.mint(await signer.getAddress(), tokenURI);
      setStatus("confirming");
      await tx.wait();
      setTxHash(tx.hash);
      setStatus("success");
    } catch (err) {
      console.error(err);
      setError(err.message || "Transaction failed");
      setStatus("error");
    }
  };

  const btnStyle = {
    fontFamily: "'Cinzel', serif",
    fontSize: "0.7rem",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    padding: "0.85rem 2.5rem",
    border: "1px solid",
    cursor: status === "connecting" || status === "minting" || status === "confirming" ? "not-allowed" : "pointer",
    transition: "all 0.3s",
    background: status === "success" ? "rgba(45,106,45,0.2)" : status === "error" ? "rgba(139,0,0,0.2)" : "rgba(212,175,55,0.08)",
    borderColor: status === "success" ? "#2d6a2d" : status === "error" ? "#8b0000" : "#d4af37",
    color: status === "success" ? "#4caf50" : status === "error" ? "#e57373" : "#d4af37",
  };

  const labels = {
    idle: "✦ Mint to Blockchain",
    connecting: "Connecting Wallet...",
    minting: "Sending Transaction...",
    confirming: "Confirming on Chain...",
    success: "✓ Minted Successfully",
    error: "Retry Mint",
  };

  return (
    <div style={{ textAlign: "center" }}>
      <button onClick={mint} disabled={["connecting","minting","confirming"].includes(status)} style={btnStyle}>
        {labels[status]}
      </button>
      {error && <p style={{ color: "#e57373", fontSize: "0.78rem", marginTop: "0.75rem", fontFamily: "monospace" }}>{error}</p>}
      {txHash && (
        <p style={{ marginTop: "1rem", fontSize: "0.72rem", color: "#7a7268", fontFamily: "'Cinzel', serif", letterSpacing: "0.1em" }}>
          TX:{" "}
          <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer"
            style={{ color: "#d4af37" }}>
            {txHash.slice(0,10)}...{txHash.slice(-8)}
          </a>
        </p>
      )}
    </div>
  );
}