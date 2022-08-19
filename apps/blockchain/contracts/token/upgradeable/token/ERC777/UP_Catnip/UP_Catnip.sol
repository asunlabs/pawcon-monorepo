// SPDX-License-Identifier: MIT

pragma solidity ^0.8.15;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC777/ERC777Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

/// @author @developerasun
/// @notice Upgradeable ERC777 Catnip token. Governance token in PawCon project
/// @dev Proxy, UUPS
contract UP_Catnip is Initializable, ERC777Upgradeable, UUPSUpgradeable, OwnableUpgradeable {
    uint256 public supplyLimit;

    /**
     * *_disableInitializers
     * @dev Locks the contract, preventing any future reinitialization. This cannot be part of an initializer call.
     * Calling this in the constructor of a contract will prevent that contract from being initialized or reinitialized
     * to any version. It is recommended to use this to lock implementation contracts that are designed to be called
     * through proxies.
     */
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() public virtual initializer {
        __ERC777_init("UP_Catnip", "CN", new address[](0));
        __UUPSUpgradeable_init();
        __Ownable_init();
        __Setup_init();
    }

    function __Setup_init() private {
        supplyLimit = 1000000000 * uint256(10**decimals());
    }

    /**
     * set who can upgrade contract with access control
     * _authorizeUpgrade must be overridden with access control
     */
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
