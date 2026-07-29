/**
 * Staking contract types
 * These match the Solidity struct definitions
 */

export interface UserInfo {
	stakedAmount: bigint;
	lastRewardTime: bigint;
	pendingRewards: bigint;
}
