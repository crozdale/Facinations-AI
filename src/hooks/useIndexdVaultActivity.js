const ENDPOINT =
  "https://api.thegraph.com/subgraphs/name/facinations";

export async function fetchVaultActivity(vaultId) {
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

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query })
  });

  const json = await res.json();
  return json.data;
}
