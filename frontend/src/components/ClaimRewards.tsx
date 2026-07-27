import { useEffect } from 'react';
import { useClaimRewards } from '../hooks/useClaimRewards';
import { usePendingRewards } from '../hooks/usePendingRewards';
import { useRewardTokenBalance } from '../hooks/useRewardTokenBalance';
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
			<h3>Claim Reward</h3>

			<h3>Pending Rewards</h3>
			<p>{parseFloat(formattedRewards).toFixed(4)} RWT</p>

			<button
				onClick={handleClaimReward}
				disabled={!pendingRewards || isRewardPending || isRewardConfirming}
			>
				Claim Reward
			</button>
		</div>
	);
}
