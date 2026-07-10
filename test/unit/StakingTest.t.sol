// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Test} from "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {Staking} from "src/Staking.sol";
import {RewardToken} from "src/RewardToken.sol";
import {ERC20Mock} from "@openzeppelin/contracts/mocks/token/ERC20Mock.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";

contract StakingTest is Test {
    ERC20Mock stakingToken;
    RewardToken public rewardToken;
    Staking public staking;

    // test user
    address public user = makeAddr("user");
    uint256 public constant STARTING_USER_BALANCE = 10e18;
    uint256 public constant USER_STAKE_AMOUNT = 1e18;
    uint256 public constant USER_UNSTAKE_AMOUNT = 1e18;
    uint256 public constant USER_EMERGENCY_WITHDRAWAL_AMOUNT = 2e18;

    // events
    event StakeAdded(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 amount);
    event EmergencyWithdrawal(address indexed user, uint256 amount);

    // set up
    function setUp() public {
        stakingToken = new ERC20Mock();
        rewardToken = new RewardToken();
        staking = new Staking(address(stakingToken), address(rewardToken));

        stakingToken.mint(user, STARTING_USER_BALANCE);

        vm.prank(user);
        stakingToken.approve(address(staking), type(uint256).max); // type(uint256).max - testing purposes only
        rewardToken.transferOwnership(address(staking)); // purely for testing purposes to allow Staking contract to call mint()
    }

    ///////////////////
    ///// Stake ///////
    ///////////////////

    function testStakeRevertsIfAmountIsZero() public {
        vm.prank(user);
        vm.expectRevert(Staking.Staking__InvalidStakeAmount.selector);
        staking.stake(0);
    }

    function testIfPendingRewardsAreStoredIfUserIsAlreadyStaking() public {
        // first stake
        vm.prank(user);
        staking.stake(USER_STAKE_AMOUNT); // 1 token

        // advance the time
        vm.warp(block.timestamp + 1 days); // 1 = 1 day

        // calculate expected reward before second stake
        uint256 expectedReward = staking.calculateReward(user);

        // second stake
        vm.prank(user);
        staking.stake(USER_STAKE_AMOUNT);

        // check pending rewards
        Staking.UserInfo memory userInfo = staking.getUserInfo(user);
        assertEq(userInfo.pendingRewards, expectedReward);
    }

    function testLastRewardTimeIsResetAfterStake() public {
        // first stake
        vm.prank(user);
        staking.stake(USER_STAKE_AMOUNT);

        vm.warp(block.timestamp + 1 days);

        // second stake
        vm.prank(user);
        staking.stake(USER_STAKE_AMOUNT);

        Staking.UserInfo memory userInfo = staking.getUserInfo(user);
        assertEq(userInfo.lastRewardTime, block.timestamp);
    }

    function testUserStakesExactAmount() public {
        vm.prank(user);

        staking.stake(USER_STAKE_AMOUNT);

        Staking.UserInfo memory userInfoAfterStake = staking.getUserInfo(user);
        uint256 userBalanceAfterStake = userInfoAfterStake.stakedAmount;

        assertEq(userBalanceAfterStake, USER_STAKE_AMOUNT);
    }

    function testStakingTokenIsTransferredFromUserToContract() public {
        vm.startPrank(user);

        uint256 stakingTokenBalanceBeforeStake = stakingToken.balanceOf(address(staking));
        uint256 userBalanceBeforeStake = stakingToken.balanceOf(user);

        staking.stake(USER_STAKE_AMOUNT);

        uint256 stakingTokenBalanceAfterStake = stakingToken.balanceOf(address(staking));
        uint256 userBalanceAfterStake = stakingToken.balanceOf(user);

        vm.stopPrank();

        assertEq(
            stakingTokenBalanceAfterStake,
            stakingTokenBalanceBeforeStake + USER_STAKE_AMOUNT,
            "contract stakingToken balance should increase by exactly USER_STAKE_AMOUNT"
        );
        assertEq(
            userBalanceAfterStake,
            userBalanceBeforeStake - USER_STAKE_AMOUNT,
            "user stakingToken balance should decrease by exactly USER_STAKE_AMOUNT"
        );
    }

    function testTotalStakedIncreasesAfterUserStakes() public {
        vm.startPrank(user);

        uint256 totalStakedAmountBeforeUserStake = staking.getTotalStaked();

        staking.stake(USER_STAKE_AMOUNT);

        uint256 totalStakedAmountAfterUserStake = staking.getTotalStaked();

        vm.stopPrank();

        assertEq(
            totalStakedAmountAfterUserStake,
            totalStakedAmountBeforeUserStake + USER_STAKE_AMOUNT,
            "totalStaked should increase by exactly USER_STAKE_AMOUNT"
        );
    }

    function testRevertWhenContractIsPaused() public {
        staking.pause();

        vm.prank(user);

        vm.expectRevert(Pausable.EnforcedPause.selector);
        staking.stake(USER_STAKE_AMOUNT);
    }

    function testAddingStakeEmitsEvent() public {
        vm.prank(user);

        vm.expectEmit(true, false, false, true, address(staking));
        emit StakeAdded(user, USER_STAKE_AMOUNT);

        staking.stake(USER_STAKE_AMOUNT);
    }

    /////////////////////
    ////// Unstake //////
    /////////////////////

    function testUnstakeRevertsIfAmountIsZero() public {
        vm.prank(user);
        vm.expectRevert(Staking.Staking__InvalidStakeAmount.selector);
        staking.unstake(0);
    }

    function testUserHasEnoughStakedBeforeUnstaking() public {
        vm.prank(user);
        staking.stake(USER_STAKE_AMOUNT);

        vm.expectRevert(Staking.Staking__AmountToUnstakeExceedsStakedAmount.selector);
        staking.unstake(USER_UNSTAKE_AMOUNT);
    }

    function testUsersStakedAmountDecreasesAfterUnstake() public {
        vm.startPrank(user);
        staking.stake(USER_STAKE_AMOUNT);

        Staking.UserInfo memory userInfoBeforeUnstake = staking.getUserInfo(user);
        uint256 userStakedAmountBeforeUnstake = userInfoBeforeUnstake.stakedAmount;

        staking.unstake(USER_UNSTAKE_AMOUNT);

        Staking.UserInfo memory userInfoAfterUnstake = staking.getUserInfo(user);
        uint256 userStakedAmountAfterUnstake = userInfoAfterUnstake.stakedAmount;

        vm.stopPrank();

        assertEq(
            userStakedAmountAfterUnstake,
            userStakedAmountBeforeUnstake - USER_UNSTAKE_AMOUNT,
            "User staked amount should decrease by exactly USER_UNSTAKE_AMOUNT"
        );
    }

    function testTotalStakedDecreasesAfterUserUnstakes() public {
        vm.startPrank(user);
        staking.stake(USER_STAKE_AMOUNT);

        uint256 totalStakedAmountBeforeUserUnstake = staking.getTotalStaked();

        staking.unstake(USER_UNSTAKE_AMOUNT);

        uint256 totalStakedAmountAfterUserUnstake = staking.getTotalStaked();

        vm.stopPrank();

        assertEq(
            totalStakedAmountAfterUserUnstake,
            totalStakedAmountBeforeUserUnstake - USER_UNSTAKE_AMOUNT,
            "totalStaked should decrease by exactly USER_UNSTAKE_AMOUNT"
        );
    }

    function testUnstakingEmitsEvent() public {
        vm.startPrank(user);
        staking.stake(USER_STAKE_AMOUNT);

        vm.expectEmit(true, false, false, true, address(staking));
        emit Unstaked(user, USER_UNSTAKE_AMOUNT);

        staking.unstake(USER_UNSTAKE_AMOUNT);

        vm.stopPrank();
    }

    /////////////////////
    //// ClaimReward ////
    /////////////////////

    function testClaimRewardsRevertsIfRewardAmountIsZero() public {
        vm.prank(user);
        vm.expectRevert(Staking.Staking__RewardAmountIsZero.selector);
        staking.claimReward();
    }

    function testRewardSentToUser() public {
        vm.startPrank(user);
        staking.stake(USER_STAKE_AMOUNT);

        vm.warp(block.timestamp + 1 days);
        staking.stake(USER_STAKE_AMOUNT);

        uint256 userTokenBalanceBeforeClaiming = rewardToken.balanceOf(user);

        staking.claimReward();

        uint256 userTokenBalanceAfterClaiming = rewardToken.balanceOf(user);

        vm.stopPrank();

        assertGt(userTokenBalanceAfterClaiming, userTokenBalanceBeforeClaiming);
    }

    function testPendingRewardsIsResetToZero() public {
        vm.startPrank(user);
        staking.stake(USER_STAKE_AMOUNT);

        vm.warp(block.timestamp + 1 days);
        staking.stake(USER_STAKE_AMOUNT);

        staking.claimReward();

        Staking.UserInfo memory userInfoAfterClaimReward = staking.getUserInfo(user);

        vm.stopPrank();

        assertEq(userInfoAfterClaimReward.pendingRewards, 0, "pendingRewards should be reset to zero after claiming");
    }

    function testClaimRewardEmitsRewardClaimedEvent() public {
        vm.startPrank(user);
        staking.stake(USER_STAKE_AMOUNT);

        vm.warp(block.timestamp + 1 days);
        staking.stake(USER_STAKE_AMOUNT);

        Staking.UserInfo memory userInfo = staking.getUserInfo(user);
        uint256 pendingRewardsAmount = userInfo.pendingRewards;

        vm.expectEmit(true, false, false, true, address(staking));
        emit RewardClaimed(user, pendingRewardsAmount);

        staking.claimReward();

        vm.stopPrank();
    }

    /////////////////////////
    //// PendingRewards ////
    //////////////////////

    function testPendingRewardsRevertsIfUserDoesNotExist() public {
        vm.prank(user);
        vm.expectRevert(Staking.Staking__InvalidUserAddress.selector);
        staking.pendingRewards(address(0));
    }

    function testPendingRewardsReturnsStoredAmount() public {
        vm.startPrank(user);
        staking.stake(USER_STAKE_AMOUNT);

        vm.warp(block.timestamp + 1 days);
        staking.stake(USER_STAKE_AMOUNT);

        Staking.UserInfo memory userInfo = staking.getUserInfo(user);
        uint256 userPendingRewards = userInfo.pendingRewards;

        uint256 pendingRewardsReturnedAmount = staking.pendingRewards(user);

        vm.stopPrank();

        assertEq(pendingRewardsReturnedAmount, userPendingRewards);
    }

    /////////////////////////////
    //// EmergencyWithdrawal ////
    ////////////////////////////

    function testRevertIfAmountToWithdrawIsZero() public {
        vm.prank(user);
        vm.expectRevert(Staking.Staking__InvalidStakeAmount.selector);
        staking.emergencyWithdrawal(0);
    }

    function testRevertIfAmountToWithdrawExceedsStakedAmount() public {
        vm.prank(user);
        staking.stake(USER_STAKE_AMOUNT);

        vm.expectRevert(Staking.Staking__AmountToWithdrawExceedsStakedAmount.selector);
        staking.emergencyWithdrawal(USER_EMERGENCY_WITHDRAWAL_AMOUNT);
    }

    function testEmergencyWithdrawalEmitsEvent() public {
        vm.startPrank(user);
        staking.stake(USER_STAKE_AMOUNT);

        Staking.UserInfo memory userInfo = staking.getUserInfo(user);
        uint256 userStakedAmount = userInfo.stakedAmount;

        vm.expectEmit(true, false, false, true, address(staking));
        emit EmergencyWithdrawal(user, userStakedAmount);

        staking.emergencyWithdrawal(userStakedAmount);

        vm.stopPrank();
    }

    //////////////////////////
    //// CalculateReward ////
    ////////////////////////

    function testCalculateRewardsRevertsIfUserDoesNotExist() public {
        vm.prank(user);
        vm.expectRevert(Staking.Staking__InvalidUserAddress.selector);
        staking.calculateReward(address(0));
    }
}
