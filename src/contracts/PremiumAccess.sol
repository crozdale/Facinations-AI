// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
}

contract PremiumAccess {
    /*//////////////////////////////////////////////////////////////
                                CONFIG
    //////////////////////////////////////////////////////////////*/

    address public immutable XER_TOKEN;
    address public immutable ADMIN_WALLET;

    uint256 public constant PREMIUM_COST = 100 ether;

    /*//////////////////////////////////////////////////////////////
                                STORAGE
    //////////////////////////////////////////////////////////////*/

    mapping(address => bool) public isPremium;

    /*//////////////////////////////////////////////////////////////
                                EVENTS
    //////////////////////////////////////////////////////////////*/

    event PremiumPurchased(
        address indexed user,
        uint256 amount
    );

    /*//////////////////////////////////////////////////////////////
                                CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    constructor(address xerToken, address adminWallet) {
        require(xerToken != address(0), "Invalid token");
        require(adminWallet != address(0), "Invalid admin");

        XER_TOKEN = xerToken;
        ADMIN_WALLET = adminWallet;
    }

    /*//////////////////////////////////////////////////////////////
                            PREMIUM PURCHASE
    //////////////////////////////////////////////////////////////*/

    function purchasePremium() external {
        require(!isPremium[msg.sender], "Already premium");

        bool success = IERC20(XER_TOKEN).transferFrom(
            msg.sender,
            ADMIN_WALLET,
            PREMIUM_COST
        );

        require(success, "XER transfer failed");

        isPremium[msg.sender] = true;

        emit PremiumPurchased(msg.sender, PREMIUM_COST);
    }

    /*//////////////////////////////////////////////////////////////
                        PREMIUM CHECK (VIEW)
    //////////////////////////////////////////////////////////////*/

    function hasPremium(address user) external view returns (bool) {
        return isPremium[user];
    }
}
