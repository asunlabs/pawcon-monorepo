import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { loadFixture, SnapshotRestorer, takeSnapshot, time } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import chalk from "chalk";
import { Contract } from "ethers";
import { ethers, upgrades } from "hardhat";
import deploy from "../../../scripts/hooks/useDeployer";
import { useSnapshotForReset } from "../../../scripts/hooks/useNetworkHelper";
import { useUUPSDeployer } from "../../../scripts/hooks/useUpgradeDeployer";

const PREFIX = "integ-singleCatnipPool";
const ERC1820Registry = "0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24";

const mintAmount = ethers.utils.parseEther("10");
const stakeAmount = ethers.utils.parseEther("7");
const rewardAmount = stakeAmount.div(100).mul(4);

const userData = ethers.utils.toUtf8Bytes("");
const operatorData = ethers.utils.toUtf8Bytes("");

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
  let upgraded: Contract;
  let poolContract: Contract;
  let owner: SignerWithAddress;
  let recipient: SignerWithAddress;

  beforeEach(async function Reset() {
    await useSnapshotForReset();

    // ERC777 token contract
    const { contract } = await loadFixture(useUpgradeableDeployer);
    const ContractVer02Factory = await ethers.getContractFactory("CatnipVer02");

    upgraded = await upgrades.upgradeProxy(contract.address, ContractVer02Factory, {
      kind: "uups",
    });

    const [_owner, _recipient] = await ethers.getSigners();

    owner = _owner;
    recipient = _recipient;

    const _poolContract = await useFixture();
    poolContract = _poolContract.contract;

    await upgraded.connect(owner).mint(recipient.address, mintAmount, userData, operatorData);
    await upgraded.connect(recipient).authorizeOperator(poolContract.address);
    await poolContract.connect(recipient).stake(upgraded.address, stakeAmount);
  });

  it("Should stake an exact amount", async function TestStake() {
    // staking pool contract
    const _poolContract = await useFixture();
    const poolContract = _poolContract.contract;

    /// @dev token holder mint
    await upgraded.connect(recipient).mint(recipient.address, mintAmount, userData, operatorData);

    /// @dev authorize contract for token transfer
    await upgraded.connect(recipient).authorizeOperator(poolContract.address);

    /// @dev token holder stake
    expect(await poolContract.connect(recipient).stake(upgraded.address, stakeAmount))
      .to.emit(upgraded, "Stake")
      .withArgs(anyValue);

    expect(await poolContract.connect(recipient).stakeAmount()).to.equal(stakeAmount);
  });

  it("Should unstake an exact amount", async function TestUnstake() {
    /// @dev staking is 1-year-long
    await expect(poolContract.connect(recipient).unStake(upgraded.address, stakeAmount)).to.be.revertedWith("Staking hasn't finished");

    const current = await time.latest();
    const oneYear = time.duration.years(1);
    const oneSecond = time.duration.seconds(1);
    const stakingFinished = current + oneYear + oneSecond;

    await time.setNextBlockTimestamp(stakingFinished);

    /// @dev staking should end and token should be withdrawable
    await expect(poolContract.connect(recipient).unStake(upgraded.address, stakeAmount)).not.to.be.reverted;
    expect(await poolContract.connect(recipient).stakeAmount()).to.equal(0);

    /// @dev once unstake is done, token holder should get their token back
    const totalBalance = mintAmount.add(rewardAmount);
    expect(await upgraded.balanceOf(recipient.address)).to.equal(totalBalance);
  });

  it("Should calculate 4 percent staking reward", async function TestStakingReward() {
    /// @dev staking reward is the 4 percent of whole staked amount
    expect(await poolContract.calculateStakeReward(recipient.address)).to.equal(rewardAmount);
    console.log(chalk.bgMagenta.bold("staking reward: "), await poolContract.calculateStakeReward(recipient.address));
  });

  it("Should reward staker", async function TestStakerReward() {
    const balance = mintAmount.sub(stakeAmount).add(rewardAmount);
    expect(await upgraded.balanceOf(recipient.address)).to.equal(balance);
  });
});
