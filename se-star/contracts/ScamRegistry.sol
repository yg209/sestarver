
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ScamRegistry {
    mapping(address => bool) public isScammer;
    event ScammerReported(address indexed scammer);

    function reportScammer(address scammer) external {
        isScammer[scammer] = true;
        emit ScammerReported(scammer);
    }
}
