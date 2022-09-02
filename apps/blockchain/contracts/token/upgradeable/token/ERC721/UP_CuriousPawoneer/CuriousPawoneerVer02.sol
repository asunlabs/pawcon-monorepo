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

import "./CuriousPawoneer.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "hardhat/console.sol";

interface IDataFeedFactory {
    function getOraclePrice(uint256 feedId) external view returns (int256);
}

interface IAuction {
    function revealWinner(uint256 tokenId) external view returns (address);
}

contract CuriousPawoneerVer02 is CuriousPawoneer, ReentrancyGuardUpgradeable {
    bool public onlyVer02SetupInit;
    bool public isStaticFee;
    uint256 public mintFee;
    uint256 public whitelistEventTime;
    uint256 public oracleEtherInUSD;

    mapping(address => bool) public whitelist;
    mapping(address => bool) public auctionWinnerList;

    event ReceivedEtherFrom(address sender, uint256 etherSent);
    event WithdrewEtherTo(address recipient, uint256 etherWithdrawn);
    event WrongFeedId(uint256 actual, string message);

    error RevertWhenDynamicMint(bool isStaticMint);

    using SafeMathUpgradeable for uint256;

    modifier onlyLimitedTime() {
        require(block.timestamp < whitelistEventTime, "Whitelist event ended");
        _;
    }

    function curiousPawoneerVersion() external pure returns (uint256) {
        return 2;
    }

    /// @dev this is not related to upgradeables.
    function __Ver02Setup_init() external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(onlyVer02SetupInit != true, "Already setup initialized");

        onlyVer02SetupInit = true;

        // solhint-disable-next-line
        whitelistEventTime = block.timestamp + 7 days;

        /// @dev fee can be dynamic with oracle. default is static
        mintFee = 0.0001 ether;
        isStaticFee = true;

        console.log("onlyVer02SetupInit: ", onlyVer02SetupInit);
        console.log("whitelistEventTime: ", whitelistEventTime);
        console.log("initial mintFee: ", mintFee);
    }

    function setAuctionWinner(address _auction, uint256 tokenId) external onlyRole(DEFAULT_ADMIN_ROLE) {
        IAuction auction = IAuction(_auction);
        address winner = auction.revealWinner(tokenId);

        /// @dev if auction winner is not set, address is zero.
        if (winner != address(0)) {
            auctionWinnerList[winner] = true;
        } else {
            auctionWinnerList[winner] = false;
        }
    }

    function setWhitelist(address account) external onlyLimitedTime onlyRole(DEFAULT_ADMIN_ROLE) {
        whitelist[account] = true;
    }

    /// @dev only minter. overriding super.
    /// @dev msg.value requires a function to be payable.
    function safeMint(address to) public payable override onlyRole(MINTER_ROLE) whenNotPaused {
        /// @dev whitelist/auction winner mint is free of charge
        if (whitelist[to] || auctionWinnerList[to]) {
            super.safeMint(to);
        }

        if (!whitelist[to] && !auctionWinnerList[to] && isStaticFee == true) {
            require(msg.value == mintFee, "Non-whitelist: 0.0001 ether");
            super.safeMint(to);
        }

        if (!whitelist[to] && !auctionWinnerList[to] && isStaticFee != true) {
            revert RevertWhenDynamicMint({isStaticMint: isStaticFee});
        }
    }

    function safeDynamicMint(
        address _dataFeedFactory,
        uint256 feedId,
        address to
    ) public payable virtual onlyRole(MINTER_ROLE) whenNotPaused {
        setDynamicPrice(_dataFeedFactory, feedId);
        require(msg.value == mintFee, "Should pay a proper mint fee");
        super.safeMint(to);
    }

    /// @dev change static mint fee 0.0001 ether to dynamic mint fee with oracle
    function setDynamicPrice(address _dataFeedFactory, uint256 feedId) public onlyRole(MINTER_ROLE) whenNotPaused {
        IDataFeedFactory dataFeedFactory = IDataFeedFactory(_dataFeedFactory);

        /// @dev external contract call with try~catch
        try dataFeedFactory.getOraclePrice(feedId) returns (int256 _price) {
            console.log("ETH / USD return value: ", uint256(_price));

            /// @dev 1 ether equals to 1473.92 in USD as of August 28th, 2022
            /// @dev example value from oracle network: 147392015247 (1e12)
            isStaticFee = false;
            oracleEtherInUSD = uint256(_price);
            console.log("oracleEtherInUSD: ", oracleEtherInUSD);

            /// @dev _mintFee is 2 digit e.g 147392015247 => 14
            (, uint256 _mintFee) = oracleEtherInUSD.tryDiv(1e10);

            require(_mintFee != 0, "ETH / USD decimals changed");

            /// @dev oraclized mintFee is 0.0014 ether
            mintFee = _mintFee * mintFee;
            console.log("oraclized mintFee: ", mintFee);
        } catch Error(string memory _err) {
            emit WrongFeedId(feedId, _err);
        }
    }

    /// @dev receive ether sent as a minting fee
    receive() external payable {
        emit ReceivedEtherFrom(msg.sender, msg.value);
    }

    function getReceivedEther() external view returns (uint256) {
        return address(this).balance;
    }

    function withdrawReceivedEther(address recipient) external payable onlyRole(DEFAULT_ADMIN_ROLE) nonReentrant {
        (bool success, ) = payable(recipient).call{value: address(this).balance}("");
        require(success, "Ether transfer failed");
        emit WithdrewEtherTo(recipient, address(this).balance);
    }

    function safeTransferNFT(
        address from,
        address to,
        uint256 tokenId
    ) external onlyRole(MINTER_ROLE) {
        super.safeTransferFrom(from, to, tokenId, "");
    }
}
