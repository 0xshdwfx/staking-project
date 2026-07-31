import { usePendingRewards } from '../hooks/usePendingRewards';
import { useRewardTokenSymbol } from '../hooks/useRewardTokenSymbol';
import { formatEther } from 'viem';

export function PendingRewards() {
	const { pendingRewards, isLoading, error } = usePendingRewards();
	const { symbol: rewardTokenSymbol } = useRewardTokenSymbol();

	if (isLoading)
		return <div className='text-slate-400'>Loading rewards...</div>;
	if (error) return <div className='text-red-400'>Error loading rewards</div>;

	const formattedRewards = pendingRewards
		? formatEther(pendingRewards)
		: '0.00';
	const displayAmount = parseFloat(formattedRewards).toFixed(4);

	return (
		<div>
			<h3 className='text-sm font-semibold uppercase tracking-wide text-slate-400 mb-4'>
				Pending Rewards
			</h3>
			<p className='text-4xl font-bold text-white mb-2'>{displayAmount}</p>
			<p className='text-sm text-slate-400'>{rewardTokenSymbol}</p>
		</div>
	);
}
