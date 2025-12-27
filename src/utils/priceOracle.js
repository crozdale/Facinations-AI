export async function getTokenPrice(symbol) {
  const feeds = {
    ETH: "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
    USDC: "https://api.coingecko.com/api/v3/simple/price?ids=usd-coin&vs_currencies=usd",
    DAI: "https://api.coingecko.com/api/v3/simple/price?ids=dai&vs_currencies=usd",
  };

  const res = await fetch(feeds[symbol]);
  const data = await res.json();

  return Object.values(data)[0].usd;
}
