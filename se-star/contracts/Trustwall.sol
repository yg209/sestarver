// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract TrustWall {
    address public admin;

    mapping(address => bool) public isTrusted;

    event TrustAdded(address indexed exchange);
    event TrustRevoked(address indexed exchange);

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    function addTrust(address exchange) external onlyAdmin {
        isTrusted[exchange] = true;
        emit TrustAdded(exchange);
    }

    function removeTrust(address exchange) external onlyAdmin {
        isTrusted[exchange] = false;
        emit TrustRevoked(exchange);
    }
}