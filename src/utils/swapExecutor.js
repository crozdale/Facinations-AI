import { ethers } from "ethers";

export async function executeSwap({
  provider,
  tokenIn,
  tokenOut,
  amountIn,
  slippage,
}) {
  const signer = await provider.getSigner();

  const router = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
  const erc20Abi = [
    "function approve(address spender, uint amount) external returns (bool)"
  ];

  const routerAbi = [
    "function exactInputSingle((address,address,uint24,address,uint256,uint256,uint160)) payable returns (uint256)"
  ];

  const amountInWei = ethers.parseEther(amountIn);
  const minOut = 0; // simplified (slippage later)

  const token = new ethers.Contract(tokenIn, erc20Abi, signer);
  await token.approve(router, amountInWei);

  const routerContract = new ethers.Contract(router, routerAbi, signer);

  const tx = await routerContract.exactInputSingle({
    tokenIn,
    tokenOut,
    fee: 3000,
    recipient: await signer.getAddress(),
    deadline: Math.floor(Date.now() / 1000) + 600,
    amountIn: amountInWei,
    amountOutMinimum: minOut,
    sqrtPriceLimitX96: 0,
  });

  return tx;
}
