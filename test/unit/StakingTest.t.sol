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
}
