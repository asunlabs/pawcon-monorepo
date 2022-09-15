// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "@openzeppelin/contracts/utils/Counters.sol";
import "./PairPool.sol";

/// @author @developerasun
/// @dev Factory contract generating pair pool contract, not deployable
abstract contract AbsPairPoolFactory {
    using Counters for Counters.Counter;
    Counters.Counter private _poolId;

    /// @dev pool id => pool contract address
    mapping(uint256 => PairPoolData) public poolList;

    event PairPoolCreated(address _pairPool);
    event PoolCreationFailed(string _reason);

    struct PairPoolData {
        uint256 id;
        uint256 fundLimit;
        address leftToken;
        address rightToken;
        address addr;
    }

    function initPool(address left, address right) internal virtual {
        // 1. should create a new pool
        PairPool pairPool;
        try new PairPool() returns (PairPool _pairPool) {
            pairPool = _pairPool;
            emit PairPoolCreated(address(_pairPool));
        } catch Error(string memory reason) {
            emit PoolCreationFailed(reason);
        }

        // 2. should enlist pool struct
        uint256 poolId = _poolId.current();
        uint256 defaultFundLimit = 100;

        PairPoolData memory pairPoolData = PairPoolData({
            id: poolId,
            fundLimit: defaultFundLimit,
            leftToken: left,
            rightToken: right,
            addr: address(pairPool)
        });

        poolList[poolId] = pairPoolData;
        _poolId.increment();
    }

    function getTokenPairAddress(uint256 poolId) public virtual returns (address, address) {
        address left = poolList[poolId].leftToken;
        address right = poolList[poolId].rightToken;

        return (left, right);
    }

    function setPoolFundLimitation() internal virtual {}

    // solhint-disable-next-line
    receive() external payable {}
}
