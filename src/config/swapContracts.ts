// src/config/swapContracts.ts

export const CHAIN_ID = Number(import.meta.env.VITE_CHAIN_ID || 11155111); // Sepolia

export const XER_TOKEN_ADDRESS: string =
  import.meta.env.VITE_XER_TOKEN_ADDRESS || "";

/** Vault Sale contract — executes all vault fraction swaps. */
export const VAULT_SALE_ADDRESS: string =
  import.meta.env.VITE_VAULT_SALE_ADDRESS ||
  "0x9580745edCd853E6c1199e74b6618Ca0890749Df";

/** Legacy alias — kept for backwards compatibility. */
export const BARTER_ESCROW_ADDRESS: string = VAULT_SALE_ADDRESS;
