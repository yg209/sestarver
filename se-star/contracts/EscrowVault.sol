// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract EscrowVault {
    address public buyer;
    address public seller;
    address public arbiter;
    uint256 public amount;
    bool public isReleased;
    bool public isRefunded;

    constructor(address _buyer, address _seller, address _arbiter) payable {
        buyer = _buyer;
        seller = _seller;
        arbiter = _arbiter;
        amount = msg.value;
    }

    modifier onlyArbiter() {
        require(msg.sender == arbiter, "Not arbiter");
        _;
    }

    function releaseFunds() external onlyArbiter {
        require(!isReleased && !isRefunded, "Already processed");
        isReleased = true;
        payable(seller).transfer(amount);
    }

    function refundBuyer() external onlyArbiter {
        require(!isReleased && !isRefunded, "Already processed");
        isRefunded = true;
        payable(buyer).transfer(amount);
    }
}