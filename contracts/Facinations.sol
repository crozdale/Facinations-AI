// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Facinations is ERC721URIStorage, ERC2981, Ownable {
    uint256 private _tokenCounter;

    constructor(
        string memory name_,
        string memory symbol_,
        address initialOwner,
        address royaltyReceiver,
        uint96 royaltyFee
    )
        ERC721(name_, symbol_)
        Ownable(initialOwner)
    {
        _setDefaultRoyalty(royaltyReceiver, royaltyFee);
        _tokenCounter = 0;
    }

    function mint(
        address to,
        string memory uri
    ) external onlyOwner {
        uint256 tokenId = _tokenCounter;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        _tokenCounter++;
    }

    // 🔑 THIS IS THE FIX
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721URIStorage, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
cd C:\Users\crozd\Downloads\facinations-foundry
set SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/4f9f75fdaf684612a5a51450cbd25832
set PRIVATE_KEY=0xcffe123456933ac37ae163d993ea93352ae663fd28e3471fcd4898edc780ff6
forge script script/DeployVaultRegistry.s.sol --rpc-url %SEPOLIA_RPC_URL% --private-key %PRIVATE_KEY% --broadcast

