import { useEffect } from 'react';
import { useClaimRewards } from '../hooks/useClaimRewards';
import { usePendingRewards } from '../hooks/usePendingRewards';
import { useRewardTokenBalance } from '../hooks/useRewardTokenBalance';
import { useRewardTokenSymbol } from '../hooks/useRewardTokenSymbol';
import { toast } from 'sonner';
import { formatEther } from 'viem';

export function ClaimRewards() {
	const {
		claimReward,
		isPending: isRewardPending,
		isConfirming: isRewardConfirming,
		isSuccess: isRewardSuccess,
		error: rewardError,
	} = useClaimRewards();

	const { refetch: refetchRewardBalance } = useRewardTokenBalance();
	const { pendingRewards, refetch: refetchPendingRewards } =
		usePendingRewards();
	const { symbol: rewardTokenSymbol } = useRewardTokenSymbol();

	const handleClaimReward = () => {
		claimReward();
	};

	const formattedRewards = formatEther(pendingRewards ?? 0n);

	useEffect(() => {
		if (isRewardPending) {
			toast.loading('Transaction pending... confirm in MetaMask');
		}
	}, [isRewardPending]);

	useEffect(() => {
		if (isRewardConfirming) {
			toast.dismiss();
			toast.loading('Waiting for blockchain confirmation...');
		}
	}, [isRewardConfirming]);

	useEffect(() => {
		if (isRewardSuccess) {
			toast.dismiss();
			toast.success('Reward claimed successfully!');
			refetchPendingRewards();
			refetchRewardBalance();
		}
	}, [isRewardSuccess, refetchPendingRewards, refetchRewardBalance]);

	useEffect(() => {
		if (rewardError) {
			toast.dismiss();
			toast.error(`Claim failed: ${rewardError.message}`, {
				duration: 10000,
			});
		}
	}, [rewardError]);

	return (
		<div>
			<h3 className='text-lg font-semibold text-white mb-6'>Claim Rewards</h3>

			<div className='mb-6 p-4 rounded-lg bg-slate-700/50 border border-slate-600'>
				<p className='text-sm text-slate-400 mb-2'>Pending Rewards</p>
				<p className='text-3xl font-bold text-white'>
					{parseFloat(formattedRewards).toFixed(4)}
				</p>
				<p className='text-sm text-slate-400 mt-1'>{rewardTokenSymbol}</p>
			</div>

			<button
				onClick={handleClaimReward}
				disabled={!pendingRewards || isRewardPending || isRewardConfirming}
				className='w-full px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition'
			>
				{isRewardPending ? 'Claiming...' : 'Claim Reward'}
			</button>
		</div>
	);
}
