// src/hooks/useFacinationsSwap.ts
// Executes token swaps through Uniswap V3 on Sepolia.
// Quote: QuoterV2.quoteExactInputSingle (static call — no gas)
// Execute: ERC20 approve (if needed) → SwapRouter02.exactInputSingle

import { useMemo } from "react";
import { ethers } from "ethers";
import { useWeb3 } from "./useWeb3";
import { XER_TOKEN_ADDRESS } from "../config/swapContracts";

// ── Uniswap V3 Sepolia contract addresses ────────────────────────────────────
const QUOTER_ADDRESS  = "0x61fFE014bA17989E743c5F6cB21bF9697530B21e";
const ROUTER_ADDRESS  = "0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48";
const WETH_ADDRESS    = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14";
const USDC_ADDRESS    = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";
const POOL_FEE        = 3000; // 0.3 %

// ── Minimal ABIs ─────────────────────────────────────────────────────────────
const QUOTER_ABI = [
  "function quoteExactInputSingle((address tokenIn, address tokenOut, uint256 amountIn, uint24 fee, uint160 sqrtPriceLimitX96) params) returns (uint256 amountOut, uint160 sqrtPriceX96After, uint32 initializedTicksCrossed, uint256 gasEstimate)",
];

const ROUTER_ABI = [
  "function exactInputSingle((address tokenIn, address tokenOut, uint24 fee, address recipient, uint256 amountIn, uint256 amountOutMinimum, uint160 sqrtPriceLimitX96) params) payable returns (uint256 amountOut)",
];

const ERC20_ABI = [
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
];

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Returns the ERC-20 address for a token symbol. ETH maps to WETH. */
function resolveAddress(symbol: string): string | null {
  switch (symbol) {
    case "XER":  return XER_TOKEN_ADDRESS || null;
    case "ETH":  return WETH_ADDRESS;
    case "USDC": return USDC_ADDRESS;
    default:     return null; // FRAC is ERC-1155 — not Uniswap-tradeable
  }
}

function decimals(symbol: string): number {
  return symbol === "USDC" ? 6 : 18;
}

// ── Hook ─────────────────────────────────────────────────────────────────────

export function useFacinationsSwap(
  _vaultAddress?: string,
  tokenIn = "ETH",
  tokenOut = "XER"
) {
  const { provider, signer, chainId, connect, account } = useWeb3();

  // Sepolia only
  const isOnCorrectChain = useMemo(() => chainId === 11155111, [chainId]);

  /** Returns human-readable output amount, or null if pool unavailable. */
  async function getQuote(amountInHuman: string): Promise<string | null> {
    if (!provider || !amountInHuman || parseFloat(amountInHuman) <= 0) return null;

    const addrIn  = resolveAddress(tokenIn);
    const addrOut = resolveAddress(tokenOut);
    if (!addrIn || !addrOut) return null;

    const amountIn = ethers.parseUnits(amountInHuman, decimals(tokenIn));
    const quoter   = new ethers.Contract(QUOTER_ADDRESS, QUOTER_ABI, provider);

    try {
      const [amountOut] = await quoter.quoteExactInputSingle.staticCall({
        tokenIn:            addrIn,
        tokenOut:           addrOut,
        amountIn,
        fee:                POOL_FEE,
        sqrtPriceLimitX96:  0n,
      });
      return ethers.formatUnits(amountOut, decimals(tokenOut));
    } catch {
      // Pool likely has no liquidity on testnet yet — surface as null
      return null;
    }
  }

  /** Approves (if needed) and executes the swap via SwapRouter02. */
  async function executeSwap(amountInHuman: string, minOutHuman: string) {
    if (!signer || !account) throw new Error("Wallet not connected");

    const addrIn  = resolveAddress(tokenIn);
    const addrOut = resolveAddress(tokenOut);
    if (!addrIn || !addrOut) throw new Error("Token pair not supported via Uniswap");

    const amountIn = ethers.parseUnits(amountInHuman, decimals(tokenIn));
    const amountOutMinimum =
      minOutHuman && Number(minOutHuman) > 0
        ? ethers.parseUnits(minOutHuman, decimals(tokenOut))
        : 0n;

    const router      = new ethers.Contract(ROUTER_ADDRESS, ROUTER_ABI, signer);
    const isNativeEth = tokenIn === "ETH";

    // ERC-20 approval step (skip for native ETH — router accepts msg.value)
    if (!isNativeEth) {
      const token: ethers.Contract = new ethers.Contract(addrIn, ERC20_ABI, signer);
      const allowance: bigint = await token.allowance(account, ROUTER_ADDRESS);
      if (allowance < amountIn) {
        const approveTx = await token.approve(ROUTER_ADDRESS, amountIn);
        await approveTx.wait();
      }
    }

    const params = {
      tokenIn:           addrIn,
      tokenOut:          addrOut,
      fee:               POOL_FEE,
      recipient:         account,
      amountIn,
      amountOutMinimum,
      sqrtPriceLimitX96: 0n,
    };

    const tx = await router.exactInputSingle(
      params,
      isNativeEth ? { value: amountIn } : {}
    );
    return tx.wait();
  }

  return { getQuote, executeSwap, isOnCorrectChain, account, connect };
}
