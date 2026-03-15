// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title  XERPremiumGate
 * @notice Accepts ETH payments for premium access to the Facinations protocol.
 *         Funds accumulate in the contract and can only be withdrawn by
 *         addresses holding TREASURY_ROLE.
 */
contract XERPremiumGate is AccessControl, ReentrancyGuard {

    bytes32 public constant TREASURY_ROLE = keccak256("TREASURY_ROLE");

    uint256 public premiumPrice;

    mapping(address => bool)    public hasPremium;
    mapping(address => uint256) public premiumSince;
    mapping(address => uint256) public totalContributed;
    uint256 public totalReceived;

    event PremiumPurchased(address indexed buyer, uint256 amount, uint256 timestamp);
    event PremiumPriceUpdated(uint256 oldPrice, uint256 newPrice, address indexed updatedBy);
    event FundsWithdrawn(address indexed to, uint256 amount, address indexed withdrawnBy);

    error InsufficientPayment(uint256 sent, uint256 required);
    error WithdrawFailed();
    error ZeroAddress();
    error NothingToWithdraw();

    constructor(address admin, uint256 initialPrice) {
        if (admin == address(0)) revert ZeroAddress();
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(TREASURY_ROLE, admin);
        premiumPrice = initialPrice;
    }

    function purchasePremium() external payable nonReentrant {
        if (msg.value < premiumPrice)
            revert InsufficientPayment(msg.value, premiumPrice);

        hasPremium[msg.sender]       = true;
        premiumSince[msg.sender]     = block.timestamp;
        totalContributed[msg.sender] += premiumPrice;
        totalReceived                += premiumPrice;

        emit PremiumPurchased(msg.sender, premiumPrice, block.timestamp);

        uint256 excess = msg.value - premiumPrice;
        if (excess > 0) {
            (bool ok, ) = msg.sender.call{value: excess}("");
            if (!ok) revert WithdrawFailed();
        }
    }

    function withdraw(address to, uint256 amount)
        external
        onlyRole(TREASURY_ROLE)
        nonReentrant
    {
        if (to == address(0)) revert ZeroAddress();
        uint256 balance = address(this).balance;
        if (balance == 0) revert NothingToWithdraw();
        uint256 sendAmount = amount == 0 ? balance : amount;
        if (sendAmount > balance) sendAmount = balance;
        (bool ok, ) = to.call{value: sendAmount}("");
        if (!ok) revert WithdrawFailed();
        emit FundsWithdrawn(to, sendAmount, msg.sender);
    }

    function setPremiumPrice(uint256 newPrice) external onlyRole(DEFAULT_ADMIN_ROLE) {
        emit PremiumPriceUpdated(premiumPrice, newPrice, msg.sender);
        premiumPrice = newPrice;
    }

    function contractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function isPremium(address account) external view returns (bool) {
        return hasPremium[account];
    }

    receive() external payable {
        revert("Use purchasePremium()");
    }
}
