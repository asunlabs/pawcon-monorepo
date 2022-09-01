// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

/**
 * 
 * * SinglePool : reward => staked amount * 4 percent
 * Should stake ERC777 Catnip, rewarding Catnip
 * Should stake ERC721 CuriousPawoneer, rewarding Catnip
 * Should stake ERC721 User-choice-NFT, rewarding Catnip

 */

import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721ReceiverUpgradeable.sol";

contract SingleNFTPool is IERC721ReceiverUpgradeable, IERC721Receiver {
    /// @dev holder address => (tokenId => staked amount)
    mapping(address => mapping(uint256 => uint256)) public stakerList;

    function rewardStaker() public {}

    // solhint-disable-next-line
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external pure override(IERC721Receiver, IERC721ReceiverUpgradeable) returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }
}
