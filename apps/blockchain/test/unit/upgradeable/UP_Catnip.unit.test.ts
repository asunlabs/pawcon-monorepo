import { loadFixture, takeSnapshot } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers, upgrades } from "hardhat";
import { useSnapshotForReset, useImpersonatedSigner } from "../../../scripts/hooks/useNetworkHelper";
import "@nomicfoundation/hardhat-chai-matchers";
import chalk from "chalk";

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

describe(`${PREFIX}-metadata`, function TestMetadata() {
  beforeEach("Reset blockchain state", async function TestResetBlockchain() {
    await useSnapshotForReset();
  });

  it("Initial value should be zero", async function TestName() {
    const { contract } = await loadFixture(useFixture);
    expect(await contract.number()).to.equal(0);
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

    // await expect(contract.increaseNumber()).not.to.be.reverted;
  });

  it("Ver2 should have a version getter", async function TestVersionGetter() {
    const { contractVer02 } = await deployVer2();
    const CATNIP_VERSION_02 = 2;

    expect(await contractVer02.catnipVersion()).to.equal(CATNIP_VERSION_02);
  });

  it("Ver2 should have a increaseNumber function", async function TestIncreaseNumber() {
    const { contractVer02 } = await deployVer2();
    await contractVer02.increaseNumber();
    const INITIAL_VALUE = 0;
    expect(await contractVer02.number()).to.equal(INITIAL_VALUE + 1);

    // console.log(chalk.bgMagenta("contractVer02: "), contractVer02);
  });

  // FIX: after upgrade, contract ver 01 does not have newly added functions
  it.skip("Ver2 ownership should be transferred to recipient", async function TestOwnershipTransfer() {
    const { contractVer02 } = await deployVer2();
    const { contract } = await loadFixture(useFixture);
    const ContractVer02Factory = await ethers.getContractFactory("UP_CatnipVer02");
    await upgrades.upgradeProxy(contract.address, ContractVer02Factory, {
      kind: "uups",
    });
    const upgraded = await contract.upgradeTo(contractVer02.address);
    await upgraded.catnipVersion();
    // expect(await contract.catnipVersion()).to.equal(2);
    // console.log(await contract.upgradeToAndCall(contractVer02.address, ethers.utils.toUtf8Bytes("increaseNumber()")));
  });
});
