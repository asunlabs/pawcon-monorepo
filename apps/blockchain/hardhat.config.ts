import * as dotenv from "dotenv";
import hre from "hardhat";
import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-chai-matchers";
import "@openzeppelin/hardhat-upgrades";
import "@nomiclabs/hardhat-solhint";
import { COMPILER_OPT, PLUGIN } from "./scripts/manager/constantManager";
import {
  checkCoverageForCI,
  cleanCoverageDir,
} from "./scripts/manager/coverageManager";
import "hardhat-contract-sizer";
import "hardhat-log-remover";

dotenv.config({ path: "./.env.development" });

/**
 *
 * "@nomicfoundation/hardhat-toolbox" dependency includes below deps.
 * - @nomiclabs/hardhat-ethers
 * - @nomiclabs/hardhat-etherscan
 * - hardhat-gas-reporter
 * - solidity-coverage
 * - @typechain/hardhat
 *
 */

task("clean-coverage", "Delete previous coverage report").setAction(
  async () => await cleanCoverageDir()
);

task("cherry-pick", "Prints test coverage indices").setAction(async () => {
  await checkCoverageForCI();
});

const {
  TEST_GOERLI_URL,
  TEST_SEPOLIA_URL,
  TEST_ROPSTEN_URL,
  TEST_RINKEBY_URL,
  TEST_KOVAN_URL,

  MAIN_ETHEREUM_URL,
  FORK_MAINNET_URL,
  FORK_GOERLI_URL,

  ACCOUNT_ETHEREUM_PRIVATE_KEY,
  ACCOUNT_GOERLI_PRIVATE_KEY,
  ACCOUNT_SEPOLIA_PRIVATE_KEY,
  ACCOUNT_ROPSTEN_PRIVATE_KEY,
  ACCOUNT_RINKEBY_PRIVATE_KEY,
  ACCOUNT_KOVAN_PRIVATE_KEY,

  ACCOUNT_DEPLOYER_PRIVATE_KEY,
  ACCOUNT_DEPLOYER_ADDRESS,

  API_COINMARKETCAP_KEY,
  API_ETHERSCAN_KEY,
  API_ETHERSCAN_BACKUP_KEY,
} = process.env;

const options = {
  settings: {
    optimizer: {
      enabled: COMPILER_OPT.IS_ENABLED,
      runs: COMPILER_OPT.FEE.LOW_EXECUTION,
    },
    // enable smock plugin mocking
    outputSelection: {
      "*": {
        "*": ["storageLayout"],
      },
    },
  },
};

const deployerForTheSameAddress = {
  ADDRESS: ACCOUNT_DEPLOYER_ADDRESS,
  PRIVATE_KEY: ACCOUNT_DEPLOYER_PRIVATE_KEY,
};

const config: HardhatUserConfig = {
  solidity: {
    // version: "0.8.0",
    // set multiple compiler version
    // prettier-ignore
    compilers: [
      { version: "0.8.0" }, 
      { version: "0.8.16" }
    ].map((ver) => {
      return {
        ...ver,
        ...options,
      };
    }),
  },
  networks: {
    mainnet: {
      url: MAIN_ETHEREUM_URL !== undefined ? MAIN_ETHEREUM_URL : "",
      accounts:
        ACCOUNT_ETHEREUM_PRIVATE_KEY !== undefined
          ? [ACCOUNT_ETHEREUM_PRIVATE_KEY]
          : [],
    },
    // * mainnet fork
    hardhat: {
      forking: {
        url: FORK_MAINNET_URL !== undefined ? FORK_MAINNET_URL : "", // alchemy node assist an archived data caching
        blockNumber: 14390000,
        enabled: true,
      },
    },
    goerli: {
      url: TEST_GOERLI_URL !== undefined ? TEST_GOERLI_URL : "",
      accounts:
        ACCOUNT_GOERLI_PRIVATE_KEY !== undefined
          ? [ACCOUNT_GOERLI_PRIVATE_KEY]
          : [],
    },
    // node provider not yet actively supports sepolia. currently url is empty string.
    sepolia: {
      url: TEST_SEPOLIA_URL !== undefined ? TEST_SEPOLIA_URL : "",
      accounts:
        ACCOUNT_SEPOLIA_PRIVATE_KEY !== undefined
          ? [ACCOUNT_SEPOLIA_PRIVATE_KEY]
          : [],
    },
    // ! @deprecated
    ropsten: {
      url: TEST_ROPSTEN_URL !== undefined ? TEST_ROPSTEN_URL : "",
      accounts:
        ACCOUNT_ROPSTEN_PRIVATE_KEY !== undefined
          ? [ACCOUNT_ROPSTEN_PRIVATE_KEY]
          : [],
    },
    // ! @deprecated
    rinkeby: {
      url: TEST_RINKEBY_URL !== undefined ? TEST_RINKEBY_URL : "",
      accounts:
        ACCOUNT_RINKEBY_PRIVATE_KEY !== undefined
          ? [ACCOUNT_RINKEBY_PRIVATE_KEY]
          : [],
    },
    // ! @deprecated
    kovan: {
      url: TEST_KOVAN_URL !== undefined ? TEST_KOVAN_URL : "",
      accounts:
        ACCOUNT_KOVAN_PRIVATE_KEY !== undefined
          ? [ACCOUNT_KOVAN_PRIVATE_KEY]
          : [],
    },
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
  gasReporter: {
    enabled: PLUGIN.REPORT_GAS ? true : false,
    coinmarketcap:
      API_COINMARKETCAP_KEY !== undefined ? API_COINMARKETCAP_KEY : "", // for gas reporter
    currency: "USD",
    src: "./contracts",
    outputFile: "./",
  },
  etherscan: {
    apiKey: {
      goerli: API_ETHERSCAN_KEY !== undefined ? API_ETHERSCAN_KEY : "",
      ropsten: API_ETHERSCAN_KEY !== undefined ? API_ETHERSCAN_KEY : "",
      rinkeby:
        API_ETHERSCAN_BACKUP_KEY !== undefined ? API_ETHERSCAN_BACKUP_KEY : "",
    },
  },
  typechain: {
    outDir: "./typechain",
    target: "ethers-v5",
  },
  contractSizer: {
    alphaSort: false,
    runOnCompile: false,
    strict: true,
  },
};

export default config;
