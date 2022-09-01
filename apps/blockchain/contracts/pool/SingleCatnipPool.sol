// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

/**

 * * SinglePool 
 * Should stake ERC777 Catnip, rewarding Catnip

 */

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts-upgradeable/interfaces/IERC777RecipientUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/interfaces/IERC777SenderUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/interfaces/IERC1820RegistryUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/interfaces/IERC777Upgradeable.sol";

contract SingleCatnipPool is IERC777RecipientUpgradeable, IERC777SenderUpgradeable, Ownable {
    uint256 public releaseTime;
    mapping(address => uint256) public beneficiaries; // stake holder and balance
    IERC1820RegistryUpgradeable public _ERC1820_REGISTRY;

    event ReleaseTime(uint256 _releaseTime);
    event TokenReceived(address operator, address from, address to, uint256 amount, bytes userData, bytes operatorData);
    event TokensToSend(address operator, address from, address to, uint256 amount, bytes userData, bytes operatorData);
    event Stake(address staker, uint256 stakeAmount);
    event UnStake(address unStaker, uint256 unStakeAmount);

    /// @dev SingleCatnipPool contract itself is not upgradeable.
    constructor() {
        _ERC1820_REGISTRY = IERC1820RegistryUpgradeable(0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24);
        setReleaseTime();
        initERC1820Registry();
    }

    /// @dev prevent token being locked (1)
    function tokensReceived(
        address operator,
        address from,
        address to,
        uint256 amount,
        bytes calldata userData,
        bytes calldata operatorData
    ) public {
        emit TokenReceived(operator, from, to, amount, userData, operatorData);
    }

    /// @dev prevent token being locked (2)
    function tokensToSend(
        address operator,
        address from,
        address to,
        uint256 amount,
        bytes calldata userData,
        bytes calldata operatorData
    ) public {
        emit TokensToSend(operator, from, to, amount, userData, operatorData);
    }

    /// @dev prevent token being locked (3)
    function initERC1820Registry() private onlyOwner {
        bytes32 ERC777RecipientHash = _ERC1820_REGISTRY.interfaceHash("ERC777TokensRecipient");
        bytes32 ERC777SenderHash = _ERC1820_REGISTRY.interfaceHash("ERC777TokensSender");

        _ERC1820_REGISTRY.setInterfaceImplementer(address(this), ERC777RecipientHash, address(this));
        _ERC1820_REGISTRY.setInterfaceImplementer(address(this), ERC777SenderHash, address(this));
    }

    /// @dev add new interface to registry
    function updateERC1820Registry(string memory interfaceName) external onlyOwner {
        bytes32 interfaceHash = _ERC1820_REGISTRY.interfaceHash(interfaceName);
        _ERC1820_REGISTRY.setInterfaceImplementer(address(this), interfaceHash, address(this));
    }

    function stake(address _catnip, uint256 _amount) public {
        IERC777Upgradeable catnip = IERC777Upgradeable(_catnip);

        // solhint-disable-next-line
        require(catnip.balanceOf(msg.sender) > _amount, "Should have catnips to stake");

        beneficiaries[msg.sender] += _amount;

        /// @dev token holder should authorize first
        catnip.operatorSend(msg.sender, address(this), _amount, "", "");
        emit Stake(msg.sender, _amount);
    }

    function stakeAmount() external view returns (uint256) {
        return beneficiaries[msg.sender];
    }

    function setReleaseTime() private onlyOwner {
        uint256 oneYear = (4 weeks * 12);

        // solhint-disable-next-line
        releaseTime = block.timestamp + oneYear;
        emit ReleaseTime(releaseTime);
    }

    /// @dev reentrancy guard pattern
    function unStake(address _catnip) external {
        IERC777Upgradeable catnip = IERC777Upgradeable(_catnip);

        // solhint-disable-next-line
        require(releaseTime < block.timestamp, "Staking hasn't finished");

        uint256 unStakeAmount = beneficiaries[msg.sender];
        beneficiaries[msg.sender] = 0;

        catnip.operatorSend(address(this), msg.sender, unStakeAmount, "", "");
        emit UnStake(msg.sender, unStakeAmount);
    }
}