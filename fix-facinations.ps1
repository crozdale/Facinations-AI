Write-Host "=== FACINATIONS STRUCTURE FIX ===" -ForegroundColor Cyan

# Root check
if (!(Test-Path "contracts") -or !(Test-Path "subgraph")) {
    Write-Error "You must run this script from the FACINATIONS ROOT directory."
    exit 1
}

# -------------------------------
# 1. Verify required contracts
# -------------------------------
$requiredContracts = @(
    "contracts/VaultRegistry.sol",
    "contracts/XERPremiumGate.sol"
)

foreach ($file in $requiredContracts) {
    if (!(Test-Path $file)) {
        Write-Error "MISSING CONTRACT: $file"
        exit 1
    }
}

Write-Host "✔ Contracts present"

# -------------------------------
# 2. Verify Hardhat artifacts
# -------------------------------
$artifactPaths = @(
    "artifacts/contracts/VaultRegistry.sol/VaultRegistry.json",
    "artifacts/contracts/XERPremiumGate.sol/XERPremiumGate.json"
)

foreach ($file in $artifactPaths) {
    if (!(Test-Path $file)) {
        Write-Error "ABI NOT FOUND: $file"
        Write-Host "Run: npx hardhat compile" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host "✔ ABIs found in artifacts"

# -------------------------------
# 3. Create subgraph folders
# -------------------------------
$subgraphDirs = @(
    "subgraph/abis",
    "subgraph/src"
)

foreach ($dir in $subgraphDirs) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir | Out-Null
        Write-Host "Created $dir"
    }
}

# -------------------------------
# 4. Copy ABIs into subgraph
# -------------------------------
Copy-Item `
  artifacts/contracts/VaultRegistry.sol/VaultRegistry.json `
  subgraph/abis/VaultRegistry.json -Force

Copy-Item `
  artifacts/contracts/XERPremiumGate.sol/XERPremiumGate.json `
  subgraph/abis/XERPremiumGate.json -Force

Write-Host "✔ ABIs copied to subgraph/abis"

# -------------------------------
# 5. Validate subgraph.yaml
# -------------------------------
if (!(Test-Path "subgraph/subgraph.yaml")) {
    Write-Error "subgraph.yaml is missing"
    exit 1
}

Write-Host "✔ subgraph.yaml present"

# -------------------------------
# 6. Final status
# -------------------------------
Write-Host ""
Write-Host "FACINATIONS STRUCTURE IS NOW VALID" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  cd subgraph"
Write-Host "  npx graph codegen"
Write-Host "  npx graph build"
Write-Host "  npx graph deploy facinations"
