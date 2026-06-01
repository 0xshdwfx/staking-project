// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import {RewardToken} from "src/RewardToken.sol";

contract Staking is Ownable, ReentrancyGuard, Pausable {
    /////////////////
    /// Errors //////
    /////////////////

    error InvalidTokenAddress();

    ////////////////////////
    /// State Variables ///
    //////////////////////

    struct UserInfo {
        uint256 stakedAmount;
        uint256 lastRewardTime;
        uint256 pendingRewards;
    }

    RewardToken public immutable REWARD_TOKEN;

    ///////////////////
    /// Constructor ///
    ///////////////////
    constructor(address tokenAddress) Ownable(msg.sender) {
        if (tokenAddress == address(0)) revert InvalidTokenAddress();
        REWARD_TOKEN = RewardToken(tokenAddress);
    }
}
