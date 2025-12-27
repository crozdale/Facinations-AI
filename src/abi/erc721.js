export const ERC721_ABI = [
  // ERC-721 core
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenURI(uint256 tokenId) view returns (string)",

  // Optional ERC721Enumerable (not guaranteed)
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",

  // Optional metadata helpers
  "function name() view returns (string)",
];
