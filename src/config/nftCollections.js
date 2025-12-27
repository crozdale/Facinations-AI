// Configure the ERC-721 collections you want to show in the Gallery.
// IMPORTANT: On-chain wallet token discovery requires ERC721Enumerable (tokenOfOwnerByIndex).
// If your collection does not support enumeration, the Gallery will show empty state (by design).

export const NFT_COLLECTIONS = [
  {
    chainId: 137, // Polygon
    name: "Albatrix",
    address: "0x0d747DCF00c94EB47fa2EAf34a7bf71576461eCB", // <-- replace
  },
];
