// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title  FacinationsNFT
 * @notice ERC-721 NFT contract for Facinations cultural vault tokens.
 *         Includes ERC-2981 royalty support and role-based minting.
 */
contract FacinationsNFT is ERC721URIStorage, ERC2981, AccessControl {

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    uint256 public tokenCounter;

    event ArtworkMinted(
        uint256 indexed tokenId,
        address indexed to,
        string  tokenURI,
        address indexed minter
    );

    constructor(
        address admin,
        address royaltyReceiver,
        uint96  royaltyFeeBasisPoints
    )
        ERC721("Facinations", "FAC")
    {
        require(admin != address(0), "Admin cannot be zero address");
        require(royaltyReceiver != address(0), "Royalty receiver cannot be zero address");

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);

        _setDefaultRoyalty(royaltyReceiver, royaltyFeeBasisPoints);

        tokenCounter = 0;
    }

    // ─── Minting ──────────────────────────────────────────────────────────────

    function mint(address to, string memory tokenURI)
        external
        onlyRole(MINTER_ROLE)
        returns (uint256)
    {
        uint256 tokenId = tokenCounter;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        tokenCounter++;

        emit ArtworkMinted(tokenId, to, tokenURI, msg.sender);
        return tokenId;
    }

    // ─── Role Management ──────────────────────────────────────────────────────

    function grantMinter(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(MINTER_ROLE, account);
    }

    function revokeMinter(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(MINTER_ROLE, account);
    }

    // ─── Royalties ────────────────────────────────────────────────────────────

    function setDefaultRoyalty(address receiver, uint96 feeBasisPoints)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _setDefaultRoyalty(receiver, feeBasisPoints);
    }

    function setTokenRoyalty(uint256 tokenId, address receiver, uint96 feeBasisPoints)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _setTokenRoyalty(tokenId, receiver, feeBasisPoints);
    }

    // ─── Interface Support ────────────────────────────────────────────────────

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721URIStorage, ERC2981, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
