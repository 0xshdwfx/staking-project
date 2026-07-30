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
			refetchInterval: 1000,
			refetchOnMount: true,
			refetchOnWindowFocus: true,
		},
	}) as {
		data?: bigint;
		refetch: Function;
	};

	return {
		allowance: allowance as bigint | undefined,
		refetch,
	};
}
