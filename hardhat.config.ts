import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-vyper";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  vyper: {
    version: "0.3.9",
    // @ts-ignore
    path: "/Users/13months/Desktop/solidity-learning/vyenv/bin/vyper",
  },
};

export default config; 
