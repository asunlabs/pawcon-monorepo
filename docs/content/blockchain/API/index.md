---
title: 'Contract API'
draft: false
featured_image: '/images/chain-banner.jpg' # the images dir means static.
tags: ['ethereum', 'dapp', 'decentralization']
categories: ['blockchain']
---

# Solidity API

## Auction

### startedAt

```solidity
uint256 startedAt
```

### period

```solidity
uint256 period
```

### highestBid

```solidity
uint256 highestBid
```

### auctionStarted

```solidity
bool auctionStarted
```

### auctionEnded

```solidity
bool auctionEnded
```

### bidList

```solidity
mapping(uint256 => mapping(address => uint256)) bidList
```

### \_bidList

```solidity
address[] _bidList
```

_aviod dynamic array declaration_

### AuctionStarted

```solidity
event AuctionStarted(uint256 startedAt)
```

### AuctionEnded

```solidity
event AuctionEnded(uint256 endedAt)
```

### BidHistory

```solidity
event BidHistory(address bidder, uint256 amount)
```

### AuctionNotStartedError

```solidity
error AuctionNotStartedError(bool _auctionStarted)
```

### NotHighestBidError

```solidity
error NotHighestBidError(uint256 _highestBid, uint256 _bid)
```

### NotAuctionPeriodError

```solidity
error NotAuctionPeriodError(uint256 _startedAt, uint256 _period)
```

### onlyWinner

```solidity
modifier onlyWinner(uint256 tokenId)
```

### startAuction

```solidity
function startAuction() public
```

_should update auctionStarted. only owner
should emit AuctionStarted event_

### endAuction

```solidity
function endAuction() public
```

_should update auctionEnded
should emit AuctionEnded event_

### bid

```solidity
function bid(uint256 tokenId) public payable
```

- msg.sender bids a NFT with Ether

_AuctionNotStartedError: auction should start
NotHighestBidError: bid should be higher than current bid
NotAuctionPeriodError: should be within auction schedule
ItemNotMintedError: should check if nft exist
BidHistory => front end should render this_

### receive

```solidity
receive() external payable
```

### getReceivedEther

```solidity
function getReceivedEther() public view returns (uint256)
```

### withdrawReceivedEther

```solidity
function withdrawReceivedEther(address _recipient) external payable
```

### revealWinner

```solidity
function revealWinner(uint256 tokenId) public view returns (address)
```

## DataFeedFactory

_Dynamic data feeds generation with factory pattern_

### \_feedId

```solidity
struct Counters.Counter _feedId
```

### feeds

```solidity
mapping(uint256 => contract AggregatorV3Interface) feeds
```

### constructor

```solidity
constructor() public
```

- As of August 2022, Chainlink starts to support Goerli testnet,
- corresponding to Ethereum PoS merge update. But the number of aggregator
- is not yet enough.
  Network: Goerli
  Aggregator: ETH/USD
  Address: 0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e

Network Mainnet
Aggregator: ETH/USD
Address: 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419

Base functionality checked in Remix Goerli testnet
Test cases done with mocking

### initDataFeeds

```solidity
function initDataFeeds(address _feed) external
```

### getOraclePrice

```solidity
function getOraclePrice(uint256 feedId) external view returns (int256)
```

_should be test with mock in integration test_

### getPriceFeed

```solidity
function getPriceFeed(uint256 feedId) public view returns (contract AggregatorV3Interface)
```

Returns the Price Feed address

| Name | Type                           | Description        |
| ---- | ------------------------------ | ------------------ |
| [0]  | contract AggregatorV3Interface | Price Feed address |

### getDecimals

```solidity
function getDecimals(uint256 feedId) external view returns (uint8)
```

| Name   | Type    | Description        |
| ------ | ------- | ------------------ |
| feedId | uint256 | auto counter index |

| Name | Type  | Description         |
| ---- | ----- | ------------------- |
| [0]  | uint8 | Price Feed decimals |

### getVersion

```solidity
function getVersion(uint256 feedId) external view returns (uint256)
```

