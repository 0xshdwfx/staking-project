// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Script} from "forge-std/Script.sol";
import {StakingToken} from "../src/StakingToken.sol";
import {RewardToken} from "../src/RewardToken.sol";
import {Staking} from "../src/Staking.sol";
import {console} from "forge-std/console.sol";

contract DeployScript is Script {
    function run() external {
        vm.startBroadcast();

        // Deploy StakingToken
        StakingToken stakingToken = new StakingToken();

        // Deploy RewardToken
        RewardToken rewardToken = new RewardToken();

        // Deploy Staking with token addresses
        Staking staking = new Staking(address(stakingToken), address(rewardToken));

        vm.stopBroadcast();

        // Log addresses for reference
        console.log("StakingToken deployed at:", address(stakingToken));
        console.log("RewardToken deployed at:", address(rewardToken));
        console.log("Staking deployed at:", address(staking));
    }
}
