// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "./AbsPairPool.sol";

/**
 * 1) Define a pool contract
 * 2) Define a pool factory contract
 */
contract PairPool is AbsPairPool {
    function provideEthCatnipLiquidity(address _catnip, uint256 catnipAmount) public payable virtual {
        _provideLiquidity(_catnip, catnipAmount);
    }

    function getEthCatnipPairAmount(address provider) public view returns (uint256, uint256) {
        uint256 left = liquidityBalance[provider].leftTokenAmount;
        uint256 right = liquidityBalance[provider].rightTokenAmount;

        return (left, right);
    }
}
