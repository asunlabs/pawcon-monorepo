import hre from "hardhat";

async function readArtifactPath() {
  //   console.log(await hre.artifacts.getArtifactPaths());
  //   console.log(await hre.artifacts.readArtifact("Dex"));
  const Dex = await hre.artifacts.readArtifact("Dex");
  const DEX_ABI = Dex.abi;
  console.log(DEX_ABI);
  //   return DEX_ABI;
}

// readArtifactPath();
// console.log(abi);

async function getContractArtifacts(contractName: string) {
  const contract = await hre.artifacts.readArtifact(contractName);
  return contract.abi;
}

(async () => {
  const Dex = await getContractArtifacts("Dex");
  console.log(Dex);
})();
