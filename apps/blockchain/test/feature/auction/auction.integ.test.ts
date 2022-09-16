import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import deploy from "../../../scripts/hooks/useDeployer";
import { useUUPSDeployer } from "../../../scripts/hooks/useUpgradeDeployer";

const PREFIX = "integ-auction";

async function useUpgradeDeployer() {
  return await useUUPSDeployer("CuriousPawoneer");
}

async function useFixture() {
  return await deploy("Auction");
}

async function nftSetup() {
  let upgraded;
  const _nftContract = await useUpgradeDeployer();
  const nftContract = _nftContract.contract;
  const nftContractVer02 = await ethers.getContractFactory("CuriousPawoneerVer02");

  upgraded = await upgrades.upgradeProxy(nftContract.address, nftContractVer02);

  const [_owner, _recipient] = await ethers.getSigners();
  return { upgraded, _owner, _recipient };
}

describe(`${PREFIX}-mint-NFT`, function TestMintNFT() {
  it("Should mint a NFT to winner", async function TestMintForWinner() {
    const { contract, owner, recipient } = await loadFixture(useFixture);
    const { upgraded, _owner, _recipient } = await nftSetup();

    const tokenId = 0;

    await contract.connect(owner).startAuction();
    await contract.connect(recipient).bid(tokenId);
    await contract.connect(owner).endAuction();

    await upgraded.connect(_owner).setAuctionWinner(contract.address, tokenId);
    await upgraded.connect(_owner).safeMint(recipient.address);

    expect(await upgraded.balanceOf(recipient.address)).not.to.equal(0);
    expect(await upgraded.ownerOf(tokenId)).to.equal(recipient.address);
  });
});
