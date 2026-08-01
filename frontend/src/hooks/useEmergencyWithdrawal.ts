import {
	useAccount,
	useWaitForTransactionReceipt,
	useWriteContract,
} from 'wagmi';
import { CONTRACT_ADDRESSES, STAKING_ABI } from '../config/contracts';

export function useEmergencyWithdrawal() {
	const { address } = useAccount();

	const { writeContract, isPending, data: hash, error } = useWriteContract();

	const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
		hash,
	});

	const emergencyWithdrawal = (amount: bigint) => {
		writeContract({
			address: CONTRACT_ADDRESSES.staking as `0x${string}`,
			abi: STAKING_ABI,
			functionName: 'emergencyWithdrawal',
			args: [amount],
			account: address,
		});
	};

	return {
		emergencyWithdrawal,
		isPending,
		isConfirming,
		isSuccess,
		error,
	};
}
