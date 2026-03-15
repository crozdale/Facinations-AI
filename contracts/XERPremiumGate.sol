// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract XERPremiumGate {
    event PremiumPurchased(
        address indexed buyer,
        uint256 amount,
        uint256 timestamp
    );

    function purchasePremium() external payable {
        emit PremiumPurchased(
            msg.sender,
            msg.value,
            block.timestamp
        );
    }
}
