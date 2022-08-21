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

1. [Wallet]

   1. [Architecture](#architecture)
   1. [UI](#ui)
   1. [Usage](#usage)

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

Minting dapp

- AsunSwap: DeFi dapp

- Wallets: Master wallet(CA), wallet A(CA), wallet B(CA)
- Swap: ERC20/777☜☞ERC20/777, ERC20☜☞ERC721
- Pool: Deposit, timelock

## Contract

will be added

<details>
<summary>upcoming</summary>

### Test-driven development

### Lint

### Oracle

### Media management

## Wallet

### Architecture

### UI

### Usage

</details>
