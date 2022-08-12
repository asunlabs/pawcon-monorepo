// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "./UP_Catnip.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/TokenTimelockUpgradeable.sol";

contract UP_CatnipVer02 is UP_Catnip {
    uint256 public supplyLimit;
    uint256 public releaseTime;
    mapping(address => uint256) public beneficiaries; // stake holder and balance

    event ReleaseTime(uint256 _releaseTime);

    function initialize() public override reinitializer(2) {
        UP_Catnip.initialize();
        supplyLimit = 1000000000 * uint256(10**decimals());
    }

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

    function stake(IERC777Upgradeable _token, uint256 _amount) public {
        require(_token.balanceOf(msg.sender) > _amount);
        _token.authorizeOperator(address(this));

        // token holder should authorize this contract as an operator
        setReleaseTime();
        beneficiaries[msg.sender] += _amount;
        _token.send(address(this), _amount, "");
    }

    function unStake(IERC777Upgradeable _token) public {
        require(releaseTime < block.timestamp, "Staking hasn't finished");
        beneficiaries[msg.sender] = 0;
        uint256 unStakeAmount = _token.balanceOf(address(this));
        _token.operatorSend(address(this), msg.sender, unStakeAmount, "", "");
    }
}
