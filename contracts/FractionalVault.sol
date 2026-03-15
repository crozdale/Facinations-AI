// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";

contract FractionalVault is ERC1155, IERC2981, Ownable {
    string public vaultId;
    string public legalURI;

    address private _royaltyReceiver;
    uint96 private _royaltyFee;

    constructor(
        string memory _vaultId,
        string memory _uri,
        string memory _legalURI,
        address royaltyReceiver_,
        uint96 royaltyFee_
    )
        ERC1155(_uri)
        Ownable(msg.sender)
    {
        vaultId = _vaultId;
        legalURI = _legalURI;
        _royaltyReceiver = royaltyReceiver_;
        _royaltyFee = royaltyFee_;
    }

    function mintFraction(
        address to,
        uint256 tokenId,
        uint256 amount
    ) external onlyOwner {
        _mint(to, tokenId, amount, "");
    }

    function royaltyInfo(
        uint256,
        uint256 salePrice
    )
        external
        view
        override
        returns (address receiver, uint256 royaltyAmount)
    {
        uint256 amount = (salePrice * _royaltyFee) / 10000;
        return (_royaltyReceiver, amount);
    }

    function updateRoyalty(address receiver, uint96 fee) external onlyOwner {
        _royaltyReceiver = receiver;
        _royaltyFee = fee;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155, IERC165)
        returns (bool)
    {
        return
            interfaceId == type(IERC2981).interfaceId ||
            super.supportsInterface(interfaceId);
    }
}
