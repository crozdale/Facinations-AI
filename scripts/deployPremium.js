import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  const xerToken = "0x0000000000000000000000000000000000000000"; // ← XER
  const adminWallet = "0x0000000000000000000000000000000000000000"; // ← ADMIN

  const PremiumAccess = await ethers.getContractFactory("PremiumAccess");
  const premium = await PremiumAccess.deploy(
    xerToken,
    adminWallet
  );

  await premium.waitForDeployment();

  console.log("PremiumAccess deployed to:", await premium.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
