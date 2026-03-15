import fs from "fs";

const registry = "contracts/VaultRegistry.sol";
const premium = "contracts/XERPremiumGate.sol";

function check(file, event) {
  const src = fs.readFileSync(file, "utf8");
  if (!src.includes(`event ${event}`)) {
    throw new Error(`Missing ${event} in ${file}`);
  }
}

check(registry, "VaultRegistered");
check(premium, "PremiumPurchased");

console.log("✅ Solidity events verified");
