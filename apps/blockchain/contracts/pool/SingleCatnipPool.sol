// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

/**

 * * SinglePool 
 * Should stake ERC777 Catnip, rewarding Catnip

 */

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts-upgradeable/interfaces/IERC777RecipientUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/interfaces/IERC777SenderUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/interfaces/IERC1820RegistryUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/interfaces/IERC777Upgradeable.sol";

interface ICatnipProxy {
    function mint(
        address account,
        uint256 amount,
        bytes memory userData,
        bytes memory operatorData
    ) external;
}

contract SingleCatnipPool is IERC777RecipientUpgradeable, IERC777SenderUpgradeable, Ownable, ReentrancyGuard {
    using SafeMath for uint256;

    /// @dev stake holder and amount
    mapping(address => uint256) public beneficiaries;

    /// @dev stake holder => (amount => timestamp)
    mapping(address => mapping(uint256 => uint256)) private unstakableAt;

    IERC1820RegistryUpgradeable public _ERC1820_REGISTRY;

    event ReleaseTime(uint256 _releaseTime);
    event TokenReceived(address operator, address from, address to, uint256 amount, bytes userData, bytes operatorData);
    event TokensToSend(address operator, address from, address to, uint256 amount, bytes userData, bytes operatorData);
    event Stake(address staker, uint256 stakeAmount);
    event UnStake(address unStaker, uint256 unStakeAmount);

    /// @dev SingleCatnipPool contract itself is not upgradeable.
    constructor() {
        _ERC1820_REGISTRY = IERC1820RegistryUpgradeable(0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24);
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
        require(catnip.balanceOf(msg.sender) > _amount, "Should have catnips to stake");

        uint256 unstakeTime = block.timestamp + (4 weeks * 12);

        beneficiaries[msg.sender] += _amount;
        unstakableAt[msg.sender][_amount] = unstakeTime;

        /// @dev token holder should authorize first
        catnip.operatorSend(msg.sender, address(this), _amount, "", "");

        /// @dev mint 4 percent of staked amount as reward
        rewardStaker(_catnip, msg.sender);
        emit Stake(msg.sender, _amount);
    }

    function stakeAmount() external view returns (uint256) {
        return beneficiaries[msg.sender];
    }

    /**
     * @dev staking reward is the 4 percent of whole staked amount
     */
    function calculateStakeReward(address staker) public view returns (uint256) {
        uint256 stakedAmount = beneficiaries[staker];

        (bool _success, uint256 _result) = stakedAmount.tryDiv(100);
        require(_success, "reward calculation (1) failed");

        (bool success, uint256 result) = _result.tryMul(4);
        require(success, "reward calculation (2) failed");

        return result;
    }

    function rewardStaker(address _catnip, address staker) private {
        uint256 rewardAmount = calculateStakeReward(staker);
        ICatnipProxy(_catnip).mint(staker, rewardAmount, "", "");
    }

    /// @dev reentrancy guard pattern
    function unStake(address _catnip, uint256 _amount) external nonReentrant {
        IERC777Upgradeable catnip = IERC777Upgradeable(_catnip);

        // solhint-disable-next-line
        require(unstakableAt[msg.sender][_amount] < block.timestamp, "Staking hasn't finished");

        uint256 unStakeAmount = beneficiaries[msg.sender];
        beneficiaries[msg.sender] = 0;
        unstakableAt[msg.sender][_amount] = 0;

        catnip.operatorSend(address(this), msg.sender, unStakeAmount, "", "");
        emit UnStake(msg.sender, unStakeAmount);
    }
}
