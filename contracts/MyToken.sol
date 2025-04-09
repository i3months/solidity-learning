// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

// contract는 class와 유사
contract MyToken {
    string public name;
    string public symbol;
    uint8 public decimals; // uint8 = unsigned 8 bit int

    uint256 public totalSupply; // 토큰이 총 몇 개 발행되었는지?
    mapping(address => uint256) public balanceOf; // 누가 몇 개의 토큰을 가지는지? address는 길이가 동일함

    // string은 길이 제한이 없으니 memory에다가 복사하라고 명시해 줘야 함
    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        uint256 _amount
    ) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;

        // msg.sender는 배포하는 사람을 의미
        _mint(_amount * 10 ** uint256(decimals), msg.sender);
    }

    // 토큰 발행은 mint로
    function _mint(uint256 amount, address owner) internal {
        totalSupply += amount;
        balanceOf[owner] += amount;
    }

    function transfer(uint256 amount, address to) external {
        require(balanceOf[msg.sender] >= amount, "insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
    }

    // external은 외부 호출만 가능함을 의미, view는 해당 함수가 ReadOnly임을 의미. returns라서 여러 개를 반환할 수 있음
    // // public 타입에 대해서는 기본적으로 만들어 줌
    // function totalSupply() external view returns (uint256) {
    //     return totalSupply;
    // }

    // function balanceOf(address owner) external view returns (uint256) {
    //     return balanceOf[owner];
    // }

    // // string은 address처럼 길이가 정해져 있지 않으니 memory를 사용해야 함
    // function name() external view returns (string memory) {
    //     return name;
    // }
}
