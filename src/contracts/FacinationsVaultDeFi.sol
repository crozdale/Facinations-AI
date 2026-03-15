// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

interface IERC20Ext {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
}
interface IPremiumAccess {
    function hasPremium(address user) external view returns (bool);
}

interface IFacinationsNFT {
    function mint(address to, string memory tokenURI) external returns (uint256);
}

interface IVaultRegistry {
    function registerVault(string calldata vaultId, uint256 tokenId, address contractAddr, string calldata legalURI) external;
}

interface ISwapRouter {
    struct ExactInputSingleParams {
        address tokenIn;
        address tokenOut;
        uint24  fee;
        address recipient;
        uint256 deadline;
        uint256 amountIn;
        uint256 amountOutMinimum;
        uint160 sqrtPriceLimitX96;
    }
    function exactInputSingle(ExactInputSingleParams calldata params) external returns (uint256 amountOut);
}

contract FacinationsVaultDeFi is AccessControl, ReentrancyGuard {

    bytes32 public constant OPERATOR_ROLE   = keccak256("OPERATOR_ROLE");
    uint256 public constant SWAP_FEE_BPS    = 10;
    uint256 public constant BPS_DENOMINATOR = 10_000;

    IERC20Ext          public immutable XER;
    IPremiumAccess  public immutable PREMIUM_ACCESS;
    IFacinationsNFT public immutable NFT;
    IVaultRegistry  public immutable REGISTRY;
    ISwapRouter     public immutable SWAP_ROUTER;
    address         public immutable ADMIN_WALLET;

    event VaultMinted(address indexed user, uint256 indexed tokenId, string vaultId, string tokenURI, string legalURI, uint256 timestamp);
    event SwapExecuted(address indexed user, address indexed tokenOut, uint256 amountIn, uint256 feePaid, uint256 amountOut, uint256 timestamp);
    event FeeWithdrawn(address indexed to, address indexed token, uint256 amount, uint256 timestamp);

    error PremiumRequired();
    error ZeroAmount();
    error ZeroAddress();
    error TransferFailed();

    constructor(
        address xerToken,
        address premiumAccess,
        address nftContract,
        address registry,
        address swapRouter,
        address adminWallet,
        address admin
    ) {
        if (xerToken      == address(0)) revert ZeroAddress();
        if (premiumAccess == address(0)) revert ZeroAddress();
        if (nftContract   == address(0)) revert ZeroAddress();
        if (registry      == address(0)) revert ZeroAddress();
        if (swapRouter    == address(0)) revert ZeroAddress();
        if (adminWallet   == address(0)) revert ZeroAddress();
        if (admin         == address(0)) revert ZeroAddress();

        XER            = IERC20Ext(xerToken);
        PREMIUM_ACCESS = IPremiumAccess(premiumAccess);
        NFT            = IFacinationsNFT(nftContract);
        REGISTRY       = IVaultRegistry(registry);
        SWAP_ROUTER    = ISwapRouter(swapRouter);
        ADMIN_WALLET   = adminWallet;

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(OPERATOR_ROLE, admin);
    }

    modifier onlyPremium() {
        if (!PREMIUM_ACCESS.hasPremium(msg.sender)) revert PremiumRequired();
        _;
    }

    function mintVault(string calldata vaultId, string calldata tokenURI, string calldata legalURI)
        external onlyPremium nonReentrant returns (uint256 tokenId)
    {
        tokenId = NFT.mint(msg.sender, tokenURI);
        REGISTRY.registerVault(vaultId, tokenId, address(NFT), legalURI);
        emit VaultMinted(msg.sender, tokenId, vaultId, tokenURI, legalURI, block.timestamp);
    }

    function swap(address tokenOut, uint256 amountIn, uint256 amountOutMin, uint24 poolFee, uint256 deadline)
        external onlyPremium nonReentrant returns (uint256 amountOut)
    {
        if (amountIn == 0)           revert ZeroAmount();
        if (tokenOut == address(0))  revert ZeroAddress();
        if (!XER.transferFrom(msg.sender, address(this), amountIn)) revert TransferFailed();
        uint256 fee        = (amountIn * SWAP_FEE_BPS) / BPS_DENOMINATOR;
        uint256 swapAmount = amountIn - fee;
        if (!XER.transfer(ADMIN_WALLET, fee)) revert TransferFailed();
        XER.approve(address(SWAP_ROUTER), swapAmount);
        amountOut = SWAP_ROUTER.exactInputSingle(ISwapRouter.ExactInputSingleParams({
            tokenIn: address(XER), tokenOut: tokenOut, fee: poolFee,
            recipient: msg.sender, deadline: deadline, amountIn: swapAmount,
            amountOutMinimum: amountOutMin, sqrtPriceLimitX96: 0
        }));
        emit SwapExecuted(msg.sender, tokenOut, amountIn, fee, amountOut, block.timestamp);
    }

    function withdrawToken(address token, address to, uint256 amount)
        external onlyRole(DEFAULT_ADMIN_ROLE) nonReentrant
    {
        if (to == address(0)) revert ZeroAddress();
        if (!IERC20Ext(token).transfer(to, amount)) revert TransferFailed();
        emit FeeWithdrawn(to, token, amount, block.timestamp);
    }

    receive() external payable { revert("No ETH accepted"); }
}