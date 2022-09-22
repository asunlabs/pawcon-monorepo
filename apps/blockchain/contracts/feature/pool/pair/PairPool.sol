// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "./AbsPairPool.sol";

/**
 * 1) Define a pool contract
 * 2) Define a pool factory contract
 */
contract PairPool is AbsPairPool {
    using SafeMath for uint256;

    function provideEthCatnipLiquidity(address _catnip, uint256 catnipAmount) public payable virtual {
        super._provideLiquidity(_catnip, catnipAmount);
    }

    function getEthCatnipPairAmount(address provider) public view returns (uint256, uint256) {
        uint256 left = liquidityBalance[provider].leftTokenAmount;
        uint256 right = liquidityBalance[provider].rightTokenAmount;

        return (left, right);
    }

    /**
     * (ETH, Catnip) yield farming reward: (whole amount of left & right tokens / 2)
     */
    function calculateReward(address provider) public returns (uint256) {
        uint256 rewardAmount = super._calculateReward(provider);
        console.log("pair pool reward amount: ", rewardAmount);
        return rewardAmount;
    }

    function rewardLiquidityProvider(address provider, address _catnip) public {
        super._rewardLiquidityProvider(provider, _catnip);
    }
}
