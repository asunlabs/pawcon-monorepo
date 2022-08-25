---
title: 'Blockchain overview'
draft: false
---

## Contents

1. [Heads-up](#heads-up)

1. [App services](#app-services)

   1. [Token economy](#token-economy)
   1. [Dapp projects](#dapp-projects)

1. [Contract](#contract)

   1. [Test-driven development](#test-driven-development)
   1. [Lint](#lint)
   1. [Oracle](#oracle)
   1. [Media management](#media-management)

1. [Wallet](#wallet)

## Heads-up

There once a wise man said,

> Read docs, write codes, and cry alone underwater thinking why my codes don't work.. or even _works_.

... and yes, that's pretty much sums up my blockchain development journey.

Jokes aside, welcome to my project. I will try my best to spell out how the project configures.

## App services

I, my, me, myself is a product owner and development lead in PawCon project. Below readers will find how I approached to create this project in the perspective of product owner in agile framework.

### Token economy

Tokens being developed in PawCon project are as followings. Note that these are _upgradeable_ contracts.

1. UUPS ERC20 Churu: from version 0.2.0
1. UUPS ERC721 CuriousPawoneer: from version 0.2.0
1. UUPS ERC777 Catnip: since version 0.3.0
1. UUPS ERC1155 Whiskers: since version 0.3.0

Mainly, the Catnip will be a governance token in ecosystem, which will be provided to liquidity providers and stakers as a reward. In AsunSwap Defi service, the catnip will be paired with other tokens, providing a list of swap pools.

The Curious pawoneer tokens were image assets in PawCon ver 0.2.0. This will somehow be the same in version 0.3.0 but I'm planning to add more features for NFTs such as expanding lending limit for NFT holder in DeFi service.

Token Churu and Whiskers are in planning phase, yet.

### Dapp projects

Two projects are being developed in this monorepo, which is as followings.

**AsunMint**

This is an Ethereum UUPS ERC721 NFT minting service application. There will be around 20 NFTs available with auction. User can buy/mint each NFT and stake the NFT to get staking reward token, which is ERC777 Catnip governance token.

AsunMint is primarily about refactoring [PawCon legacy ver 0.2.0](https://github.com/developerasun/pawcon)

**AsunSwap**

This is a simplified DeFi application. The target features are as followings.

|          Swap           |        Stake        | Yield farming |
| :---------------------: | :-----------------: | :-----------: |
|     ERC20 <=> ERC20     |       ERC721        | ERC20/ERC777  |
|    ERC20 <=> ERC721     |       ERC777        |       -       |
|    ERC721 <=> ERC721    | upgradeable ERC777  |       -       |
| non-upgradeable ERC1155 | upgradeable ERC1155 |       -       |

Financial products served in typical DeFi apps are based on a delicate price formular with a proven math. Take a look at [here](https://uniswap.org/whitepaper-v3.pdf). I would not target to build a sophisticated DeFi service like [Uniswap](https://app.uniswap.org/#/swap?chain=mainnet), rather simplify things with pre-defined ruleset.

1. **Staking reward** will be _4 percent per year_ of the amount of token staked.
1. **Yield farming reward** will be _up to 50 percent per month_, which will be detailed later.

Below, readers will find a list of checklist that asks _unclear assumption_. These checklist will be updated regularly.

- [ ] Is UUPS ERC777 tradeable/swappable with non-upgradeable ERC20?
- [ ] Is UUPS ERC777 tradeable/swappable with non-upgradeable ERC721?

Last, but not least, the whole DeFi contract architecture is structured like below. Note that there might some changes later.

![defi-swap-pool-architecture](https://user-images.githubusercontent.com/83855174/184159638-3eb8971e-4add-43a6-adf3-6f2a672ef7ef.jpg)

## Contract

### Test-driven development

PawCon takes test codes very seriously. Thorough testing in smart contract is a _MUST_, not an \_choice. For tests, the project uses:

- mocha
- chai
- ethers.js
- hardhat-network-helpers
- hardhat-chai-matchers
- smock
- solidity-coverage
- typescript
- custom hooks

Target test coverage is 90 percent of Istanbul report, which will decide whether or not a pull request can be merged in CI like Github Actions.

### Lint

PawCon configures hardhat-solhint to check contract security. Note that this is soley for security, not considering styling.

### Oracle

will be added

### Media management

will be added

## Wallet

**AsunWallet**

This is a wallet that should be able to hold below types of tokens.

|     Non-upgradeable     |     Upgradeable     |
| :---------------------: | :-----------------: |
|  non-upgradeable ERC20  |  upgradeable ERC20  |
| non-upgradeable ERC721  | upgradeable ERC721  |
| non-upgradeable ERC777  | upgradeable ERC777  |
| non-upgradeable ERC1155 | upgradeable ERC1155 |

Token receival will be available with ERC1820 implementation.

Wallet architecture will be like below.

![asun-wallet-architecture](https://user-images.githubusercontent.com/83855174/184156248-507f7315-50ce-4af5-a30d-619f7917e80d.jpg)

Note that every account that has some funds in them are contract account. I `assume` that funds are taken caren of in the contracts(main and childs) and UI will provide a way to generate EOA(public address, public key, private key) for user like Metamask. For example,

```solidity
function generateEOA() public {
   // some logic here
}
```

and then call the function in UI like,

```js
const contract = await ethers.getContractAt(addr, ABI);
await contract.generateEOA(); // more logics after ..
```

Note that this is a very primitive architecture approach of how to create a one's own wallet from scratch.
