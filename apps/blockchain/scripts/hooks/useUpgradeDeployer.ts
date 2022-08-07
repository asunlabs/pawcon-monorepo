import { Contract, Signer } from "ethers";
import { ethers, upgrades } from "hardhat";
import chalk from "chalk";
import { UpgradePattern } from "../manager/typeManager";

async function useTransparent(contractName: string, signer?: Signer, constructorArgs?: unknown[]) {
  let contract: Contract;
  const Contract = await ethers.getContractFactory(contractName, signer);

  if (constructorArgs !== undefined) {
    contract = await upgrades.deployProxy(Contract, constructorArgs, {
      initializer: "initializer",
      kind: "transparent",
    });
  } else {
    contract = await upgrades.deployProxy(Contract, {
      initializer: "initializer",
      kind: "transparent",
    });
  }

  console.log(chalk.bgMagenta.bold(`===== ${contractName} is upgradeable: transparent proxy =====`));
  console.log(chalk.bgCyan.bold(`${contractName} deployed to: `), contract.address);

  return contract;
}

async function upgradeTransparent(proxyAddress: string) {}

async function useUUPS() {}

async function useBeacon() {
  // upgrades.prepareUpgrade; // upgrade-safe validation
}

async function proxyRouter(pattern: UpgradePattern) {
  if (pattern == "transparent") {
    // await useTransparent();
  }

  if (pattern == "uups") {
    // await useUUPS();
  }

  if (pattern == "beacon") {
    // await useBeacon();
  }
}

export default proxyRouter;
