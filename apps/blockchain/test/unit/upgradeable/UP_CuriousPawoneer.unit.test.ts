import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import chalk from "chalk";
import { BigNumber, Contract } from "ethers";
import { ethers, upgrades } from "hardhat";
import { useSnapshotForReset } from "../../../scripts/hooks/useNetworkHelper";
import { useUUPSDeployer } from "../../../scripts/hooks/useUpgradeDeployer";

/**
 *  *  * UUPS upgradeable contract test point
 *  * 1. proxiableUUID => should revert when it is called from proxy
 *  * 2. _authorizeUpgrade => access control should work
 */

const contractName = "CuriousPawoneer";
const contractSymbol = "CP";
const PREFIX = "unit-CuriousPawoneer";

const MINTER_ROLE = ethers.utils.solidityKeccak256(["string"], ["MINTER_ROLE"]);
const UPGRADER_ROLE = ethers.utils.solidityKeccak256(["string"], ["UPGRADER_ROLE"]);
const BURNER_ROLE = ethers.utils.solidityKeccak256(["string"], ["BURNER_ROLE"]);
const PAUSER_ROLE = ethers.utils.solidityKeccak256(["string"], ["PAUSER_ROLE"]);
const DEFAULT_ADMIN_ROLE = ethers.utils.solidityKeccak256(["string"], ["DEFAULT_ADMIN_ROLE"]);

const useFixture = async () => {
  return await useUUPSDeployer(contractName);
};

describe(`${PREFIX}-metadata`, function TestMetadata() {
  this.beforeEach("Should rest blockchain state", async function TestReset() {
    await useSnapshotForReset();
  });

  it("Should return a correct name", async function TestName() {
    const { contract } = await loadFixture(useFixture);
    expect(await contract.name()).to.equal(contractName);
  });

  it("Should return a correct symbol", async function TestSymbol() {
    const { contract } = await loadFixture(useFixture);
    expect(await contract.symbol()).to.equal(contractSymbol);
  });

  it("Should revert when there is no token", async function TestTokenURI() {
    const { contract } = await loadFixture(useFixture);
    await expect(contract.tokenURI(0)).to.be.reverted;
  });

  it("Should return a correct owner/deployer", async function TestOwner() {
    const { contract } = await loadFixture(useFixture);
    const [owner] = await ethers.getSigners();

    expect(await contract.signer.getAddress()).to.equal(owner.address);
  });
});

describe(`${PREFIX}-upgradeability`, function TestUpgradeability() {
  this.beforeEach("Should reset blockchain state", async function TestReset() {
    await useSnapshotForReset();
  });

  it("Should revert when called from proxy", async function TestProxiableUUID() {
    const { contract } = await loadFixture(useFixture);
    await expect(contract.proxiableUUID()).to.be.reverted;
  });

  it("Should prepare for upgrade", async function TestPrepareUpgrade() {
    const { contract } = await loadFixture(useFixture);
    const contractVer02Factory = await ethers.getContractFactory("CuriousPawoneerVer02");

    expect(
      await upgrades.prepareUpgrade(contract.address, contractVer02Factory, {
        kind: "uups",
      })
    ).not.to.be.reverted;
  });

  it("Should work before/after upgrade", async function TestUpgrade() {
    const { contract, owner, recipient } = await loadFixture(useFixture);
    const contractVer02Factory = await ethers.getContractFactory("CuriousPawoneerVer02");

    /// @dev contract owner/deployer has a upgrader role
    const upgraded = await upgrades.upgradeProxy(contract.address, contractVer02Factory, {
      kind: "uups",
    });

    expect(await upgraded.name()).to.equal(contractName);

    /// @dev only upgrader can upgrade
    await expect(upgraded.connect(recipient).upgradeTo(contract.address)).to.be.reverted;
  });
});

