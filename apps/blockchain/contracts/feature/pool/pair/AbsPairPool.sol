// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

abstract contract AbsPairPool {
    function provideLiquidity() internal virtual {}

    function calcualteReward() internal virtual {}

    function rewardLiquidityProvider() internal virtual {}
}
