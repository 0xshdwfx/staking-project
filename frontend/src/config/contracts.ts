// Contract addresses from the Sepolia deployment
export const CONTRACT_ADDRESSES = {
	stakingToken: '0x25acb9c2b27d0aa9d31c7b8a167febb9eebe5227',
	rewardToken: '0xf44990c151774f3acf6ef02178b8715d4abe02ad',
	staking: '0x51b67fd7c068c0acf798b5255422f4ac47df9268',
};

// ABIs from the compiled contracts
export const STAKING_ABI = [
	{
		type: 'constructor',
		inputs: [
			{
				name: '_stakingToken',
				type: 'address',
				internalType: 'address',
			},
			{ name: '_rewardToken', type: 'address', internalType: 'address' },
		],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'REWARD_TOKEN',
		inputs: [],
		outputs: [
			{
				name: '',
				type: 'address',
				internalType: 'contract RewardToken',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'STAKING_TOKEN',
		inputs: [],
		outputs: [{ name: '', type: 'address', internalType: 'contract IERC20' }],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'calculateReward',
		inputs: [{ name: '_user', type: 'address', internalType: 'address' }],
		outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'claimReward',
		inputs: [],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'dailyRewardRate',
		inputs: [],
		outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'emergencyWithdrawal',
		inputs: [{ name: 'amount', type: 'uint256', internalType: 'uint256' }],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'getDailyRewardRate',
		inputs: [],
		outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'getTotalStaked',
		inputs: [],
		outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'getUserInfo',
		inputs: [{ name: '_user', type: 'address', internalType: 'address' }],
		outputs: [
			{
				name: '',
				type: 'tuple',
				internalType: 'struct Staking.UserInfo',
				components: [
					{
						name: 'stakedAmount',
						type: 'uint256',
						internalType: 'uint256',
					},
					{
						name: 'lastRewardTime',
						type: 'uint256',
						internalType: 'uint256',
					},
					{
						name: 'pendingRewards',
						type: 'uint256',
						internalType: 'uint256',
					},
				],
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'owner',
		inputs: [],
		outputs: [{ name: '', type: 'address', internalType: 'address' }],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'pause',
		inputs: [],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'paused',
		inputs: [],
		outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'pendingRewards',
		inputs: [{ name: '_user', type: 'address', internalType: 'address' }],
		outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'renounceOwnership',
		inputs: [],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'setRewardRate',
		inputs: [{ name: 'newRate', type: 'uint256', internalType: 'uint256' }],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'stake',
		inputs: [{ name: 'amount', type: 'uint256', internalType: 'uint256' }],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'totalStaked',
		inputs: [],
		outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'transferOwnership',
		inputs: [{ name: 'newOwner', type: 'address', internalType: 'address' }],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'unpause',
		inputs: [],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'unstake',
		inputs: [{ name: 'amount', type: 'uint256', internalType: 'uint256' }],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'userInfo',
		inputs: [{ name: '', type: 'address', internalType: 'address' }],
		outputs: [
			{
				name: 'stakedAmount',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'lastRewardTime',
				type: 'uint256',
				internalType: 'uint256',
			},
			{
				name: 'pendingRewards',
				type: 'uint256',
				internalType: 'uint256',
			},
		],
		stateMutability: 'view',
	},
	{
		type: 'event',
		name: 'EmergencyWithdrawal',
		inputs: [
			{
				name: 'user',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
			{
				name: 'amount',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'OwnershipTransferred',
		inputs: [
			{
				name: 'previousOwner',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
			{
				name: 'newOwner',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'Paused',
		inputs: [
			{
				name: 'account',
				type: 'address',
				indexed: false,
				internalType: 'address',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'RewardClaimed',
		inputs: [
			{
				name: 'user',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
			{
				name: 'amount',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'RewardRateUpdate',
		inputs: [
			{
				name: 'newRate',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'StakeAdded',
		inputs: [
			{
				name: 'user',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
			{
				name: 'amount',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'Unpaused',
		inputs: [
			{
				name: 'account',
				type: 'address',
				indexed: false,
				internalType: 'address',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'Unstaked',
		inputs: [
			{
				name: 'user',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
			{
				name: 'amount',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
		],
		anonymous: false,
	},
	{ type: 'error', name: 'EnforcedPause', inputs: [] },
	{ type: 'error', name: 'ExpectedPause', inputs: [] },
	{
		type: 'error',
		name: 'OwnableInvalidOwner',
		inputs: [{ name: 'owner', type: 'address', internalType: 'address' }],
	},
	{
		type: 'error',
		name: 'OwnableUnauthorizedAccount',
		inputs: [{ name: 'account', type: 'address', internalType: 'address' }],
	},
	{ type: 'error', name: 'ReentrancyGuardReentrantCall', inputs: [] },
	{
		type: 'error',
		name: 'Staking__AmountToUnstakeExceedsStakedAmount',
		inputs: [],
	},
	{
		type: 'error',
		name: 'Staking__AmountToWithdrawExceedsStakedAmount',
		inputs: [],
	},
	{ type: 'error', name: 'Staking__ExcessiveRewardRate', inputs: [] },
	{ type: 'error', name: 'Staking__InvalidStakeAmount', inputs: [] },
	{ type: 'error', name: 'Staking__InvalidTokenAddress', inputs: [] },
	{ type: 'error', name: 'Staking__InvalidUserAddress', inputs: [] },
	{ type: 'error', name: 'Staking__RewardAmountIsZero', inputs: [] },
	{ type: 'error', name: 'Staking__TransferFailed', inputs: [] },
];

export const REWARD_TOKEN_ABI = [
	{ type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
	{
		type: 'function',
		name: 'allowance',
		inputs: [
			{ name: 'owner', type: 'address', internalType: 'address' },
			{ name: 'spender', type: 'address', internalType: 'address' },
		],
		outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'approve',
		inputs: [
			{ name: 'spender', type: 'address', internalType: 'address' },
			{ name: 'value', type: 'uint256', internalType: 'uint256' },
		],
		outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'balanceOf',
		inputs: [{ name: 'account', type: 'address', internalType: 'address' }],
		outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'decimals',
		inputs: [],
		outputs: [{ name: '', type: 'uint8', internalType: 'uint8' }],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'mint',
		inputs: [
			{ name: 'to', type: 'address', internalType: 'address' },
			{ name: 'amount', type: 'uint256', internalType: 'uint256' },
		],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'name',
		inputs: [],
		outputs: [{ name: '', type: 'string', internalType: 'string' }],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'owner',
		inputs: [],
		outputs: [{ name: '', type: 'address', internalType: 'address' }],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'renounceOwnership',
		inputs: [],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'symbol',
		inputs: [],
		outputs: [{ name: '', type: 'string', internalType: 'string' }],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'totalSupply',
		inputs: [],
		outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'transfer',
		inputs: [
			{ name: 'to', type: 'address', internalType: 'address' },
			{ name: 'value', type: 'uint256', internalType: 'uint256' },
		],
		outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'transferFrom',
		inputs: [
			{ name: 'from', type: 'address', internalType: 'address' },
			{ name: 'to', type: 'address', internalType: 'address' },
			{ name: 'value', type: 'uint256', internalType: 'uint256' },
		],
		outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'transferOwnership',
		inputs: [{ name: 'newOwner', type: 'address', internalType: 'address' }],
		outputs: [],
		stateMutability: 'nonpayable',
	},
	{
		type: 'event',
		name: 'Approval',
		inputs: [
			{
				name: 'owner',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
			{
				name: 'spender',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
			{
				name: 'value',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'OwnershipTransferred',
		inputs: [
			{
				name: 'previousOwner',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
			{
				name: 'newOwner',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'Transfer',
		inputs: [
			{
				name: 'from',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
			{
				name: 'to',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
			{
				name: 'value',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
		],
		anonymous: false,
	},
	{
		type: 'error',
		name: 'ERC20InsufficientAllowance',
		inputs: [
			{ name: 'spender', type: 'address', internalType: 'address' },
			{ name: 'allowance', type: 'uint256', internalType: 'uint256' },
			{ name: 'needed', type: 'uint256', internalType: 'uint256' },
		],
	},
	{
		type: 'error',
		name: 'ERC20InsufficientBalance',
		inputs: [
			{ name: 'sender', type: 'address', internalType: 'address' },
			{ name: 'balance', type: 'uint256', internalType: 'uint256' },
			{ name: 'needed', type: 'uint256', internalType: 'uint256' },
		],
	},
	{
		type: 'error',
		name: 'ERC20InvalidApprover',
		inputs: [{ name: 'approver', type: 'address', internalType: 'address' }],
	},
	{
		type: 'error',
		name: 'ERC20InvalidReceiver',
		inputs: [{ name: 'receiver', type: 'address', internalType: 'address' }],
	},
	{
		type: 'error',
		name: 'ERC20InvalidSender',
		inputs: [{ name: 'sender', type: 'address', internalType: 'address' }],
	},
	{
		type: 'error',
		name: 'ERC20InvalidSpender',
		inputs: [{ name: 'spender', type: 'address', internalType: 'address' }],
	},
	{
		type: 'error',
		name: 'OwnableInvalidOwner',
		inputs: [{ name: 'owner', type: 'address', internalType: 'address' }],
	},
	{
		type: 'error',
		name: 'OwnableUnauthorizedAccount',
		inputs: [{ name: 'account', type: 'address', internalType: 'address' }],
	},
];

export const STAKING_TOKEN_ABI = [
	{ type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
	{
		type: 'function',
		name: 'allowance',
		inputs: [
			{ name: 'owner', type: 'address', internalType: 'address' },
			{ name: 'spender', type: 'address', internalType: 'address' },
		],
		outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'approve',
		inputs: [
			{ name: 'spender', type: 'address', internalType: 'address' },
			{ name: 'value', type: 'uint256', internalType: 'uint256' },
		],
		outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'balanceOf',
		inputs: [{ name: 'account', type: 'address', internalType: 'address' }],
		outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'decimals',
		inputs: [],
		outputs: [{ name: '', type: 'uint8', internalType: 'uint8' }],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'name',
		inputs: [],
		outputs: [{ name: '', type: 'string', internalType: 'string' }],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'symbol',
		inputs: [],
		outputs: [{ name: '', type: 'string', internalType: 'string' }],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'totalSupply',
		inputs: [],
		outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
		stateMutability: 'view',
	},
	{
		type: 'function',
		name: 'transfer',
		inputs: [
			{ name: 'to', type: 'address', internalType: 'address' },
			{ name: 'value', type: 'uint256', internalType: 'uint256' },
		],
		outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
		stateMutability: 'nonpayable',
	},
	{
		type: 'function',
		name: 'transferFrom',
		inputs: [
			{ name: 'from', type: 'address', internalType: 'address' },
			{ name: 'to', type: 'address', internalType: 'address' },
			{ name: 'value', type: 'uint256', internalType: 'uint256' },
		],
		outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
		stateMutability: 'nonpayable',
	},
	{
		type: 'event',
		name: 'Approval',
		inputs: [
			{
				name: 'owner',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
			{
				name: 'spender',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
			{
				name: 'value',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
		],
		anonymous: false,
	},
	{
		type: 'event',
		name: 'Transfer',
		inputs: [
			{
				name: 'from',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
			{
				name: 'to',
				type: 'address',
				indexed: true,
				internalType: 'address',
			},
			{
				name: 'value',
				type: 'uint256',
				indexed: false,
				internalType: 'uint256',
			},
		],
		anonymous: false,
	},
	{
		type: 'error',
		name: 'ERC20InsufficientAllowance',
		inputs: [
			{ name: 'spender', type: 'address', internalType: 'address' },
			{ name: 'allowance', type: 'uint256', internalType: 'uint256' },
			{ name: 'needed', type: 'uint256', internalType: 'uint256' },
		],
	},
	{
		type: 'error',
		name: 'ERC20InsufficientBalance',
		inputs: [
			{ name: 'sender', type: 'address', internalType: 'address' },
			{ name: 'balance', type: 'uint256', internalType: 'uint256' },
			{ name: 'needed', type: 'uint256', internalType: 'uint256' },
		],
	},
	{
		type: 'error',
		name: 'ERC20InvalidApprover',
		inputs: [{ name: 'approver', type: 'address', internalType: 'address' }],
	},
	{
		type: 'error',
		name: 'ERC20InvalidReceiver',
		inputs: [{ name: 'receiver', type: 'address', internalType: 'address' }],
	},
	{
		type: 'error',
		name: 'ERC20InvalidSender',
		inputs: [{ name: 'sender', type: 'address', internalType: 'address' }],
	},
	{
		type: 'error',
		name: 'ERC20InvalidSpender',
		inputs: [{ name: 'spender', type: 'address', internalType: 'address' }],
	},
];
