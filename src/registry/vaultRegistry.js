// ETH-DRY REGISTRY BINDING
// Temporary Ethereum ERC-20 hydration for DRY-RUN validation only
// NOT a production vault topology

export const VAULTS = [
  {
    id: "xer-erc20-eth-dry",
    title: "XER Token (ETH · DRY-RUN)",
    artist: "Xdale / XER",
    status: "dry-run",
    vaultType: "ERC-20 Reference (Read-Only)",

    // Ethereum mainnet
    network: 1,
    enabled: true,

    // Ethereum XER ERC-20 (checksummed)
    contract: "0x2926F34AD98CCc6d90556C9F570E2DEe2dA89eE",

    // Canonical external reference
    externalUrl: "https://xdalegallery.com"
  }
];
