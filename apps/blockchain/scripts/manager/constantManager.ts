import { ERC20TokenProps, NetworkProps, OracleProps } from "./typeManager";

// if a token is based on proxy => contract ABI should be implementation, address should be proxy
export const CONTRACT_ADDR = {
  MAINNET: {
    USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    DAI: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  },
  GOERLI: {},
};

/**
 * LINK token: kovan is deprecated.
 * Rinkeby and Kovan is deprecated after PoS merge update.
 * Use them until Chainlink will come up with Goerli/Sepolia supports.
 */
export const ORACLE: OracleProps = {
  subscriptionId: 9302,
  datafeeds: "rinkeby",
  vrf: "rinkeby",
};

export const NETWORK: NetworkProps = {
  testnet: "goerli",
  oracle: "rinkeby",
};

export const WHALE: Record<string, ERC20TokenProps> = {
  MAINNET: {
    ERC20: {
      DAI: "0x1B7BAa734C00298b9429b518D621753Bb0f6efF2",
      USDC: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      TETHER: "",
      WETH: "",
      UNI: "",
      ZRX: "",
      LINK: "0x8652Fb672253607c0061677bDCaFb77a324DE081",
    },
  },
  GOERLI: {
    ERC20: {
      DAI: "0xFBB8495A691232Cb819b84475F57e76aa9aBb6f1", // 41 ETH, 95,000,100 DAI
      USDC: "0x01dA0c5fda944a694CE10F2457301CD7E3b3Ba3C", // 1 ETH, 43,000,000 USDC
      TETHER: "0x7c8CA1a587b2c4c40fC650dB8196eE66DC9c46F4",
      WETH: "0xE807C2a81366dc10a68cd8e95660477294B6019B", // 2,680 ETH, 4,064 WETH
      UNI: "0xC6E19b38C01e8E9B2cC5AF190E6fa33654Fc5F7d", // 0 ETH, 5,000,000 UNI
      ZRX: "0x0cadA1cf272472cF9Eb8f579EB6a5263C5F7D61b",
      LINK: "0x27EDCF774e0991c86e3d52FF58f94cB39c486A3E", // 91 ETH, 100,000 LINK
    },
  },
};

export const RareNFTWhales = {
  MAINNET: {
    FiniliarEgg: "0xe4f91a435ef991A380f8dF573EF49d415b9D627D", // 16 FEGG
    FatRatMafia: "0x0EeCCd3B48D7cAA3a516D808eE5aDA20fB660c3a", // 237 FRM
    CryptoPudgyPunks: "0xa85c827B214123ad8818532f7E8fe3069132bc42", // 121 CPP
  },
  GOERLI: {},
};

export const RareNFTContracts = {
  MAINNET: {
    FiniliarEgg: "0x326f09FFCDd200f1B110E6dda0d240635b89e507", // 16 FEGG
    FatRatMafia: "0x2b9FD4D651414e51c9bA56aE1add36bb71cCa24B", // 237 FRM
    CryptoPudgyPunks: "0xCd903693a2EdDA8D4C9F69f9937eaf2B38A2CbF6", // 121 CPP
  },
  GOERLI: {},
};

const TopERC1155Whales = {
  MAINNET: {},
  GOERLI: {},
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

// list of network chain IDs
export const CHAIN_ID = {
  "arbitrum-mainnet": 42161,
  avalanche: 43114,
  bsc: 56,
  hardhat: 31337,
  mainnet: 1,
  "optimism-mainnet": 10,
  "polygon-mainnet": 137,
  "polygon-mumbai": 80001,
  rinkeby: 4,
  ganache: 1337,
};

export const mainnetDataFeed = {
  id: 0,
  address: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
};

export const goerliDataFeed = {
  id: 1,
  address: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
};
