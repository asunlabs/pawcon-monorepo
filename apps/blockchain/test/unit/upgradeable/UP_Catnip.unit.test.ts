import { loadFixture, takeSnapshot } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { Contract } from "ethers";
import { ethers, upgrades } from "hardhat";
import { useSnapshotForReset, useImpersonatedSigner } from "../../../scripts/hooks/useNetworkHelper";
import "@nomicfoundation/hardhat-chai-matchers";

const PREFIX = "unit-UP_Catnip";
let contract: Contract;

const useFixture = async () => {
  const UP_Catnip = await ethers.getContractFactory("UP_Catnip");
  const Contract = await upgrades.deployProxy(UP_Catnip, {
    initializer: "initialize",
    kind: "uups",
  });
  contract = await Contract.deployed();

  return { contract };
};

describe(`${PREFIX}-metadata`, function TestMetadata() {
  beforeEach("Reset blockchain state", async function TestResetBlockchain() {
    await useSnapshotForReset();
  });

  it("Initial value should be zero", async function TestName() {
    const { contract } = await loadFixture(useFixture);
    expect(await contract.number()).to.equal(0);
  });

  // Write failing test. upgradeTo not added yet.
  it("Should upgrade to a new implementation", async function TestUpgrade() {
    const { contract } = await loadFixture(useFixture);
    const newImpl = "new-address";

    await expect(contract.upgradeTo(newImpl)).not.to.be.reverted;
  });
});
