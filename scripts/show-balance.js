import hardhat from "hardhat";

const { ethers } = hardhat;

async function main() {
  const [signer] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(signer.address);
  console.log("Signer:", signer.address);
  console.log("Balance (wei):", balance.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
