import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import deploy from "../../../scripts/hooks/useDeployer";
import { useSnapshotForReset } from "../../../scripts/hooks/useNetworkHelper";
import hre from "hardhat";

const PREFIX = "unit-pairPoolFactory";
const contractName = "AbsPairPoolFactory";

async function useFixture() {
  return await deploy(contractName);
}

describe.skip(`${PREFIX}-functionalit`, function TestFunctionality() {
  this.beforeEach("Should reset blockchain", async function TestReset() {
    await useSnapshotForReset();
  });

  it("Should generate token pair pool", async function TestInitPool() {
    // const { contract, owner, recipient } = await loadFixture(useFixture);
    const { abi } = await hre.artifacts.readArtifact(contractName);
    const contract = new ethers.Contract(contractName, abi);
    expect(await contract.initPool()).not.to.be.reverted;
  });
});
