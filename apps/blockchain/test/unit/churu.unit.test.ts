// 1. Write unit tests to check **function return values** and **state variable values**.
import { assert, expect } from 'chai';
import { ethers } from 'hardhat';
import hre from 'hardhat';
import { beforeEach, it } from 'mocha';

// TO DO : add upgrade plugin
// NOTE : private state variables in contract not accessible in test code
// What should be test
// 1. minter : mint
// 1. burner : burn
// 1. pauser : pauseChuru
// 1. desctructor : destructChuru
// 1. ether withdrawl : only owner

let churu: any; // type from typechain

// `beforeEach` will run before each test, re-deploying the contract every
// time. It receives a callback, which can be async.

describe('unit-Churu.sol', function () {
    // beforeEach(async function () {
    //     const Churu = await ethers.getContractFactory('Churu')
    //     churu = await Churu.deploy()
    //     await churu.deployed()
    // })
    // TEST CASE 1
    it('Should return a contract name : Churu', async function () {
        // get contract name
        const Churu = await ethers.getContractFactory('Churu');
        churu = await Churu.deploy();
        await churu.deployed();
        expect(await churu.name()).to.equal('Churu');
    });

    it('should return true', function TestNumbers() {
        assert(3 === 3, 'wow');
    });

    it('should return 5', function TestReturn5() {
        const isFive = () => {
            return 6;
        };
        assert(5 === isFive());
    });

    // // TEST CASE 2 : PASS
    // it('Only minter can mint', async function () {
    //     // TIP : use solidityKeccak256 to hash role name(otherwise test will fail)
    //     await churu.grantRole(ethers.utils.solidityKeccak256(['string'], ['MINTER_ROLE']), account) // grant minter role
    //     const hasMinterRole = await churu.hasRole(ethers.utils.solidityKeccak256(['string'], ['MINTER_ROLE']), account) // grant minter role
    //     console.log(hasMinterRole) // true
    //     await churu.mint(account2, 100) // mint 100 churu to account 2

    //     // balance should be 100
    //     expect(await churu.balanceOf(account2)).equal(100, 'not equal')
    // })

    // // TEST CASE 3 : PASS
    // it('Only Burner can burn', async function () {
    //     // grant burner role
    //     await churu.grantRole(
    //         ethers.utils.solidityKeccak256(['string'], ['BURNER_ROLE']),
    //         account
    //     )
    //     await churu.burn(account, 100) // burn 100 churu

    //     expect(await churu.balanceOf(account)).equal(999999900, 'not equal')
    // })

    // // TEST CASE 4 : NOT PASS => Error: VM Exception while processing transaction: reverted with reason string 'Pausable: paused'
    // it('Only Pauser can pause', async function () {
    //     await churu.grantRole(
    //         ethers.utils.solidityKeccak256(['string'], ['PAUSER_ROLE']),
    //         account
    //     )
    //     await churu.grantRole(
    //         ethers.utils.solidityKeccak256(['string'], ['MINTER_ROLE']),
    //         account
    //     )
    //     await churu.pauseChuru() // pause contract

    //     // FIX : chai not throwing err
    //     expect(await churu.mint(account, 100)).to.throw('Pausable: paused') // should throw error
    // })

    // // TEST CASE 5 : NOT PASS => Error: call revert exception (method="balanceOf(address)",
    // // errorArgs=null, errorName=null, errorSignature=null, reason=null, code=CALL_EXCEPTION, version=abi/5.5.0)
    // it('Only destructor can desctruct', async function () {
    //     await churu.grantRole(
    //         ethers.utils.solidityKeccak256(['string'], ['DESTRUCTOR_ROLE']),
    //         account
    //     )
    //     await churu.destructChuru(account2) // disable contract and move ethers to the address

    //     // FIX : chai not throwing err
    //     expect(await churu.balanceOf(account2)).to.throw() // should have ethers
    // })

    // // TEST CASE 6 : NOT PASS => Error: VM Exception while processing transaction: reverted with reason string 'Only owner.'
    // it('Should withdraw eth from contract', async function () {
    //     const deployedChuru = churu as any

    //     // FIX : Only owner VM Exception
    //     await churu.withdraw()
    //     expect(await churu.balanceOf(deployedChuru.address)).equal(0)
    // })

    // TO DO : add more test cases

    // TEST CASE 7
    // TEST CASE 8
    // TEST CASE 9

    // TEST CASE 10 : upgradability
    // it('Should work before and after upgrading', async function () {
    //     // const instance = await upgrades.deployProxy(Box, [42]);
    //     // assert.strictEqual(await instance.retrieve(), 42);
    //     // await upgrades.upgradeProxy(instance.address, BoxV2);
    //     // assert.strictEqual(await instance.retrieve(), 42);
    // })
});
