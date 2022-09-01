import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { loadFixture, SnapshotRestorer, takeSnapshot, time } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import deploy from "../../../scripts/hooks/useDeployer";
import { useSnapshotForReset } from "../../../scripts/hooks/useNetworkHelper";
import { useUUPSDeployer } from "../../../scripts/hooks/useUpgradeDeployer";

const PREFIX = "integ-singleCatnipPool";
const ERC1820Registry = "0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24";

async function useFixture() {
  const { contract } = await deploy("SingleCatnipPool");
  const [owner, recipient] = await ethers.getSigners();
  return { contract, owner, recipient };
}

async function useUpgradeableDeployer() {
  const { contract, owner, recipient } = await useUUPSDeployer("Catnip");
  return { contract, owner, recipient };
}

describe(`${PREFIX}-init-registry`, function TestRegistry() {
  it("Should initialize registry", async function TestERC1820Registry() {
    const { contract } = await loadFixture(useFixture);
    expect(await contract._ERC1820_REGISTRY()).to.equal(ERC1820Registry);
  });
});

describe(`${PREFIX}-staking`, function TestStaking() {
  beforeEach(async function Reset() {
    await useSnapshotForReset();
  });

  it("Should stake an exact amount", async function TestStake() {
    // staking pool contract
    const _poolContract = await useFixture();
    const poolContract = _poolContract.contract;

    // ERC777 token contract
    const { contract } = await loadFixture(useUpgradeableDeployer);
    const ContractVer02Factory = await ethers.getContractFactory("CatnipVer02");

    const upgraded = await upgrades.upgradeProxy(contract.address, ContractVer02Factory, {
      kind: "uups",
    });

    const mintAmount = ethers.utils.parseEther("100");
    const stakeAmount = ethers.utils.parseEther("50");
    const [owner, recipient] = await ethers.getSigners();

    /// @dev token holder mint
    await upgraded.connect(recipient).mint(recipient.address, mintAmount, ethers.utils.toUtf8Bytes(""), ethers.utils.toUtf8Bytes(""));

    /// @dev authorize contract for token transfer
    await upgraded.connect(recipient).authorizeOperator(poolContract.address);

    /// @dev token holder stake
    expect(await poolContract.connect(recipient).stake(upgraded.address, stakeAmount))
      .to.emit(upgraded, "Stake")
      .withArgs(anyValue);

    expect(await poolContract.connect(recipient).stakeAmount()).to.equal(stakeAmount);
  });

  it("Should unstake an exact amount", async function TestUnstake() {
    const _poolContract = await useFixture();
    const poolContract = _poolContract.contract;

    const { contract, owner, recipient } = await useUpgradeableDeployer();
    const ContractVer02Factory = await ethers.getContractFactory("CatnipVer02");

    const upgraded = await upgrades.upgradeProxy(contract.address, ContractVer02Factory, {
      kind: "uups",
    });

    await upgraded
      .connect(recipient)
      .mint(recipient.address, ethers.utils.parseEther("10"), ethers.utils.toUtf8Bytes(""), ethers.utils.toUtf8Bytes(""));
    await upgraded.connect(recipient).authorizeOperator(poolContract.address);

    await poolContract.connect(recipient).stake(upgraded.address, ethers.utils.parseEther("7"));

    /// @dev staking is 1-year-long
    await expect(poolContract.connect(recipient).unStake(upgraded.address)).to.be.revertedWith("Staking hasn't finished");

    const current = await time.latest();
    const oneYear = time.duration.years(1);
    const oneSecond = time.duration.seconds(1);
    const stakingFinished = current + oneYear + oneSecond;

    await time.setNextBlockTimestamp(stakingFinished);

    /// @dev staking should end and token should be withdrawable
    await expect(poolContract.connect(recipient).unStake(upgraded.address)).not.to.be.reverted;
    expect(await poolContract.connect(recipient).stakeAmount()).to.equal(0);

    /// @dev once unstake is done, token holder should get their token back
    expect(await upgraded.balanceOf(recipient.address)).to.equal(ethers.utils.parseEther("10"));
  });
});
