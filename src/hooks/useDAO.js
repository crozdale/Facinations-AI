import { ethers } from "ethers";
import { DAO_ABI } from "../contracts/DAO";
import { useChain } from "./useChain";

export function useDAO() {
  const chainId = useChain();

  async function getDAO(readOnly = true) {
    const provider = readOnly
      ? new ethers.JsonRpcProvider(import.meta.env[`VITE_RPC_${chainId}`])
      : new ethers.BrowserProvider(window.ethereum);

    const signer = readOnly ? null : await provider.getSigner();

    return new ethers.Contract(
      import.meta.env[`VITE_DAO_${chainId}`],
      DAO_ABI,
      signer || provider
    );
  }

  return { getDAO };
}
