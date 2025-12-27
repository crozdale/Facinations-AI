import { useEffect, useState } from "react";
import { ethers } from "ethers";

const ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function royaltyInfo(uint256 tokenId, uint256 salePrice) view returns (address, uint256)"
];

export function useGalleryNFTs({ provider, account, contractAddress }) {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    if (!provider || !account || !contractAddress) return;

    const load = async () => {
      try {
        setStatus("loading");
        const contract = new ethers.Contract(contractAddress, ABI, provider);
        const balance = Number(await contract.balanceOf(account));
        const results = [];

        for (let i = 0; i < balance; i++) {
          const tokenId = await contract.tokenOfOwnerByIndex(account, i);
          const uri = await contract.tokenURI(tokenId);
          const meta = await fetch(
            uri.replace("ipfs://", "https://ipfs.io/ipfs/")
          ).then(r => r.json());

          const salePrice = ethers.parseEther("1");
          const [receiver, royalty] = await contract.royaltyInfo(
            tokenId,
            salePrice
          );

          results.push({
            id: tokenId.toString(),
            name: meta.name,
            image: meta.image.replace("ipfs://", "https://ipfs.io/ipfs/"),
            royaltyPercent: ((Number(royalty) / Number(salePrice)) * 100).toFixed(2),
            royaltyReceiver: receiver
          });
        }

        setItems(results);
        setStatus("success");
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    };

    load();
  }, [provider, account, contractAddress]);

  return { items, status };
}
