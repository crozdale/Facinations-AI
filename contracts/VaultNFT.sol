// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VaultNFT is ERC721, Ownable {
    constructor(
        string memory name_,
        string memory symbol_,
        address initialOwner
    )
        ERC721(name_, symbol_)
        Ownable(initialOwner)
    {}
}
