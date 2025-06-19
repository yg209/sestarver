
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AIAgent {
    enum RiskLevel {White, Green, Yellow, Orange, Red, Black}
    mapping(address => RiskLevel) public addressRisk;
    event RiskUpdated(address indexed addr, RiskLevel risk);

    function updateStatus(address addr, RiskLevel risk) external {
        addressRisk[addr] = risk;
        emit RiskUpdated(addr, risk);
    }
}
