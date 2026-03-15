#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const root = process.cwd();
const subgraph = path.join(root, "subgraph");
const abisDir = path.join(subgraph, "abis");
const srcDir = path.join(subgraph, "src");

// ---------- helpers ----------
const run = (cmd) => {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { stdio: "inherit" });
};

const ensureDir = (p) => {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
};

// ---------- enforce folders ----------
ensureDir(subgraph);
ensureDir(abisDir);
ensureDir(srcDir);

// ---------- compile contracts ----------
run("npx hardhat compile");

// ---------- copy ABIs ----------
const contracts = [
  "VaultRegistry",
  "XERPremiumGate",
];

for (const name of contracts) {
  const src = path.join(
    root,
    "artifacts",
    "contracts",
    `${name}.sol`,
    `${name}.json`
  );

  if (!fs.existsSync(src)) {
    throw new Error(`ABI missing: ${src}`);
  }

  fs.copyFileSync(src, path.join(abisDir, `${name}.json`));
}

// ---------- schema.graphql ----------
fs.writeFileSync(
  path.join(subgraph, "schema.graphql"),
`type Vault @entity(immutable: true) {
  id: ID!
  vaultId: String!
  tokenId: BigInt!
  contractAddress: Bytes!
  legalURI: String!
  createdAt: BigInt!
  txHash: Bytes!
}

type PremiumPurchase @entity(immutable: true) {
  id: ID!
  user: Bytes!
  timestamp: BigInt!
  txHash: Bytes!
}
`
);

// ---------- subgraph.yaml ----------
fs.writeFileSync(
  path.join(subgraph, "subgraph.yaml"),
`specVersion: 0.0.4
schema:
  file: ./schema.graphql

dataSources:
  - kind: ethereum
    name: VaultRegistry
    network: mainnet
    source:
      abi: VaultRegistry
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
    network: mainnet
    source:
      abi: XERPremiumGate
      startBlock: 0
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.6
      language: wasm/assemblyscript
      entities:
        - PremiumPurchase
      abis:
        - name: XERPremiumGate
          file: ./abis/XERPremiumGate.json
      eventHandlers:
        - event: PremiumPurchased(address)
          handler: handlePremiumPurchased
      file: ./src/mappings.ts
`
);

// ---------- mappings.ts ----------
fs.writeFileSync(
  path.join(srcDir, "mappings.ts"),
`import { BigInt } from "@graphprotocol/graph-ts";
import {
  VaultRegistered
} from "../generated/VaultRegistry/VaultRegistry";
import {
  PremiumPurchased
} from "../generated/XERPremiumGate/XERPremiumGate";

import { Vault, PremiumPurchase } from "../generated/schema";

export function handleVaultRegistered(event: VaultRegistered): void {
  let id = event.transaction.hash.toHex();
  let vault = new Vault(id);

  vault.vaultId = event.params.vaultId;
  vault.tokenId = event.params.tokenId;
  vault.contractAddress = event.params.contractAddr;
  vault.legalURI = event.params.legalURI;
  vault.createdAt = event.block.timestamp;
  vault.txHash = event.transaction.hash;

  vault.save();
}

export function handlePremiumPurchased(event: PremiumPurchased): void {
  let id = event.transaction.hash.toHex();
  let p = new PremiumPurchase(id);

  p.user = event.params.user;
  p.timestamp = event.block.timestamp;
  p.txHash = event.transaction.hash;

  p.save();
}
`
);

// ---------- graph ----------
run("cd subgraph && npx graph codegen");
run("cd subgraph && npx graph build");

console.log("\n✅ Facinations subgraph FIXED and READY");
