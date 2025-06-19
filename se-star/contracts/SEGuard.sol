// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract SEGuard {
    address public owner;

    mapping(address => bool) public flagged;

    event AddressFlagged(address indexed wallet, string reason);
    event AddressCleared(address indexed wallet);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    function flag(address wallet, string memory reason) external onlyOwner {
        flagged[wallet] = true;
        emit AddressFlagged(wallet, reason);
    }

    function clear(address wallet) external onlyOwner {
        flagged[wallet] = false;
        emit AddressCleared(wallet);
    }

    function isFlagged(address wallet) external view returns (bool) {
        return flagged[wallet];
    }
}