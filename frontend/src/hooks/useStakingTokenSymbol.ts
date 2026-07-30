import { useReadContract } from 'wagmi';
import { CONTRACT_ADDRESSES, STAKING_TOKEN_ABI } from '../config/contracts';

export function useStakingTokenSymbol() {
	const {
		data: symbol,
		isLoading,
		error,
	} = useReadContract({
		address: CONTRACT_ADDRESSES.staking as `0x${string}`,
		abi: STAKING_TOKEN_ABI,
		functionName: 'symbol',
	}) as {
		data?: string;
		isLoading: boolean;
		error: unknown;
	};

	return {
		symbol: symbol || 'STK', // default ot 'STK' if not loaded
		isLoading,
		error,
	};
}
