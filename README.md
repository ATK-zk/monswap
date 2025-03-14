# Monswap (Backend)

A decentralized exchange (DEX) backend built on Monad Testnet. This repository contains the smart contracts powering Monswap, inspired by Uniswap and BeanSwap.

## Overview
- **Purpose:** Provides the core smart contracts for token swapping and liquidity provision on Monad Testnet.
- **Frontend:** The React frontend is maintained separately at [monswap_frontend](https://github.com/ATK-zk/monswap_frontend).
- **Live Demo:** [https://monswap.vercel.app/](https://monswap.vercel.app/)

## Smart Contracts
- **WMON:** `0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701`
- **MONs:** `0x414C48Ce59EC0B3083537aA885934c6b23541F17`
- **Factory:** `0x0d4e71Dd89c538A3383B5386AB06047058f20590`
- **Pair:** `0x3585E8fa506E723405E016FE0172fCBfbDe2Bfd6`

## Features
- Deployed on Monad Testnet
- Token swapping (WMON ↔ MONs)
- Liquidity provision and removal

## Setup
1. **Clone the repository:**
   ```bash
   git clone https://github.com/ATK-zk/monswap.git
   cd monswap

2. **Install dependencies:**
   ```bash
   npm install

3. **Configure Hardhat:**
   Update hardhat.config.js with your Monad Testnet RPC and private key.

4. **Deploy contracts:**
   npx hardhat run scripts/deploy.js --network monad_testnet

## Network
   Monad Testnet

   Chain ID: 10143
   
   RPC: https://testnet-rpc.monad.xyz

## Development
1. **Compile contracts:**
   ```bash
   npx hardhat compile

2. **Test contracts:**
   ```bash
   npx hardhat test

## Contributing
   Feel free to open issues or submit pull requests to improve the contracts!

## License
<<<<<<< HEAD
   MIT
=======
MIT
>>>>>>> a7417c308e200cbdd6dde30a42f291c7f1686017
