import { smock } from "@defi-wonderland/smock";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import chalk from "chalk";
import { ethers } from "hardhat";

const PREFIX = "integ-mockDataFeedFactory";
const mockedRandomNumber = 778;

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
