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
    /// @dev staker => tokenId => StakedNFT
    mapping(address => mapping(uint256 => StakedNFT)) public stakedTokenlist;
    mapping(address => mapping(uint256 => bool)) public isStaker;

    event NFTStaked(address staker, uint256 tokenId, uint256 stakedAt);
    event NFTUnstaked(address stakingContract, uint256 tokenId, uint256 unstakedAt);
    event ReceivedERC721Token(address operator, address from, uint256 tokenId, bytes data);

    struct StakedNFT {
        address owner;
        uint256 tokenId;
        uint256 stakedAt;
        uint256 unstakableAt;
    }

    /// @dev now contract receivable ERC721
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external override(IERC721Receiver, IERC721ReceiverUpgradeable) returns (bytes4) {
        emit ReceivedERC721Token(operator, from, tokenId, data);
        return IERC721Receiver.onERC721Received.selector;
    }

    function stake(address _curiousPawoneer, uint256 _tokenId) external {
        IERC721Upgradeable curiousPawoneer = IERC721Upgradeable(_curiousPawoneer);
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
        isStaker[msg.sender][_tokenId] = true;

        emit NFTStaked(msg.sender, _tokenId, block.timestamp);
    }

    function unstake(address _curiousPawoneer, uint256 _tokenId) external {
        IERC721Upgradeable curiousPawoneer = IERC721Upgradeable(_curiousPawoneer);

        require(isStaker[msg.sender][_tokenId] == true, "Token not staked");
        require(stakedTokenlist[msg.sender][_tokenId].unstakableAt < block.timestamp, "Staking not finished");

        curiousPawoneer.safeTransferFrom(address(this), msg.sender, _tokenId, "");

        emit NFTUnstaked(address(this), _tokenId, block.timestamp);
    }
}
