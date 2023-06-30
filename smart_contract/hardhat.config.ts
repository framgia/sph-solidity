import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-solhint";
import dotenv from "dotenv";

dotenv.config();

const API_URL = process.env.API_URL;
const USER_KEY = process.env.USER_KEY;

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks: {
    sepolia: {
      url: API_URL,
      accounts: [USER_KEY as string]
    }
  }
};

export default config;
