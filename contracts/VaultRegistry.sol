// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract VaultRegistry {
    struct Vault {
        string vaultId;
        uint256 tokenId;
        address contractAddress;
        string legalURI;
        bool active;
    }

    event VaultRegistered(
        string vaultId,
        uint256 tokenId,
        address contractAddr,
        string legalURI
    );

    mapping(string => Vault) public vaults;

    function registerVault(
        string calldata vaultId,
        uint256 tokenId,
        address contractAddr,
        string calldata legalURI
    ) external {
        vaults[vaultId] = Vault(
            vaultId,
            tokenId,
            contractAddr,
            legalURI,
            true
        );

        emit VaultRegistered(
            vaultId,
            tokenId,
            contractAddr,
            legalURI
        );
    }
}
