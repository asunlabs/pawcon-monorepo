import { Contract } from "ethers";
import { ethers } from "hardhat";
import chalk from "chalk";

async function deploy(contractName: string, constructorArgs?: any[]) {
  let contract;
  const Contract = await ethers.getContractFactory(contractName);

  if (constructorArgs !== undefined) {
    const _contract = await Contract.deploy(...constructorArgs);
    contract = await _contract.deployed();
  } else {
    const _contract = await Contract.deploy();
    contract = await _contract.deployed();
  }

  const [owner, recipient] = await ethers.getSigners();

  console.log(chalk.bgMagenta.bold(`===== ${contractName} is non-upgrade =====`));
  console.log(chalk.bgCyan.bold(`${contractName} deployed to: `), contract.address);

  return { contract, owner, recipient };
}

export default deploy;
