import '@nomiclabs/hardhat-ethers';
import { ethers, upgrades } from 'hardhat';

async function main() {
    // Deploying
    const Box = await ethers.getContractFactory('Box');
    const instance = await upgrades.deployProxy(Box, [42]);
    await instance.deployed();

    console.log('Box deployed to: ', instance.address);
}

main();

// Hardhat recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
