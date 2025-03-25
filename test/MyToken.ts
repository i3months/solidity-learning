import hre from "hardhat";
import { expect } from "chai";
import { MyToken } from "../typechain-types";

// 컴파일 할 때 필요한 클래스 만들어줌 
describe("mytoken deploy", () => {
    let myTokenContract: MyToken;

    before("should deploy", async () => {
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
})