import { useReadContract, useAccount } from 'wagmi';
import { CONTRACT_ADDRESSES, STAKING_ABI } from '../config/contracts';

export function usePendingRewards() {
	const { address } = useAccount();

	const {
		data: pendingRewards,
		isLoading,
		error,
	} = useReadContract({
		address: CONTRACT_ADDRESSES.staking as `0x${string}`,
		abi: STAKING_ABI,
		functionName: 'pendingRewards',
		args: [address],
		query: {
			enabled: !!address, // Only query if address exists
		},
	});

	return {
		pendingRewards: pendingRewards as bigint | undefined,
		isLoading,
		error,
	};
}
