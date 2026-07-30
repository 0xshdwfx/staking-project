import { useReadContract } from 'wagmi';
import { CONTRACT_ADDRESSES, REWARD_TOKEN_ABI } from '../config/contracts';

export function useRewardTokenSymbol() {
	const {
		data: symbol,
		isLoading,
		error,
	} = useReadContract({
		address: CONTRACT_ADDRESSES.rewardToken as `0x${string}`,
		abi: REWARD_TOKEN_ABI,
		functionName: 'symbol',
	}) as {
		data?: string;
		isLoading: boolean;
		error: unknown;
	};

	return {
		symbol: symbol || 'RWT', // default ot 'RWT' if not loaded
		isLoading,
		error,
	};
}
