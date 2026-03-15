const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with:", deployer.address);
  console.log("Balance:", hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address)), "ETH");

  const FacinationsNFT = await hre.ethers.getContractFactory("FacinationsNFT");
  const contract = await FacinationsNFT.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("FacinationsNFT deployed to:", address);

  // Save ABI
  const fs = require("fs");
  const artifact = await hre.artifacts.readArtifact("FacinationsNFT");
  fs.writeFileSync("src/abi/FacinationsNFT.json", JSON.stringify(artifact.abi, null, 2));
  console.log("ABI saved to src/abi/FacinationsNFT.json");
  console.log("\nNext: paste this address into src/components/MintButton.jsx");
}

main().catch((err) => { console.error(err); process.exit(1); });
