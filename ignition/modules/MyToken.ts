import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

// 배포 테스트 하려면 hardhat 네트워크 띄워 둬야 함 
// npx hardhat ignition deploy ignition/modules/MyToken.ts --network localhost
export default buildModule("MyTokenDeploy", (m) => {
    const myTokenContract = m.contract("MyToken", ["MyToken", "MT", 18]);
    return { myTokenContract };
})