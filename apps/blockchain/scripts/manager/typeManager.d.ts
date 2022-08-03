export type oracleTestnet = "kovan" | "rinkeby";
export type posTestnet = "goerli" | "sepolia";
export type proxyPattern = "transparent" | "uups" | "beacon";

export interface NetworkSupport {
  testnet?: posTestnet;
  oracle?: oracleTestnet;
}

export interface ChainlinkSolution {
  subscriptionId?: number;
  datafeeds?: oracleTestnet;
  vrf?: oracleTestnet;
}

export interface GoerliProps {
  ERC20: {
    DAI: string;
    USDC: string;
    WETH: string;
  };
}
