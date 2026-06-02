// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import {RewardToken} from "src/RewardToken.sol";

/**
 * @author  0xshdwfx
 * @title   Staking
 * @dev     Staking contract enabling users to stake ERC20 tokens and earn rewards.
 *          Implements reentrancy protection, pausable functionality, and owner-controlled
 *          reward distribution via the RewardToken contract. Uses immutable token reference
 *          for gas efficiency and security.
 * @notice  Users can stake tokens, claim rewards, and unstake. The contract owner can
 *          pause/unpause staking operations and control reward distribution through the
 *          RewardToken mint function.
 */

contract Staking is Ownable, ReentrancyGuard, Pausable {
    /////////////////
    /// Errors //////
    /////////////////

    error InvalidTokenAddress();
    error InvalidEthAmount();

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

    /**
     * @notice Initializes the Staking contract with a RewardToken reference.
     * @param tokenAddress The address of the deployed RewardToken contract.
     * @dev Validates that tokenAddress is not zero. Initializes Ownable with msg.sender.
     * @custom:error InvalidTokenAddress if tokenAddress is address(0).
     */
    constructor(address tokenAddress) Ownable(msg.sender) {
        if (tokenAddress == address(0)) revert InvalidTokenAddress();
        REWARD_TOKEN = RewardToken(tokenAddress);
    }

    ///////////////////
    /// Functions /////
    ///////////////////

    function stake(uint256 amount) external whenNotPaused nonReentrant {
        if (amount == 0) revert InvalidEthAmount();
    }
}
