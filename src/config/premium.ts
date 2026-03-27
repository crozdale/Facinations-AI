export const PREMIUM_PRICE = 100n; // 100 XER (raw units handled later)

export const ADMIN_WALLET = "0x0d747DCF00c94EB47fa2EAf34a7bf71576461eCB";

export const XER_TOKEN_ADDRESS = "0x2926f34Ad98ccC6d90556c9f570E2DA89eEE";

// ERC20 minimal ABI
export const ERC20_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function decimals() view returns (uint8)",
];