describe(`${PREFIX}-backlogs`, function TestBacklogs() {
  this.beforeEach("Should reset blockchain state", async function TestReset() {
    await useSnapshotForReset();
  });

  describe("Access control", function TestAccessControl() {
    it("Should set an owner MINTER/UPGRADER roles", async function TestOwnerRoles() {
      const { contract, owner, recipient } = await loadFixture(useFixture);

      expect(await contract.hasRole(MINTER_ROLE, owner.address)).to.be.true;
      expect(await contract.hasRole(UPGRADER_ROLE, owner.address)).to.be.true;
    });

    it("Only Minter can mint", async function TestMinterRole() {
      const { contract, owner, recipient } = await loadFixture(useFixture);

      await expect(contract.connect(recipient).safeMint(recipient.address)).to.be.reverted;
      expect(await contract.connect(owner).safeMint(recipient.address)).not.to.be.reverted;
    });

    it("Only Upgrader can upgrade", async function TestUpgraderRole() {
      const { contract, owner, recipient } = await loadFixture(useFixture);

      const contractVer02Factory = await ethers.getContractFactory("CuriousPawoneerVer02");
      const _contractVer02 = await contractVer02Factory.deploy();
      const contractVer02 = await _contractVer02.deployed();

      await expect(contract.connect(recipient).upgradeTo(contractVer02.address)).to.be.reverted;
      await expect(contract.connect(owner).upgradeTo(contractVer02.address)).not.to.be.reverted;
    });

    it("Only Burner can burn", async function TestBurnerRole() {
      const { contract, owner, recipient } = await loadFixture(useFixture);
      const [_, __, burner] = await ethers.getSigners();

      await contract.grantRole(BURNER_ROLE, burner.address);

      /// @dev owner has a MINTER role
      await contract.connect(owner).safeMint(recipient.address);

      /// @dev token holder decides operation privilege
      await contract.connect(recipient).setApprovalForAll(burner.address, true);

      /// @dev burner has a BURNER role
      await expect(contract.connect(burner).burnOneToken(0)).not.to.be.reverted;
    });

    it("Only Pauser can pause", async function TestPauserRole() {
      const { contract, owner, recipient } = await loadFixture(useFixture);
      const [_, __, ___, pauser] = await ethers.getSigners();

      /// @dev grant PAUSER role to pauser
      await contract.connect(owner).grantRole(PAUSER_ROLE, pauser.address);

      /// @dev pauser stops contract
      await contract.connect(pauser).pauseCuriousPawoneer();

      /// @dev transaction should revert when paused
      await expect(contract.connect(owner).safeMint(owner.address)).to.be.reverted;

      /// @dev pauser restarts contract
      await contract.connect(pauser).resumeCuriousPawoneer();

      /// @deve transaction should execute
      await contract.connect(owner).safeMint(owner.address);
      expect(await contract.ownerOf(0)).to.equal(owner.address);
    });
  });
});

