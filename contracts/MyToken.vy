# @version ^0.3.9
# @license MIT

# 파일 자체가 contract 
# 타입 명시 필수
# public에 대해서는 getter 만들어줌
# vyper에서는 camelCase사용함 - solidity를 사용하기에.. 원래는 snake_case사용

name: public(String[64])
symbol: public(String[32])
decimals: public(uint256)
totalSupply: public(uint256)

balanceOf: public(HashMap[address, uint256])
allowances: public(HashMap[address, HashMap[address, uint256]])

@external
def __init__(_name: String[64], _symbol: String[32], _decimals: uint256, _initialSupply: uint256):
    self.name = _name
    self.symbol = _symbol
    self.decimals = _decimals
    self.totalSupply= _initialSupply * 10 ** 18
    self.balanceOf[msg.sender] += _initialSupply

@external
def transfer(_amount:uint256, _to:address):
    assert self.balanceOf[msg.sender] >= _amount, "insufficient balance"
    self.balanceOf[msg.sender] -= _amount
    self.balanceOf[_to] += _amount

@external
def approve(_spender:address, _amount:uint256):
    # assert self.balanceOf[_owner] >= _amount, "insufficient balance"
    self.allowances[msg.sender][_spender] += _amount
    
 
@external
def transferFrom(_owner:address, _amount:uint256):
    assert self.allowances[_owner][msg.sender] >= _amount, "insufficient allowance"
    assert self.balanceOf[_owner] >= _amount, "insufficient balance"
    self.balanceOf[_owner] -= _amount
    self.balanceOf[msg.sender] += _amount
    self.allowances[_owner][msg.sender] -= _amount