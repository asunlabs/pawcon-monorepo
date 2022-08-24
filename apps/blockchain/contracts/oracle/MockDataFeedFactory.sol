// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "@openzeppelin/contracts/utils/Counters.sol";
import "./DataFeedFactory.sol";

contract MockAggregator {
    int256 public s_answer;

    function setMockedLatestAnswer(int256 answer) public virtual {
        s_answer = answer;
    }

    function getMockedLatestAnswer() public view virtual returns (int256) {
        return s_answer;
    }
}

contract MockDataFeedFactory is MockAggregator, DataFeedFactory {
    function setMockedLatestAnswer(int256 answer) public override onlyOwner {
        s_answer = answer;
    }

    function getMockedLatestAnswer() public view override returns (int256) {
        return s_answer;
    }
}
