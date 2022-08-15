// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "./UP_Catnip.sol";

contract UP_CatnipVer02 is UP_Catnip, IERC777RecipientUpgradeable {
    uint256 public releaseTime;
    mapping(address => uint256) public beneficiaries; // stake holder and balance

    event ReleaseTime(uint256 _releaseTime);
    event StakedTokenReceived(address operator, address from, address to, uint256 amount, bytes userData, bytes operatorData);
    event Stake(address staker, uint256 stakeAmount);
    event UnStake(address unStaker, uint256 unStakeAmount);

    function catnipVersion() external pure returns (uint256) {
        return 2;
    }

    function mint(
        address account,
        uint256 amount,
        bytes memory userData,
        bytes memory operatorData
    ) public {
        require(amount < supplyLimit, "Exceeded max supply");
        _mint(account, amount, userData, operatorData);
    }

    /// @dev below not tested: setReleaseTime, stake, unStake
    /// @dev if not working, try to use TokenTimelock ERC20
    function setReleaseTime() private {
        uint256 oneYear = (4 weeks * 12);
        releaseTime = block.timestamp + oneYear;
        emit ReleaseTime(releaseTime);
    }

    function tokensReceived(
        address operator,
        address from,
        address to,
        uint256 amount,
        bytes calldata userData,
        bytes calldata operatorData
    ) public {
        emit StakedTokenReceived(operator, from, to, amount, userData, operatorData);
    }

    function stake(uint256 _amount) public {
        IERC777Upgradeable catnip = IERC777Upgradeable(address(this));
        require(catnip.balanceOf(msg.sender) > _amount, "Should have catnips to stake");

        // token holder should authorize this contract as an operator
        setReleaseTime();
        beneficiaries[msg.sender] += _amount;

        /**
         * TODO ERC1820 implementation requires
         * For this contract to be able to receive ERC777, it needs to implement ERC1820.
         */
        catnip.operatorSend(msg.sender, address(this), _amount, "", "");
        emit Stake(msg.sender, _amount);
    }

    function unStake() public {
        IERC777Upgradeable catnip = IERC777Upgradeable(address(this));
        require(releaseTime < block.timestamp, "Staking hasn't finished");

        beneficiaries[msg.sender] = 0;
        uint256 unStakeAmount = catnip.balanceOf(msg.sender);
        catnip.send(msg.sender, unStakeAmount, "");
        emit UnStake(msg.sender, unStakeAmount);
    }
}
