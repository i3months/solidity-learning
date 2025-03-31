import hre from "hardhat";
import { expect } from "chai";
import { MyToken } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { assertArgumentCount } from "ethers";

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
    it("should return 1MT totalSupply", async () => {
        expect(await myTokenContract.totalSupply()).equals(1n * 10n ** 18n);
    })
    // it("should return 0 balance for signer 0", async () => {
    //     expect(await myTokenContract.balanceOf(signers[0])).equals(0);
    // })
    it("should return 1MT balance for signer 0", async () => {
        const signer0 = signers[0];
        expect(await myTokenContract.balanceOf(signer0)).equals(1n * 10n ** 18n);
    })
    /**
     * view 함수는 readonly. 트랜잭션 수수료를 내지 않는다
     * transfer 함수는 state를 변경하게 되는데, 이 변경 작업은 모든 노드에 이어지게 돼 비용이 많이 소모됨.
     */
    it("should have 0.5MT", async () => {
        const signer1 = signers[1];
        await myTokenContract.transfer(hre.ethers.parseUnits("0.5", 18), signer1.address);
        expect(await myTokenContract.balanceOf(signer1)).equals(hre.ethers.parseUnits("0.5", 18));
    })


})