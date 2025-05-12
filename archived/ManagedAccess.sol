// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

// 공통 기능인 access 관련은 추상클래스로 빼기 - 자바와 동일한 개념
abstract contract ManagedAccess {

    address public owner;
    address public manager;

    constructor(address _owner, address _manager) {
        owner = _owner;
        manager = _manager;
    }

    modifier onlyOwner {
        require(msg.sender == owner, "Not Authorized");
        _;
    }
    
    modifier onlyManager {
        require(msg.sender == manager, "Not Manager");
        _;
    }
}