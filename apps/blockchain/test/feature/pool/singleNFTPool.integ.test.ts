import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers, upgrades } from "hardhat";
import deploy from "../../../scripts/hooks/useDeployer";
import { useSnapshotForReset } from "../../../scripts/hooks/useNetworkHelper";
import { useUUPSDeployer } from "../../../scripts/hooks/useUpgradeDeployer";

const PREFIX = "integ-singleNFTPool";
const rewardAmount = ethers.utils.parseEther("100");

async function useFixture() {
  const { contract } = await deploy("SingleNFTPool");
  return { contract };
}

async function useUpgradeDeployerForNFT() {
  return await useUUPSDeployer("CuriousPawoneer");
}

async function useUpgradeDeployerForFT() {
  return await useUUPSDeployer("Catnip");
}

let upgraded: Contract;
let tokenContract: Contract;
let poolContract: Contract;
let catnipVer02: Contract;

let _owner: SignerWithAddress;
let _recipient: SignerWithAddress;

describe(`${PREFIX}-NFT-transfer`, function TestNFTTransfer() {
  this.beforeEach("Should reset blockchain", async function TestReset() {
    await useSnapshotForReset();

    /// @dev Staking pool setup
    const { contract } = await useFixture();
    poolContract = contract;

    /// @dev ERC721 CuriousPawoneer setup
    const _tokenContract = await useUpgradeDeployerForNFT();
    tokenContract = _tokenContract.contract;
    upgraded = await upgrades.upgradeProxy(tokenContract.address, await ethers.getContractFactory("CuriousPawoneerVer02"));

    const [owner, recipient] = await ethers.getSigners();

    _owner = owner;
    _recipient = recipient;

    /// @dev ERC777 Catnip setup
    const _catnip = await useUpgradeDeployerForFT();
    const catnipProxy = _catnip.contract;
    const catnipVer02Factory = await ethers.getContractFactory("CatnipVer02");

    catnipVer02 = await upgrades.upgradeProxy(catnipProxy.address, catnipVer02Factory, {
      kind: "uups",
    });
  });

  it("Should receive NFT", async function TestNFTReceival() {
    await upgraded.connect(_owner).__Ver02Setup_init();

    await upgraded.connect(_owner).setWhitelist(_owner.address);
    await upgraded.connect(_owner).safeMint(_owner.address);

    const tokenId = 0;

    /// @dev send a NFT to pool contract
    await expect(upgraded.safeTransferNFT(_owner.address, poolContract.address, tokenId)).not.to.be.reverted;
    expect(await upgraded.ownerOf(tokenId)).to.equal(poolContract.address);
  });

  it("Should stake NFT", async function TestNFTStaking() {
    await upgraded.connect(_owner).__Ver02Setup_init();
    await upgraded.connect(_owner).safeMint(_owner.address, { value: ethers.utils.parseEther("0.0001") });

    const tokenId = 0;

    expect(await upgraded.ownerOf(tokenId)).to.equal(_owner.address);

    /// @dev token transfer approval must be done
    await upgraded.connect(_owner).approve(poolContract.address, tokenId);
    await expect(poolContract.connect(_owner).stake(catnipVer02.address, upgraded.address, tokenId)).not.to.reverted;

    expect(await poolContract.stakedTokenlist(_owner.address, tokenId)).not.to.reverted;
    expect(await poolContract.stakedTokenlist(_owner.address, tokenId))
      .to.emit(poolContract, "NFTStaked")
      .withArgs(anyValue);

    /// @dev nested mapping: deliver keys in order. below will log NFT struct
    console.log(await poolContract.stakedTokenlist(_owner.address, tokenId));
  });

  it("Should unstake NFT", async function TestNFTUnstaking() {
    await upgraded.__Ver02Setup_init();
    await upgraded.connect(_owner).safeMint(_owner.address, { value: ethers.utils.parseEther("0.0001") });

    const tokenId = 0;

    await upgraded.connect(_owner).approve(poolContract.address, tokenId);
    await poolContract.connect(_owner).stake(catnipVer02.address, upgraded.address, tokenId);

    /// @dev staking is one year
    await expect(poolContract.unstake(upgraded.address, tokenId)).to.be.revertedWith("Staking not finished");
    expect(await upgraded.ownerOf(tokenId)).to.equal(poolContract.address);

    await time.setNextBlockTimestamp((await time.latest()) + time.duration.years(1) + time.duration.seconds(1));

    await expect(poolContract.connect(_owner).unstake(upgraded.address, tokenId)).not.to.be.reverted;
    expect(await upgraded.ownerOf(tokenId)).to.equal(_owner.address);
  });

  it("Should calculate staking reward", async function TestRewardCalculation() {
    expect(await poolContract.calculateReward()).to.equal(rewardAmount);
  });

  it("Should reward NFT staker", async function TestNFTStakingReward() {
    /// Upgradeable NFT
    await upgraded.__Ver02Setup_init();
    await upgraded.connect(_owner).safeMint(_owner.address, { value: ethers.utils.parseEther("0.0001") });

    const tokenId = 0;

    await upgraded.connect(_owner).approve(poolContract.address, tokenId);
    await poolContract.connect(_owner).stake(catnipVer02.address, upgraded.address, tokenId);

    expect(await catnipVer02.balanceOf(_owner.address)).to.equal(rewardAmount);
  });
});
