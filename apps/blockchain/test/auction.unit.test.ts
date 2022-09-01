import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import deploy from "../scripts/hooks/useDeployer";

const PREFIX = "unit-Auction";

async function useFixture() {
  const { contract } = await deploy("Auction");
  const [owner, recipient] = await ethers.getSigners();

  return { contract, owner, recipient };
}

describe(`${PREFIX}-state-variables`, function TestStateVariables() {
  it.only("Should return correct variables", async function TestBidCurrency() {
    const { contract } = await loadFixture(useFixture);
    const auctionPeriod = time.duration.days(7);
    expect(await contract.period()).to.equal(auctionPeriod);
    expect(await contract.auctionStarted()).to.be.false;
    expect(await contract.auctionEnded()).to.be.false;
  });
});

describe(`${PREFIX}-start and end auction`, function TestAuctionStartEnd() {
  it.only("Should start auction", async function TestAuctionStart() {
    const { contract, owner, recipient } = await loadFixture(useFixture);

    /// @dev only owner
    await expect(contract.connect(recipient).startAuction()).to.be.reverted;
    expect(await contract.connect(owner).startAuction())
      .to.emit(contract, "AuctionStarted")
      .withArgs(anyValue);
    expect(await contract.auctionStarted()).to.be.true;
  });

  it.only("Should end auction", async function TestAuctionEnd() {
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
