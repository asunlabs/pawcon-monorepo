import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers, upgrades } from "hardhat";
import { useSnapshotForReset } from "../../../scripts/hooks/useNetworkHelper";
import "@nomicfoundation/hardhat-chai-matchers";
import chalk from "chalk";
import { smock } from "@defi-wonderland/smock";
import chai from "chai";

/**
 *  * UUPS upgradeable contract test point
 *  * 1. proxiableUUID => should revert when it is called from proxy
 *  * 2. _authorizeUpgrade => access control should work
 *
 *  * Mocking
 *  Ethereum-waffle and hardhat-network-helper may cause conflict.
 *  Smock community plugin is used to replace ethereum-waffle.
 *
 *  * Provided functions by smock plugin
 *  1) atCall
 *  2) getCall
 *  3) returns
 *  4) returnsAtCall
 *  5) reverts
 *  6) revertsAtCall
 *  7) whenCalledWith
 *  8) reset
 */

chai.use(smock.matchers);

const PREFIX = "unit-UP_Catnip";
let contract: Contract;

const useFixture = async () => {
  const UP_Catnip = await ethers.getContractFactory("UP_Catnip");
  const Contract = await upgrades.deployProxy(UP_Catnip, {
    initializer: "initialize",
    kind: "uups",
  });
  contract = await Contract.deployed();

  return { contract };
};

const deployVer2 = async () => {
  const UP_CatnipVer02 = await ethers.getContractFactory("UP_CatnipVer02");
  const ContractVer02 = await UP_CatnipVer02.deploy();
  const contractVer02 = await ContractVer02.deployed();

  return { contractVer02 };
};

const deployMockVer2 = async () => {
  const MockContract = await smock.mock("UP_CatnipVer02");
  const mockContractVer02 = await MockContract.deploy();

  return {
    mockContractVer02,
  };
};

describe(`${PREFIX}-proxy`, function TestMetadata() {
  beforeEach("Reset blockchain state", async function TestResetBlockchain() {
    await useSnapshotForReset();
  });

  it("Should return a owner/signer of the contract", async function TestContractOwner() {
    const { contract } = await loadFixture(useFixture);
    const [hardhatFirstAccount] = await ethers.getSigners();

    // default contract deployer/owner/signer is the first account of hardhat network
    expect(await contract.signer.getAddress()).to.equal(hardhatFirstAccount.address);
  });
});

describe(`${PREFIX}-smock`, function TestSmockPlugin() {
  it("Smock should properly work", async function TestSmockPlugin() {
    const { mockContractVer02 } = await loadFixture(deployMockVer2);

    const FORGED_DECIMALS = 200;
    await mockContractVer02.decimals.returns(FORGED_DECIMALS);
    expect(await mockContractVer02.decimals()).to.equal(FORGED_DECIMALS);
  });

  it("Smock should return a fake maximum supply", async function TestMaximumSupply() {
    const { mockContractVer02 } = await loadFixture(deployMockVer2);

    const FAKE_LIMIT = "100000000000";
    const FAKE_SUPPLY_LIMIT = ethers.utils.parseEther(FAKE_LIMIT);
    await mockContractVer02.supplyLimit.returns(FAKE_SUPPLY_LIMIT);

    expect(await mockContractVer02.supplyLimit()).to.equal(FAKE_SUPPLY_LIMIT);
  });

  it("Should mint an exact amount", async function TestMint() {
    const { mockContractVer02 } = await deployMockVer2();

    const [owner, recipient] = await ethers.getSigners();
    const mintAmount = ethers.utils.parseEther("100");

    /// @dev implementation/logic contract does not hold state.
    expect(await mockContractVer02.mint.whenCalledWith(owner.address, mintAmount, ethers.utils.toUtf8Bytes(""), ethers.utils.toUtf8Bytes(""))).not.to
      .be.reverted;

    await mockContractVer02.balanceOf.whenCalledWith(owner.address).returns(mintAmount);
    console.log(chalk.bgMagenta.bold("OWNER BALANCE: "), await mockContractVer02.balanceOf(owner.address));
    expect(await mockContractVer02.balanceOf(owner.address)).to.equal(mintAmount);
  });
});

