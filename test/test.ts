// hardhat 프레임워크 안에서 실행해 보기 위해

import hre from "hardhat";

describe("hardhat-test", () => {
    it("print hardhat", async () => {
        const signers = await hre.ethers.getSigners();

        // const myFirstWallet = hre.ethers.Wallet.createRandom(); 원래는 이렇게 만들어야 했음 
        // 매번 이렇게 만들어주는건 불편하니까.. hardhat ethers를 만들고 사용함 
        // signers를 통해 편하게 사용할 수 있음 
        // 불필요한 작업을 줄여준다고 생각하면 됨

        // 실제로 개발할 때는 일반 ethers를 사용함 

        console.log(signers); // hardhat 네트워크 띄울 때 account는 20개 만들어지는데.. 
        console.log(signers.length);
        console.log(hre.ethers);
    });
});

// describe는 mocha 프레임워크 구조 
// 테스트 할 때 그루핑해줌 
// it를 사용해서 테스트 진행 

describe("hardhat-test", () => {
    it("hardhat ethers test", async () => {
        const signers = await hre.ethers.getSigners();

        // bob -> alice : 100 eth send 
        // signers 자체가 지갑
        const bobWallet = signers[0];
        const aliceWallet = signers[1];

        const tx = {
            from: bobWallet.address,
            to: aliceWallet.address,
            // 1 ETH == 1 * 10^18 wei 
            // 100 ETH == 100 * 10^18 wei
            // 둘 다 wei 단위로 변환하고 더하고.. 소숫점 이하가 손실이 없어야 함. 정밀한 계산을 위해 wei 사용
            value: hre.ethers.parseEther("100"), // wei 단위로 입력해 줘야 함 
        };

        // 트랜잭션아이디는 UNIQUE
        // 거래 후에는 영수증을 받아온다
        const txHash = await bobWallet.sendTransaction(tx);
        const receipt = txHash.wait();

        console.log(hre.ethers.provider.getTransaction(txHash.hash));
        console.log("----------");
        console.log(receipt);

    });

    it("ethers test", async () => {

    });
});