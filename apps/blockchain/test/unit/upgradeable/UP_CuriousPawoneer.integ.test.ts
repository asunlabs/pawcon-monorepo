import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers, upgrades } from "hardhat";
import deploy from "../../../scripts/hooks/useDeployer";
import { useUUPSDeployer } from "../../../scripts/hooks/useUpgradeDeployer";
import { mainnetDataFeed } from "../../../scripts/manager/constantManager";

const PREFIX = `integ-CuriousPawoneer`;

const useFixture = async () => {
  return useUUPSDeployer("CuriousPawoneer");
};

let upgraded: Contract;

describe(`${PREFIX}-dynamic-nft-price`, function TestDynamicPrice() {
  this.beforeEach("Should upgrade", async function TestUpgradeDeployment() {
    const { contract } = await loadFixture(useFixture);

    upgraded = await upgrades.upgradeProxy(contract.address, await ethers.getContractFactory("CuriousPawoneerVer02"), {
      kind: "uups",
    });
  });

  it("Should return a zero mintFee before setup initialization", async function TestBeforeSetup() {
    expect(await upgraded.mintFee()).to.equal(0);
  });

  it("Should set a dynamic mint fee", async function TestDynamicPriceSetter() {
    const { contract } = await deploy("DataFeedFactory");

    await upgraded.__Ver02Setup_init();

    /// @dev default mint fee is 0.0001 ether
    expect(await upgraded.mintFee()).to.equal(ethers.utils.parseEther("0.0001"));

    /// @dev set dynamic mint price with oracle
    await expect(upgraded.setDynamicPrice(contract.address, mainnetDataFeed.id)).not.to.reverted;

    /**
     * @dev note that below mintFee is not in a correct value, only
     * @dev verifying the fee is changed dynamically.
     */
    expect(await upgraded.mintFee()).not.to.equal(ethers.utils.parseEther("0.0001"));
  });
});
