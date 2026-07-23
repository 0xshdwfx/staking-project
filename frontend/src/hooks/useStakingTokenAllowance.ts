import { useReadContract, useAccount } from 'wagmi';
import { CONTRACT_ADDRESSES, STAKING_TOKEN_ABI } from '../config/contracts';

export function useStakingTokenAllowance() {
	const { address } = useAccount();

	const { data: allowance, refetch } = useReadContract({
		address: CONTRACT_ADDRESSES.stakingToken as `0x${string}`,
		abi: STAKING_TOKEN_ABI,
		functionName: 'allowance',
		args: [address, CONTRACT_ADDRESSES.staking],
		query: {
			enabled: !!address,
			refetchInterval: 1000, // Refetch every 1 second (was 2000)
			refetchOnMount: true, // Always refetch when component mounts
			refetchOnWindowFocus: true, // Refetch when window regains focus
		},
	}) as any;

	return {
		allowance: allowance as bigint | undefined,
		refetch,
	};
}
