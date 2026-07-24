import {
	useWriteContract,
	useAccount,
	useWaitForTransactionReceipt,
} from 'wagmi';
import { CONTRACT_ADDRESSES, STAKING_ABI } from '../config/contracts';

export function useStake() {
	const { address } = useAccount();

	const { writeContract, isPending, data: hash, error } = useWriteContract();

	// This waits for the actual transaction receipt (mined on blockchain)
	const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
		hash,
	});

	const stake = (amount: bigint) => {
		writeContract({
			address: CONTRACT_ADDRESSES.staking as `0x${string}`,
			abi: STAKING_ABI,
			functionName: 'stake',
			args: [amount],
			account: address,
		});
	};

	return {
		stake,
		isPending,
		isConfirming,
		isSuccess,
		error,
	};
}
