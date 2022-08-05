import { ethers, upgrades } from "hardhat";

const proxyAddr = "0x4B34585e661fDAB2653666a738824aCBB0d2Cb69";

async function main() {
  const UP_CatnipVer02 = await ethers.getContractFactory("UP_CatnipVer02");
  const up_CatnipVer02 = await upgrades.upgradeProxy(proxyAddr, UP_CatnipVer02);
  const contract = await up_CatnipVer02.deployed();

  console.log("UP_Catnip upgraded to: ", contract.address);
}

main()
  .then(() => {
    process.exitCode = 1;
  })
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  });
