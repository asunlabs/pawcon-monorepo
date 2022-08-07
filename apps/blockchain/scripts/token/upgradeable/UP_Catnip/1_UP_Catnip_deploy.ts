import { ethers, upgrades } from "hardhat";
import fs from "fs";

async function main() {
  const UP_Catnip = await ethers.getContractFactory("UP_Catnip");
  const up_Catnip = await upgrades.deployProxy(UP_Catnip);
  const contract = await up_Catnip.deployed();

  console.log("UP_Catnip deployed to: ", contract.address);

  fs.writeFileSync("./scripts/token/upgradeable/UP_Catnip/upCatnipProxyAddr.ts", `export const addr = ${contract.address}`);
}

main()
  .then(() => (process.exitCode = 1))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
