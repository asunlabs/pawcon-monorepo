import '@nomiclabs/hardhat-ethers';
import { ethers } from 'hardhat';

async function main() {
    const CuriousPawoneer = await ethers.getContractFactory('CuriousPawoneer');
    const curiousPawoneer = await CuriousPawoneer.deploy('key', 5, 'cid');

    // hardhat network
    await curiousPawoneer.deployed();
    console.log('Curious Pawoneer deployed to:', curiousPawoneer.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
