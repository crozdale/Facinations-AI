Write-Host "=== Generating Facinations subgraph.yaml ===" -ForegroundColor Cyan

# Safety check
if (!(Test-Path "subgraph")) {
    Write-Error "subgraph directory not found. Run from Facinations root."
    exit 1
}

# Ensure abis exist
$abiChecks = @(
    "subgraph/abis/VaultRegistry.json",
    "subgraph/abis/XERPremiumGate.json"
)

foreach ($abi in $abiChecks) {
    if (!(Test-Path $abi)) {
        Write-Error "Missing ABI: $abi"
        exit 1
    }
}

# Write subgraph.yaml
$yaml = @"
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
      address: "0x0000000000000000000000000000000000000000"
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
        - event: PremiumPurchased(address,uint256)
          handler: handlePremiumPurchased
      file: ./src/mappings.ts
"@

Set-Content -Path "subgraph/subgraph.yaml" -Value $yaml -Encoding UTF8

Write-Host "✔ subgraph/subgraph.yaml generated" -ForegroundColor Green
Write-Host ""
Write-Host "NEXT:" -ForegroundColor Cyan
Write-Host "  cd subgraph"
Write-Host "  npx graph codegen"
Write-Host "  npx graph build"
Write-Host "  npx graph deploy facinations"
