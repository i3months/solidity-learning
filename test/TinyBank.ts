import hre from "hardhat";
import { expect } from "chai";

import { DECIMALS, MINTING_AMOUNT } from "./constants";
import { MyToken, TinyBank } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("TinyBank", () => {
    let signers: HardhatEthersSigner[];
    let myTokenC: MyToken;
    let tinyBankC: TinyBank;

    beforeEach(async () => {
        signers = await hre.ethers.getSigners();
        myTokenC = await hre.ethers.deployContract("MyToken", [
            "MyToken",
            "MY",
            DECIMALS,
            MINTING_AMOUNT,
        ]);
        tinyBankC = await hre.ethers.deployContract("TinyBank", [
            await myTokenC.getAddress()
        ]);

        describe("Initialized state check", () => {
            it("should return totalStaked 0", async () => {
                expect (await tinyBankC.totalStaked()).equal(0);
            })
            it("should return staked 0 amount of signer0", async () => {
                const signer0 = signers[0];
                expect (await tinyBankC.staked(signer0.address)).equals(0);
            });
        });

        describe("Staking", async () => {
            it("should return staked amount", async () => {
                const signer0 = signers[0];
                const stakingAmount = hre.ethers.parseUnits("50", DECIMALS);

                // 승인 받아야 호출 가능 
                await myTokenC.approve(await tinyBankC.getAddress(), stakingAmount);
                await tinyBankC.stake(stakingAmount);
                tinyBankC.staked(signer0.address);

                expect(await tinyBankC.staked(signer0.address)).equals(stakingAmount);
                expect(await tinyBankC.totalStaked()).equals(stakingAmount);

                expect(await myTokenC.balanceOf(tinyBankC)).equals(await tinyBankC.totalStaked());                  
            });
        });
        
    });
    describe("Withdraw", () => {
        it("should return 0 staked after withdrawing total token", async () => {
            const signer0 = signers[0];
            const stakingAmount = hre.ethers.parseUnits("50", DECIMALS);
            await myTokenC.approve(await tinyBankC.getAddress(), stakingAmount);
            await tinyBankC.stake(stakingAmount);
            await tinyBankC.withdraw(stakingAmount);
            expect(await tinyBankC.staked(signer0.address)).equals(0);
        });
    });

});