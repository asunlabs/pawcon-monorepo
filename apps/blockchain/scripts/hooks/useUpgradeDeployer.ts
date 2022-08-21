import { Contract, Signer } from "ethers";
import { ethers, upgrades } from "hardhat";
import chalk from "chalk";

async function useTransparentDeployer(contractName: string, signer?: Signer, constructorArgs?: unknown[]) {
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

  return { contract };
}

async function useUUPSDeployer(contractName: string, signer?: Signer, constructorArgs?: unknown[]) {
  let contract;
  const uupsProxyFactory = await ethers.getContractFactory(contractName, signer);

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

  return { contract };
}

// TODO set beacon pattern deployer
async function useBeaconDeployer() {
  // upgrades.prepareUpgrade; // upgrade-safe validation
}

export { useTransparentDeployer, useUUPSDeployer, useBeaconDeployer };
