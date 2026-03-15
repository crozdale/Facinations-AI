import { ethers } from "ethers";
import {
  ADMIN_WALLET,
  XER_TOKEN_ADDRESS,
  ERC20_ABI,
  PREMIUM_PRICE,
} from "../config/premium";
import { getSigner } from "./wallet";

export async function purchasePremium() {
  const signer = await getSigner();

  const token = new ethers.Contract(
    XER_TOKEN_ADDRESS,
    ERC20_ABI,
    signer
  );

  const decimals = await token.decimals();
  const amount = ethers.parseUnits(PREMIUM_PRICE.toString(), decimals);

  const tx = await token.transfer(ADMIN_WALLET, amount);
  const receipt = await tx.wait();

  setPremiumPending9receipt.hash);


  return tx.wait(); // resolves when mined
  return receipt;
}

