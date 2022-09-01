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
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Auction is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    uint256 public startedAt = 0;
    uint256 public period = 7 days;
    uint256 public highestBid = 0;

    bool public auctionStarted = false;
    bool public auctionEnded = false;

    mapping(uint256 => mapping(address => uint256)) public bidList;

    /// @dev aviod dynamic array declaration
    address[] private _bidList = new address[](50);

    event AuctionStarted(uint256 startedAt);
    event AuctionEnded(uint256 endedAt);
    event BidHistory(address bidder, uint256 amount);

    error AuctionNotStartedError(bool _auctionStarted);
    error NotHighestBidError(uint256 _highestBid, uint256 _bid);
    error NotAuctionPeriodError(uint256 _startedAt, uint256 _period);

    modifier onlyWinner(uint256 tokenId) {
        address _winner = revealWinner(tokenId);
        require(msg.sender == _winner, "Only winner");
        _;
    }

    /**
     * @dev should update auctionStarted. only owner
     * @dev should emit AuctionStarted event
     */
    function startAuction() public onlyOwner {
        require(auctionStarted != true, "Auction already started");
        auctionStarted = true;

        // solhint-disable-next-line
        startedAt = block.timestamp;

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
     * @dev AuctionNotStartedError: auction should start
     * @dev NotHighestBidError: bid should be higher than current bid
     * @dev NotAuctionPeriodError: should be within auction schedule
     * @dev ItemNotMintedError: should check if nft exist
     * @dev BidHistory => front end should render this
     */
    function bid(uint256 tokenId) public payable {
        if (auctionStarted != true) {
            revert AuctionNotStartedError(
                { _auctionStarted: auctionStarted }
            );
        }

        if (msg.value < highestBid) {
            revert NotHighestBidError(
                { 
                    _highestBid: highestBid, 
                    _bid: msg.value 
                }
            );
        }

        // solhint-disable-next-line
        if (block.timestamp > startedAt + period) {
            revert NotAuctionPeriodError(
                { 
                    _startedAt: startedAt,
                    _period: startedAt + period
                }
            );
        }

        highestBid = msg.value;
        bidList[tokenId][msg.sender] = msg.value;
        _bidList.push(msg.sender);

        emit BidHistory(msg.sender, msg.value);
    }

    // solhint-disable-next-line
    receive() external payable {}

    function getReceivedEther() public view returns(uint256) {
        return address(this).balance;
    }

    function withdrawReceivedEther(address _recipient) external payable onlyOwner nonReentrant {
        // solhint-disable-next-line
        (bool success, ) = address(_recipient).call{ value: address(this).balance }("");
        require(success, "Ether transfer failed");
    }

    /// @dev call revealWinner in CuriousPawoneer NFT contract 
    function revealWinner(uint256 tokenId) public view returns(address) {
        require(auctionEnded == true, "Auction ongoing");

        address winner;

        for (uint256 i=0; i<_bidList.length; i++) {
            if (bidList[tokenId][_bidList[i]] == highestBid) {
                winner = _bidList[i];
            } else {
                winner = address(0);
            }
        }

        return winner;
    }
}
