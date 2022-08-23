// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "@chainlink/contracts/src/v0.8/mocks/MockAggregator.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ExtendedMockAggregator is MockAggregator {
    using Counters for Counters.Counter;
    Counters.Counter private _index;

    mapping(uint256 => bytes32) mockRegistry;

    function convertToBytes32(string memory _feeds) private pure returns (bytes32) {
        return keccak256(abi.encodePacked(_feeds));
    }

    function register(string memory _feeds) external {
        bytes32 _registry = convertToBytes32(_feeds);
        uint256 index = _index.current();
        mockRegistry[index] = _registry;
        _index.increment();
    }
}
