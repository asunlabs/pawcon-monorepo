// SPDX-License-Identifier: MIT

/*
       /$$                               /$$                                                                               
      | $$                              | $$                                                                               
  /$$$$$$$  /$$$$$$  /$$    /$$ /$$$$$$ | $$  /$$$$$$   /$$$$$$   /$$$$$$   /$$$$$$  /$$$$$$   /$$$$$$$ /$$   /$$ /$$$$$$$ 
 /$$__  $$ /$$__  $$|  $$  /$$//$$__  $$| $$ /$$__  $$ /$$__  $$ /$$__  $$ /$$__  $$|____  $$ /$$_____/| $$  | $$| $$__  $$
| $$  | $$| $$$$$$$$ \  $$/$$/| $$$$$$$$| $$| $$  \ $$| $$  \ $$| $$$$$$$$| $$  \__/ /$$$$$$$|  $$$$$$ | $$  | $$| $$  \ $$
| $$  | $$| $$_____/  \  $$$/ | $$_____/| $$| $$  | $$| $$  | $$| $$_____/| $$      /$$__  $$ \____  $$| $$  | $$| $$  | $$
|  $$$$$$$|  $$$$$$$   \  $/  |  $$$$$$$| $$|  $$$$$$/| $$$$$$$/|  $$$$$$$| $$     |  $$$$$$$ /$$$$$$$/|  $$$$$$/| $$  | $$
 \_______/ \_______/    \_/    \_______/|__/ \______/ | $$____/  \_______/|__/      \_______/|_______/  \______/ |__/  |__/
                                                      | $$                                                                 
                                                      | $$                                                                 
                                                      |__/                                                                 
*/

pragma solidity ^0.8.16;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @author @developerasun
/// @dev Dynamic data feeds generation with factory pattern
contract DataFeedFactory is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _feedId;

    mapping(uint256 => AggregatorV3Interface) public feeds;

    /**
     * * As of August 2022, Chainlink starts to support Goerli testnet,
     * * corresponding to Ethereum PoS merge update. But the number of aggregator
     * * is not yet enough.
     * Network: Goerli
     * Aggregator: ETH/USD
     * Address: 0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e

     * Network Mainnet
     * Aggregator: ETH/USD
     * Address: 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419

     * Base functionality checked in Remix Goerli testnet
     * Test cases done with mocking
     */

    // solhint-disable-next-line
    constructor() {
        /// @dev set Mainnet, Goerli ETH / USD aggreagtor default
        AggregatorV3Interface mainnetEthUsdFeed = AggregatorV3Interface(0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419);
        AggregatorV3Interface goerliEthUsdFeed = AggregatorV3Interface(0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e);

        uint256 feedId0 = _feedId.current();
        feeds[feedId0] = mainnetEthUsdFeed;
        _feedId.increment();

        uint256 feedId1 = _feedId.current();
        feeds[feedId1] = goerliEthUsdFeed;
        _feedId.increment();
    }

    function initDataFeeds(address _feed) external onlyOwner {
        AggregatorV3Interface feed = AggregatorV3Interface(_feed);
        uint256 feedId = _feedId.current();
        feeds[feedId] = feed;
        _feedId.increment();
    }

    /// @dev should be test with mock in integration test
    function getOraclePrice(uint256 feedId) external view returns (int256) {
        //   (uint80 roundID, int256 price, uint256 startedAt, uint256 timeStamp, uint80 answeredInRound) = priceFeed.latestRoundData();
        (, int256 price, , , ) = feeds[feedId].latestRoundData();
        return price;
    }

    /**
     * @notice Returns the Price Feed address
     * @return Price Feed address
     */
    function getPriceFeed(uint256 feedId) public view returns (AggregatorV3Interface) {
        return feeds[feedId];
    }

    /**
     * @param feedId auto counter index
     * @return Price Feed decimals
     */
    function getDecimals(uint256 feedId) external view returns (uint8) {
        return feeds[feedId].decimals();
    }

    /// @param feedId auto counter index
    function getVersion(uint256 feedId) external view returns (uint256) {
        return feeds[feedId].version();
    }

    /**
     * @param feedId auto counter index
     * @return Price Feed name. e.g ETH / USD
     */
    function getDescription(uint256 feedId) external view returns (string memory) {
        return feeds[feedId].description();
    }
}
