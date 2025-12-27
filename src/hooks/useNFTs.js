import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, ABI } from "../data/contract";

export function useNFTs() {
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    async function load() {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

      const ids = [1, 2, 3]; // example tokens
      const items = [];

      for (let id of ids) {
        const uri = await contract.tokenURI(id);
        const url = uri.replace("ipfs://", "https://ipfs.io/ipfs/");
        const meta = await fetch(url).then(r => r.json());

        items.push({
          id,
          ...meta,
          image: meta.image.replace("ipfs://", "https://ipfs.io/ipfs/")
        });
      }

      setNfts(items);
    }

    load();
  }, []);

  return nfts;
}
