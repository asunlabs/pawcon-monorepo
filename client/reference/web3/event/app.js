import Web3 from "web3";
import { web3Key, ABI_AND_CONTRACT } from "../config/key.js";

// connecting to Ropsten Mainnet
const web3 = new Web3(web3Key.INFURA.MAINNET)

// connect contract with web3 JS API
const abi = ABI_AND_CONTRACT.ABI
const address = ABI_AND_CONTRACT.CONTRACT
const contract = new web3.eth.Contract(abi, address)

// console.log(contract.methods.admin()._method.stateMutability)

contract.getPastEvents('Transfer', 
    { fromBlock: 1, toBlock : 'latest'}, // chain range
    (err, events) => { console.log(events.length)}
)