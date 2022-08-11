import { loadFixture, takeSnapshot } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers, upgrades } from "hardhat";
import { useSnapshotForReset, useImpersonatedSigner } from "../../../scripts/hooks/useNetworkHelper";
import "@nomicfoundation/hardhat-chai-matchers";
import chalk from "chalk";
import { FakeContract, smock } from "@defi-wonderland/smock";
import chai from "chai";

/**
 * Ethereum-waffle and hardhat-network-helper may cause conflict.
 * Smock community plugin is used to replace ethereum-waffle.
 */

chai.use(smock.matchers);

/**
 * UUPS upgradeable contract test point
 * 1. proxiableUUID => should revert when it is called from proxy
 * 2. _authorizeUpgrade => access control should work
 */

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

describe(`${PREFIX}-metadata`, function TestMetadata() {
  beforeEach("Reset blockchain state", async function TestResetBlockchain() {
    await useSnapshotForReset();
  });

  it("Must not be called through delegatecall", async function TestProxiableUUID() {
    const { contract } = await loadFixture(useFixture);
    await expect(contract.proxiableUUID()).to.be.revertedWith("UUPSUpgradeable: must not be called through delegatecall");
  });

  it("Should return a owner/signer of the contract", async function TestContractOwner() {
    const { contract } = await loadFixture(useFixture);
    const [hardhatFirstAccount] = await ethers.getSigners();

    // default contract deployer/owner/signer is the first account of hardhat network
    expect(await contract.signer.getAddress()).to.equal(hardhatFirstAccount.address);
  });

  it("Should be upgradeble for only owner", async function TestUpgradeAccessControl() {
    const { contract } = await loadFixture(useFixture);
    const { contractVer02 } = await deployVer2();

    const [owner, recipient] = await ethers.getSigners();

    await expect(contract.connect(recipient).upgradeTo(contractVer02.address)).to.be.reverted;
    await expect(contract.upgradeTo(contractVer02.address)).not.to.be.reverted;
  });

  it("Ver2 should have a catnipVersion function", async function TestVersionGetter() {
    const { contractVer02 } = await deployVer2();
    const CATNIP_VERSION_02 = 2;

    expect(await contractVer02.catnipVersion()).to.equal(CATNIP_VERSION_02);
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

    /// @dev proxy contract name does not change even after upgrades.
    expect(await contract.name()).to.equal("UP_Catnip");
  });

  it("Smock should properly work", async function TestSmockPlugin() {
    const { mockContractVer02 } = await loadFixture(deployMockVer2);

    const FORGED_DECIMALS = 200;
    await mockContractVer02.decimals.returns(FORGED_DECIMALS);
    expect(await mockContractVer02.decimals()).to.equal(FORGED_DECIMALS);
  });

  it("Mock should return a proper maximum supply", async function TestMaximumSupply() {
    const { mockContractVer02 } = await loadFixture(deployMockVer2);

    // upgradeable contract does not support constructor.
    // state variable initialization dealt by mocking.
    const SUPPLY_LIMIT = ethers.utils.parseEther("1000000000");
    await mockContractVer02.supplyLimit.returns(SUPPLY_LIMIT);

    expect(await mockContractVer02.supplyLimit()).to.equal(SUPPLY_LIMIT);
  });

  it("CatnipVer02 has a version getter", async function TestCatnipVersion() {
    const { contractVer02 } = await loadFixture(deployVer2);
    const CATNIP_VERSION_02 = 2;
    expect(await contractVer02.catnipVersion()).to.equal(CATNIP_VERSION_02);
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
});
