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

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/Base64Upgradeable.sol";
import "hardhat/console.sol";

contract CuriousPawoneer is
    Initializable,
    ERC721Upgradeable,
    UUPSUpgradeable,
    AccessControlUpgradeable,
    PausableUpgradeable,
    ERC721BurnableUpgradeable
{
    using CountersUpgradeable for CountersUpgradeable.Counter;
    using StringsUpgradeable for uint256;

    CountersUpgradeable.Counter private _tokenIdCounter;

    /// @dev roles should be externally available
    /// @dev it is OK to define constants in upgradeables
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    string public MIME;
    bool public onChainStorageType;

    error OffChainStroageNotImplemented();

    /// @custom:oz-upgrades-unsafe-allow constructor
    // solhint-disable-next-line
    constructor() {
        _disableInitializers();
    }

    function initialize() public initializer {
        __ERC721_init("CuriousPawoneer", "CP");
        __UUPSUpgradeable_init();
        __AccessControl_init();
        __ERC721Burnable_init();
        __Pausable_init();

        /// @dev set contract deployer a default admin
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(UPGRADER_ROLE, msg.sender);

        onChainStorageType = true;
        MIME = "data:application/json;base64,";
    }

    /// @dev on-chain tokenURI: mime/dataURI
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        super._requireMinted(tokenId);
        string memory _tokenURI = "";

        /// @dev add IPFS token URI later
        if (onChainStorageType) {
            // prettier-ignore
            bytes memory dataURI = abi.encodePacked(
                '{', 
                    '"name": "CuriousPawoneer #', tokenId.toString(), '"', 
                '}'
            );

            string memory encodedDataURI = Base64Upgradeable.encode(dataURI);
            _tokenURI = string(abi.encodePacked(MIME, encodedDataURI));
        }

        console.log("contract tokenURI: ", _tokenURI);

        return _tokenURI;
    }

    function safeMint(address to) public payable virtual onlyRole(MINTER_ROLE) whenNotPaused {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }

    /// @dev _authorizeUpgrade MUST be overriden and access-controlled.
    function _authorizeUpgrade(address newImplementation) internal override onlyRole(UPGRADER_ROLE) {}

    /// @dev overriding supportsInterface is required by AccessControlUpgradeable and ERC721Upgradeable.
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721Upgradeable, AccessControlUpgradeable) returns (bool) {
        return interfaceId == type(IAccessControlUpgradeable).interfaceId || super.supportsInterface(interfaceId);
    }

    function pauseCuriousPawoneer() external onlyRole(PAUSER_ROLE) {
        super._pause();
    }

    function resumeCuriousPawoneer() external onlyRole(PAUSER_ROLE) {
        super._unpause();
    }

    function burnOneToken(uint256 tokenId) external onlyRole(BURNER_ROLE) {
        super.burn(tokenId);
    }
}