describe(`${PREFIX}-ver02`, async function TestVer02() {
  let upgraded: Contract;
  let _owner: SignerWithAddress;
  let _recipient: SignerWithAddress;

  beforeEach("Should upgrade a UUPS proxy to ver02", async function TestUpgradeDeploy() {
    await useSnapshotForReset();

    const { contract, owner, recipient } = await loadFixture(useFixture);
    const contractVer02Factory = await ethers.getContractFactory("CuriousPawoneerVer02");

    upgraded = await upgrades.upgradeProxy(contract.address, contractVer02Factory, {
      kind: "uups",
    });

    _owner = owner;
    _recipient = recipient;
  });

  it("Should return a version", async function TestVersionGetter() {
    /// @dev proxy does not have a version getter
    const VERSION_02 = 2;
    expect(await upgraded.curiousPawoneerVersion()).to.equal(VERSION_02);
  });

  it("Should initialize ver02", async function TestVer02SetupInit() {
    await expect(upgraded.connect(_recipient).__Ver02Setup_init()).to.be.reverted;

    /// @dev should initialze once
    await upgraded.connect(_owner).__Ver02Setup_init();

    expect(await upgraded.onlyVer02SetupInit()).to.be.true;

    const _whitelistEventTime = (await time.latest()) + time.duration.weeks(1);
    expect(await upgraded.whitelistEventTime()).to.equal(_whitelistEventTime);
  });

  it("Should set a whitelist only for a limited time", async function TestWhitelistSetter() {
    await upgraded.connect(_owner).__Ver02Setup_init();

    expect(await upgraded.setWhitelist(_owner.address)).not.to.be.reverted;
    expect(await upgraded.whitelist(_owner.address)).to.be.true;
  });

  it("Should whitelist-mint free", async function TestWhitelistMint() {
    /// @dev should initialze once
    await upgraded.connect(_owner).__Ver02Setup_init();

    /// @dev whitelist mint requires no fee
    await upgraded.connect(_owner).setWhitelist(_owner.address);
    await upgraded.connect(_owner).safeMint(_owner.address);
    expect(await upgraded.ownerOf(0)).to.equal(_owner.address);
  });

  it("Non-whitelist mint requires a 0.0001 ether", async function TestNonWhitelistMint() {
    await upgraded.connect(_owner).__Ver02Setup_init();

    /// @dev non-whitelist mint requires a 0.0001 ether
    /// @dev owner has a minter role
    await expect(upgraded.connect(_owner).safeMint(_recipient.address)).to.be.revertedWith("Non-whitelist mint requires a fee");
    expect(await upgraded.connect(_owner).safeMint(_recipient.address, { value: ethers.utils.parseEther("0.0001") }));
  });

  it("Contract should receive mint fee in Ether", async function TestEtherReceival() {
    await upgraded.connect(_owner).__Ver02Setup_init();

    await expect(upgraded.connect(_owner).safeMint(_recipient.address)).to.be.revertedWith("Non-whitelist mint requires a fee");
    expect(await upgraded.connect(_owner).safeMint(_recipient.address, { value: ethers.utils.parseEther("0.0001") }));

    expect(await upgraded.getReceivedEther()).to.equal(ethers.utils.parseEther("0.0001"));
  });

  it("Should withdraw and transfer a received ether", async function TestEtherWithdrawl() {
    await upgraded.connect(_owner).__Ver02Setup_init();

    console.log(chalk.bgMagenta.bold("BAL BEFORE MINT: "), await _recipient.getBalance());

    await expect(upgraded.connect(_owner).safeMint(_recipient.address)).to.be.revertedWith("Non-whitelist mint requires a fee");
    expect(await upgraded.connect(_owner).safeMint(_recipient.address, { value: ethers.utils.parseEther("0.0001") }));

    const recipientBalanceBeforeEtherTransfer = await _recipient.getBalance();

    await upgraded.withdrawReceivedEther(_recipient.address);

    const recipientBalanceAfterEtherTransfer = await _recipient.getBalance();

    expect(await upgraded.withdrawReceivedEther(_recipient.address))
      .to.emit(upgraded, "WithdrewEtherTo")
      .withArgs(anyValue);

    /// @dev hardhat accounts already pre-funded to 10,000 ether
    /// @dev do not compare balances directly. try to use difference.
    const diff = recipientBalanceAfterEtherTransfer.toBigInt() - recipientBalanceBeforeEtherTransfer.toBigInt();
    expect(diff).to.equal(ethers.utils.parseEther("0.0001"));
  });

  it("Should withdraw a minted NFT", async function TestNFTWithdrawl() {
    await upgraded.connect(_owner).__Ver02Setup_init();

    await upgraded.connect(_owner).setWhitelist(_owner.address);
    await upgraded.connect(_owner).safeMint(_owner.address);

    const tokenId = 0;
    await expect(upgraded.withdrawMintedNFT(_owner.address, _recipient.address, tokenId)).not.to.be.reverted;

    expect(await upgraded.ownerOf(tokenId)).to.equal(_recipient.address);
    expect(await upgraded.ownerOf(tokenId)).not.to.equal(_owner.address);
  });

  it("Should receive NFT", async function TestNFTReceival() {
    await upgraded.connect(_owner).__Ver02Setup_init();

    await upgraded.connect(_owner).setWhitelist(_owner.address);
    await upgraded.connect(_owner).safeMint(_owner.address);

    const tokenId = 0;

    /// @dev send a NFT to curious pawoneer contract
    await expect(upgraded.withdrawMintedNFT(_owner.address, upgraded.address, tokenId)).not.to.be.reverted;
    expect(await upgraded.ownerOf(tokenId)).to.equal(upgraded.address);
  });

  it.skip("Should withdraw a received NFT", async function TestReceivedNFTWithdrawl() {});
});
