
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AlertTrigger {
    event Alert(address indexed addr, string reason);

    function triggerAlert(address addr, string calldata reason) external {
        emit Alert(addr, reason);
    }
}
