import {
	useAccount,
	useWaitForTransactionReceipt,
	useWriteContract,
} from 'wagmi';
import { CONTRACT_ADDRESSES, STAKING_ABI } from '../config/contracts';

export function useClaimRewards() {
	const { address } = useAccount();

	const { writeContract, isPending, data: hash, error } = useWriteContract();

	const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
		hash,
	});

	const claimReward = () => {
		writeContract({
			address: CONTRACT_ADDRESSES.staking as `0x${string}`,
			abi: STAKING_ABI,
			functionName: 'claimReward',
			account: address,
		});
	};

	return {
		claimReward,
		isPending,
		isConfirming,
		isSuccess,
		error,
	};
}
