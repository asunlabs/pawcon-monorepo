// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "./UP_Catnip.sol";

contract UP_CatnipVer02 is UP_Catnip {
    uint256 public supplyLimit;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() public override reinitializer(2) {
        __ERC777_init("UP_CatnipVer02", "CN", new address[](0));
        __UUPSUpgradeable_init();
        __Ownable_init();
        // UP_Catnip.initialize();
        supplyLimit = 1000000000 * uint256(10**decimals());
    }

    function catnipVersion() external pure returns (uint256) {
        return 2;
    }
}
