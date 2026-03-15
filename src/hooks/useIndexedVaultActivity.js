import { CHAINS } from "../chains/chains";
import { useChain } from "./useChain";

export async function fetchVaultActivity(vaultId, chainId) {
  const endpoint = CHAINS[chainId].subgraph;

  const query = `
    {
      fractionalizations(
        where: { vault: "${vaultId}" }
        orderBy: timestamp
        orderDirection: desc
      ) {
        user
        amount
        timestamp
      }
      swaps(
        where: { vault: "${vaultId}" }
        orderBy: timestamp
        orderDirection: desc
      ) {
        user
        amountIn
        amountOut
        timestamp
      }
    }
  `;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query })
  });

  return (await res.json()).data;
}