/**
pragma solidity ^0.8.10;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "../ERC20/Churu.sol";

/// @title ERC721 implementation of CuriousPawoneer NFT
/// @author DeveloperAsun(Jake Sung)
contract CuriousPawoneer is ERC721, AccessControl, Pausable, ReentrancyGuard {
    // import libraries
    using Strings for uint256; 
    using Counters for Counters.Counter;

    address public owner;// contract owner

    // ======================== token detail setting ================== //
    bytes32 public constant CREATOR = keccak256("Jake Sung"); 
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant DESTRUCTOR_ROLE = keccak256("DESTRUCTOR_ROLE");
    
    uint256 public cost = 0.03 ether;
    uint256 public giveaway = 10;
    uint256 public requiredChuru = 100; // hold 100 churu to mint curious pawoneer
    uint256 private nonce; // for random number
    
    // 0, 1, 2, 3
    enum Rarity { 
        COMMON,
        RARE,
        EPIC, 
        LEGENDARY
    }
    Rarity public rarity = Rarity.COMMON;
    // ======================== token detail ================== //
    
    // ======================== IPFS setting ================== //
    string public baseImageURI; 
    string public baseMetadataURI; 
    string public baseURI; // pinata cid
    string public baseImageExtension = ".png"; 
    string public baseMetadataExtension = ".json"; 
    string public gateway = "https://gateway.pinata.cloud/ipfs/";
    // ======================== IPFS setting ================== //
    
    // ======================== Mapping setting ================== //
    mapping(address=>bool) public whitelist; // set whitelist
    mapping(uint256=>uint256) public tokenRarity; // key : tokenId, value : rarity
    // ======================== Mapping setting ================== //

    // ======================== Event setting ================== //
    event LogRarity(uint256 _rarity); 
    // ======================== Event setting ================== //

    Counters.Counter public mintCount;
    Churu public churu;

    // ======================== Token inheritance setting ================== //
    // initialize ERC721 and ERC20
    constructor(
        address _churu,
        uint256 _nonce, 
        string memory cid
    ) ERC721("Curious Pawoneer", "CP")
    { 
        owner = msg.sender;
        churu = Churu(_churu);
        nonce = _nonce; // nonce added when deployed
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender); // set invoker to role setter
        setBaseURI(cid); // set pinata IPFS URI when deployed
    }
    // ======================== Token inheritance setting ================== //
    
    // ======================== AccessControl setting ================== //
    // Should inherite supportsInterface
    function supportsInterface(bytes4 interfaceId) public view virtual override(AccessControl, ERC721) whenNotPaused returns (bool) {
        return interfaceId == type(IAccessControl).interfaceId || super.supportsInterface(interfaceId);
    }
    // ======================== AccessControl setting ================== //
    
    // ======================== Modifier setting ================== //
    /// @dev set dynamic cost based on total supply
    modifier setCost() {
        if (mintCount.current() < 300) { 
            cost = 0.03 ether;
        }
        if (mintCount.current() >= 300) {
            cost *= 2;
        }
        if (mintCount.current() < 700) {
            cost *= 2;
        }
        if (mintCount.current() >= 700) {
            cost *= 2;
        }
        _;
    }
    // ======================== Modifier setting ================== //
    
    // ======================== Minting zone ================== // 
    function mintNFT(address to, uint256 tokenId) private { 
        // choose _safeMint over _mint whenever possible
        _safeMint(to, tokenId);
        tokenRarity[tokenId] = uint256(rarity); // default rarity is common(0)
        // token URI is set to : 'ipfs://cid/tokenId.png(.json)'
        setTokenURI(tokenId); 
    }

    // set minting condition
    function mint(address to, uint256 tokenId) public payable whenNotPaused setCost{ 
        // minting requires 1) to have 100 churu 2) msg.value > cost
        require(churu.balanceOf(to) > requiredChuru, "Should own 100+ Churu");
        
        // non-whitelist mint costs 0.03 ether
        if (!whitelist[to]) {
            require(msg.value > cost, "Enter a proper ether amount."); 
            mintNFT(to, tokenId);
        } 
        // whitelist can mint free for up to 10 giveaways(total)
        else if (whitelist[to] && giveaway > 0) { 
            mintNFT(to, tokenId);
            giveaway--;
        } 
        else { 
            require(msg.value > cost, "Enter a proper ether amount");
            mintNFT(to, tokenId);
        }
        // increase mint amount for dynamic cost
        mintCount.increment();
    }

    // set burning condition
    function burn(uint256 tokenId) public whenNotPaused { 
        // set Legendary rarity can't be deleted
        require(tokenRarity[tokenId] != 3, "Legendary can't be deleted");
        _burn(tokenId); // delete nft
    }

    // set random rarity
    function getRandomNumber() internal whenNotPaused returns(uint256) { 
        uint256 rand = uint256(keccak256(abi.encodePacked(
            nonce, block.difficulty, msg.sender
        ))) % 4; // Rarity ranges from 0 ~ 3
        nonce++; // increase nonce
        return rand;
    }

    function getTokenRarity(uint256 tokenId) public view whenNotPaused returns(uint256) {
        return tokenRarity[tokenId];
    }

    function resetRarity(uint256 tokenId) public payable whenNotPaused returns(uint256) {
        require(msg.value > cost, "Reset rarity cost 0.03 ether");
        uint256 rand = getRandomNumber(); // check random number
        emit LogRarity(rand); // emit rarity as event
        tokenRarity[tokenId] = rand;
        return rand;
    }

    // TO DO : test whitelist setter
    function setWhitelist(address _address) public whenNotPaused {
        require(msg.sender == owner, "only owner");
        whitelist[_address] = true;
    }

    function isWhitelisted(address _address) public view returns(bool) {
        return whitelist[_address];
    }

    // ======================== Minting zone ======================== // 

    // ======================== IPFS & Token URI zone ======================== // 
    // NOT TESTED : _baseURI only returns and takes no parameters. should override from ERC721
    function _baseURI() internal view virtual override whenNotPaused returns (string memory) {
        // baseURI result =>  ipfs://cid/
        return string(abi.encodePacked(gateway, baseURI, "/"));
    }

    // NOT TESTED
    function setBaseURI(string memory _baseURI_) internal whenNotPaused  { 
        baseURI = _baseURI_;
    } 

    // NOT TESTED : change to new baseURI. Without this method, baseURI will be never changed once deployed. 
    function resetNewBaseURI(string memory newURI) public whenNotPaused {
        require(msg.sender == owner, "only owner");
        setBaseURI(newURI);
    }
    
    // NOT TESTED
    function resetGateway(string memory newGateway) public whenNotPaused {
        require(msg.sender == owner, "only owner");
        gateway = newGateway;
    }

    // NOT TESTED
    function getBaseURI() public view whenNotPaused returns(string memory) {
        return _baseURI();
    }

    /// @dev set NFT imageURI
    // TO DO : should test 
    function setTokenURI(uint256 tokenId) public whenNotPaused {
        // tokenURI should be : 'ipfs://cid/tokenId.png' 
        baseMetadataURI = string(abi.encodePacked(tokenURI(tokenId), baseMetadataExtension));
        baseImageURI = string(abi.encodePacked(tokenURI(tokenId), baseImageExtension));
    }

    // front end will invoke this to get tokenURI
    function getTokenURIs() public view whenNotPaused returns(string[2] memory){
        // combine baseURI with tokenId and  returns a string         
        return [baseImageURI, baseMetadataURI];
    }
    // ======================== IPFS & Token URI zone ================== // 


    // ======================== Balance zone ================== // 
    // 1. withdraw ether
    // 2. set 5% contract loyalty 
    function withdraw() public payable nonReentrant {
        require(msg.sender == owner, "Only owner");
        (bool isSent, ) = payable(address(this)).call{ value : address(this).balance }("");
        require(isSent, "Only owner.");
    }
    // ======================== Balance zone ================== // 

    
    // ======================== Danger zone ================== // 
    // disable all functions in contract
    function pauseCuriousPawoneer() public onlyRole(PAUSER_ROLE) {
        _pause(); // change pause state from false to true
    }

    function destructCuriousPawoneer(address _address) public onlyRole(DESTRUCTOR_ROLE) {
        selfdestruct(payable(_address)); // move ether to _address and destroy contract
    }
    // ======================== Danger zone ================== // 
}
 */
