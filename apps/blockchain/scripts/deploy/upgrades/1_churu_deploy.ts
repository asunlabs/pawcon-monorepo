import '@nomiclabs/hardhat-ethers';
import { ethers, upgrades } from 'hardhat';

async function main() {
    // Deploying
    const Box = await ethers.getContractFactory('Box');
    const instance = await upgrades.deployProxy(Box, [42]);
    await instance.deployed();

    // Upgrading
    const BoxV2 = await ethers.getContractFactory('BoxV2');
    const upgraded = await upgrades.upgradeProxy(instance.address, BoxV2);
}

main();

// Hardhat recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
