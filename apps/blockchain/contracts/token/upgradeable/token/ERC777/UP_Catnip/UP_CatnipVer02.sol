// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "./UP_Catnip.sol";

contract UP_CatnipVer02 is UP_Catnip {
    function increaseNumber() external {
        number = number + 1;
    }

    function catnipVersion() external pure returns (uint256) {
        return 2;
    }
}
