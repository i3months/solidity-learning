import hre from "hardhat";
import { expect } from "chai";
import { MyToken } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { assertArgumentCount } from "ethers";

const mintingAmount = 100n;
const decimals = 18n;

// 컴파일 할 때 필요한 클래스 만들어줌 
describe("My Token", () => {
    let myTokenContract: MyToken;
    let signers: HardhatEthersSigner[];

    beforeEach("should deploy", async () => {
        signers = await hre.ethers.getSigners();
        myTokenContract = await hre.ethers.deployContract("MyToken", [
            "MyToken",
            "MT",
            decimals,
            mintingAmount
        ]);
    });

    describe("Basic state value check", () => {
        it("should return name", async () => {
            expect(await myTokenContract.name()).equal("MyToken");
        })
        it("should return symbol", async () => {
            expect(await myTokenContract.symbol()).equal("MT");
        })
        it("should return decimals", async () => {
            expect(await myTokenContract.decimals()).equal(18);
        })
        it("should return 100 totalSupply", async () => {
            expect(await myTokenContract.totalSupply()).equals(mintingAmount * 10n ** decimals);
        })
    })

    // it("should return 0 balance for signer 0", async () => {
    //     expect(await myTokenContract.balanceOf(signers[0])).equals(0);
    // })

    describe("Mint", () => {
        it("should return 1MT balance for signer 0", async () => {
            const signer0 = signers[0];
            expect(await myTokenContract.balanceOf(signer0)).equals(mintingAmount * 10n ** decimals);
        })
    })

    describe("Transfer", () => {
        /**
         * view 함수는 readonly. 트랜잭션 수수료를 내지 않는다
         * transfer 함수는 state를 변경하게 되는데, 이 변경 작업은 모든 노드에 이어지게 돼 비용이 많이 소모됨.
         */
        /**
         * 상태를 변화시키는 연산은 트랜잭션으로 실행됨 
         */
        it("should have 0.5MT", async () => {
            const signer0 = signers[0];
            const signer1 = signers[1];

            expect(await myTokenContract.transfer(hre.ethers.parseUnits("0.5", decimals), signer1.address)).to.emit(myTokenContract, "Transfer").withArgs(signer0.address, signer1.address, hre.ethers.parseUnits("0.5"), decimals);

            // const receipt = await tx.wait();
            // console.log(receipt?.logs);

            expect(await myTokenContract.balanceOf(signer1)).equals(hre.ethers.parseUnits("0.5", decimals));

            /**
             * 인덱싱은 topic 에 데이터를 넣는 것 
             * 빠른 검색을 위해.. 
             */
            const filter = myTokenContract.filters.Transfer(signer0.address);
            const logs = await myTokenContract.queryFilter(filter, 0, "latest");



        })
        /**
         * exception을 테스트 할 때는 await 위치에 주의          
         */
        it("should be reverted with insufficient balance error", async () => {
            const signer1 = signers[1];
            await expect(
                myTokenContract.transfer(hre.ethers.parseUnits((mintingAmount + 1n).toString(), 18), signer1.address)
            ).to.be.revertedWith("insufficient balance");
        })
    })

    describe("TransferFrom", () => {
        it("should emit Approval event", async () => {
            const signer1 = signers[1];
            await expect(myTokenContract.approve(signer1, hre.ethers.parseUnits("10", decimals)))
                .to.emit(myTokenContract, "Approval")
                .withArgs(signer1.address, hre.ethers.parseUnits("10", decimals));
        })
        it("should be reverted with insufficient allowance error", async () => {
            const signer0 = signers[0];
            const signer1 = signers[1];
            await expect(
                myTokenContract.connect(signer1).transferFrom(signer0.address, signer1.address, hre.ethers.parseUnits("1", decimals))
            ).to.be.revertedWith("insufficient allowance");
        })
    })

    it("should signer1 transfer 3 from signer0", async () => {
        const signer0 = signers[0];
        const signer1 = signers[1];

        const amount = hre.ethers.parseUnits("3", decimals);

        // approve signer0 -> signer1
        await expect(myTokenContract.connect(signer0).approve(signer1.address, amount)).to.emit(myTokenContract, "Approval")
            .withArgs(signer1.address, amount);

        // signer0 -> signer1 tranferFrom 사용 signer1이 호출함
        await expect(myTokenContract.connect(signer1).transferFrom(signer0.address, signer1.address, amount)).to.emit(myTokenContract, "Transfer")
            .withArgs(signer0.address, signer1.address, amount);

        const balance0 = await myTokenContract.balanceOf(signer0.address);
        const balance1 = await myTokenContract.balanceOf(signer1.address);

        expect(balance0).to.equal((mintingAmount * 10n ** decimals) - amount);
        expect(balance1).to.equal(amount);
    });


})