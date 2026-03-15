// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Vault1155 is ERC1155, Ownable {
    constructor(
        string memory uri_,
        address initialOwner
    )
        ERC1155(uri_)
        Ownable(initialOwner)
    {}
}
