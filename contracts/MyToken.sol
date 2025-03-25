// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

// contract는 class와 유사
contract MyToken {
    string public name;
    string public symbol;
    uint8 public decimals; // uint8 = unsigned 8 bit int

    // string은 길이 제한이 없으니 memory에다가 복사하라고 명시해 줘야 함
    constructor(string memory _name, string memory _symbol, uint8 _decimals) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
    }
}
