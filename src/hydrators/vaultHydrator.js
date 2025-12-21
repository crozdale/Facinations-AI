import { Contract } from "ethers";

/**
 * Read-only vault hydration.
 * NO writes. NO side effects.
 * Safe to call without wallet connection.
 */
export async function hydrateVaultFromChain({
  provider,
  vaultAddress,
  vaultAbi
}) {
  if (!provider || !vaultAddress || !vaultAbi) {
    return null;
  }

  const contract = new Contract(vaultAddress, vaultAbi, provider);

  try {
    const [
      name,
      symbol,
      totalSupply
    ] = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.totalSupply()
    ]);

    return {
      name,
      symbol,
      totalSupply: totalSupply.toString()
    };
  } catch (err) {
    console.error("Vault hydration failed:", err);
    return null;
  }
}
