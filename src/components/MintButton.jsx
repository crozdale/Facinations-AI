import { ethers } from "ethers";
import { useWeb3 } from "../providers/Web3Provider";

const CONTRACT = "0xYOUR_CONTRACT_ADDRESS";

export default function MintButton() {
  const { provider, account } = useWeb3();

  const mint = async () => {
    if (!provider || !account) return alert("Connect wallet");

    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      CONTRACT,
      ["function mint(string) payable"],
      signer
    );

    await contract.mint(
      "ipfs://QmYourMetadataCID",
      { value: ethers.parseEther("0.01") }
    );
  };

  return (
    <button
      onClick={mint}
      className="px-6 py-3 bg-black text-white rounded-lg"
    >
      Mint NFT
    </button>
  );
}
