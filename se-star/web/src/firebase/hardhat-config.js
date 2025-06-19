require("dotenv").config();
module.exports = {
  defaultNetwork: "mainnet",
  networks: {
    mainnet: {
      url: process.env.MAINNET_RPC,
      accounts: [process.env.PRIVATE_KEY]
    },
  },
  solidity: "0.8.17",
};