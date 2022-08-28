import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { BigNumber, Contract } from "ethers";
import { chownSync } from "fs";
import { ethers, upgrades } from "hardhat";
import deploy from "../../../scripts/hooks/useDeployer";
import { useUUPSDeployer } from "../../../scripts/hooks/useUpgradeDeployer";
import { mainnetDataFeed } from "../../../scripts/manager/constantManager";

const PREFIX = `integ-CuriousPawoneer`;

const useFixture = async () => {
  return useUUPSDeployer("CuriousPawoneer");
};

let upgraded: Contract;
let _owner: SignerWithAddress;
let _recipient: SignerWithAddress;

describe(`${PREFIX}-oracle-nft-price`, function TestDynamicPrice() {
  this.beforeEach("Should upgrade", async function TestUpgradeDeployment() {
    const { contract } = await loadFixture(useFixture);

    upgraded = await upgrades.upgradeProxy(contract.address, await ethers.getContractFactory("CuriousPawoneerVer02"), {
      kind: "uups",
    });

    const [owner, recipient] = await ethers.getSigners();
    _owner = owner;
    _recipient = recipient;
  });

  it("Should be a static mint fee before oracle setup", async function TestStaticMintFee() {
    await upgraded.__Ver02Setup_init();
    expect(await upgraded.isStaticFee()).to.be.true;
  });

  it("Should return a zero mintFee before setup initialization", async function TestBeforeSetup() {
    expect(await upgraded.mintFee()).to.equal(0);
  });

  it("Should set a oracleEtherInUSD", async function TestDynamicPriceSetter() {
    const { contract } = await deploy("DataFeedFactory");

    await upgraded.__Ver02Setup_init();

    /// @dev default mint fee is 0.0001 ether
    expect(await upgraded.mintFee()).to.equal(ethers.utils.parseEther("0.0001"));

    /// @dev set dynamic mint price with oracle
    await expect(upgraded.setDynamicPrice(contract.address, mainnetDataFeed.id)).not.to.reverted;

    /**
     * @dev note that below oracleEtherInUSD is not in a correct value
     */
    await expect(await upgraded.oracleEtherInUSD()).not.to.be.reverted;
    expect(await upgraded.oracleEtherInUSD()).not.to.equal(0);
    expect(await upgraded.isStaticFee()).to.be.false;
  });

  it("Should mint with dynamic price", async function TestDynamicMintWithOracle() {
    await upgraded.__Ver02Setup_init();
    const { contract } = await deploy("DataFeedFactory");

    /**
     * @dev below mint fee is not a correct value but has the same format
     * @dev take a look at how the value is driven or simply take a look at oraclized mintFee in contract.
     * 
     * const staticMintFee = ethers.utils.parseEther("0.0001");
     * const _mintFee = oracleEtherInUSD / ethers.utils.parseEther("0.", "mwei"));

     * await upgraded.setDynamicPrice(contract.address, mainnetDataFeed.id);
     * const oracleEtherInUSD = await upgraded.oracleEtherInUSD();

     * console.log({ oracleEtherInUSD });
     * const decimals = 1e10;
     * const _mintFee = oracleEtherInUSD / decimals;

     * console.log({ _mintFee });
     * const dynamicMintFee = Math.floor(_mintFee) * staticMintFee.toNumber();

     * console.log({ dynamicMintFee });
     */

    /**
     * @dev oraclizedMintFee: first two digits from price oracle * static mint fee(0.0001 ether)
     * * e.g. price oracle: 147392015247 => 14
     * * oraclizedMintFee: 14 * 0.0001 ether => 0.0014 ether
     */
    const oraclizedMintFee = ethers.utils.parseEther("0.0025");
    await upgraded.safeDynamicMint(contract.address, mainnetDataFeed.id, _recipient.address, { value: oraclizedMintFee });
  });
});
