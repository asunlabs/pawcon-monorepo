// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/interfaces/IERC777Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/interfaces/IERC1820RegistryUpgradeable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "hardhat/console.sol";

interface ICatnip {
    function mint(
        address account,
        uint256 amount,
        bytes memory userData,
        bytes memory operatorData
    ) external;
}

abstract contract AbsPairPool {
    using SafeMath for uint256;

    IERC1820RegistryUpgradeable _ERC1820_REGISTRY;
    mapping(address => Liquidity) public liquidityBalance;

    struct Liquidity {
        address provider;
        uint256 leftTokenAmount;
        uint256 rightTokenAmount;
    }

    event LiquidityEthCatnip(uint256 ethAmount, uint256 catnipAmount);
    event LiquidityReward(address provider, uint256 rewardAmount);

    constructor() {
        _ERC1820_REGISTRY = IERC1820RegistryUpgradeable(0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24);
        initERC1820Registry();
    }

    // pool type: (ETH, ERC777)
    function _provideLiquidity(address _catnip, uint256 catnipAmount) public payable virtual {
        IERC777Upgradeable catnip = IERC777Upgradeable(_catnip);
        require(catnip.balanceOf(msg.sender) > catnipAmount);
        require(msg.value > 0.01 ether);

        // should receive ERC777 and ether
        catnip.operatorSend(msg.sender, address(this), catnipAmount, "", "");

        Liquidity memory liq = Liquidity({provider: msg.sender, leftTokenAmount: catnip.balanceOf(msg.sender), rightTokenAmount: msg.value});

        liquidityBalance[msg.sender] = liq;
        emit LiquidityEthCatnip(msg.value, catnipAmount);
    }

    // pool type: (ETH, ERC20)
    function _provideLiquidity(
        address provider,
        address _erc20,
        uint256 tokenAmount
    ) external payable virtual {
        IERC20 erc20 = IERC20(_erc20);
        require(erc20.balanceOf(provider) > tokenAmount);
        require(address(provider).balance > msg.value);

        // ! NOT DONE
    }

    // reward type: (ETH, ERC777)
    function _calculateReward(address provider) internal virtual returns (uint256) {
        uint256 left = liquidityBalance[provider].leftTokenAmount;
        uint256 right = liquidityBalance[provider].rightTokenAmount;
        uint256 DIVIDER = 2;

        uint256 sum = left.add(right);
        (bool result, uint256 rewardAmount) = sum.tryDiv(DIVIDER);
        require(result == true, "Calculation failed");
        console.log("rewardAmount: ", rewardAmount);

        return rewardAmount;
    }

    function _rewardLiquidityProvider(address provider, address _catnip) internal virtual {
        uint256 rewardAmount = _calculateReward(provider);
        ICatnip catnip = ICatnip(_catnip);
        catnip.mint(provider, rewardAmount, "", "");
        emit LiquidityReward(provider, rewardAmount);
    }

    // =================== ERC777 receivability ================ //
    /// @dev prevent token being locked (1)
    function tokensReceived(
        address operator,
        address from,
        address to,
        uint256 amount,
        bytes calldata userData,
        bytes calldata operatorData
    ) public {}

    /// @dev prevent token being locked (2)
    function tokensToSend(
        address operator,
        address from,
        address to,
        uint256 amount,
        bytes calldata userData,
        bytes calldata operatorData
    ) public {}

    /// @dev prevent token being locked (3)
    function initERC1820Registry() private {
        bytes32 ERC777RecipientHash = _ERC1820_REGISTRY.interfaceHash("ERC777TokensRecipient");
        bytes32 ERC777SenderHash = _ERC1820_REGISTRY.interfaceHash("ERC777TokensSender");

        _ERC1820_REGISTRY.setInterfaceImplementer(address(this), ERC777RecipientHash, address(this));
        _ERC1820_REGISTRY.setInterfaceImplementer(address(this), ERC777SenderHash, address(this));
    }

    receive() external payable {}
}
