// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

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

/**

 * * Object list(OOP prototype)
 * 1) Auction (contract)
 * 2) Bidder ===(bid, item)===> bid list ===> (period) ===> winner
 * 3) Items => should exist (minted first)
 * 4) Winner

 * * functions
 * 1) bid: function
 * 2) withdraw: if winner => nft else => catnip
 * 3) startAuction
 * 4) endAuction

 * * state variables
 * 1) auctionEnded
 * 2) auctionStarted
 * 3) bid list
 * 4) winner list
 * 5) period

 */

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Auction is Ownable {

    using Counters for Counters.Counter;

    uint256 public period = 7 days;
    bool public auctionStarted = false;
    bool public auctionEnded = false;
    
    mapping(address => uint256) public bidList;
    mapping(address => Item) public winnerList; /// @dev if non-winnder, zero address 
    
    event AuctionStarted(uint256 startedAt);
    event AuctionEnded(uint256 endedAt);

    struct Item {
        uint256 tokenId;
        uint256 startedAt;
        uint256 endedAt;
        bool sold;
    }

    /**
     * @dev should update auctionStarted
     * @dev should emit AuctionStarted event
     */
    function startAuction() public onlyOwner {
        require(auctionStarted != true, "Auction already started");
        auctionStarted = true;

        // solhint-disable-next-line
        emit AuctionStarted(block.timestamp);
    }

    /**
     * @dev should update auctionEnded
     * @dev should emit AuctionEnded event
     */
    function endAuction() public onlyOwner {
        require(auctionStarted == true, "Auction not started yet");
        require(auctionEnded != true, "Auction already ended");

        auctionEnded = true;

        // solhint-disable-next-line
        emit AuctionEnded(block.timestamp);
    }

    /**
     * * msg.sender bids a NFT with Ether
     * @dev auction should start
     * @dev bid should be higher than previous bid
     * @dev should be within auction schedule
     * @dev should check if nft exist
     * @dev should emit bid event  => front end should render this
     */ 
    function bid(uint256 tokenId) public {
        require(auctionStarted == true, "Auction not started");
    }

}