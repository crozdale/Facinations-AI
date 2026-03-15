// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IPremiumAccess {
    function hasPremium(address user) external view returns (bool);
}

abstract contract VaultPremiumGuard {
    IPremiumAccess public immutable PREMIUM_ACCESS;

    error PremiumRequired();

    constructor(address premiumAccess) {
        PREMIUM_ACCESS = IPremiumAccess(premiumAccess);
    }

    modifier onlyPremium() {
        if (!PREMIUM_ACCESS.hasPremium(msg.sender)) {
            revert PremiumRequired();
        }
        _;
    }
}