| Name   | Type    | Description        |
| ------ | ------- | ------------------ |
| feedId | uint256 | auto counter index |

### getDescription

```solidity
function getDescription(uint256 feedId) external view returns (string)
```

| Name   | Type    | Description        |
| ------ | ------- | ------------------ |
| feedId | uint256 | auto counter index |

| Name | Type   | Description                    |
| ---- | ------ | ------------------------------ |
| [0]  | string | Price Feed name. e.g ETH / USD |

## MockAggregator

### s_answer

```solidity
int256 s_answer
```

### setMockedLatestAnswer

```solidity
function setMockedLatestAnswer(int256 answer) public virtual
```

### getMockedLatestAnswer

```solidity
function getMockedLatestAnswer() public view virtual returns (int256)
```

## MockDataFeedFactory

### setMockedLatestAnswer

```solidity
function setMockedLatestAnswer(int256 answer) public
```

### getMockedLatestAnswer

```solidity
function getMockedLatestAnswer() public view returns (int256)
```

## AbsPairPool

### provideLiquidity

```solidity
function provideLiquidity() internal virtual
```

### calcualteReward

```solidity
function calcualteReward() internal virtual
```

### rewardLiquidityProvider

```solidity
function rewardLiquidityProvider() internal virtual
```

## AbsPairPoolFactory

_Factory contract generating pair pool contract, not deployable_

### \_poolId

```solidity
struct Counters.Counter _poolId
```

### poolList

```solidity
mapping(uint256 => struct AbsPairPoolFactory.PairPoolData) poolList
```

_pool id => pool contract address_

### PairPoolCreated

```solidity
event PairPoolCreated(address _pairPool)
```

### PoolCreationFailed

```solidity
event PoolCreationFailed(string _reason)
```

### PairPoolData

```solidity
struct PairPoolData {
  uint256 id;
  uint256 fundLimit;
  address leftToken;
  address rightToken;
  address addr;
}
```

### initPool

```solidity
function initPool(address left, address right) internal virtual
```

### getTokenPairAddress

```solidity
function getTokenPairAddress(uint256 poolId) public virtual returns (address, address)
```

### setPoolFundLimitation

```solidity
function setPoolFundLimitation() internal virtual
```

### receive

```solidity
receive() external payable
```

## PairPool

### Temp

```solidity
function Temp() public pure returns (uint256)
```

## PairPoolFactory

### setPoolFundLimitation

```solidity
function setPoolFundLimitation() internal
```

## ICatnipProxy

### mint

```solidity
function mint(address account, uint256 amount, bytes userData, bytes operatorData) external
```

## SingleCatnipPool

### beneficiaries

```solidity
mapping(address => uint256) beneficiaries
```

_stake holder and amount_

### unstakableAt

```solidity
mapping(address => mapping(uint256 => uint256)) unstakableAt
```

_stake holder => (amount => timestamp)_

### \_ERC1820_REGISTRY

```solidity
contract IERC1820RegistryUpgradeable _ERC1820_REGISTRY
```

### ReleaseTime

```solidity
event ReleaseTime(uint256 _releaseTime)
```

### TokenReceived

```solidity
event TokenReceived(address operator, address from, address to, uint256 amount, bytes userData, bytes operatorData)
```

### TokensToSend

```solidity
event TokensToSend(address operator, address from, address to, uint256 amount, bytes userData, bytes operatorData)
```

### Stake

```solidity
event Stake(address staker, uint256 stakeAmount)
```

### UnStake

```solidity
event UnStake(address unStaker, uint256 unStakeAmount)
```

### constructor

```solidity
constructor() public
```

_SingleCatnipPool contract itself is not upgradeable._

### tokensReceived

```solidity
function tokensReceived(address operator, address from, address to, uint256 amount, bytes userData, bytes operatorData) public
```

_prevent token being locked (1)_

### tokensToSend

```solidity
function tokensToSend(address operator, address from, address to, uint256 amount, bytes userData, bytes operatorData) public
```

_prevent token being locked (2)_

