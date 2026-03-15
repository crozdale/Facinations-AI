export const REQUIRED_CHAIN_ID = 1; // mainnet

export async function getProvider() {
  if (!window.ethereum) throw new Error("Wallet not detected");

  const provider = new BrowserProvider(window.ethereum);
  const network = await provider.getNetwork();

  if (Number(network.chainId) !== REQUIRED_CHAIN_ID) {
    throw new Error("Wrong network");
  }

  return provider;
}
