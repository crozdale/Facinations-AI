// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title  VaultRegistry
 * @notice Authoritative on-chain registry of Facinations cultural vaults.
 *         Only addresses holding REGISTRAR_ROLE may register or deactivate vaults.
 */
contract VaultRegistry is AccessControl {

    bytes32 public constant REGISTRAR_ROLE = keccak256("REGISTRAR_ROLE");

    struct Vault {
        string  vaultId;
        uint256 tokenId;
        address contractAddress;
        string  legalURI;
        bool    active;
        address registeredBy;
        uint256 registeredAt;
    }

    mapping(string => Vault) private _vaults;
    string[] private _vaultIds;

    event VaultRegistered(string indexed vaultId, uint256 tokenId, address indexed contractAddr, string legalURI, address indexed registeredBy, uint256 timestamp);
    event VaultDeactivated(string indexed vaultId, address indexed deactivatedBy, uint256 timestamp);
    event VaultLegalURIUpdated(string indexed vaultId, string newLegalURI, address indexed updatedBy, uint256 timestamp);

    error VaultAlreadyExists(string vaultId);
    error VaultNotFound(string vaultId);
    error VaultAlreadyInactive(string vaultId);
    error InvalidContractAddress();
    error EmptyVaultId();

    constructor(address admin) {
        require(admin != address(0), "Admin cannot be zero address");
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(REGISTRAR_ROLE, admin);
    }

    function registerVault(string calldata vaultId, uint256 tokenId, address contractAddr, string calldata legalURI) external onlyRole(REGISTRAR_ROLE) {
        if (bytes(vaultId).length == 0)         revert EmptyVaultId();
        if (contractAddr == address(0))          revert InvalidContractAddress();
        if (_vaults[vaultId].registeredAt != 0) revert VaultAlreadyExists(vaultId);
        _vaults[vaultId] = Vault(vaultId, tokenId, contractAddr, legalURI, true, msg.sender, block.timestamp);
        _vaultIds.push(vaultId);
        emit VaultRegistered(vaultId, tokenId, contractAddr, legalURI, msg.sender, block.timestamp);
    }

    function deactivateVault(string calldata vaultId) external onlyRole(REGISTRAR_ROLE) {
        if (_vaults[vaultId].registeredAt == 0) revert VaultNotFound(vaultId);
        if (!_vaults[vaultId].active)           revert VaultAlreadyInactive(vaultId);
        _vaults[vaultId].active = false;
        emit VaultDeactivated(vaultId, msg.sender, block.timestamp);
    }

    function updateLegalURI(string calldata vaultId, string calldata newLegalURI) external onlyRole(REGISTRAR_ROLE) {
        if (_vaults[vaultId].registeredAt == 0) revert VaultNotFound(vaultId);
        _vaults[vaultId].legalURI = newLegalURI;
        emit VaultLegalURIUpdated(vaultId, newLegalURI, msg.sender, block.timestamp);
    }

    function getVault(string calldata vaultId) external view returns (Vault memory) {
        if (_vaults[vaultId].registeredAt == 0) revert VaultNotFound(vaultId);
        return _vaults[vaultId];
    }

    function isActive(string calldata vaultId) external view returns (bool) { return _vaults[vaultId].active; }
    function totalVaults() external view returns (uint256) { return _vaultIds.length; }
    function getAllVaultIds() external view returns (string[] memory) { return _vaultIds; }
}