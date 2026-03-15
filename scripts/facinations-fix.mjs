import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const root = process.cwd();

function run(cmd) {
  console.log("▶", cmd);
  execSync(cmd, { stdio: "inherit" });
}

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

/* 1️⃣ Compile contracts */
run("npx hardhat compile");

/* 2️⃣ Copy ABIs into subgraph */
const abiSrc = path.join(root, "artifacts/contracts");
const abiDst = path.join(root, "subgraph/abis");

ensureDir(abiDst);

["VaultRegistry", "XERPremiumGate"].forEach(name => {
  const src = path.join(abiSrc, `${name}.sol/${name}.json`);
  const dst = path.join(abiDst, `${name}.json`);
  fs.copyFileSync(src, dst);
});

/* 3️⃣ Generate subgraph.yaml */
const yaml = `
specVersion: 0.0.4
schema:
  file: ./schema.graphql

dataSources:
  - kind: ethereum
    name: VaultRegistry
    network: sepolia
    source:
      abi: VaultRegistry
      address: "0xYOUR_REGISTRY_ADDRESS"
      startBlock: 0
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.6
      language: wasm/assemblyscript
      entities:
        - Vault
      abis:
        - name: VaultRegistry
          file: ./abis/VaultRegistry.json
      eventHandlers:
        - event: VaultRegistered(string,uint256,address,string)
          handler: handleVaultRegistered
      file: ./src/mappings.ts

  - kind: ethereum
    name: XERPremiumGate
    network: sepolia
    source:
      abi: XERPremiumGate
      address: "0xYOUR_PREMIUM_GATE_ADDRESS"
      startBlock: 0
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.6
      language: wasm/assemblyscript
      entities:
        - PremiumUser
      abis:
        - name: XERPremiumGate
          file: ./abis/XERPremiumGate.json
      eventHandlers:
        - event: PremiumPurchased(address)
          handler: handlePremiumPurchased
      file: ./src/mappings.ts
`;

fs.writeFileSync(path.join(root, "subgraph/subgraph.yaml"), yaml.trim());

/* 4️⃣ Codegen + Deploy */
run("cd subgraph && npx graph codegen");
console.log("✅ Facinations pipeline fixed");
