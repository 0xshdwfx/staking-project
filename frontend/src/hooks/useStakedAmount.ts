import { useReadContract, useAccount } from 'wagmi';
import { CONTRACT_ADDRESSES, STAKING_ABI } from '../config/contracts';

export function useStakedAmount() {
	const { address } = useAccount();

	const {
		data: userInfo,
		isLoading,
		error,
		refetch,
	} = useReadContract({
		address: CONTRACT_ADDRESSES.staking as `0x${string}`,
		abi: STAKING_ABI,
		functionName: 'getUserInfo',
		args: [address],
		query: {
			enabled: !!address, // Only query if address exists
			refetchInterval: 3000, // Refetch every 3 seconds
		},
	}) as any;

	// extract stakedAmount field from the returned struct
	const stakedAmount = userInfo?.stakedAmount;

	return {
		stakedAmount: stakedAmount as bigint | undefined,
		isLoading,
		error,
		refetch,
	};
}
