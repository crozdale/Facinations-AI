export const PREMIUM_PRICE = 100n; // 100 XER (raw units handled later)

export const ADMIN_WALLET = "0xADMIN_WALLET_ADDRESS_HERE";

export const XER_TOKEN_ADDRESS = "0xXER_TOKEN_ADDRESS_HERE";

// ERC20 minimal ABI
export const ERC20_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function decimals() view returns (uint8)",
];
