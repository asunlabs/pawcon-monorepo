# PawCon Blockchain

Being migrated from [here](https://github.com/developerasun/pawcon/tree/main/blockchain).

A few setups are settled for PawCon blockchain application.

- [x] Testnet: PoS merge support => Goerli and Sepolia
- [x] NFT media managment: on-chain Base64, off-chain IPFS

## Token economy

Assets are designed as followings.

**Fungible-token**

ERC777, Catnip: 1,000,000,000(1 billion) total fixed supply. governance token.
ERC777, lpCatnip: Reward token for liquidity provider.

**Non-fungible token**

ERC721, CuriousPawoneer: 20 NFTs available for minting.
ERC721, Paws: 10 NFTs available for _privilege_.

**Semi-fungible token**

ERC1155, Whiskers: _TBD_

## DeFi service

And securities that will be availabe as DeFi service are as followings.

1. Staking: Catnip ERC777, APY 10 percent
1. Liquidity reward: MPY 2 percent, lpCatnip token rewarded
1. Yield farming: Catnip + token A/B/C _TBD_

<details>
<summary>Architecture</summary>

![defi-swap-pool-architecture](https://user-images.githubusercontent.com/83855174/184159638-3eb8971e-4add-43a6-adf3-6f2a672ef7ef.jpg)

</details>

## Wallet

PawCon also targets to provide a wallet solution for its user.

- wallet name: Tree

Note that this is _an experimental feature_ being developed. User must use external wallet such as Metamask and Coinbase before full adoption.

<details>
<summary>Architecture</summary>

![asun-wallet-architecture](https://user-images.githubusercontent.com/83855174/184156248-507f7315-50ce-4af5-a30d-619f7917e80d.jpg)

</details>
