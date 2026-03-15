// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "contracts/PremiumAccess.sol";
import "contracts/FacinationsNFT.sol";
import "contracts/VaultRegistry.sol";
import "contracts/XERPremiumGate.sol";
import "contracts/FacinationsVaultDeFi.sol";

contract Deploy is Script {

    address constant XER_TOKEN         = 0xc9D529c95D6C2Fc35283208494B95578553f89A7;
    address constant ADMIN             = 0x91c5c3E065177402EF27CDA2BBB83979bA803AE5;
    address constant ROYALTY_RECEIVER  = ADMIN;
    uint96  constant ROYALTY_FEE_BPS   = 500;
    uint256 constant PREMIUM_PRICE_ETH = 0.01 ether;
    address constant UNISWAP_V3_ROUTER = 0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E;

    function run() external {
        vm.startBroadcast();

        PremiumAccess premiumAccess = new PremiumAccess(XER_TOKEN, ADMIN);
        console.log("PremiumAccess:      ", address(premiumAccess));

        FacinationsNFT nft = new FacinationsNFT(ADMIN, ROYALTY_RECEIVER, ROYALTY_FEE_BPS);
        console.log("FacinationsNFT:     ", address(nft));

        VaultRegistry registry = new VaultRegistry(ADMIN);
        console.log("VaultRegistry:      ", address(registry));

        XERPremiumGate xerGate = new XERPremiumGate(ADMIN, PREMIUM_PRICE_ETH);
        console.log("XERPremiumGate:     ", address(xerGate));

        FacinationsVaultDeFi vaultDeFi = new FacinationsVaultDeFi(
            XER_TOKEN, address(premiumAccess), address(nft),
            address(registry), UNISWAP_V3_ROUTER, ADMIN, ADMIN
        );
        console.log("FacinationsVaultDeFi:", address(vaultDeFi));

        nft.grantMinter(address(vaultDeFi));
        registry.grantRole(registry.REGISTRAR_ROLE(), address(vaultDeFi));

        vm.stopBroadcast();

        console.log("\n=== DEPLOYMENT SUMMARY ===");
        console.log("PremiumAccess:      ", address(premiumAccess));
        console.log("FacinationsNFT:     ", address(nft));
        console.log("VaultRegistry:      ", address(registry));
        console.log("XERPremiumGate:     ", address(xerGate));
        console.log("FacinationsVaultDeFi:", address(vaultDeFi));
    }
}