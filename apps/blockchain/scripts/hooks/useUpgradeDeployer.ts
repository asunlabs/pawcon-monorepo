import { Contract, Signer } from "ethers";
import { ethers, upgrades } from "hardhat";
import chalk from "chalk";

// TODO encapsulate useTransparentDeployer, useUUPSDeployer, useBeaconDeployer with class instance
class UpgradeDeployer {
  contractName: string;
  constructorArgs: unknown[];

  constructor(_contractName: string, _constructorArgs: unknown[]) {
    this.contractName = _contractName;
    this.constructorArgs = _constructorArgs;
  }

  uups() {}
  transparent() {}
  beacon() {}
  diamond() {}
}

async function useTransparentDeployer(contractName: string, constructorArgs?: unknown[]) {
  let contract: Contract;
  const [owner, recipient] = await ethers.getSigners();
  const Contract = await ethers.getContractFactory(contractName, owner);

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

  return { contract, owner, recipient };
}

async function useUUPSDeployer(contractName: string, constructorArgs?: unknown[]) {
  let contract;
  const [owner, recipient] = await ethers.getSigners();
  const uupsProxyFactory = await ethers.getContractFactory(contractName, owner);

  if (constructorArgs !== undefined) {
    contract = await upgrades.deployProxy(uupsProxyFactory, constructorArgs, {
      initializer: "initialize",
      kind: "uups",
    });
  } else {
    contract = await upgrades.deployProxy(uupsProxyFactory, {
      kind: "uups",
    });
  }

  console.log(chalk.bgMagenta.bold(`===== ${contractName} is upgradeable: uups proxy =====`));
  console.log(chalk.bgCyan.bold(`${contractName} deployed to: `), contract.address);

  return { contract, owner, recipient };
}

// TODO set beacon pattern deployer
async function useBeaconDeployer() {
  // upgrades.prepareUpgrade; // upgrade-safe validation
}

export { useTransparentDeployer, useUUPSDeployer, useBeaconDeployer };
