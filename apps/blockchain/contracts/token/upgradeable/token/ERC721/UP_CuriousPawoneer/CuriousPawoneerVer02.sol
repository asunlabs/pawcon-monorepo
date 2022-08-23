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

interface IDataFeedFactory {
    function getOraclePrice(uint256 feedId) external view returns (int256);
}

contract CuriousPawoneerVer02 is CuriousPawoneer, ReentrancyGuardUpgradeable {
    bool public onlyVer02SetupInit;
    uint256 public mintFee;
    uint256 public whitelistEventTime;
    uint256 private statkingTime;

    /// @dev staker => tokenId => StakedNFT
    mapping(address => mapping(uint256 => StakedNFT)) public stakedTokenlist;
    mapping(address => mapping(uint256 => bool)) public tokenStaked;
    mapping(address => bool) public whitelist;

    event ReceivedEtherFrom(address sender, uint256 etherSent);
    event WithdrewEtherTo(address recipient, uint256 etherWithdrawn);
    event ReceivedERC721Token(address operator, address from, uint256 tokenId, bytes data);
    event NFTStaked(address staker, uint256 tokenId, uint256 stakedAt);
    event NFTUnstaked(address stakingContract, uint256 tokenId, uint256 unstakedAt);

    struct StakedNFT {
        address owner;
        uint256 tokenId;
        uint256 stakedAt;
        uint256 unstakableAt;
    }

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

        /// @dev change this later to dynamic fee with oracle
        mintFee = 0.0001 ether;
    }

    function setWhitelist(address account) external onlyLimitedTime onlyRole(DEFAULT_ADMIN_ROLE) {
        whitelist[account] = true;
    }

    /// @dev only minter. overriding super.
    /// @dev msg.value requires a function to be payable.
    function safeMint(address to) public payable override onlyRole(MINTER_ROLE) whenNotPaused {
        /// @dev whitelist mint is free of charge
        if (whitelist[to]) {
            super.safeMint(to);
        } else {
            require(msg.value == mintFee, "Non-whitelist: 0.0001 ether");
            super.safeMint(to);
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

    /// @dev now contract receivable ERC721
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4) {
        // ! Should inherit a proper function visibility
        emit ReceivedERC721Token(operator, from, tokenId, data);
        return IERC721ReceiverUpgradeable.onERC721Received.selector;
    }

    function stake(uint256 _tokenId) external {
        IERC721Upgradeable curiousPawoneer = IERC721Upgradeable(address(this));
        require(curiousPawoneer.ownerOf(_tokenId) == msg.sender, "Only owner");

        /// @dev note that token transfer approval should be done in user sider(front side)
        curiousPawoneer.safeTransferFrom(msg.sender, address(this), _tokenId, "");

        uint256 oneYear = 4 weeks * 12;

        StakedNFT memory stakedNFT = StakedNFT({
            owner: msg.sender,
            tokenId: _tokenId,
            stakedAt: block.timestamp,
            unstakableAt: block.timestamp + oneYear
        });

        stakedTokenlist[msg.sender][_tokenId] = stakedNFT;
        tokenStaked[msg.sender][_tokenId] = true;

        emit NFTStaked(msg.sender, _tokenId, block.timestamp);
    }

    function unstake(uint256 _tokenId) external {
        IERC721Upgradeable curiousPawoneer = IERC721Upgradeable(address(this));

        require(tokenStaked[msg.sender][_tokenId] == true, "Token not staked");
        require(stakedTokenlist[msg.sender][_tokenId].unstakableAt < block.timestamp, "Staking not finished");

        curiousPawoneer.safeTransferFrom(address(this), msg.sender, _tokenId, "");

        emit NFTUnstaked(address(this), _tokenId, block.timestamp);
    }
}
