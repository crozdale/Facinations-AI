import { BrowserProvider, Contract, parseUnits } from "ethers";
import ERC20_ABI from "../abi/ERC20Approve.json";
import SWAP_ABI from "../abi/FractionSwap.json";
import { XER_TOKEN } from "../config/tokens";
import { VAULTS } from "../registry/vaultRegistry";

/**
 * BUY fractions with XER
 */
export async function buyFractions(vaultId, amount) {
  const vault = VAULTS.find(v => v.id === vaultId);
  if (!vault) throw new Error("Vault not found");

  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const xer = new Contract(
    XER_TOKEN.address,
    ERC20_ABI,
    signer
  );

  const swap = new Contract(
    vault.fractionContract,
    SWAP_ABI,
    signer
  );

  const parsed = parseUnits(amount, XER_TOKEN.decimals);

  // 1. Approve XER
  const approveTx = await xer.approve(vault.fractionContract, parsed);
  await approveTx.wait();

  // 2. Buy fractions
  const buyTx = await swap.buy(parsed);
  await buyTx.wait();
}

/**
 * SELL fractions back for XER
 */
export async function sellFractions(vaultId, amount) {
  const vault = VAULTS.find(v => v.id === vaultId);
  if (!vault) throw new Error("Vault not found");

  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const swap = new Contract(
    vault.fractionContract,
    SWAP_ABI,
    signer
  );

  const parsed = parseUnits(amount, 18);

  // Sell fractions
  const sellTx = await swap.sell(parsed);
  await sellTx.wait();
}
