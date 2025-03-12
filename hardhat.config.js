require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.28",  // หรือ version ที่คุณใช้
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    monad_testnet: {
      url: "https://testnet-rpc.monad.xyz",  // แทนที่ด้วย RPC จริงจาก docs
      chainId: 10143,  // แทนที่ด้วย Chain ID จริงจาก Monad docs
      accounts: [process.env.PRIVATE_KEY],  // private key ของ MetaMask
    },
  },
};
