import { ethers } from "ethers";

const QUOTER_ADDRESS = "0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6"; // Uniswap V3 Quoter
const QUOTER_ABI = [
  "function quoteExactInputSingle(address tokenIn,address tokenOut,uint24 fee,uint256 amountIn,uint160 sqrtPriceLimitX96) external returns (uint256 amountOut)"
];

export async function getQuote({
  provider,
  tokenIn,
  tokenOut,
  amountIn,
  decimals = 18,
}) {
  const quoter = new ethers.Contract(QUOTER_ADDRESS, QUOTER_ABI, provider);

  const amountInWei = ethers.parseUnits(amountIn, decimals);

  const amountOut = await quoter.quoteExactInputSingle(
    tokenIn,
    tokenOut,
    3000, // 0.3% pool
    amountInWei,
    0
  );

  return ethers.formatUnits(amountOut, 18);
}
