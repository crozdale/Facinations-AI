const { ethers } = require("hardhat");

async function main() {
  const vaultRegistryAddress = "0x...";   // same as in subgraph.yaml
  const premiumGateAddress  = "0x...";   // same as in subgraph.yaml

  const vaultRegistry = await ethers.getContractAt("VaultRegistry", vaultRegistryAddress);
  const premiumGate   = await ethers.getContractAt("XERPremiumGate", premiumGateAddress);

  // 1) Call the function that emits VaultRegistered(...)
  const tx1 = await vaultRegistry.registerVault(
    "Test vault",           // name or metadata
    1,                      // some uint256 id
    "0xYourNftAddress",     // whatever your event expects
    "ipfs://test"           // metadata string
  );
  await tx1.wait();

  // 2) Call the function that emits your PremiumPurchase event
  const tx2 = await premiumGate.buyPremium({
    value: ethers.parseEther("0.01"),    // adjust to your contract
  });
  await tx2.wait();

  console.log("Sent test VaultRegistered and PremiumPurchase events");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
const { ethers } = require("hardhat");

async function main() {
  const vaultRegistryAddress = "0x...";   // same as in subgraph.yaml
  const premiumGateAddress  = "0x...";   // same as in subgraph.yaml

  const vaultRegistry = await ethers.getContractAt("VaultRegistry", vaultRegistryAddress);
  const premiumGate   = await ethers.getContractAt("XERPremiumGate", premiumGateAddress);

  // 1) Call the function that emits VaultRegistered(...)
  const tx1 = await vaultRegistry.registerVault(
    "Test vault",           // name or metadata
    1,                      // some uint256 id
    "0xYourNftAddress",     // whatever your event expects
    "ipfs://test"           // metadata string
  );
  await tx1.wait();

  // 2) Call the function that emits your PremiumPurchase event
  const tx2 = await premiumGate.buyPremium({
    value: ethers.parseEther("0.01"),    // adjust to your contract
  });
  await tx2.wait();

  console.log("Sent test VaultRegistered and PremiumPurchase events");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
