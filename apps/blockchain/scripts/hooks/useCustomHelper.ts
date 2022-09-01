import hre from "hardhat";

class CusomHelper {
  async getContractABI(contractName: string) {
    const abi = (await hre.artifacts.readArtifact(contractName)).abi;

    return { abi };
  }

  checkConfig(element: string) {
    throw new Error(`${element} is required in hardhat.config but missing`);
  }
}
