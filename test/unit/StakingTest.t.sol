// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Test} from "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {Staking} from "src/Staking.sol";
import {RewardToken} from "src/RewardToken.sol";
import {ERC20Mock} from "@openzeppelin/contracts/mocks/token/ERC20Mock.sol";

contract StakingTest is Test {
    ERC20Mock stakingToken;
    RewardToken public rewardToken;
    Staking public staking;

    // test user
    address public user = makeAddr("user");
    uint256 public constant STARTING_USER_BALANCE = 10e18;
    uint256 public constant USER_STAKE_AMOUNT = 1e18;

    function setUp() public {
        stakingToken = new ERC20Mock();
        rewardToken = new RewardToken();
        staking = new Staking(address(stakingToken), address(rewardToken));

        stakingToken.mint(user, STARTING_USER_BALANCE);

        vm.prank(user);
        stakingToken.approve(address(staking), type(uint256).max); // type(uint256).max - testing purposes only
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
}
