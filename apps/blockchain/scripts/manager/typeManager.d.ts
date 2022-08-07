export type EthereumTestnet = "goerli" | "sepolia";
export type OracleTestnet = "kovan" | "rinkeby";
export type UpgradePattern = "transparent" | "uups" | "beacon";

export type NetworkKeys = "testnet" | "oracle";
export type NetworkValues = EthereumTestnet | OracleTestnet;
export type NetworkProps = Record<NetworkKeys, NetworkValues>;

export type OracleKeys = "subscriptionId" | "datafeeds" | "vrf";
export type OracleValues = OracleTestnet | number;
export type OracleProps = Record<OracleKeys, OracleValues>;

export type TokenType = "ERC20" | "ERC721" | "ERC777" | "ERC1155";

export type ERC20TokenName = {
  DAI?: string;
  USDC?: string;
  TETHER?: string;
  WETH?: string;
  UNI?: string;
  ZRX?: string;
  LINK: string;
};

export type ERC721TokenName = {
  CURIOUS_PAWONEER?: string;
};

export type ERC777TokenName = {
  SOME_TOKEN_HERE?: string;
};

export type ERC1155TokenName = {
  SOME_TOKEN_HERE?: string;
};

export type ERC20TokenProps = Record<Extract<"ERC20", TokenType>, ERC20TokenName>;
export type ERC721TokenProps = Record<Extract<"ERC721", TokenType>, ERC721TokenName>;
export type ERC777TokenProps = Record<Extract<"ERC777", TokenType>, ERC777TokenName>;
export type ERC1155TokenProps = Record<Extract<"ERC1155", TokenType>, ERC1155TokenName>;