describe(`${PREFIX}-upgradeability`, function TestUpgradeability() {
  beforeEach("Reset blockchain state", async function TestResetBlockchain() {
    await useSnapshotForReset();
  });

  it("Must not be called through delegatecall", async function TestProxiableUUID() {
    const { contract } = await loadFixture(useFixture);
    await expect(contract.proxiableUUID()).to.be.revertedWith("UUPSUpgradeable: must not be called through delegatecall");
  });

  it("Should be prepared for upgrades", async function TestPrepareUpgrades() {
    const { contract } = await loadFixture(useFixture);

    /// @dev nested loadFixture not yet supported. Do NOT use loadFixture twice in one test case
    const { contractVer02 } = await deployVer2();

    console.log(chalk.bgMagenta.bold("PROXY ADDR: "), contract.address);
    console.log(chalk.bgCyan.bold("VER2 ADDR: "), contractVer02.address);

    const contractVer02Factory = await ethers.getContractFactory("UP_CatnipVer02");

    /// @dev upgrades.prepareUpgrade returns an implementation address
    expect(
      await upgrades.prepareUpgrade(contract.address, contractVer02Factory, {
        kind: "uups",
      })
    ).not.to.reverted;

    const implAddr = await upgrades.prepareUpgrade(contract.address, contractVer02Factory, {
      kind: "uups",
    });

    console.log(implAddr);
  });

  it("Should work before/after upgrades", async function TestUpgrades() {
    // before upgrades
    const { contract } = await loadFixture(useFixture);
    expect(await contract.name()).to.equal("UP_Catnip");

    // after upgrades
    const ContractVer02Factory = await ethers.getContractFactory("UP_CatnipVer02");

    await upgrades.upgradeProxy(contract.address, ContractVer02Factory, {
      kind: "uups",
    });

    /**
     * @dev proxy contract name does not change even after upgrades
     * @dev since initializer is locked in constructor
     */
    expect(await contract.name()).to.equal("UP_Catnip");
  });

  it("Should be upgradeble by only owner", async function TestUpgradeAccessControl() {
    const { contract } = await loadFixture(useFixture);
    const { contractVer02 } = await deployVer2();

    const [owner, recipient] = await ethers.getSigners();

    await expect(contract.connect(recipient).upgradeTo(contractVer02.address)).to.be.reverted;
    await expect(contract.upgradeTo(contractVer02.address)).not.to.be.reverted;
  });

  it("Should mint an exact amount after upgrade", async function TestUpgradeMint() {
    const { contract } = await loadFixture(useFixture);
    const ContractVer02Factory = await ethers.getContractFactory("UP_CatnipVer02");

    /// @dev the upgraded is typeof Contract, holding newly added functions in contract ver02.
    const upgraded = await upgrades.upgradeProxy(contract.address, ContractVer02Factory, {
      kind: "uups",
    });

    const [owner, recipient] = await ethers.getSigners();
    const mintAmount = ethers.utils.parseEther("10");
    const userData = ethers.utils.toUtf8Bytes("");
    const operatorData = ethers.utils.toUtf8Bytes("");

    await upgraded.mint(recipient.address, mintAmount, userData, operatorData);

    expect(await upgraded.balanceOf(recipient.address)).to.equal(mintAmount);
    console.log(chalk.bgMagenta.bold("RECIPIENT MINT BAL: "), await upgraded.balanceOf(recipient.address));
  });
});

describe(`${PREFIX}-ver02`, function TestVer02() {
  beforeEach("Reset blockchain state", async function TestResetBlockchain() {
    await useSnapshotForReset();
  });

  it("Ver2 should have a catnipVersion function", async function TestVersionGetter() {
    const { contractVer02 } = await deployVer2();
    const CATNIP_VERSION_02 = 2;

    expect(await contractVer02.catnipVersion()).to.equal(CATNIP_VERSION_02);
  });

  it("Supply limit boundary test", async function TestLimitBoundary() {
    const SUPPLY_LIMIT = ethers.utils.parseEther("1000000000");
    const { contractVer02 } = await loadFixture(deployVer2);
    const [owner, recipient] = await ethers.getSigners();
    const exceededMintAmount = ethers.utils.parseEther("1000000001");

    await expect(
      contractVer02.mint(owner.address, exceededMintAmount, ethers.utils.toUtf8Bytes(""), ethers.utils.toUtf8Bytes(""))
    ).to.be.revertedWith("Exceeded max supply");
  });

  it.only("Should stake an exact amount", async function TestStake() {
    const { contract } = await loadFixture(useFixture);
    const ContractVer02Factory = await ethers.getContractFactory("UP_CatnipVer02");

    const upgraded = await upgrades.upgradeProxy(contract.address, ContractVer02Factory, {
      kind: "uups",
    });

    const mintAmount = ethers.utils.parseEther("100");
    const stakeAmount = ethers.utils.parseEther("50");
    const [, recipient] = await ethers.getSigners();

    // token holder should authorize first
    await upgraded.connect(recipient).authorizeOperator(contract.address);

    // token holder mint
    await upgraded.connect(recipient).mint(recipient.address, mintAmount, ethers.utils.toUtf8Bytes(""), ethers.utils.toUtf8Bytes(""));

    // token holder stake
    // TODO ERC1820 implementation requires. The stake function involves sending
    // TODO ERC777 token to UP_CatnipVer02 contract, which is also ERC777
    await upgraded.connect(recipient).stake(stakeAmount);
  });
});
