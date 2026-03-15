import { Contract } from "ethers";
import XERPremiumGate from "./abis/XERPremiumGate.json";
import { getProvider } from "./provider";

export async function activatePremium(address: string) {
  const provider = await getProvider();
  const signer = await provider.getSigner();

  const contract = new Contract(
    "XER_PREMIUM_GATE_ADDRESS",
    XERPremiumGate,
    signer
  );

  return contract.activate();
}
