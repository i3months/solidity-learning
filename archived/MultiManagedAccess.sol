//SPDX-License-Identifier:MIT
pragma solidity ^0.8.28;

abstract contract MultiManagedAccess {

    uint constant MANAGER_NUMBERS = 5;

    address public owner;
    address[MANAGER_NUMBERS] public managers;
    bool[MANAGER_NUMBERS] public confirmed;     
    // 매니저0 - 컨펌0 이런식으로 매칭

    constructor(address _owner, address[] memory _managers) {
        owner = _owner;
        for (uint i = 0; i < MANAGER_NUMBERS; i++) {
            managers[i] = _managers[i];
        }
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not authorized");
        _;
    }

    function allConfirmed() internal view returns (bool) {
        for(uint i=0; i<MANAGER_NUMBERS; i++) {
            if (!confirmed[i]) {
                return false;
            }            
        }
        return true;
    }

    function reset() internal {
        for(uint i=0; i<MANAGER_NUMBERS; i++) {
            confirmed[i] = false;
        }
    }

    modifier onlyAllConfirmed() {
        require(allConfirmed(), "Not all confirmed yet");
        reset();
        _;
    }

    function confirm() external {
        bool found = false;
        for(uint i=0; i<MANAGER_NUMBERS; i++) {
            if (managers[i] == msg.sender) {
                found = true;
                confirmed[i] = true;
                break;
            }
        }

        require(found, "You are not a manager");
    }
}
