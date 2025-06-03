// staking 
// deposit(MyToken) / withdraw(MyToken)

// SPDX-License-Identifier: MIT

// vault (금고)
pragma solidity ^0.8.28;

import "./ManagedAccess.sol";

interface IMyToken {
    function transfer(uint256 amount, address to) external;

    function transferFrom(address from, address to, uint256 amount) external;

    function mint(uint256 amount, address owner) external;
}

// 저장할 token을 먼저 배포, 이후 TinyBank의 생성자로 줘야 함 
contract TinyBank is ManagedAccess {
    event Staked(address from, uint256 amount);
    event WithDraw(uint256 amount, address to);

    IMyToken public stakingToken;

    mapping(address => uint256) public lastClaimedBlock;

    uint256 defaultRewardPerBlock = 1 * 10 ** 18;
    uint256 public rewardPerBlock;

    // mapping은 단방향. 대신 빠름 
    mapping(address => uint256) public staked;
    uint256 public totalStaked;

    constructor(IMyToken _stakingToken)
        ManagedAccess(msg.sender, msg.sender) {
        stakingToken = _stakingToken;
        rewardPerBlock = defaultRewardPerBlock;
    }


    function setRewardPerBlock(uint256 _amount) external onlyManager {
        rewardPerBlock = _amount;
    }

    

    // 리워드 분배 함수를 누가, 언제 호출해야 할까? 
    // state 변경은 트랜잭션으로 처리하는데. 
    // 블럭마다 하면 가스비가 많이 든다. 

    // stake나 withdraw 호출 할 때 함께 처리한다면?     

    // 모든 블럭을 처리하는건 너무 비효율적이니.. 해당하는 요소만 처리하자.

    // genesis staking -> totalStaked, staked[to] 가 0이 된다 

    // modifier의 scope는 internal
    // _는 코드를 insert 함을 의미함. 자바의 AOP 와 동일 (컴파일 타임에 동작)
    modifier updateReward(address to) {
        if (staked[to] > 0) {
            uint256 blocks = block.number - lastClaimedBlock[to];
            uint256 reward = blocks * rewardPerBlock * staked[to] / totalStaked;
            stakingToken.mint(reward, to);
        }
        lastClaimedBlock[to] = block.number;
        _;
    }

    function stake(uint256 _amount) external updateReward(msg.sender) {
        require(_amount >= 0, "cannot stake 0 amount");        
        stakingToken.transferFrom(msg.sender, address(this), _amount);
        staked[msg.sender] += _amount;
        totalStaked += _amount;
        emit Staked(msg.sender, _amount);
    }

    function withdraw(uint256 _amount) external updateReward((msg.sender)) {
        require(staked[msg.sender] >= _amount, "insufficient stake token");        
        stakingToken.transfer(_amount, msg.sender);
        staked[msg.sender] -= _amount;
        totalStaked -= _amount;

        emit WithDraw(_amount, msg.sender);
    }
    // 블록체인에서의 시간은 블록이 만들어진 시간을 기준으로 계산함 

    // function confirm() external override {
    //     super.confirm();
    // }
    
}

