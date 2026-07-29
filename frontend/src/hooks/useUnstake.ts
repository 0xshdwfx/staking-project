import {
	useWriteContract,
	useAccount,
	useWaitForTransactionReceipt,
} from 'wagmi';
import { CONTRACT_ADDRESSES, STAKING_ABI } from '../config/contracts';

export function useUnstake() {
	const { address } = useAccount();

	const { writeContract, isPending, data: hash, error } = useWriteContract();

	const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
		hash,
	});

	const unstake = (amount: bigint) => {
		writeContract({
			address: CONTRACT_ADDRESSES.staking as `0x${string}`,
			abi: STAKING_ABI,
			functionName: 'unstake',
			args: [amount],
			account: address,
		});
	};

	return {
		unstake,
		isPending,
		isConfirming,
		isSuccess,
		error,
	};
}
