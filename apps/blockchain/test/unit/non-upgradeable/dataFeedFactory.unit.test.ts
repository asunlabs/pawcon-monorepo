import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { useSnapshotForReset } from "../../../scripts/hooks/useNetworkHelper";

const PREFIX = "unit-DataFeedFactory";

const mainnetDataFeed = {
  id: 0,
  address: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
};

const goerliDataFeed = {
  id: 1,
  address: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
};

const useOracleFixture = async () => {
  const DataFeedFactory = await ethers.getContractFactory("DataFeedFactory");
  const _contract = await DataFeedFactory.deploy();
  const contract = await _contract.deployed();

  return { contract };
};

describe(`${PREFIX}-function`, function TestMainnetEthUsdFeed() {
  it("Should return a ETH/USD aggregator", async function TestDatafeeds() {
    const { contract } = await loadFixture(useOracleFixture);

    expect(await contract.getPriceFeed(mainnetDataFeed.id)).to.equal(mainnetDataFeed.address);
    expect(await contract.getPriceFeed(goerliDataFeed.id)).to.equal(goerliDataFeed.address);
  });

  it("Should return a correct feed address", async function TestFeedAddress() {
    const { contract } = await loadFixture(useOracleFixture);

    expect(await contract.getPriceFeed(mainnetDataFeed.id)).to.equal(mainnetDataFeed.address);
    expect(await contract.getPriceFeed(goerliDataFeed.id)).to.equal(goerliDataFeed.address);
  });

  it("Should return 8 decimals", async function TestDecimals() {
    const { contract } = await loadFixture(useOracleFixture);
    const ethUsdFeedDecimals = 8;
    expect(await contract.getDecimals(mainnetDataFeed.id)).to.equal(ethUsdFeedDecimals);
  });

  it("Should return a version", async function TestVersion() {
    const { contract } = await loadFixture(useOracleFixture);
    const ethUsdVersion = 4;
    expect(await contract.getVersion(mainnetDataFeed.id)).to.equal(ethUsdVersion);
  });

  it("Should return a description", async function TestDescription() {
    const { contract } = await loadFixture(useOracleFixture);
    const ethUsdDescription = "ETH / USD";
    expect(await contract.getDescription(mainnetDataFeed.id)).to.equal(ethUsdDescription);
  });

  it("Should return a feed", async function TestFeedMapping() {
    const { contract } = await loadFixture(useOracleFixture);

    expect(await contract.feeds(mainnetDataFeed.id)).to.equal(mainnetDataFeed.address);
    expect(await contract.feeds(goerliDataFeed.id)).to.equal(goerliDataFeed.address);
  });

  it("Should initialize a new feed", async function TestNewFeed() {
    const { contract } = await loadFixture(useOracleFixture);

    const randomSigner = ethers.Wallet.createRandom();

    await contract.initDataFeeds(randomSigner.address);

    const feedId = 2;
    expect(await contract.feeds(feedId)).to.equal(randomSigner.address);
  });
});
