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

// import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721ReceiverUpgradeable.sol";

contract CuriousPawoneerVer02 is CuriousPawoneer, ReentrancyGuardUpgradeable {
    bool public onlyVer02SetupInit;
    uint256 public whitelistEventTime;
    uint256 public mintFee;

    mapping(address => bool) public whitelist;

    event ReceivedEtherFrom(address sender, uint256 etherSent);
    event WithdrewEtherTo(address recipient, uint256 etherWithdrawn);

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
            require(msg.value == mintFee, "Non-whitelist mint requires a fee");
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

    function withdrawMintedNFT(
        address from,
        address to,
        uint256 tokenId
    ) external onlyRole(MINTER_ROLE) {
        super.safeTransferFrom(from, to, tokenId, "");
    }

    // ! Should inherit a proper function visibility
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external pure returns (bytes4) {
        return IERC721ReceiverUpgradeable.onERC721Received.selector;
    }
}
