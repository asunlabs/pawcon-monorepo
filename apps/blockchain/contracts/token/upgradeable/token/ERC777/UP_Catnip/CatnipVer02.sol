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

import "./Catnip.sol";

contract CatnipVer02 is Catnip {
    uint256 public whitelistEventTime;
    bool public onlyVer02SetupInit;
    mapping(address => bool) public whitelist;
    event Whitelisted(address whitelistSetter, address whitelisted);

    function catnipVersion() external pure returns (uint256) {
        return 2;
    }

    /// @dev this is a setup function that is NOT related to upgradeability.
    /// @dev should be manually executed by deployer for first time use.
    function __Ver02Setup_init() external onlyOwner {
        require(onlyVer02SetupInit != true, "Setup already initialized");
        onlyVer02SetupInit = true;
        whitelist[msg.sender] = true;
        // solhint-disable-next-line
        whitelistEventTime = block.timestamp + 7 days;
    }

    modifier onlyLimitedTime() {
        // solhint-disable-next-line
        require(block.timestamp < whitelistEventTime, "Whitelist event ended");
        _;
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

    function setWhitelist(address account) external onlyLimitedTime {
        whitelist[account] = true;
        emit Whitelisted(msg.sender, account);
    }
}
