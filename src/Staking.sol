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
    /// Events //////
    /////////////////

    event StakeAdded(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 amount);
    event RewardRateUpdate(uint256 newRate);
    event EmergencyWithdrawal(address indexed user, uint256 amount);

    /////////////////
    /// Errors //////
    /////////////////

    error InvalidTokenAddress();
    error InvalidStakeAmount();
    error TransferFailed();
    error InvalidUserAddress();
    error AmountToUnstakeExceedsStakedAmount();
    error RewardAmountIsZero();
    error ExcessiveRewardRate();
    error AmountToWithdrawExceedsStakedAmount();

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
    uint256 private dailyRewardRate = 1e17; // 10% annual reward rate - 0.1 * 1e18 = 1e17
    uint256 private constant MAX_REWARD_RATE = 2e17; // 20% annual reward rate - 0.2 * 1e18 = 2e17

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

    /**
     * @notice Stake tokens to earn rewards.
     * @param amount Amount of staking tokens to deposit (in wei).
     * @dev Calculates pending rewards, transfers tokens, and updates user balance.
     *      Protected by reentrancy guard and pausable modifier.
     * @custom:error InvalidStakeAmount if amount == 0
     * @custom:error TransferFailed if token transfer fails
     */
    function stake(uint256 amount) external whenNotPaused nonReentrant {
        // validate to ensure amount to stake is not 0
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

        // update balances
        user.stakedAmount += amount;
        totalStaked += amount;

        // emit event
        emit StakeAdded(msg.sender, amount);
    }

    /**
     * @notice Unstake tokens.
     * @param amount Amount of staking tokens to unstake.
     * @dev Calculates pending reward, removes stake, and updates balances.
     *      Protected by reentrancy guard and pausable modifier.
     * @custom:error InvalidStakeAmount if amount == 0.
     * @custom:error AmountToUnstakeExceedsStakedAmount if unstake amount is greater than staked amount.
     * @custom:error TransferFailed if token transfer fails.
     */
    function unstake(uint256 amount) external whenNotPaused nonReentrant {
        // validate to ensure amount to unstake is not 0
        if (amount == 0) revert InvalidStakeAmount();

        UserInfo storage user = userInfo[msg.sender];

        // validate to ensure user has enough staked before withdrawing
        if (amount > user.stakedAmount) revert AmountToUnstakeExceedsStakedAmount();

        // calculate and store pending rewards if user already staking
        if (user.stakedAmount > 0) {
            user.pendingRewards += calculateReward(msg.sender);
        }

        // reset time
        user.lastRewardTime = block.timestamp;

        // transfer users staked tokens from contract back to user
        bool success = STAKING_TOKEN.transfer(msg.sender, amount);
        if (!success) revert TransferFailed();

        // update balances
        user.stakedAmount -= amount;
        totalStaked -= amount;

        // emit event
        emit Unstaked(msg.sender, amount);
    }

    /**
     * @notice Claim accrued rewards from staking.
     * @dev Validates that pending rewards exist, mints reward tokens to the user,
     *      clears pending rewards balance, and resets the reward calculation timer.
     *      Protected by reentrancy guard and pausable modifier.
     * @custom:error RewardAmountIsZero if pendingRewards == 0.
     */
    function claimReward() external nonReentrant {
        UserInfo storage user = userInfo[msg.sender];

        // validate to ensure reward amount is not 0
        uint256 rewardAmount = user.pendingRewards;
        if (rewardAmount == 0) revert RewardAmountIsZero();

        // send reward to user
        REWARD_TOKEN.mint(msg.sender, rewardAmount);

        // clear pending rewards
        user.pendingRewards = 0;

        // reset time
        user.lastRewardTime = block.timestamp;

        // emit event
        emit RewardClaimed(msg.sender, rewardAmount);
    }

    /**
     * @notice View total pending rewards for a user.
     * @param _user The user address to check.
     * @return Total pending rewards in wei (stored + accrued since last calculation).
     * @dev Includes both claimed-but-not-withdrawn rewards and newly accrued earnings.
     * @custom:error InvalidUserAddress if _user is address(0).
     */
    function pendingRewards(address _user) external view returns (uint256) {
        if (_user == address(0)) revert InvalidUserAddress();

        UserInfo memory user = userInfo[_user];

        // calculate and store pending rewards if user already staking
        if (user.stakedAmount > 0) {
            user.pendingRewards += calculateReward(_user);
        }

        return user.pendingRewards;
    }

    /**
     * @notice Emergency withdrawal of staked tokens, bypassing the pause mechanism.
     * @param amount The amount of staking tokens to withdraw.
     * @dev Users forfeit all pending rewards for immediate principal recovery. Works even
     *      when contract is paused. Validates sufficient balance before transfer.
     * @custom:error InvalidStakeAmount if amount == 0.
     * @custom:error AmountToWithdrawExceedsStakedAmount if amount > staked balance.
     * @custom:error TransferFailed if token transfer fails.
     */
    function emergencyWithdrawal(uint256 amount) external nonReentrant {
        // validate to ensure amount to unstake is not 0
        if (amount == 0) revert InvalidStakeAmount();

        UserInfo storage user = userInfo[msg.sender];

        // validate to ensure user has enough staked before withdrawing
        if (amount > user.stakedAmount) revert AmountToWithdrawExceedsStakedAmount();

        // transfer users staked tokens from contract back to user
        bool success = STAKING_TOKEN.transfer(msg.sender, amount);
        if (!success) revert TransferFailed();

        // update balances
        user.stakedAmount -= amount;
        totalStaked -= amount;

        // emit event
        emit EmergencyWithdrawal(msg.sender, amount);
    }

    /**
     * @notice Calculates accrued rewards for a user based on stake amount and time elapsed.
     * @param _user The address of the user.
     * @return Reward amount in wei earned since last calculation.
     * @dev Uses 10% APY with formula: (stakedAmount × timeElapsed × rate) / (365 × 1e18).
     *      Multiplies before dividing to preserve precision.
     * @custom:error InvalidUserAddress if _user is address(0).
     */
    function calculateReward(address _user) internal view returns (uint256) {
        if (_user == address(0)) revert InvalidUserAddress();

        UserInfo memory user = userInfo[_user];

        // time elapsed since last reward calculation
        uint256 timeElapsed = block.timestamp - user.lastRewardTime;

        uint256 reward = (user.stakedAmount * timeElapsed * dailyRewardRate) / (365 * 1e18);

        return reward;
    }

    /**
     * @notice Update the annual reward rate (owner only).
     * @param newRate The new reward rate in wei (capped at 20% APY).
     * @dev Validates that newRate > 0 and newRate <= MAX_REWARD_RATE. Affects only
     *      future reward calculations.
     * @custom:error ExcessiveRewardRate if newRate is invalid or exceeds the maximum.
     */
    function setRewardRate(uint256 newRate) external onlyOwner {
        if (newRate == 0 || newRate > MAX_REWARD_RATE) revert ExcessiveRewardRate();

        dailyRewardRate = newRate;

        emit RewardRateUpdate(newRate);
    }

    /**
     * @notice Pause staking and unstaking (emergency only).
     * @dev Only owner. Users can still claim rewards and emergency withdraw.
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Resume staking and unstaking.
     * @dev Only owner.
     */
    function unpause() external onlyOwner {
        _unpause();
    }
}
