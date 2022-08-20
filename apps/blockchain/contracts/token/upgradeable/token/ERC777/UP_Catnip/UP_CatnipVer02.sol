// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "./UP_Catnip.sol";

contract UP_CatnipVer02 is UP_Catnip, IERC777RecipientUpgradeable {
    uint256 public releaseTime;
    uint256 public whitelistEventTime;
    bool public onlyVer02SetupInit;

    mapping(address => uint256) public beneficiaries; // stake holder and balance
    mapping(address => bool) public whitelist;

    event ReleaseTime(uint256 _releaseTime);
    event TokenReceived(address operator, address from, address to, uint256 amount, bytes userData, bytes operatorData);
    event TokensToSend(address operator, address from, address to, uint256 amount, bytes userData, bytes operatorData);
    event Stake(address staker, uint256 stakeAmount);
    event UnStake(address unStaker, uint256 unStakeAmount);
    event Whitelisted(address whitelistSetter, address whitelisted);

    function catnipVersion() external pure returns (uint256) {
        return 2;
    }

    /// @dev this is a setup function that is NOT related to upgradeability.
    /// @dev should be manually executed by deployer for first time use.
    function __Ver02Setup_init() external onlyOwner {
        require(onlyVer02SetupInit != true, "Setup already initialized");
        onlyVer02SetupInit = true;
        setReleaseTime();
        initERC1820Registry();
        whitelist[msg.sender] = true;

        // solhint-disable-next-line
        whitelistEventTime = block.timestamp + 7 days;
    }

    modifier onlyLimitedTime() {
        // solhint-disable-next-line
        require(block.timestamp < whitelistEventTime, "Whitelist event ended");
        _;
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

    function mint(
        address account,
        uint256 amount,
        bytes memory userData,
        bytes memory operatorData
    ) external {
        require(amount < supplyLimit, "Exceeded max supply");

        bool whitelistMint = whitelist[account] == true ? true : false;

        if (whitelistMint) {
            uint256 privilegedMintAmount = amount * 2;
            _mint(account, privilegedMintAmount, userData, operatorData);
        } else {
            _mint(account, amount, userData, operatorData);
        }
    }

    function stake(uint256 _amount) external {
        IERC777Upgradeable catnip = IERC777Upgradeable(address(this));

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
    function unStake() external {
        IERC777Upgradeable catnip = IERC777Upgradeable(address(this));
        
        // solhint-disable-next-line
        require(releaseTime < block.timestamp, "Staking hasn't finished");

        uint256 unStakeAmount = beneficiaries[msg.sender];
        beneficiaries[msg.sender] = 0;

        catnip.operatorSend(address(this), msg.sender, unStakeAmount, "", "");
        emit UnStake(msg.sender, unStakeAmount);
    }

    function setWhitelist(address account) external onlyLimitedTime {
        whitelist[account] = true;
        emit Whitelisted(msg.sender, account);
    }
}
