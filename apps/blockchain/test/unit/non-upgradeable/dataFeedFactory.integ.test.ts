import { smock } from "@defi-wonderland/smock";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import chalk from "chalk";
import { ethers } from "hardhat";

const PREFIX = "integ-mockDataFeedFactory";
const mockedRandomNumber = 778;

const mainnetDataFeed = {
  id: 0,
  address: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
};

const goerliDataFeed = {
  id: 1,
  address: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
};

const useMockedOracleFixture = async () => {
  const DataFeedFactoryFactory = await ethers.getContractFactory("MockDataFeedFactory");
  const _dataFeedFactorFactory = await DataFeedFactoryFactory.deploy();
  const mockedDataFeedFactory = await _dataFeedFactorFactory.deployed();

  return { mockedDataFeedFactory };
};

describe(`${PREFIX}-function`, async function TestMainnetEthUsdFeed() {
  it("Mocked feed factory should return ETH/USD oracle price", async function TestMockedDataFeedFactory() {
    const { mockedDataFeedFactory } = await loadFixture(useMockedOracleFixture);

    await expect(mockedDataFeedFactory.setMockedLatestAnswer(mockedRandomNumber)).not.to.reverted;
    expect(await mockedDataFeedFactory.getMockedLatestAnswer()).to.equal(mockedRandomNumber);
    console.log(chalk.bgMagenta.bold("MOCKED ORACLE PRICE: "), await mockedDataFeedFactory.getMockedLatestAnswer());
  });
});
