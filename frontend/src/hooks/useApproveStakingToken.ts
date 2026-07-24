import { useWriteContract, useAccount } from 'wagmi';
import { CONTRACT_ADDRESSES, STAKING_TOKEN_ABI } from '../config/contracts';
import { maxUint256 } from 'viem';

export function useApproveStakingToken() {
	const { address } = useAccount();

	const { writeContract, isPending, error } = useWriteContract();

	const approve = () => {
		writeContract({
			address: CONTRACT_ADDRESSES.stakingToken as `0x${string}`,
			abi: STAKING_TOKEN_ABI,
			functionName: 'approve',
			args: [CONTRACT_ADDRESSES.staking, maxUint256],
			account: address,
		});
	};

	return {
		approve,
		isPending,
		error,
	};
}
