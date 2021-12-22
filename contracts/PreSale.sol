//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/utils/math/SafeMath.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import './AwesomeTokens.sol';

contract PreSale is Ownable, ReentrancyGuard {
  using SafeMath for uint256;

  AwesomeTokens public tokens;
  uint256 public costPrice;
  address[] public participants;
  address[] public winners;
  mapping(address => bool) isParticipating;
  mapping(address => bool) withdrawn;
  mapping(address => uint256) winnerBalance;
  mapping(address => bool) isWinner;

  constructor() {
    costPrice = 0.01 ether;
    tokens = new AwesomeTokens(10000 ether);
    tokens.whitelist(msg.sender);
    tokens.transferOwnership(msg.sender);
  }

  function enterPresale() external nonReentrant {
    require(winners.length == 0, 'The presale is over');
    require(
      isParticipating[msg.sender] == false,
      'you have already entered presale'
    );
    participants.push(msg.sender);
    isParticipating[msg.sender] = true;
  }

  function pickWinners() external onlyOwner {
    require(winners.length == 0, 'Winners have already been selected');

    for (uint256 i = 0; i < 10; i++) {
      address selected = participants[_randomNum()];
      winners.push(selected);
      isWinner[selected] = true;
      winnerBalance[selected] = 1000 ether;
    }
  }

  function checkIsWinner() external view returns (bool) {
    require(isWinner[msg.sender] == true, 'You are not the winner');
    return true;
  }

  function withdraw() external payable nonReentrant {
    require(
      winnerBalance[msg.sender] > 0 && withdrawn[msg.sender] == false,
      'You are not the winner'
    );
    require(msg.value > costPrice, 'please pay 0.01 ether');

    uint256 refund = (msg.value).sub(costPrice);
    uint256 tokensToTransfer = winnerBalance[msg.sender];
    winnerBalance[msg.sender] = 0;
    withdrawn[msg.sender] = true;

    (bool refundSuccess, ) = msg.sender.call{ value: refund }('');
    require(refundSuccess, 'Failed to send Ether');
    tokens.transfer(msg.sender, tokensToTransfer);
  }

  function tokenUnlock() external onlyOwner {
    tokens.unlockTokens();
  }

  function _randomNum() internal view returns (uint256) {
    uint256 randomnumber = uint256(
      keccak256(abi.encodePacked(block.timestamp, block.difficulty))
    ) % participants.length;
    return randomnumber;
  }
}
