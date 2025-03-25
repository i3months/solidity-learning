// hardhat 프레임워크 안에서 실행해 보기 위해

import hre from "hardhat";
import { ethers, Wallet } from "ethers";

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
        // bob의 서명을 받아야 보낼 수 있도록.. 
        // ethers에서는 내부적으로 서명을 해 줌 (편의상)
        // nonce 가 0이면 bob이 만든 0 번째 트랜잭션을 의미 

        // npx hardhat node 로 만들어진 key를 가져와서 사용 
        const provider = new ethers.JsonRpcProvider("http://localhost:8545");

        const bobWallet = new ethers.Wallet(
            "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
            provider
        );
        const aliceWallet = new ethers.Wallet(
            "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
        );

        const tx = {
            from: bobWallet.address,
            to: aliceWallet.address,
            value: ethers.parseEther("100"),
            // chainId: 31337,
        }

        // ethers를 사용하는 경우 자동으로 채워주지 않으니.. populatedTx 사용해서 채워주기 
        // 서명은 bobWallet으로, 이후 블록체인 노드로 보내주자.
        const populatedTx = await bobWallet.populateTransaction(tx);
        const signedTx = await bobWallet.signTransaction(populatedTx);
        const txHash = await provider.send("eth_sendRawTransaction", [signedTx]);

        // 수수료는 송신자가 지불하게 됨 
        console.log(await provider.getBalance(bobWallet.address));
        console.log(await provider.getBalance(aliceWallet.address));
    });
});