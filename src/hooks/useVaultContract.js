import { ethers } from "ethers";

const VAULT_ABI = [
  "function premiumRequired() view returns (bool)",
  "function fractionalize(uint256 amount)"
];

export function useVaultContract(address, signer) {
  if (!address || !signer) return null;
  return new ethers.Contract(address, VAULT_ABI, signer);
}
