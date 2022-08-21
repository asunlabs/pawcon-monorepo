import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
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
// const DEFAULT_ADMIN_ROLE = ethers.utils.hex;

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

    it.only("Only Pauser can pause", async function TestPauserRole() {
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
