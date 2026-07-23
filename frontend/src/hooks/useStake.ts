import { useWriteContract, useAccount } from 'wagmi';
import { CONTRACT_ADDRESSES, STAKING_ABI } from '../config/contracts';

export function useStake() {
	const { address } = useAccount();

	const { writeContract, isPending, isSuccess, error } = useWriteContract();

	const stake = (amount: bigint) => {
		writeContract({
			address: CONTRACT_ADDRESSES.staking as `0x${string}`,
			abi: STAKING_ABI,
			functionName: 'stake',
			args: [amount],
			account: address,
			gas: 600_000n,
		});
	};

	return {
		stake,
		isPending,
		isSuccess,
		error,
	};
}
