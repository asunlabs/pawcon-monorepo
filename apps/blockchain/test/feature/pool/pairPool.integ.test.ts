import { loadFixture, SnapshotRestorer, takeSnapshot } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import deploy from "../../../scripts/hooks/useDeployer";
import { useUUPSDeployer } from "../../../scripts/hooks/useUpgradeDeployer";
import { smock } from "@defi-wonderland/smock";
import { BigNumber, Contract } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

const PREFIX = "unit-PairPool";
const contractName = "PairPool";

async function useFixture() {
  return await deploy(contractName);
}

async function deployCatnip() {
  return await useUUPSDeployer("Catnip");
}

describe(`${PREFIX}-functionality`, function TestFunctionality() {
  let upgraded: Contract;
  let _contract: Contract;
  let _owner: SignerWithAddress;
  let _recipient: SignerWithAddress;

  it.only("Should provide a Ether/Catnip liquidity", async function TestLiquidity() {
    const { contract, owner, recipient } = await loadFixture(useFixture);

    const _catnip = await deployCatnip();
    const catnip = _catnip.contract;
    const catnipVer02 = await ethers.getContractFactory("CatnipVer02");
    upgraded = await upgrades.upgradeProxy(catnip.address, catnipVer02);

    const mintAmount = 100;

    await upgraded.__Ver02Setup_init();
    await upgraded.mint(recipient.address, mintAmount, ethers.utils.toUtf8Bytes(""), ethers.utils.toUtf8Bytes(""));

    const liquidtyAmount = 50;

    await upgraded.connect(recipient).authorizeOperator(contract.address);

    expect(await contract.connect(recipient).provideEthCatnipLiquidity(upgraded.address, liquidtyAmount, { value: ethers.utils.parseEther("0.1") }));

    expect(await upgraded.balanceOf(recipient.address)).to.equal(liquidtyAmount);

    _contract = contract;
    _owner = owner;
    _recipient = recipient;
  });

  it.only("Should read (eth, catnip) pair amount", async function TestPairAmountGetter() {
    console.log(await _contract.getEthCatnipPairAmount(_recipient.address));
    let pair: any[] = await _contract.getEthCatnipPairAmount(_recipient.address);

    expect(pair.toString()).to.equal(["50", ethers.utils.parseEther("0.1")].toString());
  });
});
