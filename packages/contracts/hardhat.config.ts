import { HardhatUserConfig } from "hardhat/types";
import "dotenv/config";
import "hardhat-deploy";
import "hardhat-gas-reporter";
import "hardhat-contract-sizer";
import "@typechain/hardhat";
import "solidity-coverage";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "@nomicfoundation/hardhat-chai-matchers";
import "hardhat-tracer";
import "@typechain/ethers-v5";
import "./tasks/upgradeContract";
import "./tasks/verifyOnEtherscan";

const defaultKey =
  "0000000000000000000000000000000000000000000000000000000000000001";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
      forking: {
        url: process.env.MUMBAI_ALCHEMY_KEY || defaultKey,
        blockNumber: 14252603,
        enabled: false,
      },
      saveDeployments: false,
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      chainId: 11155111,
      accounts: [process.env.PRIVATE_KEY || defaultKey],
      saveDeployments: true,
    },
    localhost: {
      saveDeployments: false,
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  namedAccounts: {
    deployer: 0,
    alice: 1,
    bob: 2,
    carol: 3,
    ted: 4,
    system1: 5,
    system2: 6,
  },
};

export default config;
