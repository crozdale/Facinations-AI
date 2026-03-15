// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./RegistryBoundVault.sol";

contract ExampleVault is RegistryBoundVault {

    uint256 public storedValue;

    constructor(
        address registry,
        string memory vaultId
    )
        RegistryBoundVault(registry, vaultId)
    {}

    function updateValue(uint256 newValue)
        external
        onlyAuthorized
    {
        storedValue = newValue;
    }
}
