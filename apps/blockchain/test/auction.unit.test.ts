import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import chalk from "chalk";
import { ethers } from "hardhat";
import deploy from "../scripts/hooks/useDeployer";
import { useSnapshotForReset } from "../scripts/hooks/useNetworkHelper";

const PREFIX = "unit-Auction";

async function useFixture() {
  const { contract } = await deploy("Auction");
  const [owner, recipient] = await ethers.getSigners();

  return { contract, owner, recipient };
}

describe(`${PREFIX}-state-variables`, function TestStateVariables() {
  this.beforeAll(async function Reset() {
    await useSnapshotForReset();
  });

  it("Should return correct variables", async function TestBidCurrency() {
    const { contract } = await loadFixture(useFixture);
    const auctionPeriod = time.duration.days(7);
    expect(await contract.period()).to.equal(auctionPeriod);
    expect(await contract.auctionStarted()).to.be.false;
    expect(await contract.auctionEnded()).to.be.false;
  });
});

describe(`${PREFIX}-start-and-end`, function TestAuctionStartEnd() {
  this.beforeAll(async function Reset() {
    await useSnapshotForReset();
  });

  it("Should start auction", async function TestAuctionStart() {
    const { contract, owner, recipient } = await loadFixture(useFixture);

    /// @dev only owner
    await expect(contract.connect(recipient).startAuction()).to.be.reverted;
    expect(await contract.connect(owner).startAuction())
      .to.emit(contract, "AuctionStarted")
      .withArgs(anyValue);
    expect(await contract.auctionStarted()).to.be.true;
  });

  it("Should end auction", async function TestAuctionEnd() {
    const { contract, owner, recipient } = await loadFixture(useFixture);

    /// @dev auction started
    expect(await contract.connect(owner).startAuction());

    /// @dev auction should end, only owner
    await expect(contract.connect(recipient).endAuction()).to.be.reverted;

    expect(await contract.connect(owner).endAuction())
      .to.emit(contract, "AuctionEnded")
      .withArgs(anyValue);

    expect(await contract.auctionEnded()).to.be.true;
  });
});

describe(`${PREFIX}-bid`, function TestBid() {
  this.beforeAll(async function Reset() {
    await useSnapshotForReset();
  });

  it("Should bid properly", async function TestHighestBid() {
    const { contract, owner, recipient } = await loadFixture(useFixture);

    const tokenId = 0;
    await expect(contract.bid(tokenId)).to.be.reverted;
    // auction started, now biddable
    await contract.connect(owner).startAuction();

    console.log(chalk.bgMagenta.bold("acution start at: "), await contract.startedAt());

    expect(await contract.connect(recipient).bid(tokenId, { value: ethers.utils.parseEther("1") }))
      .to.emit(contract, "BidHistory")
      .withArgs(anyValue);

    expect(await contract.highestBid()).to.equal(ethers.utils.parseEther("1"));
    expect(await contract.bidList(tokenId, recipient.address)).to.equal(ethers.utils.parseEther("1"));
  });

  it("Should only accept highest bid", async function TestBidRevert() {
    const { contract, owner, recipient } = await loadFixture(useFixture);
    const tokenId = 0;

    await contract.connect(owner).startAuction();
    await contract.connect(owner).bid(tokenId, { value: ethers.utils.parseEther("1") });

    await expect(contract.connect(recipient).bid(tokenId, { value: ethers.utils.parseEther("0.5") })).to.be.reverted;

    expect(await recipient.getBalance()).to.be.closeTo(ethers.utils.parseEther("10000"), ethers.utils.parseEther("0.0005"));

    expect(await contract.bidList(tokenId, owner.address)).to.equal(ethers.utils.parseEther("1"));
    expect(await contract.bidList(tokenId, recipient.address)).to.equal(0);
  });

  it("Should receive/withdraw Ether in contract", async function TestEtherAcceptance() {
    const { contract, owner, recipient } = await loadFixture(useFixture);
    const tokenId = 0;

    await contract.connect(owner).startAuction();
    await contract.connect(owner).bid(tokenId, { value: ethers.utils.parseEther("1") });
    await contract.connect(owner).endAuction();

    expect(await contract.getReceivedEther()).to.equal(ethers.utils.parseEther("1"));

    expect(await contract.connect(owner).withdrawReceivedEther(recipient.address)).not.to.be.reverted;
    expect(await recipient.getBalance()).to.equal(ethers.utils.parseEther("10001"));
    expect(await contract.getReceivedEther()).to.equal(0);
  });
});

describe(`${PREFIX}-winner`, function TestAuctionWinner() {
  it("Should set a winner", async function TestWinner() {
    const { contract, owner, recipient } = await loadFixture(useFixture);
    const tokenId = 0;

    await contract.connect(owner).startAuction();

    await contract.connect(owner).bid(tokenId, { value: ethers.utils.parseEther("1") });
    await contract.connect(recipient).bid(tokenId, { value: ethers.utils.parseEther("2") });

    await contract.connect(owner).endAuction();

    expect(await contract.revealWinner(tokenId)).to.equal(recipient.address);
  });
});
