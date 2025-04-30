// staking 
// deposit(MyToken) / withdraw(MyToken)

// SPDX-License-Identifier: MIT

// vault (금고)
pragma solidity ^0.8.28;

interface IMyToken {
    function transfer(uint256 amount, address to) external;

    function transferFrom(address from, address to, uint256 amount) external;
}

// 저장할 token을 먼저 배포, 이후 TinyBank의 생성자로 줘야 함 
contract TinyBank {
    event Staked(address from, uint256 amount);
    event WithDraw(uint256 amount, address to);

    IMyToken public stakingToken;
    mapping(address => uint256) public staked;
    uint256 public totalStaked;

    constructor(IMyToken _stakingToken) {
        stakingToken = _stakingToken;
    }

    function stake(uint256 _amount) external {
        require(_amount >= 0, "cannot stake 0 amount");
        stakingToken.transferFrom(msg.sender, address(this), _amount);
        staked[msg.sender] += _amount;
        totalStaked += _amount;
        emit Staked(msg.sender, _amount);
    }

    function withdraw(uint256 _amount) external {
        require(staked[msg.sender] >= _amount, "insufficient stake token");
        stakingToken.transfer(_amount, msg.sender);
        staked[msg.sender] -= _amount;
        totalStaked -= _amount;

        emit WithDraw(_amount, msg.sender);
    }
}

