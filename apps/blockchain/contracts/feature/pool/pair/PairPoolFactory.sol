// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "./AbsPairPoolFactory.sol";

contract PairPoolFactory is AbsPairPoolFactory {
    function setPoolFundLimitation() internal override {}
}
