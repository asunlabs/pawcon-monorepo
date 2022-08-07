import hre from "hardhat";

export async function getContractArtifacts(contractName: string) {
  const contract = await hre.artifacts.readArtifact(contractName);
  return contract.abi;
}