### initERC1820Registry

```solidity
function initERC1820Registry() private
```

_prevent token being locked (3)_

### updateERC1820Registry

```solidity
function updateERC1820Registry(string interfaceName) external
```

_add new interface to registry_

### stake

```solidity
function stake(address _catnip, uint256 _amount) public
```

### stakeAmount

```solidity
function stakeAmount() external view returns (uint256)
```

### calculateStakeReward

```solidity
function calculateStakeReward(address staker) public view returns (uint256)
```

_staking reward is the 4 percent of whole staked amount_

### rewardStaker

```solidity
function rewardStaker(address _catnip, address staker) private
```

### unStake

```solidity
function unStake(address _catnip, uint256 _amount) external
```

_reentrancy guard pattern_

## ICatnipProxy

### mint

```solidity
function mint(address account, uint256 amount, bytes userData, bytes operatorData) external
```

## SingleNFTPool

### stakedTokenlist

```solidity
mapping(address => mapping(uint256 => struct SingleNFTPool.StakedNFT)) stakedTokenlist
```

_staker => tokenId => StakedNFT_

### isStaker

```solidity
mapping(address => mapping(uint256 => bool)) isStaker
```

### NFTStaked

```solidity
event NFTStaked(address staker, uint256 tokenId, uint256 stakedAt)
```

### NFTUnstaked

```solidity
event NFTUnstaked(address stakingContract, uint256 tokenId, uint256 unstakedAt)
```

### ReceivedERC721Token

```solidity
event ReceivedERC721Token(address operator, address from, uint256 tokenId, bytes data)
```

### StakedNFT

```solidity
struct StakedNFT {
  address owner;
  uint256 tokenId;
  uint256 stakedAt;
  uint256 unstakableAt;
}
```

### onERC721Received

```solidity
function onERC721Received(address operator, address from, uint256 tokenId, bytes data) external returns (bytes4)
```

_now contract receivable ERC721_

### stake

```solidity
function stake(address _catnip, address _curiousPawoneer, uint256 _tokenId) external
```

### calculateReward

```solidity
function calculateReward() public pure returns (uint256)
```

_simplified NFT staking reward. will be improved with formular later._

### rewardStaker

```solidity
function rewardStaker(address _catnip, address staker) private
```

### unstake

```solidity
function unstake(address _curiousPawoneer, uint256 _tokenId) external
```

## CuriousPawoneer

### \_tokenIdCounter

```solidity
struct CountersUpgradeable.Counter _tokenIdCounter
```

### MINTER_ROLE

```solidity
bytes32 MINTER_ROLE
```

_roles should be externally available
it is OK to define constants in upgradeables_

### BURNER_ROLE

```solidity
bytes32 BURNER_ROLE
```

### PAUSER_ROLE

```solidity
bytes32 PAUSER_ROLE
```

### UPGRADER_ROLE

```solidity
bytes32 UPGRADER_ROLE
```

### MIME

```solidity
string MIME
```

### onChainStorageType

```solidity
bool onChainStorageType
```

### OffChainStroageNotImplemented

```solidity
error OffChainStroageNotImplemented()
```

### constructor

```solidity
constructor() public
```

### initialize

```solidity
function initialize() public
```

### tokenURI

```solidity
function tokenURI(uint256 tokenId) public view virtual returns (string)
```

_on-chain tokenURI: mime/dataURI_

### safeMint

```solidity
function safeMint(address to) public payable virtual
```

### \_authorizeUpgrade

```solidity
function _authorizeUpgrade(address newImplementation) internal
```

\__authorizeUpgrade MUST be overriden and access-controlled._

### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceId) public view virtual returns (bool)
```

_overriding supportsInterface is required by AccessControlUpgradeable and ERC721Upgradeable._

### pauseCuriousPawoneer

```solidity
function pauseCuriousPawoneer() external
```

### resumeCuriousPawoneer

```solidity
function resumeCuriousPawoneer() external
```

### burnOneToken

```solidity
function burnOneToken(uint256 tokenId) external
```

## IDataFeedFactory

### getOraclePrice

```solidity
function getOraclePrice(uint256 feedId) external view returns (int256)
```

## IAuction

### revealWinner

```solidity
function revealWinner(uint256 tokenId) external view returns (address)
```

## CuriousPawoneerVer02

### onlyVer02SetupInit

```solidity
bool onlyVer02SetupInit
```

### isStaticFee

```solidity
bool isStaticFee
```

### mintFee

```solidity
uint256 mintFee
```

### whitelistEventTime

```solidity
uint256 whitelistEventTime
```

### oracleEtherInUSD

```solidity
uint256 oracleEtherInUSD
```

### whitelist

```solidity
mapping(address => bool) whitelist
```

### auctionWinnerList

```solidity
mapping(address => bool) auctionWinnerList
```

### ReceivedEtherFrom

```solidity
event ReceivedEtherFrom(address sender, uint256 etherSent)
```

### WithdrewEtherTo

```solidity
event WithdrewEtherTo(address recipient, uint256 etherWithdrawn)
```

### WrongFeedId

```solidity
event WrongFeedId(uint256 actual, string message)
```

### RevertWhenDynamicMint

```solidity
error RevertWhenDynamicMint(bool isStaticMint)
```

### onlyLimitedTime

```solidity
modifier onlyLimitedTime()
```

### curiousPawoneerVersion

```solidity
function curiousPawoneerVersion() external pure returns (uint256)
```

### \_\_Ver02Setup_init

```solidity
function __Ver02Setup_init() external
```

_this is not related to upgradeables._

### setAuctionWinner

```solidity
function setAuctionWinner(address _auction, uint256 tokenId) external
```

### setWhitelist

```solidity
function setWhitelist(address account) external
```

### safeMint

```solidity
function safeMint(address to) public payable
```

_only minter. overriding super.
msg.value requires a function to be payable._

### safeDynamicMint

```solidity
function safeDynamicMint(address _dataFeedFactory, uint256 feedId, address to) public payable virtual
```

### setDynamicPrice

```solidity
function setDynamicPrice(address _dataFeedFactory, uint256 feedId) public
```

_change static mint fee 0.0001 ether to dynamic mint fee with oracle_

### receive

```solidity
receive() external payable
```

_receive ether sent as a minting fee_

### getReceivedEther

```solidity
function getReceivedEther() external view returns (uint256)
```

### withdrawReceivedEther

```solidity
function withdrawReceivedEther(address recipient) external payable
```

### safeTransferNFT

```solidity
function safeTransferNFT(address from, address to, uint256 tokenId) external
```

## Catnip

Upgradeable ERC777 Catnip token. Governance token in PawCon project

_Proxy, UUPS_

### supplyLimit

```solidity
uint256 supplyLimit
```

### constructor

```solidity
constructor() public
```

### initialize

```solidity
function initialize() public virtual
```

### \_\_Setup_init

```solidity
function __Setup_init() private
```

### \_authorizeUpgrade

```solidity
function _authorizeUpgrade(address newImplementation) internal
```

set who can upgrade contract with access control
\_authorizeUpgrade must be overridden with access control

## CatnipVer02

### whitelistEventTime

```solidity
uint256 whitelistEventTime
```

### onlyVer02SetupInit

```solidity
bool onlyVer02SetupInit
```

### whitelist

```solidity
mapping(address => bool) whitelist
```

### Whitelisted

```solidity
event Whitelisted(address whitelistSetter, address whitelisted)
```

### catnipVersion

```solidity
function catnipVersion() external pure returns (uint256)
```

### \_\_Ver02Setup_init

```solidity
function __Ver02Setup_init() external
```

_this is a setup function that is NOT related to upgradeability.
should be manually executed by deployer for first time use._

### onlyLimitedTime

```solidity
modifier onlyLimitedTime()
```

### mint

```solidity
function mint(address account, uint256 amount, bytes userData, bytes operatorData) external
```

### setWhitelist

```solidity
function setWhitelist(address account) external
```
