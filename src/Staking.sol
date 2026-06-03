// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
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
    error InvalidStakeAmount();
    error TransferFailed();
    error InvalidUserAddress();

    ////////////////////////
    /// State Variables ///
    //////////////////////

    struct UserInfo {
        uint256 stakedAmount;
        uint256 lastRewardTime;
        uint256 pendingRewards;
    }

    IERC20 public immutable STAKING_TOKEN;
    RewardToken public immutable REWARD_TOKEN;

    uint256 public totalStaked;
    mapping(address => UserInfo) public userInfo;

    ///////////////////
    /// Constructor ///
    ///////////////////

    /**
     * @notice Initialises the Staking contract with staking and reward token references.
     * @param _stakingToken The address of the ERC20 token used for staking.
     * @param _rewardToken The address of the deployed RewardToken contract.
     * @dev Validates that tokenAddress is not zero. Initializes Ownable with msg.sender.
     *      Stores both token references as immutable for gas efficiency and security.
     * @custom:error InvalidTokenAddress if either _stakingToken or _rewardToken is address(0).
     */
    constructor(address _stakingToken, address _rewardToken) Ownable(msg.sender) {
        if (_stakingToken == address(0)) revert InvalidTokenAddress();
        if (_rewardToken == address(0)) revert InvalidTokenAddress();

        STAKING_TOKEN = IERC20(_stakingToken);
        REWARD_TOKEN = RewardToken(_rewardToken);
    }

    ///////////////////
    /// Functions /////
    ///////////////////

    function stake(uint256 amount) external whenNotPaused nonReentrant {
        if (amount == 0) revert InvalidStakeAmount();

        UserInfo storage user = userInfo[msg.sender];

        // calculate and store pending rewards if user already staking
        if (user.stakedAmount > 0) {
            user.pendingRewards += calculateReward(msg.sender);
        }

        // reset the time - start measuring rewards from now
        user.lastRewardTime = block.timestamp;

        // transfer staking token from user to the contract
        bool success = STAKING_TOKEN.transferFrom(msg.sender, address(this), amount);
        if (!success) revert TransferFailed();

        user.stakedAmount += amount;
        totalStaked += amount;
    }

    function calculateReward(address user) internal view returns (uint256) {
        if (user == address(0)) revert InvalidUserAddress();
    }
}
