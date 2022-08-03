import { ChainlinkSolution, NetworkSupport, GoerliProps } from './typeManager';

// if a token is based on proxy => contract ABI should be implementation, address should be proxy
export const CONTRACT_ADDR = {
  MAINNET: {
    USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  },
  GOERLI: {},
};

/**
 * LINK token: kovan is deprecated.
 * Rinkeby and Kovan is deprecated after PoS merge update.
 * Use them until Chainlink will come up with Goerli/Sepolia supports.
 */
export const ORACLE: ChainlinkSolution = {
  subscriptionId: 9302,
  datafeeds: 'rinkeby', //
  vrf: 'rinkeby',
};

export const NETWORK: NetworkSupport = {
  testnet: 'goerli',
  oracle: 'rinkeby',
};

export const WHALE = {
  MAINNET: {
    ERC20: {
      DAI: '0x1B7BAa734C00298b9429b518D621753Bb0f6efF2',
      USDC: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      WETH: '',
      UNI: '',
      ZRX: '',
      LINK: '0x8652Fb672253607c0061677bDCaFb77a324DE081',
    },
  },
  GOERLI: {
    ERC20: {
      DAI: '0xFBB8495A691232Cb819b84475F57e76aa9aBb6f1', // 41 ETH, 95,000,100 DAI
      USDC: '0x01dA0c5fda944a694CE10F2457301CD7E3b3Ba3C', // 1 ETH, 43,000,000 USDC
      TETHER: '0x7c8CA1a587b2c4c40fC650dB8196eE66DC9c46F4',
      WETH: '0xE807C2a81366dc10a68cd8e95660477294B6019B', // 2,680 ETH, 4,064 WETH
      UNI: '0xC6E19b38C01e8E9B2cC5AF190E6fa33654Fc5F7d', // 0 ETH, 5,000,000 UNI
      ZRX: '0x0cadA1cf272472cF9Eb8f579EB6a5263C5F7D61b',
      LINK: '0x27EDCF774e0991c86e3d52FF58f94cB39c486A3E', // 91 ETH, 100,000 LINK
    },
  },
};

export const PLUGIN = {
  REPORT_GAS: true,
};

export const COMPILER_OPT = {
  IS_ENABLED: true,
  FEE: {
    LOW_DEPLOYMENT: 1,
    LOW_EXECUTION: 1000,
  },
};

// Ensure that we have all the environment variables we need.
// const mnemonic: string | undefined = process.env.ACCOUNT_MNEMONIC_SEED;
// if (!mnemonic) {
//   requireEnv('ACCOUNT_MNEMONIC_SEED');
// }

// list of network chain IDs
const chainIds = {
  'arbitrum-mainnet': 42161,
  avalanche: 43114,
  bsc: 56,
  hardhat: 31337,
  mainnet: 1,
  'optimism-mainnet': 10,
  'polygon-mainnet': 137,
  'polygon-mumbai': 80001,
  rinkeby: 4,
  ganache: 1337,
};
