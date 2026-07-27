import { useReadContract, useAccount } from 'wagmi';
import { CONTRACT_ADDRESSES, REWARD_TOKEN_ABI } from '../config/contracts';

export function useRewardTokenBalance() {
	const { address } = useAccount();

	const {
		data: balance,
		isLoading,
		error,
		refetch,
	} = useReadContract({
		address: CONTRACT_ADDRESSES.rewardToken as `0x${string}`,
		abi: REWARD_TOKEN_ABI,
		functionName: 'balanceOf',
		args: [address],
		query: {
			enabled: !!address, // Only query if address exists
			refetchInterval: 3000, // Refetch every 3 seconds
		},
	});

	return {
		rewardTokenBalance: balance as bigint | undefined,
		isLoading,
		error,
		refetch,
	};
}
