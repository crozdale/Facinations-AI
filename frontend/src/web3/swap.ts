import { Contract } from "ethers";
import { getProvider } from "./provider";
import VaultSwapABI from "../abis/VaultSwap.json";

export async function executeSwap(
  swapAddress: string,
  amountIn: bigint
) {
  const provider = await getProvider();
  const signer = await provider.getSigner();

  const swap = new Contract(swapAddress, VaultSwapABI, signer);

  const tx = await swap.swap(amountIn);
  return tx.wait();
}
