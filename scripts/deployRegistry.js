import { ethers } from "hardhat";

async function main() {
  const [admin] = await ethers.getSigners();

  const premiumAccess = "0x0000000000000000000000000000000000000000"; // deployed PremiumAccess

  const Registry = await ethers.getContractFactory("VaultRegistry");
  const registry = await Registry.deploy(
    admin.address,
    premiumAccess
  );

  await registry.waitForDeployment();

  console.log("VaultRegistry deployed to:", await registry.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
