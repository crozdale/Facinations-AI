import { Contract } from "ethers";
import { getProvider } from "./provider";
import XERPremiumGateABI from "../abis/XERPremiumGate.json";

const PREMIUM_GATE_ADDRESS = "XER_PREMIUM_GATE_ADDRESS";
const PREMIUM_COST = BigInt(100);

export async function unlockPremium() {
  const provider = await getProvider();
  const signer = await provider.getSigner();

  const contract = new Contract(
    PREMIUM_GATE_ADDRESS,
    XERPremiumGateABI,
    signer
  );

  const tx = await contract.activate();
  return tx.wait();
}
