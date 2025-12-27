import { ethers } from "ethers";

// Uniswap V3 SwapRouter (same on all chains)
export const UNISWAP_ROUTER = "0xE592427A0AEce92De3Edee1F18E0157C05861564";

// Sepolia USDC (example test token)
export const USDC = {
  address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606EB48", // replace if needed
  decimals: 6,
};

export const WETH = {
  address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
};

export async function swapETHForToken(provider, amountInEth, tokenOut) {
  const signer = await provider.getSigner();

  const routerAbi = [
    "function exactInputSingle((address,address,uint24,address,uint256,uint256,uint160)) payable returns (uint256)"
  ];

  const router = new ethers.Contract(
    UNISWAP_ROUTER,
    routerAbi,
    signer
  );

  const params = {
    tokenIn: WETH.address,
    tokenOut: tokenOut,
    fee: 3000,
    recipient: await signer.getAddress(),
    deadline: Math.floor(Date.now() / 1000) + 60 * 10,
    amountIn: ethers.parseEther(amountInEth),
    amountOutMinimum: 0,
    sqrtPriceLimitX96: 0,
  };

  const tx = await router.exactInputSingle(params, {
    value: ethers.parseEther(amountInEth),
  });

  return tx;
}
