import hre from "hardhat";
import { expect } from "chai";
import { MyToken } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

// 컴파일 할 때 필요한 클래스 만들어줌 
describe("mytoken deploy", () => {
    let myTokenContract: MyToken;
    let signers: HardhatEthersSigner[];

    before("should deploy", async () => {
        signers = await hre.ethers.getSigners();
        myTokenContract = await hre.ethers.deployContract("MyToken", [
            "MyToken",
            "MT",
            18,
        ]);
    });

    it("should return name", async () => {
        expect(await myTokenContract.name()).equal("MyToken");
    })
    it("should return symbol", async () => {
        expect(await myTokenContract.symbol()).equal("MT");
    })
    it("should return decimals", async () => {
        expect(await myTokenContract.decimals()).equal(18);
    })
    it("should return 0 totalSupply", async () => {
        expect(await myTokenContract.totalSupply()).equals(0);
    })
    it("should return 0 balance for signer 0", async () => {
        expect(await myTokenContract.balanceOf(signers[0])).equals(0);
    })

})