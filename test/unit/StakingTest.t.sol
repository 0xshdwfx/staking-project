// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Test} from "forge-std/Test.sol";
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
        staking.stake(1e18); // 1 token

        // advance the time
        vm.warp(block.timestamp + 1 days); // 1 = 1 day

        // calculate expected reward before second stake
        uint256 expectedReward = staking.calculateReward(user);

        // second stake
        vm.prank(user);
        staking.stake(1e18);

        // check pending rewards
        Staking.UserInfo memory userInfo = staking.getUserInfo(user);
        assertEq(userInfo.pendingRewards, expectedReward);
    }
}
