// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./VaultPremiumGuard.sol";

contract VaultExample is VaultPremiumGuard {

    uint256 public vaultValue;

    constructor(address premiumAccess)
        VaultPremiumGuard(premiumAccess)
    {}

    function fractionalizeVault(uint256 newValue)
        external
        onlyPremium
    {
        vaultValue = newValue;
    }
}
