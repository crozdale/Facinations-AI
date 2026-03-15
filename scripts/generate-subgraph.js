import fs from "fs";

const yaml = `
specVersion: 0.0.4
schema:
  file: ./schema.graphql

dataSources:
  - kind: ethereum
    name: VaultRegistry
    network: mainnet
    source:
      abi: VaultRegistry
      address: "0x0000000000000000000000000000000000000000"
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.6
      language: wasm/assemblyscript
      entities:
        - Vault
      abis:
        - name: VaultRegistry
          file: ../artifacts/contracts/VaultRegistry.sol/VaultRegistry.json
      eventHandlers:
        - event: VaultRegistered(string,uint256,address,string)
          handler: handleVaultRegistered
      file: ./src/mappings.ts

  - kind: ethereum
    name: XERPremiumGate
    network: mainnet
    source:
      abi: XERPremiumGate
      address: "0x0000000000000000000000000000000000000000"
    mapping:
      kind: ethereum/events
      apiVersion: 0.0.6
      language: wasm/assemblyscript
      entities:
        - PremiumPurchase
      abis:
        - name: XERPremiumGate
          file: ../artifacts/contracts/XERPremiumGate.sol/XERPremiumGate.json
      eventHandlers:
        - event: PremiumPurchased(address,uint256)
          handler: handlePremiumPurchased
      file: ./src/mappings.ts
`;

fs.writeFileSync("subgraph/subgraph.yaml", yaml.trim());
console.log("✅ subgraph.yaml generated");
