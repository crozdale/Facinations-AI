// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IVaultRegistry {
    function assertVaultAccess(
        string calldata vaultId,
        address user
    ) external view;
}

abstract contract RegistryBoundVault {
    IVaultRegistry public immutable REGISTRY;
    string public VAULT_ID;  // removed immutable — strings cannot be immutable in Solidity

    constructor(address registry, string memory vaultId) {
        require(registry != address(0), "Invalid registry");
        REGISTRY = IVaultRegistry(registry);
        VAULT_ID = vaultId;
    }

    modifier onlyAuthorized() {
        REGISTRY.assertVaultAccess(VAULT_ID, msg.sender);
        _;
    }
}
