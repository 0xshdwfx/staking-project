import { useReadContract, useAccount } from 'wagmi';
import { CONTRACT_ADDRESSES, STAKING_TOKEN_ABI } from '../config/contracts';

export function useStakingTokenBalance() {
	const { address } = useAccount();

	const {
		data: balance,
		isLoading,
		error,
		refetch,
	} = useReadContract({
		address: CONTRACT_ADDRESSES.stakingToken as `0x${string}`,
		abi: STAKING_TOKEN_ABI,
		functionName: 'balanceOf',
		args: [address],
		query: {
			enabled: !!address, // Only query if address exists
			refetchInterval: 3000, // Refetch every 3 seconds
		},
	});

	return {
		stakingTokenBalance: balance as bigint | undefined,
		isLoading,
		error,
		refetch,
	};
}
