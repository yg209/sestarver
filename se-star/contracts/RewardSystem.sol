
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RewardSystem {
    mapping(address => uint256) public rewards;

    function rewardUser(address user, uint256 amount) external {
        rewards[user] += amount;
    }

    function claimReward() external {
        uint256 reward = rewards[msg.sender];
        rewards[msg.sender] = 0;
        payable(msg.sender).transfer(reward);
    }

    receive() external payable {}
}
